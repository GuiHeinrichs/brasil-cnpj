import { cn } from "@/lib/utils";

/**
 * Espaço reservado para anúncios. Hoje renderiza um placeholder com as
 * dimensões finais (evita layout shift); para ativar o AdSense, troque o
 * conteúdo interno pelo bloco <ins class="adsbygoogle" …/> + script, mantendo
 * o contêiner externo com `data-ad-slot`.
 */
const VARIANTS = {
  /** Banner horizontal — topo/rodapé de conteúdo (728×90 / responsivo). */
  leaderboard: "h-[90px] w-full max-w-[728px]",
  /** Retângulo médio — meio de conteúdo (336×280 / responsivo). */
  rectangle: "h-[250px] w-full max-w-[336px]",
  /** Arranha-céu — trilho lateral em telas largas (300×600). */
  skyscraper: "h-[600px] w-[300px]",
} as const;

export type AdVariant = keyof typeof VARIANTS;

export function AdSlot({
  variant,
  slot,
  className,
}: {
  variant: AdVariant;
  /** Identificador do bloco para o provedor de anúncios. */
  slot: string;
  className?: string;
}) {
  return (
    <div
      data-ad-slot={slot}
      aria-hidden
      className={cn(
        "mx-auto flex items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30",
        VARIANTS[variant],
        className,
      )}
    >
      <span className="font-mono text-[10px] tracking-widest text-muted-foreground/50 uppercase">
        Publicidade
      </span>
    </div>
  );
}
