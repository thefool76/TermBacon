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
  console.log(`R2 bucket ${bucketName} does not exist yet; creating it.`);
  execFileSync("npx", ["wrangler", "r2", "bucket", "create", bucketName], {
    stdio: "inherit",
  });
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
