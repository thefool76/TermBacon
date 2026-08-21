import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FileText,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecisionInbox } from "@/components/product/decision-inbox";
import { EscapeWindow } from "@/components/product/escape-window";
import { SourceClause } from "@/components/product/source-clause";
import { contracts, currency, formatShortDate, getDaysRemaining } from "@/lib/demo-data";
import { LandingMotion } from "@/components/marketing/landing-motion";

const leadContract = contracts[0];

const workflow = [
  {
    title: "Upload the agreement",
    copy: "Add the vendor PDF you need to track. TermBeacon stores it first so a failed extraction can be retried without another upload.",
    proof: "vendor-agreement.pdf",
    detail: "PDF persisted before extraction",
    icon: FileText,
  },
  {
    title: "Verify the renewal terms",
    copy: "AI suggests the renewal date, notice period and auto-renewal language. The source clause stays beside the suggestion until a person confirms it.",
    proof: "Nov 1 · 60-day notice",
    detail: "Source-backed human review",
    icon: FileCheck2,
  },
  {
    title: "Protect the cancel-by date",
    copy: "TermBeacon deterministically subtracts the confirmed notice period from the renewal date, assigns ownership and keeps the decision visible.",
    proof: "Sep 2 · last day to act",
    detail: "Renew · Renegotiate · Cancel",
    icon: Clock3,
  },
];

const principles = [
  {
    icon: FileCheck2,
    title: "Source-backed",
    text: "Every trusted renewal term keeps its supporting agreement language nearby.",
  },
  {
    icon: CheckCircle2,
    title: "Human-confirmed",
    text: "AI output stays suggested until a person reviews and confirms the terms.",
  },
  {
    icon: Clock3,
    title: "Deadline-first",
    text: "The operating focus is the last actionable cancel-by date, not a generic contract dashboard.",
  },
];

const pricingFeatures = [
  "Real PDF contract tracking",
  "Renewal-term extraction and review",
  "Source-backed Escape Windows",
  "Owner assignment and decisions",
  "Retryable extraction failures",
];

