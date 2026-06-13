import type { Metadata } from "next";

import { DocsWarning, FaqSection } from "@/components/doc-tool/reference";
import { JsonLd } from "@/components/json-ld";
import { NomeGeneratorPanel } from "@/components/nome/panels";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { NOME_FAQ } from "@/lib/faq";
import { MAX_BATCH_SIZE } from "@/lib/nome";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de Nomes brasileiros — masculinos e femininos, em lote";
const PAGE_DESCRIPTION =
  "Gere nomes brasileiros aleatórios para testes, mockups e protótipos. Filtre por sexo, gere em lote e copie individualmente ou tudo de uma vez. Grátis.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-nomes",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-nomes",
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
  name: "Gerador de Nomes",
  path: "/gerador-de-nomes",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de nomes brasileiros em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Filtro por sexo (masculino, feminino ou aleatório)",
    "Prenome com um ou dois sobrenomes",
  ],
});

export default function GeradorDeNomes() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(NOME_FAQ)} />

      <SiteHeader
        active="nomes"
        badge="Nomes brasileiros · por sexo"
        heading="Gerador de Nomes brasileiros — masculinos e femininos, em lote para testes, mockups e protótipos."
      />

      <div className="mt-8">
        <NomeGeneratorPanel />
      </div>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Os nomes são combinações aleatórias de prenomes e sobrenomes comuns,
            destinadas a testes de software. Qualquer coincidência com pessoas
            reais é casual.
          </DocsWarning>

          <FaqSection items={NOME_FAQ} />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
