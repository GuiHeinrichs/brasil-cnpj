"use client";

import { CopyButton } from "@/components/ui/copy-button";

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
      <CopyButton
        variant="ghost"
        size="icon-xs"
        aria-label={`Copiar ${label}`}
        value={value}
        toastLabel={label}
        iconClassName="size-3.5"
      />
    </div>
  );
}
