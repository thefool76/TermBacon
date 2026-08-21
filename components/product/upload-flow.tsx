"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, FileUp, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contracts, currency, formatDate } from "@/lib/demo-data";

export function UploadFlow() {
  const [step, setStep] = useState<"upload" | "processing" | "review" | "confirmed">("upload");
  const [fileName, setFileName] = useState("vendor-agreement.pdf");
  const contract = contracts[0];
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);
  const progress = step === "upload" ? 20 : step === "processing" ? 55 : step === "review" ? 80 : 100;

  function processDemo() {
    setStep("processing");
    timerRef.current = window.setTimeout(() => setStep("review"), 650);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div><p className="text-sm font-semibold">Upload → Review → Confirm</p><p className="mt-1 text-sm text-[#6a756f]">AI suggestions remain drafts until you confirm the source.</p></div>
        <Badge variant={step === "confirmed" ? "success" : "neutral"}>{step === "confirmed" ? "Ready" : "Demo Flow"}</Badge>
      </div>
      <Progress value={progress} aria-label={`Upload flow ${progress}% complete`} />

      <Tabs value={step === "upload" || step === "processing" ? "upload" : step === "review" ? "review" : "confirm"} className="mt-6">
        <TabsList aria-label="Upload progress">
          <TabsTrigger value="upload" disabled>1. Upload</TabsTrigger>
          <TabsTrigger value="review" disabled>2. Review</TabsTrigger>
          <TabsTrigger value="confirm" disabled>3. Confirm</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card className="mt-5 p-5 sm:p-7">
            {step === "processing" ? <Processing /> : <>
              <div className="grid place-items-center rounded-xl border border-dashed border-[#bdc7c0] bg-[#fafbf8] px-4 py-10 text-center">
                <span className="grid size-11 place-items-center rounded-lg bg-[#eef3ef] text-[#315f52]"><FileUp aria-hidden="true" size={21} /></span>
                <h2 className="mt-4 text-lg font-semibold">Add a vendor agreement</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#6b7670]">Choose a PDF to review. This launch shell never uploads the file; it uses demo terms for the next screen.</p>
                <div className="mt-5 w-full max-w-md text-left">
                  <Label htmlFor="contract-file">Contract PDF</Label>
                  <Input id="contract-file" name="contract-file" type="file" accept="application/pdf" className="mt-2 h-auto py-2" onChange={(event) => setFileName(event.target.files?.[0]?.name || "vendor-agreement.pdf")} />
                  <p className="mt-2 text-xs text-[#7b8580]">Selected: {fileName}</p>
                </div>
                <Button className="mt-5" onClick={processDemo}>Review Suggested Terms <ArrowRight aria-hidden="true" size={16} /></Button>
              </div>
            </>}
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <p className="text-sm font-semibold">Source Clause</p><p className="mt-1 text-xs text-[#78827d]">Page {contract.source.page} · § {contract.source.section}</p>
              <div className="mt-4 rounded-lg border border-[#e0e5e1] bg-[#fbfbf8] p-4 text-sm leading-7 text-[#45524d]">… <mark className="bg-[#edff91] text-[#22300f]">{contract.source.clause}</mark></div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center justify-between"><p className="text-sm font-semibold">Suggested Terms</p><Badge variant="attention">Needs Confirmation</Badge></div>
              <dl className="mt-4 divide-y divide-[#e5e9e5] text-sm">
                <ReviewRow label="Renewal Date" value={formatDate(contract.renewalDate)} />
                <ReviewRow label="Notice Period" value={`${contract.noticeDays} days`} />
                <ReviewRow label="Auto-Renewal" value="Yes" />
                <ReviewRow label="Annual Exposure" value={currency.format(contract.annualExposure)} />
              </dl>
              <Button className="mt-5 w-full" onClick={() => setStep("confirmed")}>Confirm Terms & Calculate Cancel-By Date <Check aria-hidden="true" size={16} /></Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="confirm">
          <Card className="mt-5 p-6 text-center sm:p-8">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#eaf6ef] text-positive"><ShieldCheck aria-hidden="true" size={23} /></span>
            <h2 className="mt-4 text-xl font-semibold">Terms confirmed</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#68736d]">The demo contract now has a source-backed cancel-by date of {formatDate(contract.cancelByDate)}. No file or data was sent anywhere.</p>
            <Button asChild className="mt-5"><a href="/app/contracts/hubspot-2026">Open Escape Window <ArrowRight aria-hidden="true" size={16} /></a></Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Processing() {
  return <div aria-live="polite" className="py-4"><p className="text-sm font-semibold">Finding renewal terms…</p><p className="mt-1 text-sm text-[#707b75]">Looking only for renewal-relevant language in this demo flow.</p><div className="mt-6 space-y-3"><Skeleton className="h-10 w-full"/><Skeleton className="h-24 w-full"/><Skeleton className="h-10 w-3/4"/></div></div>;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return <div className="grid grid-cols-[1fr_auto] gap-4 py-3"><dt className="text-[#6c7771]">{label}</dt><dd className="font-semibold tabular-nums">{value}</dd></div>;
}
