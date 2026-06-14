/**
 * Configuração do Google AdSense. Tudo vem de variáveis de ambiente
 * (NEXT_PUBLIC_*), então os anúncios só "ligam" depois que você cadastrar o
 * publisher e os blocos no AdSense e definir as variáveis na Vercel. Enquanto
 * estiverem vazias, o AdSlot exibe apenas o placeholder "Publicidade".
 */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-8413255358830529";

/** Mapeia cada espaço do layout para o slot ID numérico criado no AdSense. */
export const AD_SLOTS = {
  "rail-right": process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL ?? "",
  "content-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER ?? "",
} as const;

export type AdSlotName = keyof typeof AD_SLOTS;
