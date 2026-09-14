/**
 * Configuração do Google AdSense. O publisher fica fixo (é público e necessário
 * para a verificação do site); os slot IDs vêm de variáveis de ambiente
 * (NEXT_PUBLIC_*) e só "ligam" depois que os blocos forem criados no painel do
 * AdSense e as variáveis definidas na Vercel. Enquanto estiverem vazias, o
 * AdSlot não renderiza nada em produção.
 */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-8413255358830529";

/** Mapeia cada espaço do layout para o slot ID numérico criado no AdSense. */
export const AD_SLOTS = {
  "rail-right": process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL ?? "",
  "content-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER ?? "",
} as const;

export type AdSlotName = keyof typeof AD_SLOTS;

/** True quando o publisher e o slot estão configurados (bloco real pode ser exibido). */
export function isAdSlotLive(slot: AdSlotName): boolean {
  return Boolean(ADSENSE_CLIENT && AD_SLOTS[slot]);
}
