import { ImageResponse } from "next/og";

import { ink, OG_SIZE, OgCard } from "@/components/og-card";

export const alt = "bateCarimbo — Gerador de RENAVAM válido para testes";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        badge="11 DÍGITOS DESDE 2013"
        subtitle="Gerador de RENAVAM válido — em lote para testes"
        sample={[
          { text: "1234567890", color: ink.foreground },
          { text: "0", color: ink.gold },
        ]}
      />
    ),
    { ...size },
  );
}
