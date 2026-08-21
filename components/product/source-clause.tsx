import { Check, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Contract, formatDate } from "@/lib/demo-data";

export function SourceClause({ contract, marketing = false }: { contract: Contract; marketing?: boolean }) {
  return (
    <div id={marketing ? undefined : "source-clause"} className="grid overflow-hidden rounded-xl border border-line bg-white lg:grid-cols-[1.08fr_.92fr]">
      <div className="border-b border-line bg-[#fbfbf8] p-5 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 border-b border-[#e5e8e4] pb-4">
          <p className="flex items-center gap-2 text-sm font-semibold"><FileText aria-hidden="true" size={16} /> Source PDF</p>
          <p className="text-xs text-[#77817c]">Page {contract.source.page} · § {contract.source.section}</p>
        </div>
        <div className="mx-auto mt-5 max-w-xl rounded-lg border border-[#e3e5e1] bg-white p-5 shadow-[0_5px_20px_rgba(18,33,29,.04)] sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a938e]">§ {contract.source.section} · Term & Renewal</p>
          <p className="mt-4 text-sm leading-7 text-[#3f4c47]">
            The initial subscription term begins on the Order Effective Date. <mark className="rounded-sm bg-[#edff91] px-0.5 text-[#24300f]">{contract.source.clause}</mark>
          </p>
          <p className="mt-4 text-sm leading-7 text-[#727c77]">Any notice must be delivered according to the notice provisions of this Agreement.</p>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Extracted Terms</p>
            <p className="mt-1 text-xs text-[#707b75]">AI suggests. A person confirms.</p>
          </div>
          <Badge variant="success"><Check aria-hidden="true" className="mr-1 size-3" /> Confirmed</Badge>
        </div>
        <dl className="mt-6 divide-y divide-[#e5e9e5]">
          <Term label="Renewal Date" value={formatDate(contract.renewalDate)} />
          <Term label="Notice Period" value={`${contract.noticeDays} days`} />
          <Term label="Auto-Renewal" value={contract.autoRenew ? "Yes" : "No"} />
          <Term label="Confirmed By" value={contract.owner} />
        </dl>
        <div className="mt-6 rounded-lg bg-[#f0f5f1] p-4 text-sm leading-6 text-[#42534c]">
          <strong className="block text-[#173f35]">Source-backed, not guessed.</strong>
          The operating deadline is calculated from the confirmed renewal date and notice requirement above.
        </div>
      </div>
    </div>
  );
}

function Term({ label, value }: { label: string; value: string }) {
  return <div className="grid grid-cols-[1fr_auto] gap-4 py-3"><dt className="text-sm text-[#6c7771]">{label}</dt><dd className="text-right text-sm font-semibold tabular-nums">{value}</dd></div>;
}
