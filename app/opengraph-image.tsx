import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f7f6f0", color: "#12211d", padding: "60px 68px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, fontWeight: 700 }}><div style={{ display: "flex", width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 10, background: "#123b32", color: "white" }}>T</div>TermBeacon</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ maxWidth: 900, fontSize: 64, lineHeight: 1.02, fontWeight: 700, letterSpacing: "-0.045em" }}>Stop contracts from renewing before you decide.</div>
        <div style={{ fontSize: 25, color: "#5f6c66" }}>Today → Cancel-by date → Renewal date</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, border: "1px solid #d8ded8", borderRadius: 12, background: "white", padding: "22px 28px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontSize: 15, color: "#75817b", textTransform: "uppercase" }}>Today</span><strong style={{ fontSize: 24 }}>Aug 21</strong></div>
        <div style={{ height: 2, flex: 1, background: "#b9412e" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><span style={{ fontSize: 15, color: "#a43727", textTransform: "uppercase" }}>Cancel By</span><strong style={{ fontSize: 28, color: "#a43727" }}>Sep 2</strong></div>
        <div style={{ height: 2, flex: 1, background: "#d8ded8" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}><span style={{ fontSize: 15, color: "#75817b", textTransform: "uppercase" }}>Renews</span><strong style={{ fontSize: 24 }}>Nov 1</strong></div>
      </div>
    </div>,
    size,
  );
}
