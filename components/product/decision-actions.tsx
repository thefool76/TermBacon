"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const actions = [
  { label: "Renew", variant: "outline" as const },
  { label: "Renegotiate", variant: "default" as const },
  { label: "Cancel", variant: "outline" as const },
];

export function DecisionActions({ vendor, embedded = false }: { vendor: string; embedded?: boolean }) {
  const [saved, setSaved] = useState<string | null>(null);

  return (
    <div className={cn(embedded ? "border-t border-[#e5e9e5] px-5 py-4 sm:px-6" : "rounded-xl border border-line bg-white p-5")}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Make The Renewal Decision</p>
          <p className="mt-1 text-sm text-[#69746f]">Record the team&apos;s intent before the escape window closes.</p>
        </div>
        <div role="group" aria-label={`Renewal decision for ${vendor}`} className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Dialog key={action.label}>
              <DialogTrigger asChild><Button variant={action.variant}>{action.label}</Button></DialogTrigger>
              <DialogContent>
                <DialogTitle>{action.label} {vendor}?</DialogTitle>
                <DialogDescription>This demo records the decision in the interface only. No vendor is contacted and no contract is changed.</DialogDescription>
                <div className="mt-6 flex justify-end gap-2">
                  <DialogClose asChild><Button variant="outline">Keep Reviewing</Button></DialogClose>
                  <DialogClose asChild><Button variant={action.variant} onClick={() => setSaved(action.label)}>Confirm {action.label}</Button></DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
      <div aria-live="polite" className="mt-3 min-h-5 text-sm text-positive">
        {saved ? <span className="inline-flex items-center gap-2"><CheckCircle2 aria-hidden="true" size={16} /> Demo decision saved: {saved}.</span> : null}
      </div>
    </div>
  );
}
