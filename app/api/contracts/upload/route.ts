import { NextResponse } from "next/server";
import {
  cleanupStaleIngestions,
  createIngestionRecord,
  deleteIngestionRecord,
  findActiveIngestionByHash,
  getDraftFromIngestion,
  hashContractFile,
  IngestionError,
  processContractIngestion,
} from "@/lib/contract-ingestion";
import { getWorkspaceId, storeContractFile } from "@/lib/contract-store";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace session missing. Sign in again and retry." }, { status: 401 });
  }

  const form = await request.formData();
  const value = form.get("file");
  if (!(value instanceof File)) {
    return NextResponse.json({ error: "Choose a PDF agreement to continue." }, { status: 400 });
  }

  const validationError = await validatePdf(value);
  if (validationError) return validationError;

  await cleanupStaleIngestions(workspaceId);
  const contentHash = await hashContractFile(value);
  const existing = await findActiveIngestionByHash(workspaceId, contentHash);

  if (existing) {
    if (existing.status === "needs_review") {
      const draft = await getDraftFromIngestion(existing.contract_id, workspaceId);
      if (draft) return NextResponse.json({ contract: draft, duplicate: true, status: existing.status });
    }
    if (existing.status === "confirmed") {
      return NextResponse.json({
        error: "This agreement has already been uploaded and confirmed.",
        contractId: existing.contract_id,
        status: existing.status,
        duplicate: true,
      }, { status: 409 });
    }
    if (existing.status === "extraction_failed") {
      return NextResponse.json({
        error: existing.failure_message || "This agreement is already stored, but extraction failed.",
        contractId: existing.contract_id,
        status: existing.status,
        retryable: existing.failure_code !== "file_missing",
        duplicate: true,
      }, { status: 409 });
    }
    return NextResponse.json({
      error: "This agreement is already being processed.",
      contractId: existing.contract_id,
      status: existing.status,
      duplicate: true,
    }, { status: 409 });
  }

  const id = crypto.randomUUID();
  try {
    const created = await createIngestionRecord({ id, workspaceId, contentHash });
    if (!created) {
      const raced = await findActiveIngestionByHash(workspaceId, contentHash);
      if (raced?.status === "needs_review") {
        const draft = await getDraftFromIngestion(raced.contract_id, workspaceId);
        if (draft) return NextResponse.json({ contract: draft, duplicate: true, status: raced.status });
      }
      return NextResponse.json({
        error: raced?.status === "confirmed" ? "This agreement has already been uploaded and confirmed." : "This agreement is already being processed.",
        contractId: raced?.contract_id,
        status: raced?.status ?? "processing",
        duplicate: true,
      }, { status: 409 });
    }

    try {
      await storeContractFile(id, workspaceId, value);
    } catch (error) {
      await deleteIngestionRecord(id, workspaceId);
      throw error;
    }

    const contract = await processContractIngestion(id, workspaceId);
    return NextResponse.json({ contract, status: "needs_review" });
  } catch (error) {
    const ingestionError = error instanceof IngestionError ? error : null;
    console.error(JSON.stringify({
      event: "contract_upload_failed",
      contractId: id,
      code: ingestionError?.code ?? "upload_failed",
      message: error instanceof Error ? error.message : String(error),
    }));
    return NextResponse.json({
      error: ingestionError?.message || "We couldn't process this PDF. The file was not confirmed.",
      contractId: id,
      retryable: ingestionError?.retryable ?? false,
      status: ingestionError ? "extraction_failed" : "upload_failed",
    }, { status: ingestionError ? 422 : 500 });
  }
}

async function validatePdf(file: File) {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "TermBeacon currently accepts PDF agreements only." }, { status: 415 });
  }
  if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "PDFs must be larger than 0 bytes and no more than 10 MB." }, { status: 413 });
  }

  const signature = new TextDecoder("ascii").decode(await file.slice(0, 5).arrayBuffer());
  if (signature !== "%PDF-") {
    return NextResponse.json({ error: "That file does not appear to be a valid PDF." }, { status: 415 });
  }
  return null;
}
