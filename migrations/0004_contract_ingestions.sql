CREATE TABLE IF NOT EXISTS contract_ingestions (
  contract_id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  content_sha256 TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('uploaded', 'processing', 'needs_review', 'confirmed', 'extraction_failed', 'archived')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  failure_code TEXT NOT NULL DEFAULT '',
  failure_message TEXT NOT NULL DEFAULT '',
  vendor TEXT,
  agreement TEXT,
  renewal_date TEXT,
  notice_days INTEGER,
  annual_exposure REAL,
  auto_renew TEXT CHECK (auto_renew IN ('yes', 'no', 'unknown') OR auto_renew IS NULL),
  source_page INTEGER,
  source_section TEXT,
  source_clause TEXT,
  confidence REAL,
  review_level TEXT NOT NULL DEFAULT 'manual_required' CHECK (review_level IN ('normal', 'careful', 'manual_required')),
  missing_fields_json TEXT NOT NULL DEFAULT '[]',
  field_confidence_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS contract_ingestions_workspace_hash_active_idx
  ON contract_ingestions(workspace_id, content_sha256)
  WHERE status != 'archived';

CREATE INDEX IF NOT EXISTS contract_ingestions_workspace_status_idx
  ON contract_ingestions(workspace_id, status, updated_at);
