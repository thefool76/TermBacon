import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return <section className="bg-canvas py-24 sm:py-32"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="border-t-2 border-ink pt-10 sm:pt-14"><h2 className="max-w-5xl text-balance text-4xl font-semibold leading-[.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">Decide before the contract decides for you.</h2><div className="mt-8 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end"><p className="max-w-2xl text-pretty leading-7 text-muted-ink">Upload a vendor agreement and surface the last day your team can still act—before the renewal date becomes a consequence instead of a choice.</p><div className="flex flex-col gap-3 sm:flex-row"><Button asChild variant="acid" size="lg"><Link href="/app/upload">Find My Cancel-By Dates <ArrowRight aria-hidden="true" size={17} /></Link></Button><Button asChild variant="outline" size="lg"><a className="group" href="#escape-window">See the Escape Window <ArrowRight aria-hidden="true" className="transition-transform duration-150 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1 motion-reduce:transition-none" size={17} /></a></Button></div></div></div></div></section>;
}
