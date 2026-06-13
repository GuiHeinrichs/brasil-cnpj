import type { Metadata } from "next";

import { DocsSection } from "@/components/cpf/docs-section";
import { FormatterPanel } from "@/components/cpf/formatter-panel";
import { GeneratorPanel } from "@/components/cpf/generator-panel";
import { ValidatorPanel } from "@/components/cpf/validator-panel";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToolsSection } from "@/components/tools-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MAX_BATCH_SIZE } from "@/lib/cpf";
import { CPF_FAQ } from "@/lib/faq";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_TITLE = "Gerador de CPF válido — por região fiscal e em lote";
const PAGE_DESCRIPTION =
  "Gere CPFs válidos para testes, grátis e em lote, escolhendo a região fiscal (estado). Valide os dígitos verificadores e aplique ou remova a máscara.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-cpf",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-cpf",
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
  name: `Gerador de CPF — ${SITE_NAME}`,
  url: `${SITE_URL}/gerador-de-cpf`,
  description: PAGE_DESCRIPTION,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  inLanguage: "pt-BR",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  featureList: [
    `Geração de CPF válido em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Escolha da região fiscal (9º dígito) para gerar CPF por estado",
    "Validação de dígitos verificadores com detecção da região fiscal",
    "Formatação e remoção de máscara",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CPF_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function GeradorDeCpf() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd} />

      <SiteHeader
        active="cpf"
        badge="Região fiscal no 9º dígito"
        heading="Gerador de CPF válido por região fiscal — com validador, formatador e geração em lote para testes de software."
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
        <ToolsSection exclude="cpf" />
      </div>

      <SiteFooter />
    </div>
  );
}
