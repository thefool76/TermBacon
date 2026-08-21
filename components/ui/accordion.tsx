"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;
function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) { return <AccordionPrimitive.Item className={cn("border-b border-[#dfe4df]", className)} {...props} />; }
function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return <AccordionPrimitive.Header className="flex"><AccordionPrimitive.Trigger className={cn("group flex flex-1 items-center justify-between py-4 text-left text-sm font-semibold hover:text-[#174c40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]", className)} {...props}>{children}<ChevronDown aria-hidden="true" className="size-4 shrink-0 transition-transform duration-[220ms] ease-[cubic-bezier(.22,1,.36,1)] group-data-[state=open]:rotate-180 motion-reduce:transition-none" /></AccordionPrimitive.Trigger></AccordionPrimitive.Header>;
}
function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) { return <AccordionPrimitive.Content className="overflow-hidden text-sm text-[#66716d]" {...props}><div className={cn("pb-4 leading-6", className)}>{children}</div></AccordionPrimitive.Content>; }
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
