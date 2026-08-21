"use client";
import * as React from "react";
import { X } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
function SheetContent({ className, children, ...props }: React.ComponentProps<typeof SheetPrimitive.Content>) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-[#07110e]/45 motion-safe:data-[state=open]:animate-[fade-in_220ms_cubic-bezier(.22,1,.36,1)]" />
      <SheetPrimitive.Content
        className={cn("fixed inset-y-0 right-0 z-50 w-[min(88vw,360px)] overscroll-contain border-l border-line bg-canvas p-6 shadow-[0_18px_50px_rgba(18,33,29,.12)] focus:outline-none motion-safe:data-[state=open]:animate-[sheet-in_220ms_cubic-bezier(.22,1,.36,1)]", className)}
        {...props}
      >
        {children}
        <SheetPrimitive.Close aria-label="Close navigation" className="absolute right-4 top-4 grid size-10 place-items-center rounded-md text-[#56625d] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]">
          <X aria-hidden="true" size={18} />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}
function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) { return <SheetPrimitive.Title className={cn("font-semibold", className)} {...props} />; }
function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) { return <SheetPrimitive.Description className={cn("text-sm text-[#65716c]", className)} {...props} />; }
export { Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle, SheetDescription };
