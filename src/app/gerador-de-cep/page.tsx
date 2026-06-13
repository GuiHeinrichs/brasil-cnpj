import type { Metadata } from "next";

import {
  CepFormatterPanel,
  CepGeneratorPanel,
  CepLocatorPanel,
} from "@/components/cep/panels";
import { CEP_SEGMENTS } from "@/components/cep/segments";
import { CopyableCode, SectionLabel } from "@/components/docs";
import {
  AnatomySection,
  DocsWarning,
  FaqSection,
  OfficialLinksSection,
} from "@/components/doc-tool/reference";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CEP_LENGTH,
  CEP_MASKED_REGEX,
  CEP_REGEX,
  CEP_UFS,
  mask,
  MAX_BATCH_SIZE,
} from "@/lib/cep";
import { CEP_FAQ } from "@/lib/faq";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de CEP por estado — faixas oficiais dos Correios";
const PAGE_DESCRIPTION =
  "Gere CEPs válidos por estado para testes, grátis e em lote, dentro das faixas oficiais dos Correios. Localize a UF de um CEP e aplique ou remova a máscara 00000-000.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-cep",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-cep",
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
  name: "Gerador de CEP",
  path: "/gerador-de-cep",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de CEP por estado em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Faixas oficiais de CEP dos Correios por UF",
    "Localização da UF a partir do CEP",
    "Formatação e remoção da máscara 00000-000",
  ],
});

function formatCepNumber(value: number): string {
  return mask(String(value).padStart(CEP_LENGTH, "0"));
}

export default function GeradorDeCep() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(CEP_FAQ)} />

      <SiteHeader
        active="cep"
        badge="Faixas oficiais dos Correios"
        heading="Gerador de CEP por estado — com localização de UF, formatador e geração em lote para testes de software."
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="locator">Localizar UF</TabsTrigger>
          <TabsTrigger value="formatter">Formatador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <CepGeneratorPanel />
        </TabsContent>

        <TabsContent value="locator" className="mt-5">
          <CepLocatorPanel />
        </TabsContent>

        <TabsContent value="formatter" className="mt-5">
          <CepFormatterPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Os CEPs gerados caem dentro da faixa correta de cada estado, mas são
            sorteados ao acaso e podem não corresponder a um logradouro real.
            Use apenas para testes de software.
          </DocsWarning>

          <AnatomySection
            title="Anatomia do CEP"
            sample="01310-100"
            segments={CEP_SEGMENTS}
            length={CEP_LENGTH}
            details={[
              "Prefixo: região, sub-região, setor, subsetor e divisor.",
              "Sufixo: identifica o logradouro ou a unidade de distribuição.",
            ]}
          />

          <div className="space-y-3">
            <SectionLabel>Regex</SectionLabel>
            <CopyableCode value={CEP_REGEX.source} label="Regex sem máscara" />
            <CopyableCode
              value={CEP_MASKED_REGEX.source}
              label="Regex com máscara"
            />
          </div>

          <div className="space-y-3">
            <SectionLabel>Faixas de CEP por estado</SectionLabel>
            <div className="overflow-hidden rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left">
                    <th className="px-4 py-2 font-medium">UF</th>
                    <th className="px-4 py-2 font-medium">Estado</th>
                    <th className="px-4 py-2 text-right font-medium">Faixa</th>
                  </tr>
                </thead>
                <tbody>
                  {CEP_UFS.map((entry) => (
                    <tr key={entry.uf} className="border-b last:border-0">
                      <td className="px-4 py-2 font-mono">{entry.uf}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {entry.name}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-[11px] text-muted-foreground sm:text-xs">
                        {entry.ranges
                          .map(
                            ([start, end]) =>
                              `${formatCepNumber(start)}–${formatCepNumber(end)}`,
                          )
                          .join(" · ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <FaqSection items={CEP_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "Correios — Busca CEP",
                href: "https://buscacepinter.correios.com.br/",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
