import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceId, updateDecision } from "@/lib/contract-store";
const bodySchema = z.object({ decision: z.enum(["renew", "renegotiate", "cancel"]) });
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; const workspaceId = await getWorkspaceId(); if (!workspaceId) return NextResponse.json({ error: "Workspace session missing." }, { status: 401 }); const parsed = bodySchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Choose a valid renewal decision." }, { status: 400 }); const updated = await updateDecision(id, parsed.data.decision, workspaceId); if (!updated) return NextResponse.json({ error: "Contract not found." }, { status: 404 }); return NextResponse.json({ ok: true, decision: parsed.data.decision }); }
