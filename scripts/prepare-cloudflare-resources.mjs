import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const configPath = "wrangler.jsonc";
const databaseName = "termbeacon-db";

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

const config = JSON.parse(readFileSync(configPath, "utf8"));
config.d1_databases = [
  {
    binding: "DB",
    database_name: databaseName,
    database_id: databaseId,
  },
];
delete config.r2_buckets;

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
console.log("D1 binding resolved for this CI run. R2 is not required.");
