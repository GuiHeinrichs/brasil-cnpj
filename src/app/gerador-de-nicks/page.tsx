import type { Metadata } from "next";

import { DocsWarning, FaqSection } from "@/components/doc-tool/reference";
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

          <FaqSection items={NICK_FAQ} />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
