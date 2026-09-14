"use client";

import { CopyButton } from "@/components/ui/copy-button";

/**
 * Bloco de código dos guias, com rótulo de linguagem e botão de copiar.
 * O conteúdo vai como string em `code` (não como children) para que o botão
 * copie exatamente o que está na tela.
 */
export function CodeBlock({
  code,
  language,
  caption,
}: {
  code: string;
  /** Rótulo exibido no topo ("TypeScript", "SQL — PostgreSQL"). */
  language: string;
  /** Legenda curta abaixo do bloco. */
  caption?: string;
}) {
  return (
    <figure className="my-5">
      <div className="overflow-hidden rounded-xl border bg-muted/40">
        <div className="flex items-center justify-between gap-2 border-b bg-muted/60 px-3 py-1.5">
          <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            {language}
          </span>
          <CopyButton
            variant="ghost"
            size="icon-xs"
            aria-label={`Copiar código ${language}`}
            value={code}
            toastLabel="Código"
            iconClassName="size-3.5"
          />
        </div>
        <pre className="overflow-x-auto px-4 py-3">
          <code className="!bg-transparent !p-0 font-mono text-[12.5px] leading-relaxed text-foreground">
            {code}
          </code>
        </pre>
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
