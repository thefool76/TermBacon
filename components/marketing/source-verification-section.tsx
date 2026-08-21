import { SourceClause } from "@/components/product/source-clause";
import { contracts } from "@/lib/demo-data";

export function SourceVerificationSection() {
  return <section id="source-clause" className="border-b border-line bg-white py-24 sm:py-32"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-end"><h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">AI suggests the term. Your team sees the clause.</h2><p className="max-w-2xl text-pretty leading-7 text-muted-ink lg:justify-self-end">The renewal date, notice period and auto-renewal language stay beside the agreement text that supports them, so confirmation never depends on an opaque model answer.</p></div><div className="mt-12"><SourceClause contract={contracts[0]} marketing /></div></div></section>;
}
