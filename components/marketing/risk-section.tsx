import { AlertTriangle, CircleUserRound, Clock3, FileQuestion } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { contracts, currency, getDaysRemaining } from "@/lib/demo-data";

const contract = contracts[0];
const signals = [
  { icon: Clock3, title: `${getDaysRemaining(contract.cancelByDate)} days to act`, text: "The confirmed notice window is closing.", badge: "Time", variant: "critical" as const, span: "lg:col-span-7" },
  { icon: AlertTriangle, title: `${currency.format(contract.annualExposure)} exposed`, text: "Annual commitment attached to this renewal decision.", badge: "Exposure", variant: "attention" as const, span: "lg:col-span-5" },
  { icon: CircleUserRound, title: `${contract.owner} owns it`, text: "A named owner is accountable for getting to a decision.", badge: "Ownership", variant: "success" as const, span: "lg:col-span-5" },
  { icon: FileQuestion, title: "Decision still open", text: "No Renew, Renegotiate or Cancel outcome has been recorded yet.", badge: "Decision", variant: "attention" as const, span: "lg:col-span-7" },
];

export function RiskSection() {
  return <section className="border-b border-line bg-muted-surface py-24 sm:py-32"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-end"><div><h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">Operational risk should explain itself.</h2></div><div><p className="max-w-2xl text-pretty leading-7 text-muted-ink lg:ml-auto">TermBeacon flags what is creating pressure: time, exposure, ownership and decision state. It does not hide those facts behind an AI legal-risk score.</p><p className="mt-4 text-sm text-muted-ink"><strong className="text-ink">Not legal advice.</strong> TermBeacon manages renewal operations and deadlines.</p></div></div><div className="mt-12 grid grid-flow-dense gap-3 lg:grid-cols-12">{signals.map((signal) => <article key={signal.title} className={`${signal.span} border border-line bg-white p-6 sm:p-7`}><div className="flex items-start justify-between gap-4"><signal.icon aria-hidden="true" size={20} className="text-forest" /><Badge variant={signal.variant}>{signal.badge}</Badge></div><h3 className="mt-8 text-2xl font-semibold tracking-[-0.035em]">{signal.title}</h3><p className="mt-3 max-w-lg text-sm leading-6 text-muted-ink">{signal.text}</p></article>)}</div></div></section>;
}
