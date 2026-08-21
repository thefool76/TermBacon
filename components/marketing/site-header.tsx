"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-canvas">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 rounded-md font-semibold tracking-[-0.025em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35] focus-visible:ring-offset-2"><span className="grid size-7 place-items-center rounded-lg bg-forest text-xs font-bold text-white">T</span><span translate="no">TermBeacon</span></Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
          {siteConfig.nav.map((item) => <Link key={item.href} href={item.href} className="rounded-md text-sm font-medium text-[#596660] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]">{item.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild><Link href="/sign-in">Sign in</Link></Button>
          <Button asChild><Link href="/sign-in?next=/app/upload">Start Free</Link></Button>
        </div>
        <Sheet>
          <SheetTrigger asChild><Button className="md:hidden" size="icon" variant="outline" aria-label="Open navigation"><Menu aria-hidden="true" size={18} /></Button></SheetTrigger>
          <SheetContent>
            <SheetTitle><span translate="no">TermBeacon</span></SheetTitle><SheetDescription className="sr-only">Primary navigation and account actions.</SheetDescription>
            <nav aria-label="Mobile navigation" className="mt-10 flex flex-col gap-1">
              {siteConfig.nav.map((item) => <SheetClose asChild key={item.href}><Link href={item.href} className="rounded-lg px-3 py-3 text-base font-semibold hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]">{item.label}</Link></SheetClose>)}
            </nav>
            <div className="mt-7 grid gap-2"><SheetClose asChild><Button variant="outline" asChild><Link href="/sign-in">Sign in</Link></Button></SheetClose><SheetClose asChild><Button asChild><Link href="/sign-in?next=/app/upload">Start Free</Link></Button></SheetClose></div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
