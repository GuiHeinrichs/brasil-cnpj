import type { ToolId } from "@/lib/tools";

type SiteHeaderProps = {
  /** Mantido por compatibilidade; a navegação agora vive na barra global. */
  active?: ToolId;
  badge: string;
  heading: string;
};

/** Cabeçalho de conteúdo da página: selo + H1 (a marca/menu são globais). */
export function SiteHeader({ badge, heading }: SiteHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted-foreground">
        <span aria-hidden className="size-1.5 rounded-full bg-gold" />
        {badge}
      </span>
      <h1 className="max-w-lg text-balance text-xl font-medium tracking-tight sm:text-2xl">
        {heading}
      </h1>
    </header>
  );
}
