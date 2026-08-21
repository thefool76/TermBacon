import { NextResponse } from "next/server";
import { getIngestion, IngestionError, processContractIngestion } from "@/lib/contract-ingestion";
import { getWorkspaceId } from "@/lib/contract-store";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) return NextResponse.json({ error: "Workspace session missing. Sign in again and retry." }, { status: 401 });

  const ingestion = await getIngestion(id, workspaceId);
  if (!ingestion) return NextResponse.json({ error: "That uploaded agreement could not be found." }, { status: 404 });
  if (ingestion.status === "confirmed") {
    return NextResponse.json({ error: "This agreement is already confirmed.", contractId: id }, { status: 409 });
  }
  if (ingestion.status === "processing") {
    return NextResponse.json({ error: "This agreement is already being processed." }, { status: 409 });
  }

  try {
    const contract = await processContractIngestion(id, workspaceId);
    return NextResponse.json({ contract, status: "needs_review" });
  } catch (error) {
    const ingestionError = error instanceof IngestionError ? error : null;
    return NextResponse.json({
      error: ingestionError?.message || "Extraction failed again. You can retry or upload a different PDF.",
      contractId: id,
      retryable: ingestionError?.retryable ?? true,
      status: "extraction_failed",
    }, { status: 422 });
  }
}
