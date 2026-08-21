import { ArrowRight } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="border-b border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
          <div>
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">A renewal date can be weeks too late to matter.</h2>
          </div>
          <p className="max-w-2xl text-pretty leading-7 text-muted-ink lg:justify-self-end">The date on the invoice is not the date your team controls. A notice clause can close the clean exit window long before the contract renews.</p>
        </div>

        <div className="mt-12 grid grid-flow-dense gap-3 lg:grid-cols-12">
          <DeadlineBlock className="lg:col-span-4" label="Contract renews" value="Nov 1" detail="The date everyone remembers." />
          <DeadlineBlock className="lg:col-span-3" label="Notice required" value="60 days" detail="The clause that changes the timeline." />
          <div className="lg:col-span-5 border border-forest bg-forest p-6 text-white sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-[#c9ddd5]">Last actionable day</p><p className="mt-3 text-5xl font-semibold tracking-[-0.055em] tabular-nums sm:text-6xl">Sep 2</p></div><ArrowRight aria-hidden="true" className="text-acid" size={23} /></div>
            <p className="mt-6 max-w-sm text-sm leading-6 text-[#c9d8d2]">That earlier date is the Escape Window TermBeacon protects.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeadlineBlock({ className, label, value, detail }: { className?: string; label: string; value: string; detail: string }) {
  return <div className={`${className ?? ""} border border-line bg-white p-6 sm:p-7`}><p className="text-sm font-semibold text-muted-ink">{label}</p><p className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-ink tabular-nums">{value}</p><p className="mt-5 text-sm leading-6 text-muted-ink">{detail}</p></div>;
}
