import type { DocSegment } from "@/components/doc-tool/doc-text";

export const CEP_SEGMENTS: DocSegment[] = [
  { label: "Prefixo", positions: "1–5", end: 5, className: "text-foreground", dotClassName: "bg-foreground" },
  { label: "Sufixo", positions: "6–8", end: 8, className: "text-primary", dotClassName: "bg-primary" },
];
