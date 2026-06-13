import { ImageResponse } from "next/og";

import { ink, OG_SIZE, OgCard } from "@/components/og-card";

export const alt = "bateCarimbo — Gerador de CPF válido por região fiscal";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        badge="REGIÃO FISCAL NO 9º DÍGITO"
        subtitle="Gerador de CPF válido — por região fiscal e em lote"
        sample={[
          { text: "123.456.78", color: ink.foreground },
          { text: "9", color: ink.primary },
          { text: "-", color: ink.separator },
          { text: "09", color: ink.gold },
        ]}
      />
    ),
    { ...size },
  );
}
