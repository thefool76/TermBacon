import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cookies } from "next/headers";
import { z } from "zod";
import type { Contract, Decision } from "@/lib/demo-data";

const decisionSchema = z.enum(["pending", "renew", "renegotiate", "cancel"]);
const rowSchema = z.object({ id: z.string(), workspace_id: z.string(), vendor: z.string(), agreement: z.string(), annual_exposure: z.number(), renewal_date: z.string(), notice_days: z.number(), cancel_by_date: z.string(), owner: z.string(), auto_renew: z.number(), decision: decisionSchema, status: z.string(), file_key: z.string(), file_name: z.string(), source_page: z.number(), source_section: z.string(), source_clause: z.string(), extraction_confidence: z.number(), created_at: z.string(), updated_at: z.string() });
const schemaSql = `CREATE TABLE IF NOT EXISTS contracts (id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL, vendor TEXT NOT NULL, agreement TEXT NOT NULL, annual_exposure REAL NOT NULL, renewal_date TEXT NOT NULL, notice_days INTEGER NOT NULL, cancel_by_date TEXT NOT NULL, owner TEXT NOT NULL, auto_renew INTEGER NOT NULL DEFAULT 0, decision TEXT NOT NULL DEFAULT 'pending', status TEXT NOT NULL DEFAULT 'confirmed', file_key TEXT NOT NULL, file_name TEXT NOT NULL, source_page INTEGER NOT NULL DEFAULT 0, source_section TEXT NOT NULL DEFAULT '', source_clause TEXT NOT NULL DEFAULT '', extraction_confidence REAL NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL); CREATE INDEX IF NOT EXISTS contracts_workspace_cancel_by_idx ON contracts(workspace_id, cancel_by_date); CREATE INDEX IF NOT EXISTS contracts_workspace_status_idx ON contracts(workspace_id, status);`;

export async function getWorkspaceId() { return (await cookies()).get("tb_workspace")?.value ?? null; }
export async function getCloudflareEnv() { return (await getCloudflareContext({ async: true })).env; }
export async function ensureContractSchema() { const env = await getCloudflareEnv(); await env.DB.exec(schemaSql); return env; }

export async function listConfirmedContracts(workspaceId: string | null): Promise<Contract[]> {
  if (!workspaceId) return [];
  const env = await ensureContractSchema();
  const result = await env.DB.prepare("SELECT * FROM contracts WHERE workspace_id = ? AND status = 'confirmed' ORDER BY cancel_by_date ASC").bind(workspaceId).all();
  return result.results.map((row) => toContract(rowSchema.parse(row)));
}

export async function getConfirmedContract(id: string, workspaceId: string | null): Promise<Contract | null> {
  if (!workspaceId) return null;
  const env = await ensureContractSchema();
  const row = await env.DB.prepare("SELECT * FROM contracts WHERE id = ? AND workspace_id = ? AND status = 'confirmed' LIMIT 1").bind(id, workspaceId).first();
  return row ? toContract(rowSchema.parse(row)) : null;
}

export async function saveConfirmedContract(workspaceId: string, input: { id: string; vendor: string; agreement: string; annualExposure: number; renewalDate: string; noticeDays: number; cancelByDate: string; owner: string; autoRenew: boolean; fileKey: string; fileName: string; sourcePage: number; sourceSection: string; sourceClause: string; extractionConfidence: number }) {
  const env = await ensureContractSchema(); const now = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO contracts (id, workspace_id, vendor, agreement, annual_exposure, renewal_date, notice_days, cancel_by_date, owner, auto_renew, decision, status, file_key, file_name, source_page, source_section, source_clause, extraction_confidence, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'confirmed', ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(input.id, workspaceId, input.vendor, input.agreement, input.annualExposure, input.renewalDate, input.noticeDays, input.cancelByDate, input.owner, input.autoRenew ? 1 : 0, input.fileKey, input.fileName, input.sourcePage, input.sourceSection, input.sourceClause, input.extractionConfidence, now, now).run();
}

export async function updateDecision(id: string, decision: Decision, workspaceId: string) {
  const env = await ensureContractSchema();
  const result = await env.DB.prepare("UPDATE contracts SET decision = ?, updated_at = ? WHERE id = ? AND workspace_id = ? AND status = 'confirmed'").bind(decision, new Date().toISOString(), id, workspaceId).run();
  return Number(result.meta.changes || 0) > 0;
}

function toContract(row: z.infer<typeof rowSchema>): Contract { return { id: row.id, vendor: row.vendor, agreement: row.agreement, annualExposure: row.annual_exposure, renewalDate: row.renewal_date, noticeDays: row.notice_days, cancelByDate: row.cancel_by_date, owner: row.owner, autoRenew: row.auto_renew === 1, decision: row.decision, source: { page: row.source_page, section: row.source_section, clause: row.source_clause } }; }
