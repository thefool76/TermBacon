"use client";
import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;
function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) { return <TabsPrimitive.List className={cn("inline-flex min-h-10 items-center gap-1 rounded-lg bg-[#eef1ee] p-1", className)} {...props} />; }
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) { return <TabsPrimitive.Trigger className={cn("rounded-md px-3 py-1.5 text-sm font-medium text-[#66716d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35] data-[state=active]:bg-white data-[state=active]:text-ink data-[state=active]:shadow-sm", className)} {...props} />; }
function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) { return <TabsPrimitive.Content className={cn("mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]", className)} {...props} />; }
export { Tabs, TabsList, TabsTrigger, TabsContent };
