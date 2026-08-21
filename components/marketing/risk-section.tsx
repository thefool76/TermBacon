import { AlertTriangle, CircleUserRound, Clock3, FileQuestion } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { contracts, currency, getDaysRemaining } from "@/lib/demo-data";

const contract = contracts[0];
const signals = [
  { icon: Clock3, title: `Cancel-By In ${getDaysRemaining(contract.cancelByDate)} Days`, text: "The confirmed notice window is closing.", badge: "Time", variant: "critical" as const, iconClass: "bg-[#fff3ef] text-[#a43727]" },
  { icon: AlertTriangle, title: `${currency.format(contract.annualExposure)} Renewal Exposure`, text: "Annual commitment attached to this decision.", badge: "Exposure", variant: "attention" as const, iconClass: "bg-[#fff8e9] text-[#8b5909]" },
  { icon: CircleUserRound, title: "Owner Assigned", text: `${contract.owner} is accountable for the decision.`, badge: "Ownership", variant: "success" as const, iconClass: "bg-[#eef8f2] text-positive" },
  { icon: FileQuestion, title: "Decision Still Open", text: "No Renew, Renegotiate or Cancel outcome recorded.", badge: "Decision", variant: "attention" as const, iconClass: "bg-[#fff8e9] text-[#8b5909]" },
];

export function RiskSection() {
  return <section className="border-b border-[#dfe4df] py-20 sm:py-24"><div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.75fr_1.25fr] lg:px-8"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3e7163]">Renewal risk</p><h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Explainable signals, not a legal-risk score.</h2><p className="mt-4 text-pretty leading-7 text-[#65716b]">TermBeacon flags operational renewal risk using confirmed dates, exposure, ownership and decision state. Each signal says exactly why it exists.</p><p className="mt-5 rounded-lg border border-[#e0e5e1] bg-[#f6f8f5] p-4 text-sm leading-6 text-[#5f6b65]"><strong className="text-[#22332c]">Not legal advice.</strong> TermBeacon helps teams manage renewal operations and deadlines; it does not interpret legal rights or replace counsel.</p></div><div className="grid gap-3 sm:grid-cols-2">{signals.map((signal) => <div key={signal.title} className="rounded-xl border border-line bg-white p-5"><div className="flex items-start justify-between gap-4"><span className={`grid size-9 place-items-center rounded-lg ${signal.iconClass}`}><signal.icon aria-hidden="true" size={18} /></span><Badge variant={signal.variant}>{signal.badge}</Badge></div><h3 className="mt-5 font-semibold">{signal.title}</h3><p className="mt-2 text-sm leading-6 text-[#69746e]">{signal.text}</p></div>)}</div></div></section>;
}
