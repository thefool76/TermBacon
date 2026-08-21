"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, FileText, Inbox, LogOut, Plus, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Decision Inbox", href: "/app", icon: Inbox },
  { label: "Contracts", href: "/app/contracts", icon: FileText },
  { label: "Upload", href: "/app/upload", icon: Plus },
];

type Identity = { name: string; email: string; workspaceName: string };

export function AppShell({ children, identity, authConfigured }: { children: ReactNode; identity: Identity | null; authConfigured: boolean }) {
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
          <div className="mt-2">{identity ? <AccountMenu identity={identity} /> : <TemporaryWorkspace authConfigured={authConfigured} />}</div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="sticky top-0 z-30 flex items-center gap-2 overflow-x-auto border-b border-[#dce2dd] bg-canvas px-4 py-3 lg:hidden">
          <Link href="/" aria-label="Back to TermBeacon home" className="mr-1 grid size-9 shrink-0 place-items-center rounded-lg bg-forest text-xs font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35] focus-visible:ring-offset-2">T</Link>
          {nav.map((item) => <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={cn("shrink-0 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]", isActive(item.href) && "border-[#789489] bg-[#edf4ef] text-[#173f35]")}>{item.label}</Link>)}
          <div className="ml-auto shrink-0">{identity ? <AccountMenu identity={identity} compact /> : null}</div>
        </div>
        <main id="main-content" className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

function AccountMenu({ identity, compact = false }: { identity: Identity; compact?: boolean }) {
  const initials = identity.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";

  async function signOut() {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
    } finally {
      window.location.assign("/sign-in");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {compact ? (
          <button aria-label={`Open account menu for ${identity.name}`} className="grid size-9 place-items-center rounded-full border border-[#ccd5cf] bg-white text-xs font-bold text-[#23493f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]">{initials}</button>
        ) : (
          <button className="flex w-full items-center gap-3 rounded-lg border border-[#dce2dd] bg-white p-3 text-left hover:border-[#bdc8c1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e9f1ec] text-xs font-bold text-[#23493f]">{initials}</span>
            <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{identity.workspaceName}</span><span className="mt-0.5 block truncate text-[11px] text-[#7a8580]">{identity.email}</span></span>
            <ChevronDown aria-hidden="true" size={14} className="text-[#7a8580]" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={compact ? "end" : "start"} side={compact ? "bottom" : "top"} className="w-56">
        <div className="px-2.5 py-2"><p className="truncate text-sm font-semibold">{identity.name}</p><p className="mt-0.5 truncate text-xs text-[#77817c]">{identity.email}</p></div>
        <DropdownMenuItem onSelect={(event) => { event.preventDefault(); void signOut(); }}><LogOut aria-hidden="true" size={15} /> Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TemporaryWorkspace({ authConfigured }: { authConfigured: boolean }) {
  return (
    <Link href="/sign-in" className="block rounded-lg border border-[#dce2dd] bg-white p-3 hover:border-[#bdc8c1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]">
      <p className="text-xs font-semibold">Temporary workspace</p>
      <p className="mt-1 text-[11px] leading-4 text-[#7a8580]">{authConfigured ? "Sign in to keep access." : "Google sign-in setup pending."}</p>
    </Link>
  );
}
