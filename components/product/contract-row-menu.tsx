"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ContractRowMenu({ id }: { id: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" aria-label="Open contract actions"><MoreHorizontal aria-hidden="true" size={17} /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild><Link href={`/app/contracts/${id}`}>Open Contract</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={`/app/contracts/${id}#source-clause`}>View Source Clause</Link></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
