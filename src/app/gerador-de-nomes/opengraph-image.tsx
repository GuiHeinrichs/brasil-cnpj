import { ImageResponse } from "next/og";

import { ink, OG_SIZE, OgCard } from "@/components/og-card";

export const alt = "bateCarimbo — Gerador de Nomes brasileiros para testes";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        badge="NOMES BRASILEIROS · POR SEXO"
        subtitle="Gerador de Nomes — masculinos e femininos, em lote"
        sample={[
          { text: "Helena ", color: ink.foreground },
          { text: "Andrade Carvalho", color: ink.primary },
        ]}
      />
    ),
    { ...size },
  );
}
