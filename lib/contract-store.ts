import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cookies } from "next/headers";
import { z } from "zod";
import type { Contract, Decision } from "@/lib/demo-data";
import { isAuthEnforced } from "@/lib/auth";
import { getCurrentSessionFromD1 } from "@/lib/auth-session";

const FILE_CHUNK_BYTES = 1024 * 1024;
const decisionSchema = z.enum(["pending", "renew", "renegotiate", "cancel"]);
const rowSchema = z.object({ id: z.string(), workspace_id: z.string(), vendor: z.string(), agreement: z.string(), annual_exposure: z.number(), renewal_date: z.string(), notice_days: z.number(), cancel_by_date: z.string(), owner: z.string(), auto_renew: z.number(), decision: decisionSchema, status: z.string(), file_key: z.string(), file_name: z.string(), source_page: z.number(), source_section: z.string(), source_clause: z.string(), extraction_confidence: z.number(), created_at: z.string(), updated_at: z.string() });

export async function getWorkspaceId() {
  if (await isAuthEnforced()) {
    return (await getCurrentSessionFromD1())?.workspace.id ?? null;
  }
  return (await cookies()).get("tb_workspace")?.value ?? null;
}

export async function getCloudflareEnv() {
  return (await getCloudflareContext({ async: true })).env;
}

export async function ensureContractSchema() {
  return getCloudflareEnv();
}

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

export async function storeContractFile(contractId: string, workspaceId: string, file: File) {
  const env = await ensureContractSchema();
  const statements = [
    env.DB.prepare("DELETE FROM contract_file_chunks WHERE contract_id = ?").bind(contractId),
    env.DB.prepare("DELETE FROM contract_files WHERE contract_id = ?").bind(contractId),
    env.DB.prepare("INSERT INTO contract_files (contract_id, workspace_id, file_name, content_type, byte_size, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(contractId, workspaceId, file.name, file.type || "application/pdf", file.size, new Date().toISOString()),
  ];

  let chunkIndex = 0;
  for (let offset = 0; offset < file.size; offset += FILE_CHUNK_BYTES) {
    const data = await file.slice(offset, Math.min(file.size, offset + FILE_CHUNK_BYTES)).arrayBuffer();
    statements.push(
      env.DB.prepare("INSERT INTO contract_file_chunks (contract_id, chunk_index, data) VALUES (?, ?, ?)")
        .bind(contractId, chunkIndex, data),
    );
    chunkIndex += 1;
  }

  await env.DB.batch(statements);
}

export async function getContractFileMetadata(contractId: string, workspaceId: string) {
  const env = await ensureContractSchema();
  return env.DB.prepare("SELECT file_name, content_type, byte_size FROM contract_files WHERE contract_id = ? AND workspace_id = ? LIMIT 1")
    .bind(contractId, workspaceId)
    .first<{ file_name: string; content_type: string; byte_size: number }>();
}

export async function readContractFile(contractId: string, workspaceId: string) {
  const env = await ensureContractSchema();
  const metadata = await env.DB.prepare("SELECT file_name, content_type, byte_size FROM contract_files WHERE contract_id = ? AND workspace_id = ? LIMIT 1")
    .bind(contractId, workspaceId)
    .first<{ file_name: string; content_type: string; byte_size: number }>();
  if (!metadata) return null;

  const result = await env.DB.prepare("SELECT data FROM contract_file_chunks WHERE contract_id = ? ORDER BY chunk_index ASC")
    .bind(contractId)
    .all<{ data: number[] }>();

  const bytes = new Uint8Array(metadata.byte_size);
  let offset = 0;
  for (const row of result.results) {
    const chunk = Uint8Array.from(row.data);
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  if (offset !== metadata.byte_size) throw new Error("Stored contract file is incomplete.");
  return { bytes, fileName: metadata.file_name, contentType: metadata.content_type };
}

export async function saveConfirmedContract(workspaceId: string, input: { id: string; vendor: string; agreement: string; annualExposure: number; renewalDate: string; noticeDays: number; cancelByDate: string; owner: string; autoRenew: boolean; fileName: string; sourcePage: number; sourceSection: string; sourceClause: string; extractionConfidence: number }) {
  const env = await ensureContractSchema(); const now = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO contracts (id, workspace_id, vendor, agreement, annual_exposure, renewal_date, notice_days, cancel_by_date, owner, auto_renew, decision, status, file_key, file_name, source_page, source_section, source_clause, extraction_confidence, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'confirmed', ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(input.id, workspaceId, input.vendor, input.agreement, input.annualExposure, input.renewalDate, input.noticeDays, input.cancelByDate, input.owner, input.autoRenew ? 1 : 0, `d1:${input.id}`, input.fileName, input.sourcePage, input.sourceSection, input.sourceClause, input.extractionConfidence, now, now).run();
}

export async function updateDecision(id: string, decision: Decision, workspaceId: string) {
  const env = await ensureContractSchema();
  const result = await env.DB.prepare("UPDATE contracts SET decision = ?, updated_at = ? WHERE id = ? AND workspace_id = ? AND status = 'confirmed'").bind(decision, new Date().toISOString(), id, workspaceId).run();
  return Number(result.meta.changes || 0) > 0;
}

function toContract(row: z.infer<typeof rowSchema>): Contract { return { id: row.id, vendor: row.vendor, agreement: row.agreement, annualExposure: row.annual_exposure, renewalDate: row.renewal_date, noticeDays: row.notice_days, cancelByDate: row.cancel_by_date, owner: row.owner, autoRenew: row.auto_renew === 1, decision: row.decision, source: { page: row.source_page, section: row.source_section, clause: row.source_clause } }; }
