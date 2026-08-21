import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  FileCheck2,
  FileText,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { AuraOrbit } from "@/components/marketing/aura-orbit";
import { LandingMotion } from "@/components/marketing/landing-motion";
import { contracts, currency, formatShortDate, getDaysRemaining } from "@/lib/demo-data";

const contract = contracts[0];

const workflow = [
  {
    icon: FileText,
    title: "Upload",
    copy: "Drop in the vendor agreement. The original PDF is stored before extraction so failed runs remain retryable.",
    meta: "PDF → persisted",
  },
  {
    icon: FileCheck2,
    title: "Verify",
    copy: "TermBeacon suggests the renewal date, notice period and auto-renewal language with the supporting clause beside it.",
    meta: "AI → human confirmation",
  },
  {
    icon: Clock3,
    title: "Act",
    copy: "The confirmed notice period is subtracted from renewal to produce the one date your team must protect.",
    meta: "cancel-by → decision",
  },
];

const inboxRows = [
  ["HubSpot", "12 days", "$24,000"],
  ["Datadog", "19 days", "$8,400"],
  ["Salesforce", "27 days", "$36,000"],
];

export function LandingPage() {
  const daysRemaining = getDaysRemaining(contract.cancelByDate);

  return (
    <main
      id="main-content"
      className="aura-landing w-full max-w-full overflow-x-hidden bg-[#FAF9F9] text-[#111827]"
      data-release={process.env.NEXT_PUBLIC_RELEASE_SHA ?? "development"}
    >
      <LandingMotion />

      <section id="product" className="relative overflow-hidden border-b border-black/10">
        <div className="mx-auto grid min-h-[calc(100svh-88px)] max-w-[1440px] items-stretch lg:grid-cols-12">
          <div className="relative flex flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:col-span-7 lg:px-12 xl:px-16">
            <div className="aura-reveal aura-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F97316]">
              Vendor renewal control / 2026
            </div>

            <h1 className="aura-reveal aura-display mt-7 max-w-5xl text-[clamp(3.25rem,6.2vw,6.8rem)] font-medium leading-[.92] tracking-[-0.055em] text-black">
              Stop contracts
              <span className="mx-2 inline-flex size-[.62em] translate-y-[.05em] items-center justify-center rounded-full bg-[#F97316] align-baseline sm:mx-3">
                <span className="size-[.26em] rounded-full border border-black/80" aria-hidden="true" />
              </span>
              from renewing before you decide.
            </h1>

            <p className="aura-reveal mt-7 max-w-2xl text-base leading-7 text-[#4B5563] sm:text-lg sm:leading-8">
              Upload the agreement. TermBeacon finds the renewal terms, keeps the source visible, and shows the last day your team can still act.
            </p>

            <div className="aura-reveal mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app/upload"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#F97316] px-6 py-3 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(249,115,22,.22)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(249,115,22,.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                Find My Cancel-By Dates
                <ArrowRight aria-hidden="true" size={16} className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
              </Link>
              <a
                href="#escape-window"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/20 bg-white px-6 py-3 text-sm font-semibold text-black transition-[transform,border-color,background-color] duration-300 ease-out hover:-translate-y-1 hover:border-black hover:bg-[#FFF7ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] motion-reduce:transition-none"
              >
                See the Escape Window
                <ArrowRight aria-hidden="true" size={16} className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
              </a>
            </div>

            <div className="aura-reveal mt-10 flex max-w-2xl items-center gap-3 border-t border-black/10 pt-5 text-sm text-[#4B5563]">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-black text-white">
                <Check aria-hidden="true" size={14} />
              </span>
              <p>AI suggests. Your team confirms. The cancel-by date is calculated from confirmed terms.</p>
            </div>
          </div>

          <div className="relative min-h-[620px] overflow-hidden bg-[#191C21] lg:col-span-5 lg:min-h-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(249,115,22,.32),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(251,146,60,.16),transparent_30%)]" />
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:44px_44px]" />
            <AuraOrbit />

            <div className="relative z-10 flex h-full min-h-[620px] flex-col justify-between p-5 sm:p-8 lg:p-7 xl:p-9">
              <div className="aura-reveal flex items-center justify-between">
                <span className="aura-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">Live escape window</span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80">Source verified</span>
              </div>

              <div className="aura-reveal mx-auto flex w-full max-w-[420px] flex-col items-center py-12 text-center">
                <span className="aura-mono text-[11px] uppercase tracking-[0.15em] text-white/45">Last day to act</span>
                <strong className="aura-display mt-3 text-[clamp(4.4rem,8vw,7.3rem)] font-medium leading-none tracking-[-0.06em] text-white tabular-nums">
                  {formatShortDate(contract.cancelByDate)}
                </strong>
                <span className="mt-4 rounded-full bg-[#F97316] px-4 py-2 text-sm font-semibold text-black">
                  {daysRemaining} days remaining
                </span>
              </div>

              <div className="aura-reveal rounded-2xl border border-white/10 bg-black/45 p-5 shadow-[0_24px_80px_rgba(0,0,0,.32)] backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{contract.vendor}</p>
                    <p className="mt-1 text-xs text-white/45">{contract.agreement}</p>
                  </div>
                  <div className="text-right">
                    <p className="aura-mono text-[10px] uppercase tracking-[0.12em] text-white/35">Exposure</p>
                    <p className="mt-1 font-semibold text-white tabular-nums">{currency.format(contract.annualExposure)}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <HeroFact label="Today" value="Aug 21" />
                  <HeroFact label="Cancel by" value={formatShortDate(contract.cancelByDate)} accent />
                  <HeroFact label="Renews" value={formatShortDate(contract.renewalDate)} />
                </div>

                <div className="relative mt-5 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className="absolute inset-y-0 left-0 w-[58%] rounded-full bg-[#F97316]" />
                </div>

                <p className="mt-4 text-xs leading-5 text-white/50">
                  Renewal {formatShortDate(contract.renewalDate)} minus the confirmed {contract.noticeDays}-day notice period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="TermBeacon workflow" className="overflow-hidden border-b border-black bg-black py-4 text-white">
        <div className="aura-marquee-track aura-mono flex w-max items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.16em]">
          {[...Array(2)].flatMap((_, set) =>
            ["Upload agreement", "Extract terms", "Verify source", "Calculate cancel-by", "Assign owner", "Decide before renewal"].map((item, index) => (
              <span key={`${set}-${index}`} className="flex items-center gap-10">
                <span>{item}</span><span className="size-1.5 rounded-full bg-[#F97316]" />
              </span>
            )),
          )}
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="aura-reveal max-w-4xl">
            <p className="aura-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F97316]">The date that matters</p>
            <h2 className="aura-display mt-5 text-[clamp(2.8rem,5.5vw,5.7rem)] font-medium leading-[.96] tracking-[-0.05em] text-black">
              Renewal is the event. Cancel-by is the decision deadline.
            </h2>
          </div>

          <div className="mt-14 grid grid-flow-dense gap-4 lg:grid-cols-12">
            <article className="aura-reveal rounded-2xl border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(17,24,39,.05)] sm:p-8 lg:col-span-7">
              <div className="flex min-h-[330px] flex-col justify-between">
                <div className="flex items-center justify-between gap-4">
                  <span className="aura-mono text-[11px] uppercase tracking-[0.14em] text-[#4B5563]">Contract term</span>
                  <CalendarDays aria-hidden="true" className="text-[#F97316]" size={20} />
                </div>
                <div>
                  <p className="aura-display text-[clamp(3.8rem,8vw,7rem)] font-medium leading-none tracking-[-0.055em] text-black tabular-nums">Nov 1</p>
                  <p className="mt-4 max-w-xl text-base leading-7 text-[#4B5563]">A memorable date, but already too late if the agreement requires notice before renewal.</p>
                </div>
              </div>
            </article>

            <article className="aura-reveal rounded-2xl bg-[#191C21] p-6 text-white sm:p-8 lg:col-span-5">
              <div className="flex min-h-[330px] flex-col justify-between">
                <span className="aura-mono text-[11px] uppercase tracking-[0.14em] text-white/40">Notice requirement</span>
                <div>
                  <p className="aura-display text-[clamp(4rem,7vw,6.4rem)] font-medium leading-none tracking-[-0.055em] tabular-nums">{contract.noticeDays}</p>
                  <p className="mt-2 text-lg text-[#FB923C]">days earlier</p>
                  <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">The agreement shifts the operational deadline forward.</p>
                </div>
              </div>
            </article>

            <MetricCard icon={Clock3} label="Cancel by" value={formatShortDate(contract.cancelByDate)} tone="orange" />
            <MetricCard icon={FileCheck2} label="Source" value={`Page ${contract.source.page} · § ${contract.source.section}`} />
            <MetricCard icon={UserRoundCheck} label="Owner" value={contract.owner} />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#191C21] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="aura-reveal grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <h2 className="aura-display max-w-3xl text-[clamp(2.7rem,5vw,5.2rem)] font-medium leading-[.96] tracking-[-0.05em]">
              Three moves from PDF to a protected decision window.
            </h2>
            <p className="max-w-xl text-base leading-7 text-white/55 lg:justify-self-end">
              Focused inputs, visible source language, and one deterministic deadline. No generic contract chat layer.
            </p>
          </div>

          <div className="aura-accordion mt-14 flex flex-col gap-3 lg:flex-row">
            {workflow.map((step, index) => (
              <article
                key={step.title}
                tabIndex={0}
                className="aura-accordion-card aura-reveal group min-w-0 rounded-2xl border border-white/10 bg-black/35 p-6 outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] sm:p-7"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-xl bg-[#F97316] text-black">
                    <step.icon aria-hidden="true" size={18} />
                  </span>
                  <span className="aura-mono text-[11px] font-semibold text-white/30">0{index + 1}</span>
                </div>
                <h3 className="aura-display mt-8 text-3xl font-medium tracking-[-0.035em]">{step.title}</h3>
                <p className="aura-accordion-copy mt-4 max-w-md text-sm leading-6 text-white/55">{step.copy}</p>
                <div className="mt-8 border-t border-white/10 pt-4">
                  <span className="aura-mono text-[10px] uppercase tracking-[0.13em] text-[#FB923C]">{step.meta}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="escape-window" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <div id="aura-proof-stage" className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <div id="aura-proof-copy" className="h-fit">
            <p className="aura-reveal aura-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F97316]">The operating view</p>
            <h2 className="aura-reveal aura-display mt-5 max-w-xl text-[clamp(2.7rem,4.8vw,5rem)] font-medium leading-[.96] tracking-[-0.05em] text-black">
              What needs attention. When you must act. What it is worth.
            </h2>
            <p className="aura-reveal mt-6 max-w-lg text-base leading-7 text-[#4B5563]">
              The product stays narrow on purpose: decision queue, supporting clause, escape window, owner and outcome.
            </p>
          </div>

          <div className="space-y-10 lg:space-y-24">
            <div className="aura-scale rounded-2xl border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(17,24,39,.08)] sm:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-5">
                <div>
                  <p className="text-sm font-semibold">Decision Inbox</p>
                  <p className="mt-1 text-xs text-[#4B5563]">Sorted by last day to act</p>
                </div>
                <span className="rounded-full bg-[#FFF7ED] px-3 py-1.5 text-xs font-semibold text-[#C2410C]">3 need attention</span>
              </div>
              <div className="divide-y divide-black/10">
                {inboxRows.map(([vendor, days, exposure]) => (
                  <div key={vendor} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-4">
                    <span className="text-sm font-semibold">{vendor}</span>
                    <span className="aura-mono text-[11px] text-[#C2410C]">{days}</span>
                    <span className="text-sm font-medium tabular-nums">{exposure}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="aura-scale overflow-hidden rounded-2xl border border-[#2A2524] bg-[#191C21] text-white shadow-[0_30px_90px_rgba(0,0,0,.18)]">
              <div className="grid lg:grid-cols-[1.08fr_.92fr]">
                <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
                  <div className="flex items-center justify-between gap-4">
                    <span className="aura-mono text-[11px] uppercase tracking-[0.13em] text-white/40">Source agreement</span>
                    <span className="text-xs text-white/35">Page {contract.source.page}</span>
                  </div>
                  <p className="mt-10 text-lg leading-8 text-white/75">“{contract.source.clause}”</p>
                </div>
                <div className="p-6">
                  <span className="aura-mono text-[11px] uppercase tracking-[0.13em] text-[#FB923C]">Confirmed terms</span>
                  <dl className="mt-6 divide-y divide-white/10">
                    <Term label="Renewal" value={formatShortDate(contract.renewalDate)} />
                    <Term label="Notice" value={`${contract.noticeDays} days`} />
                    <Term label="Auto-renew" value="Yes" />
                  </dl>
                </div>
              </div>
            </div>

            <div className="aura-scale rounded-2xl border border-black/10 bg-[#F97316] p-6 text-black shadow-[0_28px_80px_rgba(249,115,22,.22)] sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="aura-mono text-[11px] uppercase tracking-[0.13em] text-black/55">Escape window</p>
                  <p className="aura-display mt-3 text-5xl font-medium tracking-[-0.055em] tabular-nums">{formatShortDate(contract.cancelByDate)}</p>
                  <p className="mt-2 text-sm font-medium text-black/65">{daysRemaining} days left to decide</p>
                </div>
                <div className="rounded-xl bg-black px-5 py-4 text-white">
                  <p className="aura-mono text-[10px] uppercase tracking-[0.12em] text-white/45">Exposure</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">{currency.format(contract.annualExposure)}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {["Renew", "Renegotiate", "Cancel"].map((decision) => (
                  <span key={decision} className="rounded-lg border border-black/20 bg-white/35 px-4 py-3 text-center text-sm font-semibold">{decision}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="security" className="bg-black px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="aura-reveal">
            <span className="aura-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FB923C]">Traceable by design</span>
            <h2 className="aura-display mt-5 max-w-3xl text-[clamp(2.7rem,4.8vw,5rem)] font-medium leading-[.96] tracking-[-0.05em]">
              AI does not get the final word.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/55">
              TermBeacon keeps source language, human confirmation and deterministic date math visible in the same operating flow.
            </p>
          </div>

          <div className="grid gap-3">
            <SecurityRow icon={FileCheck2} title="Source stays visible" copy="Extracted renewal terms point back to the supporting agreement language." />
            <SecurityRow icon={ShieldCheck} title="Human confirmation" copy="Suggested terms do not become trusted product state until a person confirms them." />
            <SecurityRow icon={Clock3} title="Explainable deadline" copy="Cancel-by is calculated from confirmed renewal date minus confirmed notice period." />
          </div>
        </div>
      </section>

      <section id="pricing" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div className="aura-reveal">
            <p className="aura-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F97316]">One focused plan</p>
            <h2 className="aura-display mt-5 max-w-3xl text-[clamp(2.7rem,5vw,5.2rem)] font-medium leading-[.96] tracking-[-0.05em] text-black">
              Protect the renewal decision before adding procurement complexity.
            </h2>
          </div>

          <div className="aura-reveal rounded-2xl border border-black/10 bg-white p-7 shadow-[0_24px_80px_rgba(17,24,39,.08)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">Team</p>
                <p className="mt-1 text-sm text-[#4B5563]">Vendor renewal control</p>
              </div>
              <span className="rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white">Launch</span>
            </div>
            <p className="aura-display mt-8 text-6xl font-medium tracking-[-0.055em] tabular-nums">$49<span className="text-base font-normal tracking-normal text-[#4B5563]"> / month</span></p>
            <ul className="mt-8 grid gap-3 text-sm">
              {["PDF upload + extraction", "Source-backed term review", "Escape Window", "Owner + renewal decision", "Retryable failed extraction"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="grid size-5 place-items-center rounded-full bg-[#FFF7ED] text-[#F97316]"><Check aria-hidden="true" size={12} /></span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/app/upload"
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#F97316] px-6 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black motion-reduce:transition-none"
            >
              Start Free
            </Link>
            <p className="mt-3 text-center text-xs leading-5 text-[#6B7280]">Product preview · checkout is not enabled yet.</p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-5 sm:px-8 sm:pb-8">
        <div className="mx-auto max-w-[1440px] overflow-hidden rounded-2xl bg-[#191C21] px-6 py-20 text-white sm:px-10 sm:py-24 lg:px-14">
          <div className="aura-reveal grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="aura-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FB923C]">Before the window closes</p>
              <h2 className="aura-display mt-5 max-w-5xl text-[clamp(3rem,5.8vw,6.2rem)] font-medium leading-[.94] tracking-[-0.055em]">
                Decide before the contract decides for you.
              </h2>
            </div>
            <Link
              href="/app/upload"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#F97316] px-7 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
            >
              Find My Cancel-By Dates
              <ArrowRight aria-hidden="true" size={17} className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroFact({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="aura-mono text-[9px] uppercase tracking-[0.1em] text-white/30">{label}</p>
      <p className={`mt-1 text-sm font-semibold tabular-nums ${accent ? "text-[#FB923C]" : "text-white"}`}>{value}</p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone = "light",
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
  tone?: "light" | "orange";
}) {
  const orange = tone === "orange";
  return (
    <article className={`aura-reveal rounded-2xl p-6 lg:col-span-4 ${orange ? "bg-[#F97316] text-black" : "border border-black/10 bg-white"}`}>
      <Icon aria-hidden="true" size={20} className={orange ? "text-black" : "text-[#F97316]"} />
      <p className={`aura-mono mt-10 text-[10px] uppercase tracking-[0.13em] ${orange ? "text-black/55" : "text-[#6B7280]"}`}>{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] tabular-nums">{value}</p>
    </article>
  );
}

function Term({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-white/45">{label}</dt>
      <dd className="text-sm font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function SecurityRow({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof ShieldCheck;
  title: string;
  copy: string;
}) {
  return (
    <article className="aura-reveal group rounded-2xl border border-white/10 bg-[#191C21] p-6 transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#F97316] text-black">
          <Icon aria-hidden="true" size={18} />
        </span>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/50">{copy}</p>
        </div>
      </div>
    </article>
  );
}
