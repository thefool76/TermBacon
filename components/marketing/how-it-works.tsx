import type { ReactNode } from "react";
import { ArrowRight, Check, FileUp, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-[#dfe4df] bg-[#eef2ed] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3e7163]">How it works</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Three steps from agreement to decision.</h2>
          <p className="mt-4 text-pretty leading-7 text-[#65716b]">No contract chatbot. No black-box legal score. TermBeacon pulls out the terms that control the renewal window and keeps the final confirmation with your team.</p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <Step number="01" icon={<FileUp aria-hidden="true" size={18} />} title="Upload the agreement" text="Add the vendor contract you need to track." ui={<div className="mt-5 rounded-lg border border-dashed border-[#bcc7c0] bg-[#fbfcf9] p-4 text-center"><FileUp aria-hidden="true" className="mx-auto text-[#557169]" size={20} /><p className="mt-2 text-xs font-semibold">vendor-agreement.pdf</p></div>} />
          <Step number="02" icon={<Check aria-hidden="true" size={18} />} title="Confirm the terms" text="Review renewal date, notice period and auto-renewal language beside the source." ui={<div className="mt-5 space-y-2"><TermRow label="Renewal" value="Nov 1" /><TermRow label="Notice" value="60 days" /><div className="pt-1"><Badge variant="attention">Suggested · Check source</Badge></div></div>} />
          <Step number="03" icon={<Flag aria-hidden="true" size={18} />} title="Decide on time" text="Assign an owner and record Renew, Renegotiate or Cancel before the deadline." ui={<div role="group" aria-label="Decision options preview" className="mt-5 grid grid-cols-3 gap-2"><span className="rounded-md border border-[#cfd7d1] bg-white px-2 py-2 text-center text-xs font-semibold">Renew</span><span className="rounded-md bg-forest px-2 py-2 text-center text-xs font-semibold text-white">Renegotiate</span><span className="rounded-md border border-[#cfd7d1] bg-white px-2 py-2 text-center text-xs font-semibold">Cancel</span></div>} />
        </div>
        <Button variant="outline" asChild className="group mt-8"><a href="#escape-window">See the Escape Window <ArrowRight aria-hidden="true" className="transition-transform duration-150 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1 motion-reduce:transition-none" size={16} /></a></Button>
      </div>
    </section>
  );
}

function Step({ number, icon, title, text, ui }: { number: string; icon: ReactNode; title: string; text: string; ui: ReactNode }) {
  return <Card className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-lg bg-[#edf3ef] text-[#315f52]">{icon}</span><span className="text-xs font-semibold tabular-nums text-[#87908b]">{number}</span></div><h3 className="mt-5 text-lg font-semibold tracking-[-0.025em]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#68736d]">{text}</p>{ui}</Card>;
}
function TermRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between rounded-md bg-[#f6f7f4] px-3 py-2 text-xs"><span className="text-[#6c7771]">{label}</span><strong className="tabular-nums">{value}</strong></div>; }
