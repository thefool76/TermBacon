"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Decision } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const actions = [
  { label: "Renew", value: "renew" as const, variant: "outline" as const },
  { label: "Renegotiate", value: "renegotiate" as const, variant: "default" as const },
  { label: "Cancel", value: "cancel" as const, variant: "outline" as const },
];

export function DecisionActions({ vendor, contractId, initialDecision = "pending", embedded = false }: { vendor: string; contractId?: string; initialDecision?: Decision; embedded?: boolean }) {
  const router = useRouter();
  const [saved, setSaved] = useState<Decision>(initialDecision);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveDecision(decision: Exclude<Decision, "pending">) {
    setError("");
    if (!contractId) { setSaved(decision); return; }
    setSaving(true);
    try {
      const response = await fetch(`/api/contracts/${contractId}/decision`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision }) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not save the decision.");
      setSaved(decision);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save the decision.");
    } finally { setSaving(false); }
  }

  return <div className={cn(embedded ? "border-t border-[#e5e9e5] px-5 py-4 sm:px-6" : "rounded-xl border border-line bg-white p-5")}><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold">Make the renewal decision</p><p className="mt-1 text-sm text-[#69746f]">Record the team&apos;s intent before the escape window closes.</p></div><div role="group" aria-label={`Renewal decision for ${vendor}`} className="flex flex-wrap gap-2">{actions.map((action) => <Dialog key={action.value}><DialogTrigger asChild><Button variant={saved === action.value ? "default" : action.variant} disabled={saving}>{action.label}</Button></DialogTrigger><DialogContent><DialogTitle>{action.label} {vendor}?</DialogTitle><DialogDescription>{contractId ? "This records the decision in TermBeacon only. It does not contact the vendor or modify the agreement." : "This product preview records the decision in the interface only."}</DialogDescription><div className="mt-6 flex justify-end gap-2"><DialogClose asChild><Button variant="outline">Keep Reviewing</Button></DialogClose><DialogClose asChild><Button variant={action.variant} onClick={() => void saveDecision(action.value)}>Confirm {action.label}</Button></DialogClose></div></DialogContent></Dialog>)}</div></div><div aria-live="polite" className="mt-3 min-h-5 text-sm">{error ? <span className="text-[#a43727]">{error}</span> : saved !== "pending" ? <span className="inline-flex items-center gap-2 text-positive"><CheckCircle2 aria-hidden="true" size={16} /> Decision saved: {saved === "renegotiate" ? "Renegotiate" : saved === "renew" ? "Renew" : "Cancel"}.</span> : null}</div></div>;
}
