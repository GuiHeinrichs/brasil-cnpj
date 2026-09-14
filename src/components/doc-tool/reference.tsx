import { ExternalLinkIcon, TriangleAlertIcon } from "lucide-react";

import { SectionLabel } from "@/components/docs";
import { DocText } from "@/components/doc-tool/doc-text";
import type { DocSegment } from "@/components/doc-tool/doc-text";
import { WorkedDvTable, type WorkedDvStep } from "@/components/guias/worked-table";
import { cn } from "@/lib/utils";

export function DocsWarning({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
      <TriangleAlertIcon
        aria-hidden
        className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
      />
      <p>{children}</p>
    </div>
  );
}

/**
 * Bloco de texto corrido (guia editorial) da referência de cada ferramenta.
 * Usa H2 de verdade e corpo com o mesmo peso dos artigos — o conteúdo editorial
 * é parte principal da página, não legenda.
 */
export function GuideSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-medium tracking-tight text-foreground">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_strong]:font-medium [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_code]:rounded [&_code]:bg-muted/60 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-foreground">
        {children}
      </div>
    </section>
  );
}

type AnatomySectionProps = {
  title: string;
  sample: string;
  segments: DocSegment[];
  length: number;
  separators?: string;
  /** Descrição de cada segmento, na mesma ordem de `segments`. */
  details: string[];
};

export function AnatomySection({
  title,
  sample,
  segments,
  length,
  separators,
  details,
}: AnatomySectionProps) {
  return (
    <div className="space-y-5">
      <SectionLabel>{title}</SectionLabel>
      <p className="text-center">
        <DocText
          value={sample}
          segments={segments}
          length={length}
          separators={separators}
          className="text-xl font-medium tracking-tight sm:text-2xl"
        />
      </p>
      <div
        className={cn(
          "grid gap-3",
          segments.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {segments.map((segment, index) => (
          <div key={segment.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className={cn("size-2 rounded-full", segment.dotClassName)}
              />
              <h3 className="text-sm font-semibold">{segment.label}</h3>
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                {segment.positions}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {details[index]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Um dígito verificador resolvido: linhas da conta, soma, resto e regra. */
export type WorkedDv = {
  title: string;
  steps: WorkedDvStep[];
  sum: number;
  remainder: number;
  rule: string;
  result: string;
  showValueColumn?: boolean;
};

type AlgorithmSectionProps = {
  intro: React.ReactNode;
  steps: React.ReactNode[];
  /** Contas resolvidas, exibidas como tabela dígito × peso × produto. */
  worked?: WorkedDv[];
  note?: React.ReactNode;
};

export function AlgorithmSection({
  intro,
  steps,
  worked,
  note,
}: AlgorithmSectionProps) {
  return (
    <div className="space-y-3">
      <SectionLabel>Exemplo — cálculo do DV</SectionLabel>
      <p className="text-sm text-muted-foreground">{intro}</p>
      <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      {worked?.map((dv) => (
        <WorkedDvTable
          key={dv.title}
          title={dv.title}
          steps={dv.steps}
          sum={dv.sum}
          remainder={dv.remainder}
          rule={dv.rule}
          result={dv.result}
          showValueColumn={dv.showValueColumn}
        />
      ))}
      {note && <p className="text-sm text-muted-foreground">{note}</p>}
    </div>
  );
}

export function FaqSection({
  items,
}: {
  items: readonly { question: string; answer: React.ReactNode }[];
}) {
  return (
    <div className="space-y-4">
      <SectionLabel>Perguntas frequentes</SectionLabel>
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.question} className="rounded-xl border bg-card p-4">
            <h3 className="text-sm font-semibold">{item.question}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OfficialLinksSection({
  references,
}: {
  references: { label: string; href: string }[];
}) {
  return (
    <div className="space-y-3">
      <SectionLabel>Links oficiais</SectionLabel>
      <ul className="space-y-2">
        {references.map((ref) => (
          <li key={ref.href}>
            <a
              href={ref.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
            >
              {ref.label}
              <ExternalLinkIcon aria-hidden className="size-3.5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
