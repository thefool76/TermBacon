"use client";
import * as React from "react";
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
function DialogContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#07110e]/45 motion-safe:data-[state=open]:animate-[fade-in_220ms_cubic-bezier(.22,1,.36,1)] motion-safe:data-[state=closed]:animate-[fade-out_150ms_cubic-bezier(.22,1,.36,1)]" />
      <DialogPrimitive.Content
        className={cn("fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-white p-6 shadow-[0_24px_70px_rgba(18,33,29,.18)] focus:outline-none motion-safe:data-[state=open]:animate-[dialog-in_220ms_cubic-bezier(.22,1,.36,1)] motion-safe:data-[state=closed]:animate-[fade-out_150ms_cubic-bezier(.22,1,.36,1)]", className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close aria-label="Close dialog" className="absolute right-4 top-4 grid size-9 place-items-center rounded-md text-[#66726d] hover:bg-[#eef1ee] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]">
          <X aria-hidden="true" size={17} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) { return <DialogPrimitive.Title className={cn("text-lg font-semibold tracking-[-0.02em]", className)} {...props} />; }
function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) { return <DialogPrimitive.Description className={cn("mt-2 text-sm leading-6 text-[#65716c]", className)} {...props} />; }
export { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose };
