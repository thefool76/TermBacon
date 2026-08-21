"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Inbox, Plus, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Decision Inbox", href: "/app", icon: Inbox },
  { label: "Contracts", href: "/app/contracts", icon: FileText },
  { label: "Upload", href: "/app/upload", icon: Plus },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => href === "/app" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#f5f6f2] text-ink lg:grid lg:grid-cols-[220px_1fr]">
      <aside className="hidden border-r border-[#dce2dd] bg-canvas lg:flex lg:min-h-screen lg:flex-col lg:p-4">
        <Link href="/" className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold tracking-[-0.02em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]"><span className="grid size-7 place-items-center rounded-lg bg-forest text-xs font-bold text-white">T</span><span translate="no">TermBeacon</span></Link>
        <nav aria-label="Product navigation" className="mt-7 space-y-1">
          {nav.map((item) => <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={cn("flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#65716c] hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]", isActive(item.href) && "bg-white text-[#173f35] shadow-sm")}><item.icon aria-hidden="true" size={16} />{item.label}</Link>)}
        </nav>
        <div className="mt-auto">
          <Separator className="mb-3" />
          <div className="flex min-h-10 items-center gap-3 px-3 text-sm font-medium text-[#8a938f]"><Settings aria-hidden="true" size={16} />Settings <span className="ml-auto text-[10px] uppercase tracking-[0.08em]">Soon</span></div>
          <div className="mt-3 rounded-lg border border-[#dce2dd] bg-white p-3">
            <p className="text-xs font-semibold">Demo Workspace</p><p className="mt-1 text-[11px] leading-4 text-[#7a8580]">Static launch shell · no documents uploaded</p>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="sticky top-0 z-30 flex items-center gap-2 overflow-x-auto border-b border-[#dce2dd] bg-canvas px-4 py-3 lg:hidden">
          <Link href="/" aria-label="Back to TermBeacon home" className="mr-2 grid size-9 shrink-0 place-items-center rounded-lg bg-forest text-xs font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35] focus-visible:ring-offset-2">T</Link>
          {nav.map((item) => <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={cn("shrink-0 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]", isActive(item.href) && "border-[#789489] bg-[#edf4ef] text-[#173f35]")}>{item.label}</Link>)}
        </div>
        <main id="main-content" className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
