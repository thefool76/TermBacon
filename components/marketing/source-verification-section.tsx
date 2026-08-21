import { SourceClause } from "@/components/product/source-clause";
import { contracts } from "@/lib/demo-data";

export function SourceVerificationSection() {
  return <section id="source-clause" className="border-b border-[#dfe4df] bg-white py-20 sm:py-24"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mx-auto mb-10 max-w-2xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3e7163]">Source verification</p><h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">See the clause behind every suggested term.</h2><p className="mt-4 text-pretty leading-7 text-[#65716b]">TermBeacon is designed around verification: the extracted term and its source stay visible together, so the user can confirm what the operating deadline is based on.</p></div><SourceClause contract={contracts[0]} marketing /></div></section>;
}
