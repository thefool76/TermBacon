CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  vendor TEXT NOT NULL,
  agreement TEXT NOT NULL,
  annual_exposure REAL NOT NULL,
  renewal_date TEXT NOT NULL,
  notice_days INTEGER NOT NULL,
  cancel_by_date TEXT NOT NULL,
  owner TEXT NOT NULL,
  auto_renew INTEGER NOT NULL DEFAULT 0,
  decision TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'confirmed',
  file_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  source_page INTEGER NOT NULL DEFAULT 0,
  source_section TEXT NOT NULL DEFAULT '',
  source_clause TEXT NOT NULL DEFAULT '',
  extraction_confidence REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS contracts_workspace_cancel_by_idx ON contracts(workspace_id, cancel_by_date);
CREATE INDEX IF NOT EXISTS contracts_workspace_status_idx ON contracts(workspace_id, status);
