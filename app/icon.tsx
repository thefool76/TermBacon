import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#123b32", color: "#f7f6f0", fontSize: 260, fontWeight: 800, letterSpacing: "-0.08em" }}>T</div>,
    size,
  );
}
