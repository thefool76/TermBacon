import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#29483f] bg-forest text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
        <div>
          <p className="text-lg font-semibold tracking-[-0.035em]" translate="no">TermBeacon</p>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#c3d4ce]">Vendor-renewal decisions organized around the last actionable cancel-by date, its source terms, exposure and owner.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#c3d4ce]">
          <Link className="rounded-sm transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid" href="/app">Product</Link>
          <a className="rounded-sm transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid" href="#security">Security</a>
          <a className="rounded-sm transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid" href="#pricing">Pricing</a>
          <span>© 2026 TermBeacon</span>
        </div>
      </div>
    </footer>
  );
}
