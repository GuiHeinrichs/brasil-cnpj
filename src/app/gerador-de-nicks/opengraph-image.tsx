import { ImageResponse } from "next/og";

import { ink, OG_SIZE, OgCard } from "@/components/og-card";

export const alt = "bateCarimbo — Gerador de Nicks e usernames";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        badge="JOGOS · REDES SOCIAIS"
        subtitle="Gerador de Nicks e usernames — com estilos, em lote"
        sample={[
          { text: "Shadow", color: ink.foreground },
          { text: "Dragon", color: ink.primary },
          { text: "47", color: ink.gold },
        ]}
      />
    ),
    { ...size },
  );
}
