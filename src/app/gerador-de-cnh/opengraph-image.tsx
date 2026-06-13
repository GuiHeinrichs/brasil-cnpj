import { ImageResponse } from "next/og";

import { ink, OG_SIZE, OgCard } from "@/components/og-card";

export const alt = "bateCarimbo — Gerador de CNH válida para testes";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        badge="DOIS DVS · MÓDULO 11"
        subtitle="Gerador de CNH válida — em lote para testes"
        sample={[
          { text: "123456789", color: ink.foreground },
          { text: "00", color: ink.gold },
        ]}
      />
    ),
    { ...size },
  );
}
