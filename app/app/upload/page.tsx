import { UploadFlow } from "@/components/product/upload-flow";

export default function UploadPage() {
  return <div><div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#557169]">Upload</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">Find the renewal terms that matter.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#68736d]">Review the suggested terms against their source before TermBeacon calculates a cancel-by date.</p></div><UploadFlow /></div>;
}
