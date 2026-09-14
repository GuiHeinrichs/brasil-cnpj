import type { Metadata } from "next";

import { DocsSection } from "@/components/cnpj/docs-section";
import { FormatterPanel } from "@/components/cnpj/formatter-panel";
import { GeneratorPanel } from "@/components/cnpj/generator-panel";
import { ValidatorPanel } from "@/components/cnpj/validator-panel";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToolsSection } from "@/components/tools-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MAX_BATCH_SIZE } from "@/lib/cnpj";
import { CNPJ_FAQ } from "@/lib/faq";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_TITLE = "Gerador de CNPJ numérico e alfanumérico para testes";
const PAGE_DESCRIPTION = `Gere CNPJs com dígitos verificadores corretos nos formatos numérico e alfanumérico, em lotes de até ${MAX_BATCH_SIZE}. Valide, aplique ou remova a máscara e entenda raiz, ordem e o cálculo do DV.`;

export const metadata: Metadata = {
  // O template `%s | bateCarimbo` do layout não se aplica ao segmento raiz,
  // então a marca entra explicitamente aqui.
  title: `${PAGE_TITLE} | ${SITE_NAME}`,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
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

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: PAGE_DESCRIPTION,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  inLanguage: "pt-BR",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  featureList: [
    `Geração de CNPJ válido em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Suporte aos formatos numérico (legado) e alfanumérico (novo)",
    "Validação de dígitos verificadores",
    "Formatação e remoção de máscara",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CNPJ_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd} />

      <SiteHeader
        active="cnpj"
        badge="Numérico e alfanumérico · módulo 11"
        heading="Gerador de CNPJ (numérico e alfanumérico)"
        lead={
          <>
            Monta CNPJs com os dois dígitos verificadores corretos nos dois
            formatos, em lotes de até {MAX_BATCH_SIZE}. As abas de validador e
            formatador trabalham sobre números que você já tem: conferem o DV,
            aplicam a máscara <code className="font-mono">00.000.000/0000-00</code>{" "}
            ou a removem.
          </>
        }
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
          <TabsTrigger value="formatter">Formatador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <GeneratorPanel />
        </TabsContent>

        <TabsContent value="validator" className="mt-5">
          <ValidatorPanel />
        </TabsContent>

        <TabsContent value="formatter" className="mt-5">
          <FormatterPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <DocsSection />
      </div>

      <div className="mt-14">
        <ToolsSection exclude="cnpj" />
      </div>

      <SiteFooter />
    </div>
  );
}
