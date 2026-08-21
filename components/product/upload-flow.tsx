"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, FileUp, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/demo-data";

type Draft = {
  id: string;
  fileName: string;
  vendor: string;
  agreement: string;
  renewalDate: string;
  noticeDays: number;
  annualExposure: number;
  owner: string;
  autoRenew: boolean;
  confidence: number;
  source: { page: number; section: string; clause: string };
};

export function UploadFlow() {
  const [step, setStep] = useState<"upload" | "processing" | "review" | "confirmed">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [cancelByDate, setCancelByDate] = useState("");
  const [error, setError] = useState("");
  const progress = step === "upload" ? 20 : step === "processing" ? 55 : step === "review" ? 80 : 100;

  async function processContract() {
    if (!file) { setError("Choose a PDF agreement first."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("PDFs must be 10 MB or smaller."); return; }
    setError("");
    setStep("processing");
    const form = new FormData();
    form.set("file", file);
    try {
      const response = await fetch("/api/contracts/upload", { method: "POST", body: form });
      const payload = await response.json() as { contract?: Draft; error?: string };
      if (!response.ok || !payload.contract) throw new Error(payload.error || "Could not process this agreement.");
      setDraft(payload.contract);
      setStep("review");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not process this agreement.");
      setStep("upload");
    }
  }

  async function confirmTerms() {
    if (!draft) return;
    setError("");
    try {
      const response = await fetch(`/api/contracts/${draft.id}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor: draft.vendor,
          agreement: draft.agreement,
          renewalDate: draft.renewalDate,
          noticeDays: Number(draft.noticeDays),
          annualExposure: Number(draft.annualExposure),
          owner: draft.owner,
          autoRenew: draft.autoRenew,
          sourcePage: Number(draft.source.page),
          sourceSection: draft.source.section,
          sourceClause: draft.source.clause,
          extractionConfidence: draft.confidence,
        }),
      });
      const payload = await response.json() as { id?: string; cancelByDate?: string; error?: string };
      if (!response.ok || !payload.cancelByDate) throw new Error(payload.error || "Could not save confirmed terms.");
      setCancelByDate(payload.cancelByDate);
      setStep("confirmed");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save confirmed terms.");
    }
  }

  const update = <K extends keyof Draft,>(key: K, value: Draft[K]) => setDraft((current) => current ? { ...current, [key]: value } : current);
  const updateSource = <K extends keyof Draft["source"],>(key: K, value: Draft["source"][K]) => setDraft((current) => current ? { ...current, source: { ...current.source, [key]: value } } : current);

  return <div className="mx-auto max-w-4xl"><div className="mb-6 flex items-center justify-between gap-4"><div><p className="text-sm font-semibold">Upload → Review → Confirm</p><p className="mt-1 text-sm text-[#6a756f]">AI suggestions remain drafts until you confirm the source.</p></div><Badge variant={step === "confirmed" ? "success" : "neutral"}>{step === "confirmed" ? "Ready" : "Live Extraction"}</Badge></div><Progress value={progress} aria-label={`Upload flow ${progress}% complete`} />
    {error ? <div role="alert" className="mt-4 rounded-lg border border-[#e6c6c0] bg-[#fff8f6] p-3 text-sm text-[#a43727]">{error}</div> : null}
    <Tabs value={step === "upload" || step === "processing" ? "upload" : step === "review" ? "review" : "confirm"} className="mt-6"><TabsList aria-label="Upload progress"><TabsTrigger value="upload" disabled>1. Upload</TabsTrigger><TabsTrigger value="review" disabled>2. Review</TabsTrigger><TabsTrigger value="confirm" disabled>3. Confirm</TabsTrigger></TabsList>
      <TabsContent value="upload"><Card className="mt-5 p-5 sm:p-7">{step === "processing" ? <Processing /> : <div className="grid place-items-center rounded-xl border border-dashed border-[#bdc7c0] bg-[#fafbf8] px-4 py-10 text-center"><span className="grid size-11 place-items-center rounded-lg bg-[#eef3ef] text-[#315f52]"><FileUp aria-hidden="true" size={21} /></span><h2 className="mt-4 text-lg font-semibold">Add a vendor agreement</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#6b7670]">Choose a text-based PDF up to 10 MB. The original file is stored privately in encrypted Cloudflare D1 storage while renewal-relevant terms are extracted for your review.</p><div className="mt-5 w-full max-w-md text-left"><Label htmlFor="contract-file">Contract PDF</Label><Input id="contract-file" type="file" accept="application/pdf,.pdf" className="mt-2 h-auto py-2" onChange={(event) => setFile(event.target.files?.[0] || null)} /><p className="mt-2 text-xs text-[#7b8580]">{file ? `Selected: ${file.name}` : "No file selected"}</p></div><Button className="mt-5" disabled={!file} onClick={() => void processContract()}>Review Suggested Terms <ArrowRight aria-hidden="true" size={16} /></Button></div>}</Card></TabsContent>
      <TabsContent value="review">{draft ? <div className="mt-5 grid gap-5 lg:grid-cols-2"><Card className="p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">Source Clause</p><Badge variant={draft.confidence >= .8 ? "success" : "attention"}>{Math.round(draft.confidence * 100)}% extraction confidence</Badge></div><div className="mt-4 grid grid-cols-2 gap-3"><Field label="Page"><Input type="number" min="0" value={draft.source.page} onChange={(e) => updateSource("page", Number(e.target.value))} /></Field><Field label="Section"><Input value={draft.source.section} onChange={(e) => updateSource("section", e.target.value)} /></Field></div><Label htmlFor="source-clause" className="mt-4 block">Supporting clause</Label><textarea id="source-clause" value={draft.source.clause} onChange={(e) => updateSource("clause", e.target.value)} className="mt-2 min-h-48 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]" /></Card><Card className="p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold">Suggested Terms</p><Badge variant="attention">Needs Confirmation</Badge></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Vendor"><Input value={draft.vendor} onChange={(e) => update("vendor", e.target.value)} /></Field><Field label="Agreement"><Input value={draft.agreement} onChange={(e) => update("agreement", e.target.value)} /></Field><Field label="Renewal date"><Input type="date" value={draft.renewalDate} onChange={(e) => update("renewalDate", e.target.value)} /></Field><Field label="Notice period (days)"><Input type="number" min="1" value={draft.noticeDays || ""} onChange={(e) => update("noticeDays", Number(e.target.value))} /></Field><Field label="Annual exposure (USD)"><Input type="number" min="0" value={draft.annualExposure} onChange={(e) => update("annualExposure", Number(e.target.value))} /></Field><Field label="Owner"><Input value={draft.owner} onChange={(e) => update("owner", e.target.value)} /></Field><div><Label htmlFor="auto-renew">Auto-renewal</Label><select id="auto-renew" value={draft.autoRenew ? "yes" : "no"} onChange={(e) => update("autoRenew", e.target.value === "yes")} className="mt-2 h-10 w-full rounded-lg border border-line bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]"><option value="yes">Yes</option><option value="no">No</option></select></div></div><Button className="mt-5 w-full" onClick={() => void confirmTerms()}>Confirm Terms & Calculate Cancel-By Date <Check aria-hidden="true" size={16} /></Button></Card></div> : null}</TabsContent>
      <TabsContent value="confirm">{draft ? <Card className="mt-5 p-6 text-center sm:p-8"><span className="mx-auto grid size-12 place-items-center rounded-full bg-[#eaf6ef] text-positive"><ShieldCheck aria-hidden="true" size={23} /></span><h2 className="mt-4 text-xl font-semibold">Terms confirmed</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#68736d]">The confirmed renewal date and notice period produce a cancel-by date of <strong>{cancelByDate ? formatDate(cancelByDate) : "—"}</strong>. This contract is now in your Decision Inbox.</p><Button asChild className="mt-5"><Link href={`/app/contracts/${draft.id}`}>Open Escape Window <ArrowRight aria-hidden="true" size={16} /></Link></Button></Card> : null}</TabsContent>
    </Tabs></div>;
}

function Processing() { return <div aria-live="polite" className="py-4"><p className="text-sm font-semibold">Reading the agreement and finding renewal terms…</p><p className="mt-1 text-sm text-[#707b75]">The PDF is converted for extraction, then stored privately in D1 as small chunks so no paid object-storage service is required.</p><div className="mt-6 space-y-3"><Skeleton className="h-10 w-full"/><Skeleton className="h-24 w-full"/><Skeleton className="h-10 w-3/4"/></div></div>; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <div><Label>{label}</Label><div className="mt-2">{children}</div></div>; }
