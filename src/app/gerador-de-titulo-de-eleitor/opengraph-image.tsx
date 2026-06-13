import { ImageResponse } from "next/og";

import { ink, OG_SIZE, OgCard } from "@/components/og-card";

export const alt = "bateCarimbo — Gerador de Título de Eleitor válido por UF";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        badge="UF NOS DÍGITOS 9–10"
        subtitle="Gerador de Título de Eleitor — por estado e em lote"
        sample={[
          { text: "1234 5678 ", color: ink.foreground },
          { text: "20", color: ink.primary },
          { text: "97", color: ink.gold },
        ]}
      />
    ),
    { ...size },
  );
}
