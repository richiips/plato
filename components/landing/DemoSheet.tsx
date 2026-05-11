"use client";

import { useState } from "react";
import { Smartphone } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface DemoSheetProps {
  slug?: string;
}

export function DemoSheet({ slug = "demo" }: DemoSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-100"
      >
        <Smartphone className="h-4 w-4" />
        Ver demo en vivo
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col p-0 sm:max-w-sm"
        >
          <SheetHeader className="border-b border-border px-4 py-3">
            <SheetTitle className="text-sm">Demo — como lo ve tu cliente</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            <iframe
              src={`/r/${slug}`}
              title="Demo carta digital"
              className="h-full w-full border-0"
              loading="lazy"
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
