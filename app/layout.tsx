import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site";

const siteUrl = new URL(siteConfig.url);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "TermBeacon — Vendor Contract Renewal & Cancel-By Tracking",
    template: "%s | TermBeacon",
  },
  description: siteConfig.description,
  applicationName: "TermBeacon",
  category: "Business",
  icons: { icon: "/icon", apple: "/icon" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "TermBeacon",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "TermBeacon Escape Window showing a cancel-by date before renewal" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f6f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip To Content</a>
        {children}
      </body>
    </html>
  );
}
