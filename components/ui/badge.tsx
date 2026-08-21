import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-semibold leading-none", {
  variants: {
    variant: {
      neutral: "border-[#d7ddd8] bg-[#f4f6f3] text-[#53605b]",
      critical: "border-[#efd2cc] bg-[#fff2ef] text-[#a43727]",
      attention: "border-[#ecd9ba] bg-[#fff8e9] text-[#8b5909]",
      success: "border-[#cde2d8] bg-[#eef8f2] text-[#286650]",
      decision: "border-[#cbd9d2] bg-[#edf4ef] text-[#315f52]",
      acid: "border-[#c9e532] bg-[#edff8a] text-[#24320d]",
    },
  },
  defaultVariants: { variant: "neutral" },
});

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
