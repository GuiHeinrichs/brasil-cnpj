"use client";

import { useEffect, useRef } from "react";

import { ADSENSE_CLIENT, AD_SLOTS, isAdSlotLive, type AdSlotName } from "@/lib/ads";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Espaço de anúncio do AdSense.
 *
 * - Quando ADSENSE_CLIENT e o slot correspondente estão configurados, renderiza
 *   o bloco real <ins class="adsbygoogle" …/> com as dimensões finais (evita
 *   layout shift).
 * - Quando o slot ainda não existe, NÃO renderiza nada em produção: uma caixa
 *   vazia rotulada "Publicidade" passa a impressão de site inacabado (motivo
 *   de reprovação "conteúdo de baixo valor / em construção" no AdSense).
 *   Apenas em desenvolvimento mostra um placeholder discreto para conferir o
 *   layout.
 */
const VARIANTS = {
  /** Banner horizontal — topo/rodapé de conteúdo (728×90 / responsivo). */
  leaderboard: { box: "h-[90px] w-full max-w-[728px]", format: "horizontal" },
  /** Retângulo médio — meio de conteúdo (336×280 / responsivo). */
  rectangle: { box: "h-[250px] w-full max-w-[336px]", format: "rectangle" },
  /** Arranha-céu — trilho lateral em telas largas (300×600). */
  skyscraper: { box: "h-[600px] w-[300px]", format: "vertical" },
} as const;

export type AdVariant = keyof typeof VARIANTS;

const SHOW_DEV_PLACEHOLDER = process.env.NODE_ENV === "development";

export function AdSlot({
  variant,
  slot,
  className,
}: {
  variant: AdVariant;
  /** Espaço do layout — resolve o slot ID numérico via AD_SLOTS. */
  slot: AdSlotName;
  className?: string;
}) {
  const { box, format } = VARIANTS[variant];
  const adSlotId = AD_SLOTS[slot];
  const isLive = isAdSlotLive(slot);

  if (!isLive && !SHOW_DEV_PLACEHOLDER) {
    return null;
  }

  return (
    <div
      data-ad-slot={slot}
      className={cn(
        "mx-auto",
        box,
        !isLive &&
          "flex items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30",
        className,
      )}
    >
      {isLive ? (
        <AdUnit adSlotId={adSlotId} format={format} />
      ) : (
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground/50 uppercase">
          Publicidade (dev)
        </span>
      )}
    </div>
  );
}

function AdUnit({ adSlotId, format }: { adSlotId: string; format: string }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // O script do AdSense ainda não carregou; o push é refeito no próximo load.
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", width: "100%", height: "100%" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={adSlotId}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
