import { Check, FileCheck2, ShieldCheck } from "lucide-react";

const proofs = [
  { icon: FileCheck2, label: "Source-Backed Terms" },
  { icon: Check, label: "Human-Confirmed Extraction" },
  { icon: ShieldCheck, label: "Explainable Deadlines" },
];

export function TrustStrip() {
  return <section aria-label="Product trust" className="border-b border-[#dfe4df] bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"><p className="text-sm font-semibold text-[#26352f]">Built for vendor renewals—not generic contract management.</p><div className="flex flex-wrap gap-x-6 gap-y-3">{proofs.map((proof) => <span key={proof.label} className="inline-flex items-center gap-2 text-xs font-semibold text-[#68746e]"><proof.icon aria-hidden="true" size={15} className="text-[#315f52]" />{proof.label}</span>)}</div></div></section>;
}
