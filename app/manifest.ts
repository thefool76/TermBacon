import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TermBeacon",
    short_name: "TermBeacon",
    description: "Vendor contract renewal and cancel-by tracking for finance, procurement and operations teams.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6f0",
    theme_color: "#123b32",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
