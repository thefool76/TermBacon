import assert from "node:assert/strict";
import {
  assessExtraction,
  buildRenewalContext,
  normalizeSuggestedDate,
  parseExtractionResponse,
  sanitizeExtraction,
  type ExtractedTerms,
} from "../lib/contract-extraction.ts";

function terms(overrides: Partial<ExtractedTerms> = {}): ExtractedTerms {
  return {
    vendor: "Acme SaaS",
    vendor_confidence: 0.98,
    agreement: "Master Subscription Agreement",
    agreement_confidence: 0.96,
    renewal_date: "2027-01-01",
    renewal_date_confidence: 0.95,
    notice_days: 60,
    notice_days_confidence: 0.95,
    annual_exposure: 24000,
    annual_exposure_confidence: 0.91,
    auto_renew: "yes",
    auto_renew_confidence: 0.94,
    source_page: null,
    source_section: "Term and Renewal",
    source_clause: "The subscription renews automatically unless either party gives at least 60 days prior written notice.",
    source_confidence: 0.96,
    confidence: 0.95,
    ...overrides,
  };
}

const context = `Commercial terms. The subscription renews automatically unless either party gives at least 60 days prior written notice. Renewal date: 2027-01-01.`;
const sanitized = sanitizeExtraction(terms(), context);
assert.equal(sanitized.renewal_date, "2027-01-01");
assert.equal(sanitized.notice_days, 60);
assert.ok(sanitized.source_clause);
assert.equal(assessExtraction(sanitized).reviewLevel, "normal");

const careful = assessExtraction(sanitizeExtraction(terms({ notice_days_confidence: 0.84 }), context));
assert.equal(careful.reviewLevel, "careful");

const unsupportedClause = sanitizeExtraction(terms({ source_clause: "A sentence that does not exist in the document." }), context);
assert.equal(unsupportedClause.source_clause, null);
assert.equal(assessExtraction(unsupportedClause).reviewLevel, "manual_required");
assert.ok(assessExtraction(unsupportedClause).missingFields.includes("source_clause"));

const missingCritical = sanitizeExtraction(terms({ renewal_date: null, renewal_date_confidence: 0 }), context);
assert.equal(assessExtraction(missingCritical).reviewLevel, "manual_required");

assert.equal(normalizeSuggestedDate("2026-02-30"), "");
assert.equal(normalizeSuggestedDate("2028-02-29"), "2028-02-29");
assert.equal(normalizeSuggestedDate("not-a-date"), "");

const farNoise = "General boilerplate. ".repeat(5000);
const selected = buildRenewalContext(`${farNoise}\nTermination requires 45 days notice before renewal.\n${farNoise}`);
assert.ok(selected.includes("45 days notice"));
assert.ok(selected.length <= 60000);

const parsed = parseExtractionResponse({ response: JSON.stringify(terms({ annual_exposure: null })) });
assert.equal(parsed.annual_exposure, null);

console.log("Contract extraction tests passed: evidence verification, confidence gates, null handling, context selection, and strict date validation.");
