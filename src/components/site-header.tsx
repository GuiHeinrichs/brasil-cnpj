import { JsonLd } from "@/components/json-ld";
import { TestDataNotice } from "@/components/test-data-notice";
import { breadcrumbJsonLd } from "@/lib/schema";
import { TOOLS, type ToolId } from "@/lib/tools";

type SiteHeaderProps = {
  /** Identifica a ferramenta da página; alimenta o breadcrumb JSON-LD e o aviso de dados fictícios. */
  active?: ToolId;
  badge: string;
  heading: string;
  /**
   * Subtítulo opcional (1–2 frases) exibido abaixo do H1 — permite manter o
   * H1 curto e distinto e levar os atributos (lote, validador, formatador) para
   * o texto corrido.
   */
  lead?: React.ReactNode;
};

/** Cabeçalho de conteúdo da página: selo + H1 (+ subtítulo e aviso nas ferramentas). */
export function SiteHeader({ active, badge, heading, lead }: SiteHeaderProps) {
  // Trilha Início › ferramenta apenas nas páginas internas (a home é a raiz).
  const tool = active ? TOOLS.find((t) => t.id === active) : undefined;
  const breadcrumbTool = tool && tool.href !== "/" ? tool : undefined;

  return (
    <header className="flex flex-col gap-3">
      {breadcrumbTool && <JsonLd data={breadcrumbJsonLd(breadcrumbTool)} />}
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted-foreground">
        <span aria-hidden className="size-1.5 rounded-full bg-gold" />
        {badge}
      </span>
      <h1 className="max-w-lg text-balance text-xl font-medium tracking-tight sm:text-2xl">
        {heading}
      </h1>
      {lead && (
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          {lead}
        </p>
      )}
      {active && <TestDataNotice tool={active} />}
    </header>
  );
}
