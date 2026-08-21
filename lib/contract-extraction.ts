import { z } from "zod";

const nullableString = z.string().nullable();
const nullableInteger = z.number().int().nullable();
const nullableNumber = z.number().nullable();
const confidence = z.number().min(0).max(1);

export const extractionSchema = z.object({
  vendor: nullableString,
  vendor_confidence: confidence,
  agreement: nullableString,
  agreement_confidence: confidence,
  renewal_date: nullableString,
  renewal_date_confidence: confidence,
  notice_days: nullableInteger,
  notice_days_confidence: confidence,
  annual_exposure: nullableNumber,
  annual_exposure_confidence: confidence,
  auto_renew: z.enum(["yes", "no", "unknown"]),
  auto_renew_confidence: confidence,
  source_page: nullableInteger,
  source_section: nullableString,
  source_clause: nullableString,
  source_confidence: confidence,
  confidence,
});

export type ExtractedTerms = z.infer<typeof extractionSchema>;
export type ReviewLevel = "normal" | "careful" | "manual_required";

export const extractionJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vendor: { type: ["string", "null"], description: "Vendor or supplier legal/common name. Null when unsupported." },
    vendor_confidence: { type: "number", minimum: 0, maximum: 1 },
    agreement: { type: ["string", "null"], description: "Agreement/product name. Null when unsupported." },
    agreement_confidence: { type: "number", minimum: 0, maximum: 1 },
    renewal_date: { type: ["string", "null"], description: "YYYY-MM-DD only when directly supported by the supplied text. Otherwise null." },
    renewal_date_confidence: { type: "number", minimum: 0, maximum: 1 },
    notice_days: { type: ["integer", "null"], description: "Required non-renewal/cancellation notice period in calendar days. Null when unsupported." },
    notice_days_confidence: { type: "number", minimum: 0, maximum: 1 },
    annual_exposure: { type: ["number", "null"], description: "Annual committed amount only when the agreement clearly states USD. Never convert currencies. Null when unsupported." },
    annual_exposure_confidence: { type: "number", minimum: 0, maximum: 1 },
    auto_renew: { type: "string", enum: ["yes", "no", "unknown"] },
    auto_renew_confidence: { type: "number", minimum: 0, maximum: 1 },
    source_page: { type: ["integer", "null"], description: "PDF page number only if page identity is explicit in supplied text. Otherwise null." },
    source_section: { type: ["string", "null"] },
    source_clause: { type: ["string", "null"], description: "Verbatim supporting excerpt copied from the supplied agreement text. Null when no supporting clause is present." },
    source_confidence: { type: "number", minimum: 0, maximum: 1 },
    confidence: { type: "number", minimum: 0, maximum: 1, description: "Overall confidence that the extracted renewal-decision facts are supported." },
  },
  required: [
    "vendor", "vendor_confidence", "agreement", "agreement_confidence",
    "renewal_date", "renewal_date_confidence", "notice_days", "notice_days_confidence",
    "annual_exposure", "annual_exposure_confidence", "auto_renew", "auto_renew_confidence",
    "source_page", "source_section", "source_clause", "source_confidence", "confidence",
  ],
} as const;

export function buildRenewalContext(text: string) {
  const normalized = text.replace(/\u0000/g, " ").replace(/\r\n/g, "\n");
  const keywords = [
    "renew", "renewal", "non-renew", "nonrenew", "notice", "terminate", "termination",
    "subscription term", "initial term", "expiration", "expire", "pricing", "fees", "charges",
  ];
  const lower = normalized.toLowerCase();
  const ranges: Array<{ start: number; end: number }> = [];

  for (const keyword of keywords) {
    let from = 0;
    while (ranges.length < 40) {
      const index = lower.indexOf(keyword, from);
      if (index === -1) break;
      ranges.push({
        start: Math.max(0, index - 1400),
        end: Math.min(normalized.length, index + 2200),
      });
      from = index + keyword.length;
    }
    if (ranges.length >= 40) break;
  }

  if (ranges.length === 0) return normalized.slice(0, 60000);

  ranges.sort((a, b) => a.start - b.start);
  const merged: Array<{ start: number; end: number }> = [];
  for (const range of ranges) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end + 250) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }

  return merged
    .map((range) => normalized.slice(range.start, range.end))
    .join("\n\n--- RENEWAL-RELEVANT EXCERPT ---\n\n")
    .slice(0, 60000);
}

