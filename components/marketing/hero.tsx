import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecisionInbox } from "@/components/product/decision-inbox";
import { EscapeWindow } from "@/components/product/escape-window";
import { contracts } from "@/lib/demo-data";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#dfe4df]" id="product">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[.82fr_1.18fr] lg:gap-14 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="reveal">
          <p className="inline-flex items-center gap-2 rounded-md border border-[#ced8d1] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#315f52]"><CheckCircle2 aria-hidden="true" size={14} /> Built for vendor renewals</p>
          <h1 className="mt-6 max-w-2xl text-balance text-[clamp(2.7rem,6vw,5rem)] font-semibold leading-[.96] tracking-[-0.065em] text-ink">Stop contracts from renewing before you decide.</h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-[#5e6b65] sm:text-lg sm:leading-8">Upload your vendor agreements. TermBeacon finds the renewal date, notice period and price terms, then shows the last day your team can act.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="acid" size="lg"><Link href="/app/upload">Find My Cancel-By Dates <ArrowRight aria-hidden="true" size={17} /></Link></Button>
            <Button asChild variant="outline" size="lg"><a className="group" href="#escape-window">See the Escape Window <ArrowRight aria-hidden="true" className="transition-transform duration-150 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1 motion-reduce:transition-none" size={17} /></a></Button>
          </div>
          <p className="mt-4 text-xs leading-5 text-[#78827d]">No credit card · Review every suggested term against its source before confirming.</p>
        </div>

        <div className="reveal reveal-delay-2 relative min-w-0">
          <div className="rounded-[14px] border border-[#ccd5cf] bg-[#eef1ed] p-2 shadow-[0_24px_70px_rgba(18,33,29,.12)] sm:p-3">
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-ink">Illustrative demo data</p>
            <DecisionInbox embedded />
            <div className="relative -mt-2 ml-auto w-[96%] sm:-mt-4 sm:w-[86%] lg:w-[82%]">
              <EscapeWindow contract={contracts[0]} compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
