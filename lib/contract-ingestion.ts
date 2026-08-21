import { z } from "zod";
import {
  assessExtraction,
  buildRenewalContext,
  extractionJsonSchema,
  parseExtractionResponse,
  sanitizeExtraction,
  type ReviewLevel,
} from "@/lib/contract-extraction";
import {
  ensureContractSchema,
  getContractFileMetadata,
  readContractFile,
} from "@/lib/contract-store";

export type IngestionStatus = "uploaded" | "processing" | "needs_review" | "confirmed" | "extraction_failed" | "archived";

export type ContractDraft = {
  id: string;
  fileName: string;
  vendor: string | null;
  agreement: string | null;
  renewalDate: string | null;
  noticeDays: number | null;
  annualExposure: number | null;
  owner: string;
  autoRenew: boolean | null;
  confidence: number;
  reviewLevel: ReviewLevel;
  missingFields: string[];
  fieldConfidence: Record<string, number>;
  source: { page: number | null; section: string | null; clause: string | null };
};

const ingestionRowSchema = z.object({
  contract_id: z.string(),
  workspace_id: z.string(),
  content_sha256: z.string(),
  status: z.enum(["uploaded", "processing", "needs_review", "confirmed", "extraction_failed", "archived"]),
  attempt_count: z.number().int(),
  failure_code: z.string(),
  failure_message: z.string(),
  vendor: z.string().nullable(),
  agreement: z.string().nullable(),
  renewal_date: z.string().nullable(),
  notice_days: z.number().int().nullable(),
  annual_exposure: z.number().nullable(),
  auto_renew: z.enum(["yes", "no", "unknown"]).nullable(),
  source_page: z.number().int().nullable(),
  source_section: z.string().nullable(),
  source_clause: z.string().nullable(),
  confidence: z.number().nullable(),
  review_level: z.enum(["normal", "careful", "manual_required"]),
  missing_fields_json: z.string(),
  field_confidence_json: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

type IngestionRow = z.infer<typeof ingestionRowSchema>;

export class IngestionError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly retryable = true,
  ) {
    super(message);
    this.name = "IngestionError";
  }
}

export async function hashContractFile(file: File) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", await file.arrayBuffer()));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createIngestionRecord(input: {
  id: string;
  workspaceId: string;
  contentHash: string;
}) {
  const env = await ensureContractSchema();
  const now = new Date().toISOString();
  const result = await env.DB.prepare(`
    INSERT OR IGNORE INTO contract_ingestions (
      contract_id, workspace_id, content_sha256, status, created_at, updated_at
    ) VALUES (?, ?, ?, 'uploaded', ?, ?)
  `).bind(input.id, input.workspaceId, input.contentHash, now, now).run();
  return Number(result.meta.changes || 0) > 0;
}

export async function findActiveIngestionByHash(workspaceId: string, contentHash: string) {
  const env = await ensureContractSchema();
  const row = await env.DB.prepare(`
    SELECT * FROM contract_ingestions
    WHERE workspace_id = ? AND content_sha256 = ? AND status != 'archived'
    LIMIT 1
  `).bind(workspaceId, contentHash).first();
  return row ? ingestionRowSchema.parse(row) : null;
}

export async function getIngestion(id: string, workspaceId: string) {
  const env = await ensureContractSchema();
  const row = await env.DB.prepare(`
    SELECT * FROM contract_ingestions WHERE contract_id = ? AND workspace_id = ? LIMIT 1
  `).bind(id, workspaceId).first();
  return row ? ingestionRowSchema.parse(row) : null;
}

export async function getDraftFromIngestion(id: string, workspaceId: string) {
  const row = await getIngestion(id, workspaceId);
  if (!row || row.status !== "needs_review") return null;
  const file = await getContractFileMetadata(id, workspaceId);
  if (!file) return null;
  return rowToDraft(row, file.file_name);
}

