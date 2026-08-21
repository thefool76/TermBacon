"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F9]/95 px-3 py-3 backdrop-blur-md sm:px-5">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between rounded-2xl border border-black/10 bg-white/90 px-4 shadow-[0_8px_32px_rgba(17,24,39,.06)] sm:px-5">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
        >
          <span className="relative grid size-8 place-items-center overflow-hidden rounded-lg bg-black text-white">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(249,115,22,.8),transparent_50%)]" />
            <span className="relative text-xs font-semibold">T</span>
          </span>
          <span className="font-semibold tracking-[-0.03em] text-black" translate="no">TermBeacon</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md text-sm font-medium text-[#4B5563] transition-colors duration-200 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/sign-in" className="rounded-full px-4 py-2 text-sm font-semibold text-black transition-colors duration-200 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]">
            Sign in
          </Link>
          <Link href="/sign-in?next=/app/upload" className="rounded-full bg-[#F97316] px-5 py-2.5 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black motion-reduce:transition-none">
            Start Free
          </Link>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button type="button" className="grid size-10 place-items-center rounded-lg border border-black/15 bg-white text-black md:hidden" aria-label="Open navigation">
              <Menu aria-hidden="true" size={18} />
            </button>
          </SheetTrigger>
          <SheetContent className="bg-[#FAF9F9] text-[#111827]">
            <SheetTitle><span translate="no">TermBeacon</span></SheetTitle>
            <SheetDescription className="sr-only">Primary navigation and account actions.</SheetDescription>
            <nav aria-label="Mobile navigation" className="mt-10 flex flex-col gap-1">
              {siteConfig.nav.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link href={item.href} className="rounded-xl px-3 py-3 text-base font-semibold hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]">
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-8 grid gap-3">
              <SheetClose asChild><Link href="/sign-in" className="rounded-full border border-black/15 px-5 py-3 text-center text-sm font-semibold">Sign in</Link></SheetClose>
              <SheetClose asChild><Link href="/sign-in?next=/app/upload" className="rounded-full bg-[#F97316] px-5 py-3 text-center text-sm font-semibold text-black">Start Free</Link></SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
