import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock, FileText, Info, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DecisionActions } from "@/components/product/decision-actions";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type Contract, currency, demoToday, formatShortDate, getDaysRemaining, getOperationalRisk } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export function EscapeWindow({ contract, compact = false, sourceHref = "#source-clause", referenceDate = demoToday, persistDecisions = false }: { contract: Contract; compact?: boolean; sourceHref?: string; referenceDate?: string; persistDecisions?: boolean }) {
  const daysRemaining = getDaysRemaining(contract.cancelByDate, referenceDate);
  const renewalDays = Math.max(1, getDaysRemaining(contract.renewalDate, referenceDate));
  const cancelPosition = Math.max(4, Math.min(92, (daysRemaining / renewalDays) * 100));
  const risk = getOperationalRisk(contract, referenceDate);
  const riskVariant = risk === "critical" ? "critical" : risk === "attention" ? "attention" : "success";
  const deadlineText = risk === "critical" ? "text-[#a43727]" : risk === "attention" ? "text-[#8b5909]" : "text-positive";
  const deadlineFill = risk === "critical" ? "bg-risk-critical" : risk === "attention" ? "bg-risk-warning" : "bg-positive";
  const windowLabel = risk === "critical" ? "Escape window closing" : risk === "attention" ? "Decision window approaching" : "Decision window open";

  return <Card className={cn("overflow-hidden bg-white", !compact && "shadow-[0_18px_50px_rgba(18,33,29,.08)]")}>
    <div className="flex flex-col gap-4 border-b border-[#e2e7e3] p-5 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold tracking-[-0.02em]">{contract.vendor}</p><Badge variant={riskVariant}>{risk === "critical" ? "High Attention" : risk === "attention" ? "Watch" : "On Track"}</Badge></div><p className="mt-1 truncate text-sm text-[#6a756f]">{contract.agreement}</p></div><div className="text-left sm:text-right"><p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7d8782]">Renewal Exposure</p><p className="mt-1 text-xl font-semibold tabular-nums">{currency.format(contract.annualExposure)}</p></div></div>
    <div className={cn("p-5", compact ? "sm:p-5" : "sm:p-6")}>
      <div className="grid grid-cols-3 gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7a8580]"><div><span>Today</span><strong className="mt-1 block text-sm font-semibold normal-case tracking-normal text-ink">{formatShortDate(referenceDate)}</strong></div><div className="text-center"><span className={deadlineText}>Cancel By</span><strong className={cn("mt-1 block text-sm font-semibold normal-case tracking-normal", deadlineText)}>{formatShortDate(contract.cancelByDate)}</strong></div><div className="text-right"><span>Renews</span><strong className="mt-1 block text-sm font-semibold normal-case tracking-normal text-ink">{formatShortDate(contract.renewalDate)}</strong></div></div>
      <div className="relative mt-5 h-2 rounded-full bg-[#e8ece8]" aria-hidden="true"><div className={cn("absolute inset-y-0 left-0 rounded-full", deadlineFill)} style={{ width: `${cancelPosition}%` }} /><div className={cn("absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow-[0_0_0_1px_currentColor]", deadlineFill, deadlineText)} style={{ left: `${cancelPosition}%` }} /><div className="absolute right-0 top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-[#68756f] bg-white" /></div>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className={cn("flex items-center gap-2 text-sm font-semibold", deadlineText)}><CalendarClock aria-hidden="true" size={17} />{windowLabel} · {daysRemaining} days left</p><p className="mt-1.5 text-sm text-[#66716d]">{contract.noticeDays}-day notice required before renewal.</p></div><TooltipProvider delayDuration={250}><Tooltip><TooltipTrigger asChild><button aria-label="Explain how the cancel-by date is calculated" className="inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-[#315f52] hover:bg-[#eef4ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]">Why this date? <Info aria-hidden="true" size={14} /></button></TooltipTrigger><TooltipContent>Renewal {formatShortDate(contract.renewalDate)} minus the contract&apos;s {contract.noticeDays}-day notice requirement gives the last day to act: {formatShortDate(contract.cancelByDate)}.</TooltipContent></Tooltip></TooltipProvider></div>
      {!compact && <div className="mt-6 grid gap-3 border-t border-[#e5e9e5] pt-5 sm:grid-cols-3"><Fact label="Notice Requirement" value={`${contract.noticeDays} days`} icon={<CalendarClock aria-hidden="true" size={16} />} /><Fact label="Owner" value={contract.owner} icon={<ShieldCheck aria-hidden="true" size={16} />} /><Link href={sourceHref} className="group rounded-lg border border-[#e0e5e1] p-3 hover:border-[#bdc9c2] hover:bg-[#f8faf7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]"><p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7a8580]"><FileText aria-hidden="true" size={15} /> Clause Source</p><p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">{contract.source.page > 0 ? `Page ${contract.source.page}` : "Source clause"}{contract.source.section ? ` · § ${contract.source.section}` : ""}<ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-150 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5 motion-reduce:transition-none" /></p></Link></div>}
    </div>
    {!compact ? <DecisionActions vendor={contract.vendor} contractId={persistDecisions ? contract.id : undefined} initialDecision={contract.decision} embedded /> : null}
  </Card>;
}

function Fact({ label, value, icon }: { label: string; value: string; icon: ReactNode }) { return <div className="rounded-lg border border-[#e0e5e1] p-3"><p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7a8580]">{icon}{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>; }
