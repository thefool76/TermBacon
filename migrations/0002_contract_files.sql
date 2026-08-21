CREATE TABLE IF NOT EXISTS contract_files (
  contract_id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'application/pdf',
  byte_size INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contract_file_chunks (
  contract_id TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  data BLOB NOT NULL,
  PRIMARY KEY (contract_id, chunk_index),
  FOREIGN KEY (contract_id) REFERENCES contract_files(contract_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS contract_files_workspace_idx
  ON contract_files(workspace_id);
