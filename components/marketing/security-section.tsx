import { CheckCircle2, FileLock2, ScanText } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const points = [
  { icon: ScanText, title: "Source-Backed", text: "Every renewal term shown in TermBeacon points back to the page and clause used to support it." },
  { icon: CheckCircle2, title: "Human-Confirmed", text: "Suggested terms remain visibly unconfirmed until a person reviews them against the source." },
  { icon: FileLock2, title: "Least-Data By Design", text: "The product is scoped around renewal-relevant terms rather than open-ended chat over entire agreements." },
];

export function SecuritySection() {
  return (
    <section id="security" className="border-b border-[#24463d] bg-ink py-20 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a9cabc]">Security & Privacy</p>
            <h2 className="mt-4 max-w-xl text-balance text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Trust starts with showing your work.</h2>
            <p className="mt-5 max-w-xl text-pretty leading-7 text-[#c7d5cf]">TermBeacon&apos;s launch experience is designed around traceability and human confirmation. We do not claim certifications or controls that are not yet implemented and documented.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">{points.map((point) => <article key={point.title} className="rounded-xl border border-white/12 bg-white/[.045] p-5"><point.icon aria-hidden="true" size={20} className="text-[#a9cabc]" /><h3 className="mt-5 font-semibold">{point.title}</h3><p className="mt-2 text-sm leading-6 text-[#bdcec7]">{point.text}</p></article>)}</div>
        </div>
        <div className="mt-12 max-w-3xl border-t border-white/12 pt-3">
          <Accordion type="single" collapsible>
            <AccordionItem value="legal" className="border-white/12"><AccordionTrigger className="text-white hover:text-[#d9e6e0]">Does TermBeacon provide legal advice?</AccordionTrigger><AccordionContent className="text-[#bdcec7]">No. It organizes renewal terms and operational deadlines so your team can make a timely business decision. Legal interpretation stays with your team and counsel.</AccordionContent></AccordionItem>
            <AccordionItem value="ai" className="border-white/12"><AccordionTrigger className="text-white hover:text-[#d9e6e0]">Does AI make the renewal decision?</AccordionTrigger><AccordionContent className="text-[#bdcec7]">No. AI can suggest renewal-relevant terms. A person confirms those terms, and the team chooses Renew, Renegotiate or Cancel.</AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
