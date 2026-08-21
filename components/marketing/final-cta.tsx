import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return <section className="bg-[#eef2ed] py-20 sm:py-24"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><h2 className="text-balance text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">Decide before the contract decides for you.</h2><p className="mx-auto mt-5 max-w-2xl text-pretty leading-7 text-muted-ink">Upload your vendor agreements and see the last day your team can still act.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild variant="acid" size="lg"><Link href="/app/upload">Find My Cancel-By Dates <ArrowRight aria-hidden="true" size={17} /></Link></Button><Button asChild variant="outline" size="lg"><a className="group" href="#escape-window">See the Escape Window <ArrowRight aria-hidden="true" className="transition-transform duration-150 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1 motion-reduce:transition-none" size={17} /></a></Button></div></div></section>;
}
