import { ImageResponse } from "next/og";

import { ink, OG_SIZE, OgCard } from "@/components/og-card";

export const alt = "bateCarimbo — Gerador de Cartão de Crédito válido para testes";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        badge="ALGORITMO DE LUHN · 16 DÍGITOS"
        subtitle="Gerador de Cartão de Crédito — Visa, Mastercard, Elo, Hipercard"
        sample={[
          { text: "4111 1111 1111 111", color: ink.foreground },
          { text: "1", color: ink.gold },
        ]}
      />
    ),
    { ...size },
  );
}
