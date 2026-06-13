import { ImageResponse } from "next/og";

import { ink, OG_SIZE, OgCard } from "@/components/og-card";

export const alt = "bateCarimbo — Gerador de Placa de Veículos (Mercosul e antiga)";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        badge="MERCOSUL · ABC1D23"
        subtitle="Gerador de Placa de Veículos — Mercosul e antiga"
        sample={[
          { text: "ABC", color: ink.foreground },
          { text: "1D23", color: ink.primary },
        ]}
      />
    ),
    { ...size },
  );
}
