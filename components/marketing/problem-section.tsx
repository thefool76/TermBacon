import { ArrowDown, Minus } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="border-b border-[#dfe4df] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3e7163]">The Problem</p>
          <h2 className="mt-4 max-w-xl text-balance text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">The renewal date can already be too late.</h2>
          <p className="mt-5 max-w-xl text-pretty leading-7 text-[#65716b]">A contract that renews November 1 may require cancellation notice by September 2. Miss that earlier date and the team may lose its cleanest chance to act before another annual commitment begins.</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-5 sm:p-6">
          <Equation label="Renewal Date" value="Nov 1" />
          <div className="my-3 flex items-center gap-3 text-[#87908c]"><Minus aria-hidden="true" size={16} /><span className="text-xs font-semibold uppercase tracking-[0.08em]">minus</span></div>
          <Equation label="Notice Period" value="60 days" />
          <div className="my-4 flex justify-center text-[#68756f]"><ArrowDown aria-hidden="true" size={18} /></div>
          <div className="rounded-lg border border-[#edd0ca] bg-[#fff4f1] p-4"><p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#a43727]">Last Day To Act</p><p className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[#8f3022] tabular-nums">Sep 2</p></div>
        </div>
      </div>
    </section>
  );
}

function Equation({ label, value }: { label: string; value: string }) { return <div className="flex items-end justify-between gap-4 rounded-lg bg-[#f6f7f3] p-4"><p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7b8580]">{label}</p><p className="text-2xl font-semibold tracking-[-0.03em] tabular-nums">{value}</p></div>; }
