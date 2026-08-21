import * as React from "react";
import { cn } from "@/lib/utils";
function Skeleton({ className, ...props }: React.ComponentProps<"div">) { return <div aria-hidden="true" className={cn("skeleton-pulse rounded-md bg-[#e8ece8] motion-reduce:animate-none", className)} {...props} />; }
export { Skeleton };
