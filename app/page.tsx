import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/landing-page";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "TermBeacon",
    url: "/",
    title: "Stop contracts from renewing before you decide.",
    description: siteConfig.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "TermBeacon Escape Window showing a cancel-by date before renewal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stop contracts from renewing before you decide.",
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: "TermBeacon", url: siteConfig.url },
    {
      "@type": "SoftwareApplication",
      name: "TermBeacon",
      url: siteConfig.url,
      description: siteConfig.description,
    },
  ],
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <LandingPage />
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </>
  );
}
