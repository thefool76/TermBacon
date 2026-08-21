import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { EscapeWindow } from "@/components/product/escape-window";
import { SourceClause } from "@/components/product/source-clause";
import { currency, formatDate, getContract, getOperationalRisk } from "@/lib/demo-data";

export default async function ContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = getContract(id);
  if (!contract) notFound();
  const risk = getOperationalRisk(contract);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#557169]">Contract</p><Badge variant={risk === "critical" ? "critical" : risk === "attention" ? "attention" : "success"}>{risk === "critical" ? "High Attention" : risk === "attention" ? "Watch" : "On Track"}</Badge></div><h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">{contract.vendor}</h1><p className="mt-2 text-sm text-[#68736d]">{contract.agreement}</p></div><div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:text-right"><Meta label="Annual Exposure" value={currency.format(contract.annualExposure)} /><Meta label="Owner" value={contract.owner} /><Meta label="Renews" value={formatDate(contract.renewalDate)} /><Meta label="Notice" value={`${contract.noticeDays} days`} /></div></div>
      <EscapeWindow contract={contract} />
      <div className="mt-6"><SourceClause contract={contract} /></div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7a8580]">{label}</p><p className="mt-0.5 font-semibold tabular-nums">{value}</p></div>; }