export async function processContractIngestion(id: string, workspaceId: string): Promise<ContractDraft> {
  const env = await ensureContractSchema();
  const row = await getIngestion(id, workspaceId);
  if (!row) throw new IngestionError("not_found", "The uploaded agreement could not be found.", false);
  if (row.status === "confirmed") throw new IngestionError("already_confirmed", "This agreement is already confirmed.", false);

  const file = await readContractFile(id, workspaceId);
  if (!file) throw new IngestionError("file_missing", "The stored PDF is missing. Upload the agreement again.", false);

  const now = new Date().toISOString();
  await env.DB.prepare(`
    UPDATE contract_ingestions
    SET status = 'processing', attempt_count = attempt_count + 1,
      failure_code = '', failure_message = '', updated_at = ?
    WHERE contract_id = ? AND workspace_id = ?
  `).bind(now, id, workspaceId).run();

  try {
    const blob = new Blob([file.bytes.buffer], { type: file.contentType || "application/pdf" });
    const convertedValue = await env.AI.toMarkdown(
      { name: file.fileName, blob },
      { conversionOptions: { pdf: { metadata: false }, output: { format: "text" } } },
    );
    const converted = Array.isArray(convertedValue) ? convertedValue[0] : convertedValue;
    if (!converted || converted.format === "error" || !("data" in converted)) {
      throw new IngestionError("conversion_failed", "The PDF could not be converted to readable text.");
    }

    const rawText = converted.data.trim();
    if (rawText.length < 80) {
      throw new IngestionError("unreadable_pdf", "The PDF contains too little readable text. Try a text-based agreement or a clearer scan.");
    }

    const context = buildRenewalContext(rawText);
    const aiResult = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: [
        {
          role: "system",
          content: [
            "Extract vendor renewal facts for operational review.",
            "Never infer or calculate unsupported dates, amounts, page numbers, or notice periods.",
            "Use null/unknown whenever the supplied text does not directly support a field.",
            "source_clause must be copied verbatim from the supplied agreement text.",
            "annual_exposure is only allowed when the agreement clearly states USD; never convert currencies.",
            "This is not legal advice.",
          ].join(" "),
        },
        {
          role: "user",
          content: `Extract only renewal-decision facts from this vendor agreement.\n\n${context}`,
        },
      ],
      response_format: { type: "json_schema", json_schema: extractionJsonSchema },
      temperature: 0,
      max_tokens: 1400,
    });

    const extracted = sanitizeExtraction(parseExtractionResponse(aiResult), context);
    const assessment = assessExtraction(extracted);
    const completedAt = new Date().toISOString();

    await env.DB.prepare(`
      UPDATE contract_ingestions SET
        status = 'needs_review', vendor = ?, agreement = ?, renewal_date = ?, notice_days = ?,
        annual_exposure = ?, auto_renew = ?, source_page = ?, source_section = ?, source_clause = ?,
        confidence = ?, review_level = ?, missing_fields_json = ?, field_confidence_json = ?, updated_at = ?
      WHERE contract_id = ? AND workspace_id = ?
    `).bind(
      extracted.vendor,
      extracted.agreement,
      extracted.renewal_date,
      extracted.notice_days,
      extracted.annual_exposure,
      extracted.auto_renew,
      extracted.source_page,
      extracted.source_section,
      extracted.source_clause,
      assessment.effectiveConfidence,
      assessment.reviewLevel,
      JSON.stringify(assessment.missingFields),
      JSON.stringify(assessment.fieldConfidence),
      completedAt,
      id,
      workspaceId,
    ).run();

    const updated = await getIngestion(id, workspaceId);
    if (!updated) throw new IngestionError("persistence_failed", "Extraction finished but the draft could not be reloaded.");
    return rowToDraft(updated, file.fileName);
  } catch (error) {
    const ingestionError = error instanceof IngestionError
      ? error
      : new IngestionError("extraction_failed", "The agreement could not be analyzed. Retry the extraction.");
    await markIngestionFailed(id, workspaceId, ingestionError.code, ingestionError.message);
    console.error(JSON.stringify({
      event: "contract_extraction_failed",
      contractId: id,
      code: ingestionError.code,
      message: error instanceof Error ? error.message : String(error),
    }));
    throw ingestionError;
  }
}

export async function markIngestionConfirmed(id: string, workspaceId: string) {
  const env = await ensureContractSchema();
  const result = await env.DB.prepare(`
    UPDATE contract_ingestions SET status = 'confirmed', failure_code = '', failure_message = '', updated_at = ?
    WHERE contract_id = ? AND workspace_id = ? AND status = 'needs_review'
  `).bind(new Date().toISOString(), id, workspaceId).run();
  return Number(result.meta.changes || 0) > 0;
}

export async function cleanupStaleIngestions(workspaceId: string) {
  const env = await ensureContractSchema();
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const stale = await env.DB.prepare(`
    SELECT contract_id FROM contract_ingestions
    WHERE workspace_id = ? AND status IN ('uploaded', 'processing') AND updated_at < ?
    LIMIT 20
  `).bind(workspaceId, cutoff).all<{ contract_id: string }>();
  if (stale.results.length === 0) return;

  for (const item of stale.results) {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM contract_file_chunks WHERE contract_id = ?").bind(item.contract_id),
      env.DB.prepare("DELETE FROM contract_files WHERE contract_id = ? AND workspace_id = ?").bind(item.contract_id, workspaceId),
      env.DB.prepare("DELETE FROM contract_ingestions WHERE contract_id = ? AND workspace_id = ?").bind(item.contract_id, workspaceId),
    ]);
  }
}

export async function deleteIngestionRecord(id: string, workspaceId: string) {
  const env = await ensureContractSchema();
  await env.DB.prepare("DELETE FROM contract_ingestions WHERE contract_id = ? AND workspace_id = ?")
    .bind(id, workspaceId)
    .run();
}

async function markIngestionFailed(id: string, workspaceId: string, code: string, message: string) {
  const env = await ensureContractSchema();
  await env.DB.prepare(`
    UPDATE contract_ingestions
    SET status = 'extraction_failed', failure_code = ?, failure_message = ?, updated_at = ?
    WHERE contract_id = ? AND workspace_id = ?
  `).bind(code, message.slice(0, 400), new Date().toISOString(), id, workspaceId).run();
}

function rowToDraft(row: IngestionRow, fileName: string): ContractDraft {
  return {
    id: row.contract_id,
    fileName,
    vendor: row.vendor,
    agreement: row.agreement,
    renewalDate: row.renewal_date,
    noticeDays: row.notice_days,
    annualExposure: row.annual_exposure,
    owner: "You",
    autoRenew: row.auto_renew === "unknown" || row.auto_renew === null ? null : row.auto_renew === "yes",
    confidence: row.confidence ?? 0,
    reviewLevel: row.review_level,
    missingFields: parseJsonArray(row.missing_fields_json),
    fieldConfidence: parseJsonRecord(row.field_confidence_json),
    source: {
      page: row.source_page,
      section: row.source_section,
      clause: row.source_clause,
    },
  };
}

function parseJsonArray(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function parseJsonRecord(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, number] => typeof entry[1] === "number"),
    );
  } catch {
    return {};
  }
}
