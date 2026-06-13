import type { DocSegment } from "@/components/doc-tool/doc-text";

export const CARTAO_SEGMENTS: DocSegment[] = [
  { label: "BIN", positions: "1–6", end: 6, className: "text-foreground", dotClassName: "bg-foreground" },
  { label: "Conta", positions: "7–15", end: 15, className: "text-primary", dotClassName: "bg-primary" },
  { label: "DV", positions: "16", end: 16, className: "text-gold", dotClassName: "bg-gold" },
];
