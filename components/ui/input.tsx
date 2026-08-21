import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return <input type={type} className={cn("flex h-10 w-full rounded-[9px] border border-[#cfd7d1] bg-white px-3 py-2 text-sm text-ink shadow-none placeholder:text-[#929b97] focus-visible:border-[#466b60] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9e4df] disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
}
export { Input };
