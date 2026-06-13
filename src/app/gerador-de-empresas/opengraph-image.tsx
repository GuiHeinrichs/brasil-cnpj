import { ImageResponse } from "next/og";

import { ink, OG_SIZE, OgCard } from "@/components/og-card";

export const alt = "bateCarimbo — Gerador de Empresas com razão social e CNPJ";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        badge="RAZÃO SOCIAL · CNPJ · ENDEREÇO"
        subtitle="Gerador de Empresas — razão social, CNPJ e endereço fictícios"
        sample={[
          { text: "Oliveira ", color: ink.foreground },
          { text: "Tecnologia LTDA", color: ink.primary },
        ]}
      />
    ),
    { ...size },
  );
}
