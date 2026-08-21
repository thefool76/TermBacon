import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { contracts as demoContracts, currency, demoToday, getDaysRemaining, getOperationalRisk, type Contract } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export function DecisionInbox({ embedded = false, items = demoContracts, referenceDate = demoToday }: { embedded?: boolean; items?: Contract[]; referenceDate?: string }) {
  const metrics = {
    attention: items.filter((contract) => getOperationalRisk(contract, referenceDate) !== "clear").length,
    exposure: items.filter((contract) => contract.decision === "pending" || contract.decision === "renegotiate").reduce((total, contract) => total + contract.annualExposure, 0),
    decisionsNeeded: items.filter((contract) => contract.decision === "pending").length,
    urgent: items.filter((contract) => getDaysRemaining(contract.cancelByDate, referenceDate) < 14 && contract.decision === "pending").length,
  };

  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-white", embedded && "shadow-[0_18px_50px_rgba(18,33,29,.08)]")}>
      <div className="flex items-center justify-between gap-3 border-b border-[#e3e7e3] px-4 py-3.5 sm:px-5">
        <div><p className="text-sm font-semibold">Decision Inbox</p><p className="mt-0.5 text-xs text-[#77817c]">Sorted by last day to act</p></div>
        <Badge variant={metrics.attention > 0 ? "critical" : "success"}>{metrics.attention} Need Attention</Badge>
      </div>
      <div className="grid grid-cols-3 divide-x divide-[#e4e8e4] border-b border-[#e4e8e4] bg-[#fafbf8]">
        <Metric label="90-Day Exposure" value={currency.format(metrics.exposure)} />
        <Metric label="Decisions Needed" value={String(metrics.decisionsNeeded)} />
        <Metric label="Under 14 Days" value={String(metrics.urgent)} critical={metrics.urgent > 0} />
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center sm:p-10"><p className="font-semibold">No confirmed contracts yet.</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6d7872]">Upload a vendor agreement, review the extracted terms, and confirm them before it appears here.</p>{!embedded ? <Button asChild className="mt-4"><Link href="/app/upload">Add Contract</Link></Button> : null}</div>
      ) : (
        <>
          <div className="hidden md:block"><Table><TableHeader><TableRow className="hover:bg-transparent"><TableHead>Vendor</TableHead><TableHead>Act By</TableHead><TableHead>Exposure</TableHead><TableHead>Owner</TableHead><TableHead className="text-right">Decision</TableHead></TableRow></TableHeader><TableBody>{items.map((contract) => { const days = getDaysRemaining(contract.cancelByDate, referenceDate); return <TableRow key={contract.id}><TableCell><Link className="inline-flex items-center gap-1 font-semibold hover:text-[#174c40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]" href={`/app/contracts/${contract.id}`}>{contract.vendor}<ArrowUpRight aria-hidden="true" size={13} /></Link></TableCell><TableCell className={cn("font-semibold tabular-nums", days <= 14 ? "text-[#a43727]" : days <= 30 ? "text-[#8b5909]" : "text-[#52615a]")}>{days} days</TableCell><TableCell className="font-medium tabular-nums">{currency.format(contract.annualExposure)}</TableCell><TableCell className="text-[#65716c]">{contract.owner}</TableCell><TableCell className="text-right"><DecisionBadge decision={contract.decision} /></TableCell></TableRow>; })}</TableBody></Table></div>
          <div className="divide-y divide-[#e5e9e5] md:hidden">{items.slice(0, embedded ? 3 : undefined).map((contract) => { const days = getDaysRemaining(contract.cancelByDate, referenceDate); return <Link key={contract.id} href={`/app/contracts/${contract.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-[#f7f8f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#173f35]"><div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate text-sm font-semibold">{contract.vendor}</p><DecisionBadge decision={contract.decision} /></div><p className="mt-1 text-xs text-[#77817c]">{currency.format(contract.annualExposure)} · {contract.owner}</p></div><div className="flex shrink-0 items-center gap-2"><span className={cn("text-sm font-semibold tabular-nums", days <= 14 ? "text-[#a43727]" : days <= 30 ? "text-[#8b5909]" : "text-[#52615a]")}>{days}d</span><ChevronRight aria-hidden="true" size={16} className="text-[#8b9490]" /></div></Link>; })}</div>
        </>
      )}
    </div>
  );
}

function Metric({ label, value, critical = false }: { label: string; value: string; critical?: boolean }) { return <div className="min-w-0 p-3 sm:p-4"><p className="truncate text-[10px] font-semibold uppercase tracking-[0.06em] text-[#808a85] sm:text-[11px]">{label}</p><p className={cn("mt-1 text-lg font-semibold tabular-nums sm:text-xl", critical && "text-[#a43727]")}>{value}</p></div>; }
function DecisionBadge({ decision }: { decision: string }) { if (decision === "renegotiate") return <Badge variant="decision">Renegotiate</Badge>; if (decision === "renew") return <Badge variant="success">Renew</Badge>; if (decision === "cancel") return <Badge variant="decision">Cancel</Badge>; return <Badge variant="neutral">Needed</Badge>; }
