import type { Metadata } from "next";
import { FinalCta } from "@/components/marketing/final-cta";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PricingSection } from "@/components/marketing/pricing-section";
import { ProblemSection } from "@/components/marketing/problem-section";
import { ProductProof } from "@/components/marketing/product-proof";
import { RiskSection } from "@/components/marketing/risk-section";
import { SecuritySection } from "@/components/marketing/security-section";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { SourceVerificationSection } from "@/components/marketing/source-verification-section";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { siteConfig } from "@/lib/site";

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
      <main id="main-content" data-release={process.env.NEXT_PUBLIC_RELEASE_SHA ?? "development"}>
        <Hero />
        <TrustStrip />
        <ProblemSection />
        <HowItWorks />
        <ProductProof />
        <SourceVerificationSection />
        <RiskSection />
        <SecuritySection />
        <PricingSection />
        <FinalCta />
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </>
  );
}
