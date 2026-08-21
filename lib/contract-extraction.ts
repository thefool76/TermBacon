import { z } from "zod";

export const extractionSchema = z.object({
  vendor: z.string(),
  agreement: z.string(),
  renewal_date: z.string(),
  notice_days: z.number().int(),
  annual_exposure: z.number(),
  auto_renew: z.enum(["yes", "no", "unknown"]),
  source_page: z.number().int(),
  source_section: z.string(),
  source_clause: z.string(),
  confidence: z.number().min(0).max(1),
});

export type ExtractedTerms = z.infer<typeof extractionSchema>;

export const extractionJsonSchema = {
  type: "object",
  properties: {
    vendor: { type: "string" },
    agreement: { type: "string" },
    renewal_date: { type: "string", description: "YYYY-MM-DD, or empty string when not supported by the document" },
    notice_days: { type: "integer", description: "Notice period in days, or -1 when unknown" },
    annual_exposure: { type: "number", description: "Annual committed amount in USD, or -1 when unknown" },
    auto_renew: { type: "string", enum: ["yes", "no", "unknown"] },
    source_page: { type: "integer", description: "PDF page number, or 0 when the page cannot be established" },
    source_section: { type: "string" },
    source_clause: { type: "string", description: "Exact supporting excerpt from the agreement" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["vendor", "agreement", "renewal_date", "notice_days", "annual_exposure", "auto_renew", "source_page", "source_section", "source_clause", "confidence"],
} as const;

export function buildRenewalContext(text: string) {
  const normalized = text.replace(/\u0000/g, " ");
  const keywords = ["renew", "renewal", "non-renew", "notice", "terminate", "termination", "subscription term", "expiration", "expire", "pricing", "fees", "charges"];
  const lower = normalized.toLowerCase();
  const slices: string[] = [];

  for (const keyword of keywords) {
    let from = 0;
    while (slices.length < 28) {
      const index = lower.indexOf(keyword, from);
      if (index === -1) break;
      const start = Math.max(0, index - 1200);
      const end = Math.min(normalized.length, index + 1800);
      slices.push(normalized.slice(start, end));
      from = index + keyword.length;
    }
  }

  const combined = slices.length > 0
    ? slices.join("\n\n--- RENEWAL-RELEVANT EXCERPT ---\n\n")
    : normalized;

  return combined.slice(0, 70000);
}

export function parseExtractionResponse(value: unknown): ExtractedTerms {
  const envelope = z.object({ response: z.unknown() }).parse(value);
  const response = typeof envelope.response === "string" ? JSON.parse(envelope.response) : envelope.response;
  return extractionSchema.parse(response);
}

export function normalizeSuggestedDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? "" : value;
}
