import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

const SEPARATORS = new Set([".", "-"]);

const SEGMENTS = [
  { label: "Base", positions: "1–8", className: "text-foreground", dotClassName: "bg-foreground" },
  { label: "Região fiscal", positions: "9", className: "text-primary", dotClassName: "bg-primary" },
  { label: "DV", positions: "10–11", className: "text-gold", dotClassName: "bg-gold" },
] as const;

function segmentClassName(index: number): string {
  if (index < 8) return SEGMENTS[0].className;
  if (index < 9) return SEGMENTS[1].className;
  return SEGMENTS[2].className;
}

type CpfTextProps = {
  value: string;
  /** Escalona a entrada dos caracteres (usar em resultados recém-gerados). */
  animate?: boolean;
  className?: string;
};

/**
 * Renderiza um CPF com a anatomia colorida por segmento:
 * base (1–8), região fiscal (9) e dígitos verificadores (10–11).
 * Valores que não têm 11 dígitos significativos são exibidos sem cores.
 */
export function CpfText({ value, animate = false, className }: CpfTextProps) {
  const chars = [...value];
  const significant = chars.filter((char) => !SEPARATORS.has(char)).length;
  const plain = significant !== 11;

  let index = 0;
  return (
    <span
      className={cn("font-mono tabular-nums", animate && "animate-cnpj", className)}
    >
      {chars.map((char, i) => {
        const isSeparator = SEPARATORS.has(char);
        let colorClassName = "text-muted-foreground/60";
        if (!isSeparator) {
          colorClassName = segmentClassName(index);
          index += 1;
        }
        return (
          <span
            key={i}
            className={cn("cnpj-char", plain ? "text-foreground" : colorClassName)}
            style={
              animate
                ? ({ "--char-index": i } as CSSProperties)
                : undefined
            }
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

export function SegmentLegend({ className }: { className?: string }) {
  return (
    <dl className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-1", className)}>
      {SEGMENTS.map((segment) => (
        <div key={segment.label} className="flex items-center gap-1.5">
          <span aria-hidden className={cn("size-1.5 rounded-full", segment.dotClassName)} />
          <dt className="text-xs font-medium text-muted-foreground">{segment.label}</dt>
          <dd className="font-mono text-[11px] text-muted-foreground/70">
            {segment.positions}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export { SEGMENTS as CPF_SEGMENTS };
