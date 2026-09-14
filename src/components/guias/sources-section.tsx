import { ExternalLinkIcon } from "lucide-react";

import type { GuideSource } from "@/lib/guias";

/**
 * Seção "Fontes e referências" no fim de cada guia. Toda afirmação normativa
 * (norma, prazo, decreto) deve estar amparada por uma entrada daqui.
 */
export function SourcesSection({ sources }: { sources: GuideSource[] }) {
  if (sources.length === 0) return null;

  return (
    <section className="mt-12 space-y-3">
      <h2 className="text-lg font-medium tracking-tight text-foreground">
        Fontes e referências
      </h2>
      <ul className="space-y-2.5">
        {sources.map((source) => (
          <li key={source.href} className="text-sm leading-relaxed">
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-1.5 text-primary underline underline-offset-4 hover:text-primary/80"
            >
              {source.label}
              <ExternalLinkIcon aria-hidden className="size-3 shrink-0 self-center" />
            </a>
            {source.note && (
              <span className="text-muted-foreground"> — {source.note}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
