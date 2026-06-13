import { ImageResponse } from "next/og";

import { ink, OG_SIZE, OgCard } from "@/components/og-card";

export const alt = "bateCarimbo — Gerador de PIS/PASEP válido para testes";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        badge="MESMO NÚMERO DO NIS/NIT"
        subtitle="Gerador de PIS/PASEP válido — em lote para testes"
        sample={[
          { text: "120.16619.18", color: ink.foreground },
          { text: "-", color: ink.separator },
          { text: "1", color: ink.gold },
        ]}
      />
    ),
    { ...size },
  );
}
