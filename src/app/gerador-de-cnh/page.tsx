import type { Metadata } from "next";

import { CnhGeneratorPanel, CnhValidatorPanel } from "@/components/cnh/panels";
import { CNH_SEGMENTS } from "@/components/cnh/segments";
import { CopyableCode, SectionLabel } from "@/components/docs";
import {
  AlgorithmSection,
  AnatomySection,
  DocsWarning,
  FaqSection,
  OfficialLinksSection,
} from "@/components/doc-tool/reference";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CNH_LENGTH, CNH_REGEX, MAX_BATCH_SIZE } from "@/lib/cnh";
import { CNH_FAQ } from "@/lib/faq";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de CNH válida — em lote para testes";
const PAGE_DESCRIPTION =
  "Gere números de CNH válidos para testes, grátis e em lote. Valide os dois dígitos verificadores (módulo 11) na mesma ferramenta.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-cnh",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-cnh",
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
  name: "Gerador de CNH",
  path: "/gerador-de-cnh",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de CNH válida em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Validação dos dois dígitos verificadores (módulo 11)",
    "Números compatíveis com as duas famílias de validadores",
  ],
});

export default function GeradorDeCnh() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(CNH_FAQ)} />

      <SiteHeader
        active="cnh"
        badge="Dois DVs · módulo 11"
        heading="Gerador de CNH válida — com validador e geração em lote para testes de software."
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <CnhGeneratorPanel />
        </TabsContent>

        <TabsContent value="validator" className="mt-5">
          <CnhValidatorPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Números de CNH gerados nesta ferramenta são fictícios e destinados
            exclusivamente a testes de software. Não correspondem a condutores
            reais.
          </DocsWarning>

          <AnatomySection
            title="Anatomia da CNH"
            sample="12345678900"
            segments={CNH_SEGMENTS}
            length={CNH_LENGTH}
            details={[
              "Número de registro nacional: nove dígitos, sempre numéricos.",
              "Dígitos verificadores: dois cálculos de módulo 11 sobre a base.",
            ]}
          />

          <div className="space-y-3">
            <SectionLabel>Regex</SectionLabel>
            <CopyableCode value={CNH_REGEX.source} label="Regex da CNH" />
          </div>

          <AlgorithmSection
            intro={
              <>
                Base <code className="font-mono text-foreground">123456789</code>{" "}
                → DV <code className="font-mono text-foreground">00</code> → CNH{" "}
                <code className="font-mono text-foreground">12345678900</code>
              </>
            }
            steps={[
              "Multiplicar os 9 dígitos pelos pesos 9 a 1, da esquerda para a direita; o resto da soma ÷ 11 é o 1º DV (resto 10 vira 0).",
              "Multiplicar os mesmos 9 dígitos pelos pesos 1 a 9; o resto da soma ÷ 11 é o 2º DV (resto 10 vira 0).",
              "Quando o 1º resto é 10, o 2º DV sofre desconto de 2 — regra em que validadores divergem.",
            ]}
            note="O gerador evita as bases com resto 10 no primeiro cálculo, então todo número gerado passa nas duas famílias de validadores."
          />

          <FaqSection items={CNH_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "Portal de Serviços do SENATRAN",
                href: "https://portalservicos.senatran.serpro.gov.br/",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
