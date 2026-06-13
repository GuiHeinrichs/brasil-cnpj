import type { DocSegment } from "@/components/doc-tool/doc-text";

export const PLACA_SEGMENTS: DocSegment[] = [
  { label: "Letras", positions: "1–3", end: 3, className: "text-foreground", dotClassName: "bg-foreground" },
  { label: "Identificador", positions: "4–7", end: 7, className: "text-primary", dotClassName: "bg-primary" },
];
