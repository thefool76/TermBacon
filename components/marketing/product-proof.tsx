import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecisionInbox } from "@/components/product/decision-inbox";
import { EscapeWindow } from "@/components/product/escape-window";
import { contracts } from "@/lib/demo-data";

export function ProductProof() {
  return (
    <section id="escape-window" className="border-b border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div><h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">The product starts with the decision, not the dashboard.</h2></div>
          <div className="lg:justify-self-end"><p className="max-w-xl text-pretty leading-7 text-muted-ink">See what needs attention, the last day to act, and the exposure attached to the decision. Everything else is secondary.</p><Button asChild variant="outline" className="mt-6 group"><Link href="/app">Open the Decision Inbox <ArrowRight aria-hidden="true" className="transition-transform duration-150 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1 motion-reduce:transition-none" size={16} /></Link></Button></div>
        </div>
        <div className="mt-12 grid grid-flow-dense gap-5 lg:grid-cols-12 lg:items-start">
          <div className="min-w-0 lg:col-span-7"><DecisionInbox embedded /></div>
          <div className="min-w-0 lg:col-span-5"><EscapeWindow contract={contracts[0]} /></div>
        </div>
      </div>
    </section>
  );
}
