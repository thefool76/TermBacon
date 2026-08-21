import { CheckCircle2, FileLock2, ScanText } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const points = [
  { icon: ScanText, title: "Show the source", text: "Renewal terms stay tied to the clause used to support them." },
  { icon: CheckCircle2, title: "Keep a human in control", text: "Suggested terms stay unconfirmed until a person reviews them." },
  { icon: FileLock2, title: "Keep the scope narrow", text: "TermBeacon is built around renewal decisions, not open-ended contract chat." },
];

export function SecuritySection() {
  return (
    <section id="security" className="border-b border-[#29483f] bg-ink py-24 text-white sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div><h2 className="max-w-xl text-balance text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">Trust starts with showing your work.</h2><p className="mt-6 max-w-xl text-pretty leading-7 text-[#c3d2cc]">TermBeacon is designed around traceability and human confirmation. We do not claim certifications or controls that are not implemented and documented.</p></div>
          <div className="divide-y divide-white/12 border-y border-white/12">{points.map((point) => <article key={point.title} className="grid gap-4 py-6 sm:grid-cols-[auto_1fr] sm:items-start"><point.icon aria-hidden="true" size={20} className="mt-1 text-[#b2d0c4]" /><div><h3 className="font-semibold">{point.title}</h3><p className="mt-2 text-sm leading-6 text-[#bdcec7]">{point.text}</p></div></article>)}</div>
        </div>
        <div className="mt-12 max-w-3xl border-t border-white/12 pt-3"><Accordion type="single" collapsible><AccordionItem value="legal" className="border-white/12"><AccordionTrigger className="text-white hover:text-[#d9e6e0]">Does TermBeacon provide legal advice?</AccordionTrigger><AccordionContent className="text-[#bdcec7]">No. It organizes renewal terms and operational deadlines so your team can make a timely business decision. Legal interpretation stays with your team and counsel.</AccordionContent></AccordionItem><AccordionItem value="ai" className="border-white/12"><AccordionTrigger className="text-white hover:text-[#d9e6e0]">Does AI make the renewal decision?</AccordionTrigger><AccordionContent className="text-[#bdcec7]">No. AI can suggest renewal-relevant terms. A person confirms those terms, and the team chooses Renew, Renegotiate or Cancel.</AccordionContent></AccordionItem></Accordion></div>
      </div>
    </section>
  );
}
