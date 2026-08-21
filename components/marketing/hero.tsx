import Link from "next/link";
import { ArrowDownRight, ArrowRight, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EscapeWindow } from "@/components/product/escape-window";
import { contracts } from "@/lib/demo-data";

export function Hero() {
  return (
    <section id="product" className="overflow-hidden border-b border-line">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8 lg:pb-32 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-[1.08fr_.92fr] lg:items-start lg:gap-16">
          <div className="reveal min-w-0">
            <p className="max-w-xl text-sm font-semibold leading-6 text-forest">Your renewal date is not your decision deadline.</p>
            <h1 className="mt-5 max-w-5xl text-balance text-[clamp(3.15rem,6.2vw,6.35rem)] font-semibold leading-[.91] tracking-[-0.072em] text-ink">Stop contracts from renewing before you decide.</h1>
            <p className="mt-7 max-w-2xl text-pretty text-base leading-7 text-muted-ink sm:text-lg sm:leading-8">Upload a vendor agreement. TermBeacon finds the renewal terms, keeps the source clause beside them, and shows the last day your team can still act.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="acid" size="lg"><Link href="/app/upload">Find My Cancel-By Dates <ArrowRight aria-hidden="true" size={17} /></Link></Button>
              <Button asChild variant="outline" size="lg"><a className="group" href="#escape-window">See the Escape Window <ArrowDownRight aria-hidden="true" className="transition-transform duration-150 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 motion-reduce:transition-none" size={17} /></a></Button>
            </div>
            <div className="mt-8 flex max-w-2xl items-start gap-3 border-t border-line pt-5 text-sm leading-6 text-muted-ink">
              <FileCheck2 aria-hidden="true" className="mt-0.5 shrink-0 text-positive" size={17} />
              <p>AI suggests renewal terms. A person confirms the source before TermBeacon treats the deadline as trusted product state.</p>
            </div>
          </div>

          <div className="reveal reveal-delay-2 min-w-0 lg:pt-8">
            <div className="border-l-2 border-acid pl-3 sm:pl-4">
              <p className="mb-3 text-xs font-semibold text-muted-ink">Illustrative agreement</p>
              <EscapeWindow contract={contracts[0]} compact />
            </div>
            <div className="ml-auto mt-4 max-w-md border border-line bg-white p-4 shadow-[0_10px_30px_rgba(18,33,29,.05)]">
              <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-muted-ink">Clause verified</p><span className="text-xs font-semibold text-positive">Human confirmed</span></div>
              <p className="mt-3 text-sm leading-6 text-[#46534d]">“Unless either party gives written notice at least 60 days before the end of the then-current term…”</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
