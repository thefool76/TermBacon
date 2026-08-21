import { ensureContractSchema, getWorkspaceId, readContractFile } from "@/lib/contract-store";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) return new Response("Not found", { status: 404 });

  const env = await ensureContractSchema();
  const confirmed = await env.DB.prepare("SELECT id FROM contracts WHERE id = ? AND workspace_id = ? AND status = 'confirmed' LIMIT 1")
    .bind(id, workspaceId)
    .first<{ id: string }>();
  if (!confirmed) return new Response("Not found", { status: 404 });

  const file = await readContractFile(id, workspaceId);
  if (!file) return new Response("Not found", { status: 404 });

  const safeName = file.fileName.replace(/[\"\\\r\n]/g, "");
  return new Response(file.bytes, {
    headers: {
      "Content-Type": file.contentType || "application/pdf",
      "Content-Disposition": `inline; filename="${safeName}"`,
      "Content-Length": String(file.bytes.byteLength),
      "Cache-Control": "private, no-store",
    },
  });
}
