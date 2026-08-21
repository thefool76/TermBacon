const proofs = [
  ["Source-backed", "Every suggested term stays tied to the clause that supports it."],
  ["Human-confirmed", "AI output does not become trusted state until a person reviews it."],
  ["Deterministic", "Cancel-by dates come from confirmed dates and notice periods."],
] as const;

export function TrustStrip() {
  return <section aria-label="Product trust" className="border-b border-line bg-white"><div className="mx-auto grid max-w-7xl gap-0 px-4 sm:px-6 md:grid-cols-3 lg:px-8">{proofs.map(([title, text]) => <div key={title} className="border-b border-line py-6 last:border-b-0 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0"><p className="text-sm font-semibold text-ink">{title}</p><p className="mt-1.5 text-xs leading-5 text-muted-ink">{text}</p></div>)}</div></section>;
}