export function LandingPage() {
  const daysRemaining = getDaysRemaining(leadContract.cancelByDate);

  return (
    <main id="main-content" className="w-full max-w-full overflow-x-hidden" data-release={process.env.NEXT_PUBLIC_RELEASE_SHA ?? "development"}>
      <LandingMotion />

      <section id="product" className="relative border-b border-line px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:px-8 lg:pb-40 lg:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-6xl text-center">
            <p className="js-reveal text-sm font-semibold text-forest">Your renewal date is not your decision deadline.</p>
            <h1 className="js-reveal mx-auto mt-5 max-w-6xl text-balance text-[clamp(3.2rem,7.1vw,7.4rem)] font-semibold leading-[.88] tracking-[-0.078em] text-ink">
              Stop contracts from renewing before you decide.
            </h1>
            <p className="js-reveal mx-auto mt-7 max-w-2xl text-pretty text-base leading-7 text-muted-ink sm:text-lg sm:leading-8">
              Upload vendor agreements. TermBeacon finds the renewal terms, keeps the source beside them, and shows the last day your team can still act.
            </p>
            <div className="js-reveal mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="acid" size="lg">
                <Link href="/app/upload">Find My Cancel-By Dates <ArrowRight aria-hidden="true" size={17} /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a className="group" href="#escape-window">
                  See the Escape Window
                  <ArrowDownRight aria-hidden="true" className="transition-transform duration-150 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 motion-reduce:transition-none" size={17} />
                </a>
              </Button>
            </div>
          </div>

          <div className="js-reveal relative mx-auto mt-16 max-w-6xl lg:mt-20">
            <div className="mx-auto max-w-5xl border-l-2 border-acid pl-3 sm:pl-4">
              <EscapeWindow contract={leadContract} compact />
            </div>
            <div className="relative z-10 -mt-3 ml-auto max-w-xl border border-line bg-white p-4 shadow-[0_14px_40px_rgba(18,33,29,.07)] sm:-mt-6 sm:mr-8 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                <span className="text-muted-ink">Agreement evidence</span>
                <span className="text-positive">Human confirmed</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#46534d]">“{leadContract.source.clause}”</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Product principles" className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-px bg-line sm:grid-cols-3">
          {principles.map((principle) => (
            <div key={principle.title} className="js-reveal bg-white px-6 py-7 sm:px-7 sm:py-8">
              <principle.icon aria-hidden="true" className="text-forest" size={19} />
              <h2 className="mt-4 text-base font-semibold tracking-[-0.02em]">{principle.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-ink">{principle.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-line px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
        <div className="mx-auto max-w-7xl">
          <div className="js-reveal max-w-5xl">
            <p className="text-base font-semibold text-forest">A renewal date tells you what happens.</p>
            <h2 className="mt-4 max-w-5xl text-balance text-[clamp(2.55rem,5.4vw,5.6rem)] font-semibold leading-[.94] tracking-[-0.064em]">
              TermBeacon tells you <span className="inline-flex translate-y-[-0.08em] items-center border border-line bg-white px-3 py-1 text-[.58em] tabular-nums shadow-[0_6px_18px_rgba(18,33,29,.05)]">Sep 2</span> when you still have leverage.
            </h2>
          </div>

          <div className="mt-14 grid grid-flow-dense gap-3 lg:grid-cols-12">
            <article className="js-reveal min-h-72 border border-line bg-white p-6 lg:col-span-7 lg:p-8">
              <div className="flex h-full flex-col justify-between gap-10">
                <div>
                  <p className="text-sm font-semibold text-muted-ink">The contract says</p>
                  <p className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Renews November 1.</p>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-muted-ink">That date is visible, memorable—and operationally incomplete when the agreement requires advance notice.</p>
              </div>
            </article>

            <article className="js-reveal min-h-72 border border-line bg-forest p-6 text-white lg:col-span-5 lg:p-8">
              <div className="flex h-full flex-col justify-between gap-10">
                <div>
                  <p className="text-sm font-semibold text-[#c1d5ce]">The notice requirement says</p>
                  <p className="mt-4 text-5xl font-semibold tracking-[-0.055em] tabular-nums">60 days</p>
                </div>
                <p className="text-sm leading-6 text-[#c7d8d2]">The real operational deadline moves earlier, before the renewal date ever arrives.</p>
              </div>
            </article>

            <article className="js-reveal border border-line bg-[#fff8e9] p-6 lg:col-span-4">
              <Clock3 aria-hidden="true" className="text-risk-warning" size={20} />
              <p className="mt-8 text-sm font-semibold text-[#75500e]">Cancel by</p>
              <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-[#6f4709] tabular-nums">Sep 2</p>
            </article>

            <article className="js-reveal border border-line bg-white p-6 lg:col-span-4">
              <CircleDollarSign aria-hidden="true" className="text-forest" size={20} />
              <p className="mt-8 text-sm font-semibold text-muted-ink">Renewal exposure</p>
              <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] tabular-nums">{currency.format(leadContract.annualExposure)}</p>
            </article>

            <article className="js-reveal border border-line bg-white p-6 lg:col-span-4">
              <UserRoundCheck aria-hidden="true" className="text-forest" size={20} />
              <p className="mt-8 text-sm font-semibold text-muted-ink">Decision owner</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.035em]">{leadContract.owner}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-line bg-muted-surface px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
        <div className="mx-auto max-w-7xl">
          <div className="js-reveal grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <h2 className="max-w-3xl text-balance text-[clamp(2.5rem,4.9vw,5rem)] font-semibold leading-[.95] tracking-[-0.06em]">From agreement to a decision your team can defend.</h2>
            <p className="max-w-2xl text-pretty text-base leading-7 text-muted-ink lg:justify-self-end">No contract chatbot. No opaque legal-risk score. The workflow narrows the document to the terms that control the renewal window and keeps confirmation with a person.</p>
          </div>

          <div className="workflow-rail mt-14 grid gap-3 lg:flex">
            {workflow.map((step, index) => (
              <article key={step.title} className="workflow-panel js-reveal min-w-0 border border-line bg-white p-6 lg:p-7" tabIndex={0}>
                <div className="flex items-center justify-between gap-4">
                  <span className="grid size-10 place-items-center bg-muted-surface text-forest"><step.icon aria-hidden="true" size={18} /></span>
                  <span className="text-xs font-semibold tabular-nums text-muted-ink">0{index + 1}</span>
                </div>
                <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em]">{step.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-ink">{step.copy}</p>
                <div className="workflow-detail mt-8 border-t border-line pt-5">
                  <p className="text-sm font-semibold tabular-nums">{step.proof}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-ink">{step.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="escape-window" className="border-b border-line px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
        <div id="proof-stage" className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.66fr_1.34fr] lg:gap-16">
          <div id="proof-copy" className="js-reveal h-fit lg:pt-8">
            <p className="text-sm font-semibold text-forest">One operational view. Three questions.</p>
            <h2 className="mt-4 max-w-xl text-balance text-[clamp(2.55rem,4.6vw,4.8rem)] font-semibold leading-[.95] tracking-[-0.06em]">What needs a decision, when is the last day to act, and what is at stake?</h2>
            <p className="mt-6 max-w-xl text-pretty leading-7 text-muted-ink">The Decision Inbox sorts attention. The Escape Window explains the deadline. The source view shows exactly what the confirmed date came from.</p>
            <Button asChild variant="outline" className="mt-7">
              <Link href="/app">Open the Decision Inbox <ArrowRight aria-hidden="true" size={16} /></Link>
            </Button>
          </div>

          <div className="space-y-8 lg:space-y-24">
            <div className="js-stack-card sticky top-24 z-10 bg-canvas pb-3">
              <DecisionInbox embedded />
            </div>
            <div className="js-stack-card sticky top-28 z-20 bg-canvas pb-3">
              <EscapeWindow contract={leadContract} />
            </div>
            <div className="js-stack-card sticky top-32 z-30 bg-canvas pb-3">
              <SourceClause contract={leadContract} marketing />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
        <div className="mx-auto max-w-7xl">
          <div className="js-reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-forest">The evidence should survive the AI.</p>
              <h2 className="mt-4 text-balance text-[clamp(2.45rem,4.7vw,4.8rem)] font-semibold leading-[.95] tracking-[-0.06em]">Every suggested term stays attached to agreement language.</h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-ink" aria-hidden="true"><span>Swipe evidence</span><ArrowRight size={15} /></div>
          </div>

          <div className="evidence-rail mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
            {contracts.slice(0, 3).map((contract, index) => (
              <article id={`evidence-${index + 1}`} key={contract.id} className="js-reveal min-w-[88%] snap-start border border-line bg-canvas p-6 sm:min-w-[62%] lg:min-w-[42%] lg:p-7">
                <div className="flex items-center justify-between gap-4 text-xs font-semibold text-muted-ink">
                  <span>{contract.vendor}</span>
                  <span>Page {contract.source.page} · § {contract.source.section}</span>
                </div>
                <p className="mt-8 text-lg leading-8 text-[#38463f]">“{contract.source.clause}”</p>
                <div className="mt-8 flex items-end justify-between gap-5 border-t border-line pt-5">
                  <div>
                    <p className="text-xs font-semibold text-muted-ink">Cancel by</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums">{formatShortDate(contract.cancelByDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-muted-ink">Notice</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums">{contract.noticeDays} days</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="border-b border-[#29483f] bg-ink px-4 py-28 text-white sm:px-6 sm:py-36 lg:px-8 lg:py-44">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <div className="js-reveal">
            <p className="text-sm font-semibold text-[#b8cec6]">Trust starts with showing your work.</p>
            <h2 className="mt-4 max-w-2xl text-balance text-[clamp(2.5rem,4.8vw,4.9rem)] font-semibold leading-[.95] tracking-[-0.06em]">AI can suggest the terms. It does not get the final word.</h2>
            <p className="mt-6 max-w-xl text-pretty leading-7 text-[#bdcec7]">TermBeacon is built around traceability, human confirmation and deterministic date calculation. It does not claim legal advice, certifications or controls that are not implemented and documented.</p>
          </div>

          <div className="grid gap-px bg-white/12 sm:grid-cols-2">
            {[
              [ShieldCheck, "Human confirmation", "Suggested terms stay untrusted until a person confirms them against the source."],
              [FileCheck2, "Source visibility", "The agreement clause remains near the extracted term and calculated deadline."],
              [Check, "Explainable calculation", "Cancel-by is derived from confirmed renewal date minus confirmed notice period."],
              [Clock3, "Operational scope", "Risk signals use deadline, exposure, owner and decision state—not opaque legal scoring."],
            ].map(([Icon, title, text]) => {
              const ItemIcon = Icon as typeof ShieldCheck;
              return (
                <article key={String(title)} className="js-reveal bg-ink p-6 sm:p-7">
                  <ItemIcon aria-hidden="true" className="text-[#b8cec6]" size={20} />
                  <h3 className="mt-6 font-semibold">{String(title)}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#bdcec7]">{String(text)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b border-line px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.78fr] lg:items-start">
          <div className="js-reveal max-w-4xl">
            <p className="text-sm font-semibold text-forest">A focused product should have focused pricing.</p>
            <h2 className="mt-4 text-balance text-[clamp(2.6rem,5.2vw,5.4rem)] font-semibold leading-[.94] tracking-[-0.064em]">Protect the next renewal before building a procurement department around it.</h2>
            <p className="mt-6 max-w-2xl text-pretty leading-7 text-muted-ink">The launch plan is designed for founder-led, finance, operations and procurement teams that need renewal decisions visible and owned.</p>
          </div>

          <div className="js-reveal border border-line bg-white p-6 shadow-[0_16px_44px_rgba(18,33,29,.06)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><p className="font-semibold">Team</p><p className="mt-1 text-sm text-muted-ink">Vendor renewal control</p></div>
              <span className="border border-line bg-muted-surface px-2 py-1 text-xs font-semibold text-forest">Launch plan</span>
            </div>
            <p className="mt-7 text-5xl font-semibold tracking-[-0.055em] tabular-nums">$49<span className="text-sm font-medium tracking-normal text-muted-ink"> / month</span></p>
            <ul className="mt-7 grid gap-3">
              {pricingFeatures.map((feature) => <li key={feature} className="flex items-start gap-2.5 text-sm leading-6"><Check aria-hidden="true" className="mt-1 shrink-0 text-positive" size={15} />{feature}</li>)}
            </ul>
            <Button asChild className="mt-8 w-full" size="lg"><Link href="/app/upload">Start Free</Link></Button>
            <p className="mt-3 text-center text-xs leading-5 text-muted-ink">Product preview · Checkout is not enabled yet.</p>
          </div>
        </div>
      </section>

      <section className="bg-acid px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="js-reveal mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold text-[#35400c]">{daysRemaining} days until the demo contract’s cancel-by date.</p>
          <h2 className="mx-auto mt-4 max-w-5xl text-balance text-[clamp(2.8rem,6vw,6.4rem)] font-semibold leading-[.9] tracking-[-0.07em] text-ink">Decide before the contract decides for you.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty leading-7 text-[#4d591e]">Upload a vendor agreement and make the last actionable date visible while your team can still use it.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg"><Link href="/app/upload">Find My Cancel-By Dates <ArrowRight aria-hidden="true" size={17} /></Link></Button>
            <Button asChild variant="outline" size="lg" className="border-ink/20 bg-transparent hover:bg-white/40"><a href="#escape-window">See the Escape Window</a></Button>
          </div>
        </div>
      </section>
    </main>
  );
}