export function parseExtractionResponse(value: unknown): ExtractedTerms {
  const envelope = z.object({ response: z.unknown() }).parse(value);
  const response = typeof envelope.response === "string" ? JSON.parse(envelope.response) : envelope.response;
  return extractionSchema.parse(response);
}

export function sanitizeExtraction(extracted: ExtractedTerms, context: string): ExtractedTerms {
  const renewalDate = extracted.renewal_date ? normalizeSuggestedDate(extracted.renewal_date) || null : null;
  const noticeDays = extracted.notice_days && extracted.notice_days > 0 && extracted.notice_days <= 730
    ? extracted.notice_days
    : null;
  const annualExposure = extracted.annual_exposure !== null && extracted.annual_exposure >= 0
    ? extracted.annual_exposure
    : null;
  const sourceClause = normalizeEvidence(extracted.source_clause, context);
  const sourcePage = extracted.source_page && extracted.source_page > 0 ? extracted.source_page : null;

  return {
    ...extracted,
    vendor: cleanNullable(extracted.vendor),
    agreement: cleanNullable(extracted.agreement),
    renewal_date: renewalDate,
    notice_days: noticeDays,
    annual_exposure: annualExposure,
    source_page: sourcePage,
    source_section: cleanNullable(extracted.source_section),
    source_clause: sourceClause,
    source_confidence: sourceClause ? extracted.source_confidence : 0,
  };
}

export function assessExtraction(extracted: ExtractedTerms) {
  const missingFields: string[] = [];
  if (!extracted.vendor) missingFields.push("vendor");
  if (!extracted.agreement) missingFields.push("agreement");
  if (!extracted.renewal_date) missingFields.push("renewal_date");
  if (!extracted.notice_days) missingFields.push("notice_days");
  if (extracted.annual_exposure === null) missingFields.push("annual_exposure");
  if (extracted.auto_renew === "unknown") missingFields.push("auto_renew");
  if (!extracted.source_clause) missingFields.push("source_clause");

  const criticalConfidences = [
    extracted.renewal_date_confidence,
    extracted.notice_days_confidence,
    extracted.source_confidence,
  ];
  const effectiveConfidence = Math.min(extracted.confidence, ...criticalConfidences);
  const missingCritical = missingFields.some((field) =>
    field === "renewal_date" || field === "notice_days" || field === "source_clause",
  );

  let reviewLevel: ReviewLevel = "normal";
  if (missingCritical || effectiveConfidence < 0.7) reviewLevel = "manual_required";
  else if (effectiveConfidence < 0.9) reviewLevel = "careful";

  return {
    reviewLevel,
    missingFields,
    effectiveConfidence,
    fieldConfidence: {
      vendor: extracted.vendor_confidence,
      agreement: extracted.agreement_confidence,
      renewalDate: extracted.renewal_date_confidence,
      noticeDays: extracted.notice_days_confidence,
      annualExposure: extracted.annual_exposure_confidence,
      autoRenew: extracted.auto_renew_confidence,
      source: extracted.source_confidence,
    },
  };
}

export function normalizeSuggestedDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return "";
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return "";
  return value;
}

function normalizeEvidence(value: string | null, context: string) {
  const clause = cleanNullable(value);
  if (!clause || clause.length < 10) return null;
  const normalizedClause = normalizeForEvidenceMatch(clause);
  const normalizedContext = normalizeForEvidenceMatch(context);
  return normalizedContext.includes(normalizedClause) ? clause : null;
}

function normalizeForEvidenceMatch(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function cleanNullable(value: string | null) {
  const cleaned = value?.trim() ?? "";
  return cleaned || null;
}
