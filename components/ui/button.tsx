import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 shrink-0 touch-manipulation items-center justify-center gap-2 rounded-[9px] text-sm font-semibold whitespace-nowrap transition-[transform,opacity] duration-150 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        default: "bg-forest text-white hover:bg-[#174c40]",
        acid: "bg-acid text-ink hover:bg-[#d5f532] hover:-translate-y-px",
        outline: "border border-[#cfd7d1] bg-white text-[#23312c] hover:border-[#aebbb3] hover:bg-[#f5f6f2]",
        ghost: "text-[#35443f] hover:bg-[#edf1ed]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-5 text-[15px]",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
