"use client";

import { CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/copy-to-clipboard";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase">
      {children}
    </h2>
  );
}

export function CopyableCode({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
      <code className="flex-1 font-mono text-xs break-all">{value}</code>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Copiar ${label}`}
        onClick={() => copyToClipboard(value, label)}
      >
        <CopyIcon className="size-3.5" />
      </Button>
    </div>
  );
}
