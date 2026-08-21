import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContractRowMenu } from "@/components/product/contract-row-menu";
import { contracts, currency, formatDate, getDaysRemaining } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const filters = [
  { label: "Needs Decision", value: "open" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Decided", value: "decided" },
] as const;

export default async function ContractsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const params = await searchParams;
  const status = params.status || "open";
  const q = (params.q || "").toLowerCase();
  const filtered = contracts.filter((contract) => {
    const matchesQuery = !q || contract.vendor.toLowerCase().includes(q) || contract.owner.toLowerCase().includes(q);
    if (!matchesQuery) return false;
    if (status === "decided") return contract.decision !== "pending";
    if (status === "upcoming") return true;
    return contract.decision === "pending";
  });

  return (
    <div>
      <div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#557169]">Contracts</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">Vendor agreements</h1><p className="mt-2 text-sm text-[#68736d]">Search by vendor or owner, then open the contract to see its Escape Window and source clause.</p></div>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Contract filters" className="flex flex-wrap gap-1 rounded-lg bg-[#e9ede9] p-1">
          {filters.map((filter) => <Link key={filter.value} href={`/app/contracts?status=${filter.value}${params.q ? `&q=${encodeURIComponent(params.q)}` : ""}`} className={cn("rounded-md px-3 py-2 text-sm font-medium text-[#66716d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]", status === filter.value && "bg-white text-ink shadow-sm")}>{filter.label}</Link>)}
        </nav>
        <form className="relative w-full lg:max-w-xs" action="/app/contracts" method="get">
          <input type="hidden" name="status" value={status} />
          <label className="sr-only" htmlFor="contract-search">Search contracts</label>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#87918c]" size={16} />
          <Input id="contract-search" name="q" defaultValue={params.q} autoComplete="off" placeholder="Search vendor or owner…" className="pl-9" />
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <div className="hidden md:block"><Table><TableHeader><TableRow className="hover:bg-transparent"><TableHead>Vendor</TableHead><TableHead>Renewal</TableHead><TableHead>Cancel By</TableHead><TableHead>Exposure</TableHead><TableHead>Owner</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader><TableBody>{filtered.map((contract) => { const days = getDaysRemaining(contract.cancelByDate); return <TableRow key={contract.id}><TableCell><Link className="font-semibold hover:text-[#174c40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]" href={`/app/contracts/${contract.id}`}>{contract.vendor}</Link><p className="mt-0.5 max-w-56 truncate text-xs text-[#7b8580]">{contract.agreement}</p></TableCell><TableCell className="tabular-nums">{formatDate(contract.renewalDate)}</TableCell><TableCell><span className={cn("font-semibold tabular-nums", days <= 14 ? "text-[#a43727]" : days <= 30 ? "text-[#8b5909]" : "")}>{formatDate(contract.cancelByDate)}</span><p className="mt-0.5 text-xs text-[#7a8580]">{days} days left</p></TableCell><TableCell className="font-medium tabular-nums">{currency.format(contract.annualExposure)}</TableCell><TableCell>{contract.owner}</TableCell><TableCell><StatusBadge decision={contract.decision} /></TableCell><TableCell className="text-right"><ContractRowMenu id={contract.id} /></TableCell></TableRow>; })}</TableBody></Table></div>
        <div className="divide-y divide-[#e5e9e5] md:hidden">{filtered.map((contract) => <div key={contract.id} className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><Link className="font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]" href={`/app/contracts/${contract.id}`}>{contract.vendor}</Link><p className="mt-1 truncate text-xs text-[#7a8580]">{contract.owner}</p></div><ContractRowMenu id={contract.id} /></div><div className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><p className="text-[#7a8580]">Cancel By</p><p className="mt-1 font-semibold tabular-nums">{formatDate(contract.cancelByDate)}</p></div><div><p className="text-[#7a8580]">Exposure</p><p className="mt-1 font-semibold tabular-nums">{currency.format(contract.annualExposure)}</p></div></div></div>)}</div>
        {filtered.length === 0 ? <div className="p-10 text-center"><p className="font-semibold">No contracts match this view.</p><p className="mt-2 text-sm text-[#6d7872]">Try another filter or clear the search query.</p><Button asChild variant="outline" className="mt-4"><Link href="/app/contracts?status=upcoming">Show All Contracts</Link></Button></div> : null}
      </div>
    </div>
  );
}

function StatusBadge({ decision }: { decision: string }) {
  if (decision === "renew") return <Badge variant="success">Renew</Badge>;
  if (decision === "renegotiate") return <Badge variant="decision">Renegotiate</Badge>;
  if (decision === "cancel") return <Badge variant="decision">Cancel</Badge>;
  return <Badge>Needed</Badge>;
}
