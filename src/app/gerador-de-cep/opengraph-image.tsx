import { ImageResponse } from "next/og";

import { ink, OG_SIZE, OgCard } from "@/components/og-card";

export const alt = "bateCarimbo — Gerador de CEP por estado para testes";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        badge="FAIXAS OFICIAIS DOS CORREIOS"
        subtitle="Gerador de CEP por estado — em lote para testes"
        sample={[
          { text: "01310", color: ink.foreground },
          { text: "-", color: ink.separator },
          { text: "100", color: ink.primary },
        ]}
      />
    ),
    { ...size },
  );
}
