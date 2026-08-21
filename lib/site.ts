function normalizeSiteUrl(value?: string) {
  const raw = value?.trim() || "http://localhost:3000";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "TermBeacon",
  tagline: "Stop contracts from renewing before you decide.",
  description:
    "Upload vendor agreements. TermBeacon finds renewal dates, notice periods and price terms, then shows the last day your team can act.",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  nav: [
    { label: "Product", href: "#product" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Security", href: "#security" },
    { label: "Pricing", href: "#pricing" },
  ],
} as const;
