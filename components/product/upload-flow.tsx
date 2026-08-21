"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Check, FileUp, RotateCcw, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/demo-data";

type ReviewLevel = "normal" | "careful" | "manual_required";
type Draft = {
  id: string;
  fileName: string;
  vendor: string | null;
  agreement: string | null;
  renewalDate: string | null;
  noticeDays: number | null;
  annualExposure: number | null;
  owner: string;
  autoRenew: boolean | null;
  confidence: number;
  reviewLevel: ReviewLevel;
  missingFields: string[];
  fieldConfidence: Record<string, number>;
  source: { page: number | null; section: string | null; clause: string | null };
};

type UploadPayload = {
  contract?: Draft;
  error?: string;
  contractId?: string;
  retryable?: boolean;
  status?: string;
  duplicate?: boolean;
};

type Step = "upload" | "processing" | "review" | "failed" | "confirmed" | "existing";

export function UploadFlow() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [failedContractId, setFailedContractId] = useState<string | null>(null);
  const [existingContractId, setExistingContractId] = useState<string | null>(null);
  const [retryable, setRetryable] = useState(false);
  const [cancelByDate, setCancelByDate] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const progress = step === "upload" ? 15 : step === "processing" ? 55 : step === "review" ? 80 : step === "confirmed" ? 100 : 60;
  const canConfirm = useMemo(() => Boolean(
    draft?.vendor?.trim() &&
    draft?.agreement?.trim() &&
    draft?.renewalDate &&
    draft.noticeDays && draft.noticeDays > 0 &&
    draft.annualExposure !== null && draft.annualExposure >= 0 &&
    draft.autoRenew !== null &&
    draft.source.clause?.trim() && draft.source.clause.trim().length >= 10
  ), [draft]);

  async function processContract() {
    if (!file) { setError("Choose a PDF agreement first."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("PDFs must be 10 MB or smaller."); return; }
    setError("");
    setBusy(true);
    setStep("processing");
    const form = new FormData();
    form.set("file", file);

    try {
      const response = await fetch("/api/contracts/upload", { method: "POST", body: form });
      const payload = await response.json() as UploadPayload;
      if (response.ok && payload.contract) {
        setDraft(payload.contract);
        setStep("review");
        return;
      }
      if (payload.status === "confirmed" && payload.contractId) {
        setExistingContractId(payload.contractId);
        setStep("existing");
        return;
      }
      if (payload.status === "extraction_failed" && payload.contractId) {
        setFailedContractId(payload.contractId);
        setRetryable(Boolean(payload.retryable));
        setError(payload.error || "Extraction failed. The PDF is still stored safely for retry.");
        setStep("failed");
        return;
      }
      throw new Error(payload.error || "Could not process this agreement.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not process this agreement.");
      setStep("upload");
    } finally {
      setBusy(false);
    }
  }

  async function retryExtraction() {
    if (!failedContractId || !retryable) return;
    setBusy(true);
    setError("");
    setStep("processing");
    try {
      const response = await fetch(`/api/contracts/${failedContractId}/retry`, { method: "POST" });
      const payload = await response.json() as UploadPayload;
      if (!response.ok || !payload.contract) throw new Error(payload.error || "Extraction failed again.");
      setDraft(payload.contract);
      setStep("review");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Extraction failed again.");
      setStep("failed");
    } finally {
      setBusy(false);
    }
  }

  async function confirmTerms() {
    if (!draft || !canConfirm) {
      setError("Complete the renewal date, notice period, exposure, auto-renewal choice, and supporting clause before confirming.");
      return;
    }
    setError("");
    setBusy(true);
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
          sourcePage: Number(draft.source.page ?? 0),
          sourceSection: draft.source.section ?? "",
          sourceClause: draft.source.clause,
        }),
      });
      const payload = await response.json() as { id?: string; cancelByDate?: string; error?: string };
      if (!response.ok || !payload.cancelByDate) throw new Error(payload.error || "Could not save confirmed terms.");
      setCancelByDate(payload.cancelByDate);
      setStep("confirmed");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save confirmed terms.");
    } finally {
      setBusy(false);
    }
  }

  function resetUpload() {
    setStep("upload");
    setFile(null);
    setDraft(null);
    setFailedContractId(null);
    setExistingContractId(null);
    setRetryable(false);
    setError("");
  }

  const update = <K extends keyof Draft,>(key: K, value: Draft[K]) => setDraft((current) => current ? { ...current, [key]: value } : current);
  const updateSource = <K extends keyof Draft["source"],>(key: K, value: Draft["source"][K]) => setDraft((current) => current ? { ...current, source: { ...current.source, [key]: value } } : current);
  const tab = step === "review" ? "review" : step === "confirmed" ? "confirm" : "upload";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Upload → Review → Confirm</p>
          <p className="mt-1 text-sm text-[#6a756f]">AI suggestions remain drafts until a person verifies the source.</p>
        </div>
        <Badge variant={step === "confirmed" ? "success" : step === "failed" ? "attention" : "neutral"}>
          {step === "confirmed" ? "Ready" : step === "failed" ? "Needs retry" : "Source-backed extraction"}
        </Badge>
      </div>
      <Progress value={progress} aria-label={`Upload flow ${progress}% complete`} />
      {error && step !== "failed" ? <Alert message={error} /> : null}

      <Tabs value={tab} className="mt-6">
        <TabsList aria-label="Upload progress">
          <TabsTrigger value="upload" disabled>1. Upload</TabsTrigger>
          <TabsTrigger value="review" disabled>2. Review</TabsTrigger>
          <TabsTrigger value="confirm" disabled>3. Confirm</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card className="mt-5 p-5 sm:p-7">
            {step === "processing" ? <Processing /> : null}
            {step === "failed" ? (
              <div className="py-5 text-center">
                <span className="mx-auto grid size-11 place-items-center rounded-lg bg-[#fff1ed] text-[#a43727]"><AlertTriangle aria-hidden="true" size={20} /></span>
                <h2 className="mt-4 text-lg font-semibold">Extraction did not finish</h2>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#6b7670]">{error || "The PDF is still stored, so you can retry extraction without uploading it again."}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {retryable ? <Button disabled={busy} onClick={() => void retryExtraction()}><RotateCcw aria-hidden="true" size={16} /> Retry extraction</Button> : null}
                  <Button variant="outline" disabled={busy} onClick={resetUpload}>Upload a different PDF</Button>
                </div>
              </div>
            ) : null}
            {step === "existing" && existingContractId ? (
              <div className="py-5 text-center">
                <span className="mx-auto grid size-11 place-items-center rounded-lg bg-[#eaf6ef] text-positive"><ShieldCheck aria-hidden="true" size={20} /></span>
                <h2 className="mt-4 text-lg font-semibold">Agreement already exists</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6b7670]">TermBeacon matched this PDF to an agreement that is already confirmed, so it did not create a duplicate.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2"><Button asChild><Link href={`/app/contracts/${existingContractId}`}>Open contract <ArrowRight aria-hidden="true" size={16} /></Link></Button><Button variant="outline" onClick={resetUpload}>Upload another</Button></div>
              </div>
            ) : null}
            {step === "upload" ? (
              <div className="grid place-items-center rounded-xl border border-dashed border-[#bdc7c0] bg-[#fafbf8] px-4 py-10 text-center">
                <span className="grid size-11 place-items-center rounded-lg bg-[#eef3ef] text-[#315f52]"><FileUp aria-hidden="true" size={21} /></span>
                <h2 className="mt-4 text-lg font-semibold">Add a vendor agreement</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#6b7670]">Choose a PDF up to 10 MB. TermBeacon verifies the PDF signature, stores it privately, and keeps failed extraction attempts retryable.</p>
                <div className="mt-5 w-full max-w-md text-left">
                  <Label htmlFor="contract-file">Contract PDF</Label>
                  <Input id="contract-file" type="file" accept="application/pdf,.pdf" className="mt-2 h-auto py-2" onChange={(event) => { setFile(event.target.files?.[0] || null); setError(""); }} />
                  <p className="mt-2 text-xs text-[#7b8580]">{file ? `Selected: ${file.name}` : "No file selected"}</p>
                </div>
                <Button className="mt-5" disabled={!file || busy} onClick={() => void processContract()}>Review Suggested Terms <ArrowRight aria-hidden="true" size={16} /></Button>
              </div>
            ) : null}
          </Card>
        </TabsContent>

        <TabsContent value="review">
          {draft ? (
            <div className="mt-5 space-y-5">
              <ReviewBanner draft={draft} />
              <div className="grid gap-5 lg:grid-cols-2">
                <Card className="p-5">
                  <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">Source Clause</p><ConfidenceBadge draft={draft} /></div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Field label="Page"><Input type="number" min="0" value={draft.source.page ?? ""} placeholder="Unknown" onChange={(e) => updateSource("page", e.target.value ? Number(e.target.value) : null)} /></Field>
                    <Field label="Section"><Input value={draft.source.section ?? ""} placeholder="Not found" onChange={(e) => updateSource("section", e.target.value || null)} /></Field>
                  </div>
                  <Label htmlFor="source-clause" className="mt-4 block">Supporting clause</Label>
                  <textarea id="source-clause" value={draft.source.clause ?? ""} placeholder="Paste the exact renewal / termination clause when extraction cannot locate it." onChange={(e) => updateSource("clause", e.target.value || null)} className="mt-2 min-h-48 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]" />
                  {!draft.source.clause ? <p className="mt-2 text-xs leading-5 text-[#9b4a38]">No verified source excerpt was found. Confirmation stays disabled until you provide the supporting clause.</p> : null}
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between"><p className="text-sm font-semibold">Suggested Terms</p><Badge variant="attention">Needs Confirmation</Badge></div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label="Vendor"><Input value={draft.vendor ?? ""} placeholder="Not found" onChange={(e) => update("vendor", e.target.value || null)} /></Field>
                    <Field label="Agreement"><Input value={draft.agreement ?? ""} placeholder="Not found" onChange={(e) => update("agreement", e.target.value || null)} /></Field>
                    <Field label="Renewal date"><Input type="date" value={draft.renewalDate ?? ""} onChange={(e) => update("renewalDate", e.target.value || null)} /></Field>
                    <Field label="Notice period (days)"><Input type="number" min="1" max="730" value={draft.noticeDays ?? ""} placeholder="Not found" onChange={(e) => update("noticeDays", e.target.value ? Number(e.target.value) : null)} /></Field>
                    <Field label="Annual exposure (USD)"><Input type="number" min="0" value={draft.annualExposure ?? ""} placeholder="Enter amount" onChange={(e) => update("annualExposure", e.target.value ? Number(e.target.value) : null)} /></Field>
                    <Field label="Owner"><Input value={draft.owner} onChange={(e) => update("owner", e.target.value)} /></Field>
                    <div><Label htmlFor="auto-renew">Auto-renewal</Label><select id="auto-renew" value={draft.autoRenew === null ? "unknown" : draft.autoRenew ? "yes" : "no"} onChange={(e) => update("autoRenew", e.target.value === "unknown" ? null : e.target.value === "yes")} className="mt-2 h-10 w-full rounded-lg border border-line bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]"><option value="unknown">Select after review</option><option value="yes">Yes</option><option value="no">No</option></select></div>
                  </div>
                  <Button className="mt-5 w-full" disabled={!canConfirm || busy} onClick={() => void confirmTerms()}>Confirm Terms & Calculate Cancel-By Date <Check aria-hidden="true" size={16} /></Button>
                  {!canConfirm ? <p className="mt-2 text-center text-xs leading-5 text-[#7b8580]">Fill every required term and verify the source clause before confirmation.</p> : null}
                </Card>
              </div>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="confirm">
          {draft ? <Card className="mt-5 p-6 text-center sm:p-8"><span className="mx-auto grid size-12 place-items-center rounded-full bg-[#eaf6ef] text-positive"><ShieldCheck aria-hidden="true" size={23} /></span><h2 className="mt-4 text-xl font-semibold">Terms confirmed</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#68736d]">The confirmed renewal date and notice period produce a cancel-by date of <strong>{cancelByDate ? formatDate(cancelByDate) : "—"}</strong>. This contract is now in your Decision Inbox.</p><Button asChild className="mt-5"><Link href={`/app/contracts/${draft.id}`}>Open Escape Window <ArrowRight aria-hidden="true" size={16} /></Link></Button></Card> : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReviewBanner({ draft }: { draft: Draft }) {
  const copy = draft.reviewLevel === "normal"
    ? "Extraction is well supported. Verify the source before confirming."
    : draft.reviewLevel === "careful"
      ? "Some critical terms are below 90% confidence. Review them carefully against the source."
      : "Manual review required. A critical renewal term or verified source excerpt is missing/low-confidence.";
  return <div className="rounded-xl border border-[#d9dfda] bg-[#fbfcf9] p-4"><div className="flex flex-wrap items-center gap-2"><ConfidenceBadge draft={draft} /><span className="text-xs text-[#68736d]">{Math.round(draft.confidence * 100)}% critical confidence</span></div><p className="mt-2 text-sm leading-6 text-[#53615b]">{copy}</p>{draft.missingFields.length ? <p className="mt-2 text-xs text-[#7b8580]">Not found: {draft.missingFields.map(formatField).join(", ")}.</p> : null}</div>;
}

function ConfidenceBadge({ draft }: { draft: Draft }) {
  if (draft.reviewLevel === "normal") return <Badge variant="success">High confidence</Badge>;
  if (draft.reviewLevel === "careful") return <Badge variant="attention">Review carefully</Badge>;
  return <Badge variant="attention">Manual review required</Badge>;
}

function Processing() { return <div aria-live="polite" className="py-4"><p className="text-sm font-semibold">Storing the PDF, reading the agreement, and verifying renewal evidence…</p><p className="mt-1 text-sm text-[#707b75]">If extraction fails, the stored upload remains available for a retry instead of disappearing.</p><div className="mt-6 space-y-3"><Skeleton className="h-10 w-full"/><Skeleton className="h-24 w-full"/><Skeleton className="h-10 w-3/4"/></div></div>; }
function Alert({ message }: { message: string }) { return <div role="alert" className="mt-4 rounded-lg border border-[#e6c6c0] bg-[#fff8f6] p-3 text-sm text-[#a43727]">{message}</div>; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <div><Label>{label}</Label><div className="mt-2">{children}</div></div>; }
function formatField(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
