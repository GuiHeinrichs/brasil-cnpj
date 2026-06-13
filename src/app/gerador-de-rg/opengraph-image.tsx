import { ImageResponse } from "next/og";

import { ink, OG_SIZE, OgCard } from "@/components/og-card";

export const alt = "bateCarimbo — Gerador de RG válido (padrão SSP-SP)";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        badge="PADRÃO SSP-SP · MÓDULO 11"
        subtitle="Gerador de RG válido — em lote para testes"
        sample={[
          { text: "24.598.973", color: ink.foreground },
          { text: "-", color: ink.separator },
          { text: "0", color: ink.gold },
        ]}
      />
    ),
    { ...size },
  );
}
