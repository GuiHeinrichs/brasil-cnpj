import type { Metadata } from "next";

import { DocsWarning, FaqSection } from "@/components/doc-tool/reference";
import { SectionLabel } from "@/components/docs";
import { JsonLd } from "@/components/json-ld";
import { NickGeneratorPanel } from "@/components/nick/panels";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { NICK_FAQ } from "@/lib/faq";
import { MAX_BATCH_SIZE } from "@/lib/nick";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de Nicks e usernames — para jogos e redes sociais";
const PAGE_DESCRIPTION =
  "Gere nicks, apelidos e nomes de usuário para jogos e redes sociais. Estilos com números, leet e underscore, em lote e grátis.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-nicks",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-nicks",
    siteName: SITE_NAME,
    locale: "pt_BR",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const webApplicationJsonLd = toolJsonLd({
  name: "Gerador de Nicks",
  path: "/gerador-de-nicks",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de nicks em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Estilos limpo, com números, leet e underscore",
    "Cópia individual ou em lote",
  ],
});

const STYLES = [
  {
    name: "Limpo",
    example: "DarkWolf",
    description:
      "Duas palavras concatenadas com iniciais maiúsculas. Legível e aceito na maioria das plataformas que não permitem números.",
  },
  {
    name: "Com números",
    example: "DarkWolf42",
    description:
      "Nick limpo acrescido de dois dígitos aleatórios no final. Útil quando o nick sem números já está tomado ou a plataforma exige ao menos um dígito.",
  },
  {
    name: "Leet",
    example: "D4rkW0lf",
    description:
      "Substituição de letras por números visualmente parecidos (A→4, E→3, I→1, O→0). Convenção clássica de comunidades de jogos e fóruns dos anos 1990.",
  },
  {
    name: "Underscore",
    example: "dark_wolf_07",
    description:
      "Palavras em minúsculas separadas por underscore com dois dígitos. Padrão comum em APIs, sistemas e plataformas que tratam usernames como identificadores técnicos.",
  },
];

export default function GeradorDeNicks() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(NICK_FAQ)} />

      <SiteHeader
        active="nicks"
        badge="Jogos · redes sociais"
        heading="Gerador de Nicks e usernames — apelidos para jogos e redes sociais, com estilos e geração em lote."
      />

      <div className="mt-8">
        <NickGeneratorPanel />
      </div>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Os nicks são apenas sugestões geradas ao acaso. A ferramenta não
            verifica disponibilidade em nenhuma plataforma — confirme antes de
            usar.
          </DocsWarning>

          <div className="space-y-4">
            <SectionLabel>Os quatro estilos explicados</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {STYLES.map((style) => (
                <div key={style.name} className="rounded-xl border bg-card p-4">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-semibold">{style.name}</h3>
                    <code className="font-mono text-[11px] text-muted-foreground">
                      {style.example}
                    </code>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {style.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <SectionLabel>Quando usar cada estilo</SectionLabel>
            <p className="text-sm text-muted-foreground">
              Use o estilo <strong className="font-medium text-foreground">Limpo</strong> para
              plataformas corporativas e sistemas de gestão. Use{" "}
              <strong className="font-medium text-foreground">Com números</strong> quando
              a plataforma requer ao menos um dígito no username. Use{" "}
              <strong className="font-medium text-foreground">Leet</strong> para
              ambientes de jogos e comunidades gamer. Use{" "}
              <strong className="font-medium text-foreground">Underscore</strong> para
              testes de API e sistemas que tratam o username como um slug técnico.
              A opção <strong className="font-medium text-foreground">Aleatório</strong> mistura
              todos os estilos, útil para popular bancos de dados com diversidade
              de formatos.
            </p>
          </div>

          <FaqSection items={NICK_FAQ} />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
