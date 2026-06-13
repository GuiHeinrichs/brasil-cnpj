import { ImageResponse } from "next/og";

import { ink, OG_SIZE, OgCard } from "@/components/og-card";

export const alt =
  "bateCarimbo — Gerador de CNPJ válido, numérico e alfanumérico";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        badge="NOVO FORMATO ALFANUMÉRICO · JUL/2026"
        subtitle="Gerador de CNPJ válido — numérico e alfanumérico"
        sample={[
          { text: "12.ABC.345", color: ink.foreground },
          { text: "/", color: ink.separator },
          { text: "01DE", color: ink.primary },
          { text: "-", color: ink.separator },
          { text: "35", color: ink.gold },
        ]}
      />
    ),
    { ...size },
  );
}
