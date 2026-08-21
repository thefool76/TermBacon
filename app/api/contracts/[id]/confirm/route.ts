import { NextResponse } from "next/server";
import { z } from "zod";
import { getIngestion, markIngestionConfirmed } from "@/lib/contract-ingestion";
import { calculateCancelByDate } from "@/lib/demo-data";
import { getContractFileMetadata, getWorkspaceId, saveConfirmedContract } from "@/lib/contract-store";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}, "Invalid date");

const bodySchema = z.object({
  vendor: z.string().trim().min(1).max(160),
  agreement: z.string().trim().min(1).max(240),
  renewalDate: dateSchema,
  noticeDays: z.number().int().min(1).max(730),
  annualExposure: z.number().min(0).max(1_000_000_000),
  owner: z.string().trim().min(1).max(120),
  autoRenew: z.boolean(),
  sourcePage: z.number().int().min(0).max(100000),
  sourceSection: z.string().trim().max(120),
  sourceClause: z.string().trim().min(10).max(4000),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) return NextResponse.json({ error: "Workspace session missing. Sign in again and retry." }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Complete the required terms and supporting clause before confirming." }, { status: 400 });

  const ingestion = await getIngestion(id, workspaceId);
  if (!ingestion) return NextResponse.json({ error: "The extraction draft could not be found." }, { status: 404 });
  if (ingestion.status === "confirmed") return NextResponse.json({ error: "This agreement is already confirmed." }, { status: 409 });
  if (ingestion.status !== "needs_review") {
    return NextResponse.json({ error: "This agreement must finish extraction before it can be confirmed." }, { status: 409 });
  }

  const file = await getContractFileMetadata(id, workspaceId);
  if (!file) return NextResponse.json({ error: "The uploaded agreement could not be found. Upload it again." }, { status: 404 });

  const input = parsed.data;
  const cancelByDate = calculateCancelByDate(input.renewalDate, input.noticeDays);
  try {
    await saveConfirmedContract(workspaceId, {
      id,
      vendor: input.vendor,
      agreement: input.agreement,
      annualExposure: input.annualExposure,
      renewalDate: input.renewalDate,
      noticeDays: input.noticeDays,
      cancelByDate,
      owner: input.owner,
      autoRenew: input.autoRenew,
      fileName: file.file_name,
      sourcePage: input.sourcePage,
      sourceSection: input.sourceSection,
      sourceClause: input.sourceClause,
      extractionConfidence: ingestion.confidence ?? 0,
    });
    await markIngestionConfirmed(id, workspaceId);
  } catch (error) {
    console.error(JSON.stringify({ event: "contract_confirm_failed", contractId: id, message: error instanceof Error ? error.message : "Unknown error" }));
    return NextResponse.json({ error: "The confirmed terms could not be saved." }, { status: 500 });
  }

  return NextResponse.json({ id, cancelByDate });
}
