import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./aura.css";
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
  themeColor: "#FAF9F9",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Inter:wght@500;600&family=JetBrains+Mono:wght@500;600&display=swap"
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip To Content</a>
        {children}
      </body>
    </html>
  );
}
