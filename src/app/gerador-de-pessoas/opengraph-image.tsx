import { ImageResponse } from "next/og";

import { ink, OG_SIZE, OgCard } from "@/components/og-card";

export const alt = "bateCarimbo — Gerador de Pessoas com CPF, RG e endereço";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        badge="FICHA COERENTE POR ESTADO"
        subtitle="Gerador de Pessoas — CPF, RG, endereço e contato fictícios"
        sample={[
          { text: "João Silva ", color: ink.foreground },
          { text: "· CPF · RG · CEP", color: ink.primary },
        ]}
      />
    ),
    { ...size },
  );
}
