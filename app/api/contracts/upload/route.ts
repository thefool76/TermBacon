import { NextResponse } from "next/server";
import { buildRenewalContext, extractionJsonSchema, normalizeSuggestedDate, parseExtractionResponse } from "@/lib/contract-extraction";
import { ensureContractSchema, getWorkspaceId, storeContractFile } from "@/lib/contract-store";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace session missing. Reload the app and try again." }, { status: 401 });
  }

  const form = await request.formData();
  const value = form.get("file");

  if (!(value instanceof File)) {
    return NextResponse.json({ error: "Choose a PDF agreement to continue." }, { status: 400 });
  }
  if (value.type !== "application/pdf" && !value.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "TermBeacon currently accepts PDF agreements only." }, { status: 415 });
  }
  if (value.size <= 0 || value.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "PDFs must be between 1 byte and 10 MB." }, { status: 413 });
  }

  const env = await ensureContractSchema();
  const id = crypto.randomUUID();

  try {
    const convertedValue = await env.AI.toMarkdown(
      { name: value.name, blob: value },
      { conversionOptions: { pdf: { metadata: false }, output: { format: "text" } } },
    );
    const converted = Array.isArray(convertedValue) ? convertedValue[0] : convertedValue;
    if (!converted || converted.format === "error" || !("data" in converted)) {
      throw new Error("The PDF could not be converted to readable contract text.");
    }

    const context = buildRenewalContext(converted.data);
    const aiResult = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: [
        {
          role: "system",
          content: "You extract vendor renewal terms for operational review. Never infer unsupported dates or amounts. Return an exact source excerpt. This is not legal advice. If a field is not supported by the supplied agreement text, use the schema's unknown sentinel.",
        },
        {
          role: "user",
          content: `Extract only renewal-decision facts from this vendor agreement.\n\n${context}`,
        },
      ],
      response_format: { type: "json_schema", json_schema: extractionJsonSchema },
      temperature: 0,
      max_tokens: 1200,
    });
    const extracted = parseExtractionResponse(aiResult);

    await storeContractFile(id, workspaceId, value);

    return NextResponse.json({
      contract: {
        id,
        fileName: value.name,
        vendor: extracted.vendor || value.name.replace(/\.pdf$/i, ""),
        agreement: extracted.agreement || "Vendor agreement",
        renewalDate: normalizeSuggestedDate(extracted.renewal_date),
        noticeDays: extracted.notice_days > 0 ? extracted.notice_days : 0,
        annualExposure: extracted.annual_exposure >= 0 ? extracted.annual_exposure : 0,
        owner: "You",
        autoRenew: extracted.auto_renew === "yes",
        source: {
          page: extracted.source_page > 0 ? extracted.source_page : 0,
          section: extracted.source_section,
          clause: extracted.source_clause,
        },
        confidence: extracted.confidence,
      },
    });
  } catch (error) {
    console.error(JSON.stringify({ event: "contract_extraction_failed", contractId: id, message: error instanceof Error ? error.message : "Unknown error" }));
    return NextResponse.json({ error: "We couldn't extract renewal terms from this PDF. Try another agreement or a text-based PDF." }, { status: 500 });
  }
}
