import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const configPath = "wrangler.jsonc";
const databaseName = "termbeacon-db";
const bucketName = "termbeacon-contracts";

function wrangler(args, options = {}) {
  return execFileSync("npx", ["wrangler", ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
    ...options,
  });
}

function parseJsonOutput(value, label) {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Could not parse ${label} JSON output: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function outputFrom(result) {
  return `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
}

function r2IsDisabled(message) {
  return /code:\s*10042|enable R2 through the Cloudflare Dashboard|R2 subscription/i.test(message);
}

function exitForDisabledR2() {
  console.error("\nCloudflare R2 is not enabled for this account (error 10042).\n");
  console.error("Enable it once in Cloudflare Dashboard:");
  console.error("  Storage & databases → R2 → Overview → complete the R2 subscription/checkout flow");
  console.error("Then re-run this GitHub Actions workflow. The workflow will create/use the termbeacon-contracts bucket automatically.\n");
  process.exit(1);
}

console.log(`Resolving D1 database: ${databaseName}`);
const databaseInfo = parseJsonOutput(
  wrangler(["d1", "info", databaseName, "--json"]),
  "wrangler d1 info",
);

const databaseId =
  databaseInfo.uuid ?? databaseInfo.id ?? databaseInfo.database_id ?? databaseInfo.databaseId;

if (!databaseId || typeof databaseId !== "string") {
  throw new Error(`Wrangler returned no database ID for ${databaseName}.`);
}

console.log(`Using D1 database ${databaseName} (${databaseId}).`);

console.log(`Checking R2 bucket: ${bucketName}`);
const bucketInfo = spawnSync(
  "npx",
  ["wrangler", "r2", "bucket", "info", bucketName, "--json"],
  { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
);

if (bucketInfo.status !== 0) {
  const infoOutput = outputFrom(bucketInfo);
  if (r2IsDisabled(infoOutput)) exitForDisabledR2();

  console.log(`R2 bucket ${bucketName} does not exist yet; creating it.`);
  const createBucket = spawnSync(
    "npx",
    ["wrangler", "r2", "bucket", "create", bucketName],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );

  if (createBucket.status !== 0) {
    const createOutput = outputFrom(createBucket);
    if (r2IsDisabled(createOutput)) exitForDisabledR2();
    process.stderr.write(createOutput);
    process.exit(createBucket.status ?? 1);
  }

  process.stdout.write(createBucket.stdout ?? "");
} else {
  console.log(`Using existing R2 bucket ${bucketName}.`);
}

const config = JSON.parse(readFileSync(configPath, "utf8"));
config.d1_databases = [
  {
    binding: "DB",
    database_name: databaseName,
    database_id: databaseId,
  },
];
config.r2_buckets = [
  {
    binding: "CONTRACTS",
    bucket_name: bucketName,
  },
];

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
console.log("Cloudflare bindings resolved for this CI run.");
