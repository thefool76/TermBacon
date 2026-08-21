import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateCancelByDate } from "@/lib/demo-data";
import { getContractFileMetadata, getWorkspaceId, saveConfirmedContract } from "@/lib/contract-store";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime()), "Invalid date");
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
  extractionConfidence: z.number().min(0).max(1),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) return NextResponse.json({ error: "Workspace session missing. Reload the app and try again." }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Review the highlighted fields before confirming." }, { status: 400 });

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
      extractionConfidence: input.extractionConfidence,
    });
  } catch (error) {
    console.error(JSON.stringify({ event: "contract_confirm_failed", contractId: id, message: error instanceof Error ? error.message : "Unknown error" }));
    return NextResponse.json({ error: "The confirmed terms could not be saved." }, { status: 500 });
  }

  return NextResponse.json({ id, cancelByDate });
}
