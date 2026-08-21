import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecisionInbox } from "@/components/product/decision-inbox";

export default function DecisionInboxPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#557169]">Decision Inbox</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">What needs a decision next.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#68736d]">Prioritized by the last day your team can still act—not by the renewal date alone.</p></div>
        <Button asChild><Link href="/app/upload">Add Contract <ArrowRight aria-hidden="true" size={16} /></Link></Button>
      </div>
      <DecisionInbox />
    </div>
  );
}
