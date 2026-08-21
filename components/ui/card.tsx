import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-xl border border-line bg-white", className)} {...props} />;
}
function CardHeader({ className, ...props }: React.ComponentProps<"div">) { return <div className={cn("p-5 pb-0", className)} {...props} />; }
function CardTitle({ className, ...props }: React.ComponentProps<"h3">) { return <h3 className={cn("font-semibold tracking-[-0.02em]", className)} {...props} />; }
function CardDescription({ className, ...props }: React.ComponentProps<"p">) { return <p className={cn("text-sm leading-6 text-[#65716c]", className)} {...props} />; }
function CardContent({ className, ...props }: React.ComponentProps<"div">) { return <div className={cn("p-5", className)} {...props} />; }
function CardFooter({ className, ...props }: React.ComponentProps<"div">) { return <div className={cn("flex items-center p-5 pt-0", className)} {...props} />; }
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
