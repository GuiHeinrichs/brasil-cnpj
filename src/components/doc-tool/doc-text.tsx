import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

export type DocSegment = {
  label: string;
  positions: string;
  /** Índice significativo (exclusivo) onde o segmento termina. */
  end: number;
  className: string;
  dotClassName: string;
};

type DocTextProps = {
  value: string;
  segments: DocSegment[];
  /** Total de caracteres significativos do documento. */
  length: number;
  /** Caracteres tratados como separadores de máscara. */
  separators?: string;
  /** Escalona a entrada dos caracteres (usar em resultados recém-gerados). */
  animate?: boolean;
  className?: string;
};

/**
 * Renderiza um documento com a anatomia colorida por segmento.
 * Valores sem o total esperado de caracteres significativos são exibidos
 * sem cores.
 */
export function DocText({
  value,
  segments,
  length,
  separators = ".-/ ",
  animate = false,
  className,
}: DocTextProps) {
  const separatorSet = new Set([...separators]);
  const chars = [...value];
  const significant = chars.filter((char) => !separatorSet.has(char)).length;
  const plain = significant !== length;

  let index = 0;
  return (
    <span
      className={cn("font-mono tabular-nums", animate && "animate-cnpj", className)}
    >
      {chars.map((char, i) => {
        const isSeparator = separatorSet.has(char);
        let colorClassName = "text-muted-foreground/60";
        if (!isSeparator) {
          const segment = segments.find((entry) => index < entry.end);
          colorClassName = segment?.className ?? "text-foreground";
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

export function DocSegmentLegend({
  segments,
  className,
}: {
  segments: DocSegment[];
  className?: string;
}) {
  return (
    <dl className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-1", className)}>
      {segments.map((segment) => (
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
