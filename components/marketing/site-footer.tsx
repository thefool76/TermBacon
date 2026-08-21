import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#FAF9F9] px-5 py-8 sm:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-8 border-t border-black/10 pt-8 text-sm lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-black text-xs font-semibold text-white">T</span>
            <span className="font-semibold tracking-[-0.03em]" translate="no">TermBeacon</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#4B5563]">
            Vendor-renewal decisions organized around the last actionable cancel-by date.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-[#4B5563]">
          <Link className="hover:text-black" href="/app">Product</Link>
          <a className="hover:text-black" href="#security">Security</a>
          <a className="hover:text-black" href="#pricing">Pricing</a>
          <span>© 2026 TermBeacon</span>
        </div>
      </div>
    </footer>
  );
}
