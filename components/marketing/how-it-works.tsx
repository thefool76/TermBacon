import { Check, FileUp, Flag } from "lucide-react";

const steps = [
  { icon: FileUp, title: "Upload", text: "Add the vendor agreement you need to track.", proof: "PDF stored before extraction, so failures can be retried." },
  { icon: Check, title: "Verify", text: "Review renewal date, notice period and auto-renewal language beside the source.", proof: "Unknown fields stay unknown instead of becoming guesses." },
  { icon: Flag, title: "Decide", text: "Protect the cancel-by date and record Renew, Renegotiate or Cancel.", proof: "The decision stays owned by your team." },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-line bg-muted-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">From agreement to action, without the contract-management sprawl.</h2>
          <p className="max-w-2xl text-pretty leading-7 text-muted-ink lg:justify-self-end">TermBeacon does one job: turn renewal language into a visible, source-backed operating deadline your team can act on.</p>
        </div>
        <div className="mt-12 grid grid-flow-dense border border-line bg-white lg:grid-cols-12">
          {steps.map((step, index) => <article key={step.title} className={`p-6 sm:p-7 lg:col-span-4 ${index < steps.length - 1 ? "border-b border-line lg:border-b-0 lg:border-r" : ""}`}><step.icon aria-hidden="true" className="text-forest" size={21} /><h3 className="mt-8 text-2xl font-semibold tracking-[-0.035em]">{step.title}</h3><p className="mt-3 text-sm leading-6 text-[#56645e]">{step.text}</p><p className="mt-8 border-t border-line pt-4 text-xs leading-5 text-muted-ink">{step.proof}</p></article>)}
        </div>
      </div>
    </section>
  );
}
