import type { Metadata } from "next";

import { CopyableCode, SectionLabel } from "@/components/docs";
import {
  AlgorithmSection,
  AnatomySection,
  DocsWarning,
  FaqSection,
  OfficialLinksSection,
} from "@/components/doc-tool/reference";
import { JsonLd } from "@/components/json-ld";
import {
  PisFormatterPanel,
  PisGeneratorPanel,
  PisValidatorPanel,
} from "@/components/pis/panels";
import { PIS_SEGMENTS } from "@/components/pis/segments";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PIS_FAQ } from "@/lib/faq";
import { MAX_BATCH_SIZE, PIS_LENGTH, PIS_MASKED_REGEX, PIS_REGEX } from "@/lib/pis";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de PIS/PASEP válido — em lote para testes";
const PAGE_DESCRIPTION =
  "Gere números de PIS/PASEP (NIS/NIT) válidos para testes, grátis e em lote. Valide o dígito verificador e aplique ou remova a máscara 999.99999.99-9.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-pis",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-pis",
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
  name: "Gerador de PIS/PASEP",
  path: "/gerador-de-pis",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de PIS/PASEP válido em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Validação do dígito verificador (módulo 11)",
    "Formatação e remoção da máscara 999.99999.99-9",
  ],
});

export default function GeradorDePis() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(PIS_FAQ)} />

      <SiteHeader
        active="pis"
        badge="Mesmo número do NIS/NIT"
        heading="Gerador de PIS/PASEP válido — com validador, formatador e geração em lote para testes de software."
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
          <TabsTrigger value="formatter">Formatador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <PisGeneratorPanel />
        </TabsContent>

        <TabsContent value="validator" className="mt-5">
          <PisValidatorPanel />
        </TabsContent>

        <TabsContent value="formatter" className="mt-5">
          <PisFormatterPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Números de PIS gerados nesta ferramenta são fictícios e destinados
            exclusivamente a testes de software. Não correspondem a
            trabalhadores reais.
          </DocsWarning>

          <AnatomySection
            title="Anatomia do PIS"
            sample="120.16619.18-1"
            segments={PIS_SEGMENTS}
            length={PIS_LENGTH}
            details={[
              "Número de Identificação Social: dez dígitos do cadastro.",
              "Dígito verificador: módulo 11 sobre a base.",
            ]}
          />

          <div className="space-y-3">
            <SectionLabel>Regex</SectionLabel>
            <CopyableCode value={PIS_REGEX.source} label="Regex sem máscara" />
            <CopyableCode
              value={PIS_MASKED_REGEX.source}
              label="Regex com máscara"
            />
          </div>

          <AlgorithmSection
            intro={
              <>
                Base{" "}
                <code className="font-mono text-foreground">1201661918</code> →
                DV <code className="font-mono text-foreground">1</code> → PIS
                formatado{" "}
                <code className="font-mono text-foreground">120.16619.18-1</code>
              </>
            }
            steps={[
              "Multiplicar os 10 dígitos pelos pesos 3, 2, 9, 8, 7, 6, 5, 4, 3 e 2, da esquerda para a direita.",
              "Somar os produtos e calcular o resto da divisão por 11.",
              "DV = 11 − resto; resultados 10 e 11 viram 0.",
            ]}
          />

          <FaqSection items={PIS_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "Meu INSS — consulta ao cadastro (CNIS)",
                href: "https://meu.inss.gov.br/",
              },
              {
                label: "Caixa — PIS",
                href: "https://www.caixa.gov.br/beneficios-programas/pis/",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
