import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecisionInbox } from "@/components/product/decision-inbox";
import { EscapeWindow } from "@/components/product/escape-window";
import { contracts } from "@/lib/demo-data";

export function ProductProof() {
  return (
    <section id="escape-window" className="border-b border-[#dfe4df] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3e7163]">Product Proof</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">A decision inbox, not another dashboard.</h2>
            <p className="mt-4 text-pretty leading-7 text-[#65716b]">The inbox answers 3 questions: what needs a decision, when is the last day to act, and how much renewal exposure is attached to it.</p>
            <Button asChild variant="outline" className="mt-6"><Link href="/app">Open The Decision Inbox <ArrowRight aria-hidden="true" size={16} /></Link></Button>
          </div>
          <DecisionInbox embedded />
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[.88fr_1.12fr] lg:items-center">
          <div className="lg:pr-8"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3e7163]">The Escape Window</p><h3 className="mt-4 text-balance text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">Make the last actionable date impossible to miss.</h3><p className="mt-4 leading-7 text-[#65716b]">Renewal exposure, notice requirement, owner and source clause sit next to the one date the team needs to protect.</p></div>
          <EscapeWindow contract={contracts[0]} />
        </div>
      </div>
    </section>
  );
}
