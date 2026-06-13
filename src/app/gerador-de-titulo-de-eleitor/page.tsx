import type { Metadata } from "next";

import { SectionLabel } from "@/components/docs";
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
import {
  TituloGeneratorPanel,
  TituloValidatorPanel,
} from "@/components/titulo-eleitor/panels";
import { TITULO_SEGMENTS } from "@/components/titulo-eleitor/segments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TITULO_FAQ } from "@/lib/faq";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";
import { MAX_BATCH_SIZE, TITULO_LENGTH, TITULO_UFS } from "@/lib/titulo-eleitor";

const PAGE_TITLE = "Gerador de Título de Eleitor válido — por estado e em lote";
const PAGE_DESCRIPTION =
  "Gere títulos de eleitor válidos para testes, grátis e em lote, escolhendo a UF (dígitos 9–10). Valide os dígitos verificadores na mesma ferramenta.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-titulo-de-eleitor",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-titulo-de-eleitor",
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
  name: "Gerador de Título de Eleitor",
  path: "/gerador-de-titulo-de-eleitor",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de título de eleitor válido em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Escolha da UF (dígitos 9–10) para gerar título por estado",
    "Validação dos dígitos verificadores com detecção da UF",
    "Regra oficial do TSE, incluindo a exceção de SP e MG",
  ],
});

export default function GeradorDeTituloDeEleitor() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(TITULO_FAQ)} />

      <SiteHeader
        active="titulo"
        badge="UF nos dígitos 9–10"
        heading="Gerador de título de eleitor válido por UF — com validador e geração em lote para testes de software."
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <TituloGeneratorPanel />
        </TabsContent>

        <TabsContent value="validator" className="mt-5">
          <TituloValidatorPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Títulos gerados nesta ferramenta são fictícios e destinados
            exclusivamente a testes de software. Não correspondem a eleitores
            reais.
          </DocsWarning>

          <AnatomySection
            title="Anatomia do título"
            sample="1234 5678 2097"
            segments={TITULO_SEGMENTS}
            length={TITULO_LENGTH}
            details={[
              "Número sequencial de inscrição: oito dígitos.",
              "Código da UF de emissão — tabela abaixo.",
              "Dígitos verificadores: módulo 11 sobre sequencial e UF.",
            ]}
          />

          <div className="space-y-4">
            <SectionLabel>Códigos de UF</SectionLabel>
            <p className="text-sm text-muted-foreground">
              Os dígitos 9–10 revelam o estado de emissão. No Gerador, selecione
              a UF para criar títulos de um estado específico.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TITULO_UFS.map((entry) => (
                <div
                  key={entry.code}
                  className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2"
                >
                  <span className="font-mono text-sm font-medium text-primary">
                    {entry.code}
                  </span>
                  <span className="text-sm">{entry.uf}</span>
                </div>
              ))}
            </div>
          </div>

          <AlgorithmSection
            intro={
              <>
                Sequencial{" "}
                <code className="font-mono text-foreground">12345678</code> + UF{" "}
                <code className="font-mono text-foreground">20</code> (DF) → DV{" "}
                <code className="font-mono text-foreground">97</code> → título{" "}
                <code className="font-mono text-foreground">1234 5678 2097</code>
              </>
            }
            steps={[
              "Multiplicar os 8 dígitos do sequencial pelos pesos 2 a 9; o resto da soma ÷ 11 é o 1º DV (resto 10 vira 0).",
              "Multiplicar os 2 dígitos da UF e o 1º DV pelos pesos 7, 8 e 9; o resto da soma ÷ 11 é o 2º DV (resto 10 vira 0).",
              "Em títulos de SP (01) e MG (02), resto 0 vira 1 — exceção oficial do TSE.",
            ]}
            note="Nem todo validador implementa a exceção de SP/MG; o gerador evita os casos ambíguos, então os números passam nas duas interpretações."
          />

          <FaqSection items={TITULO_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "Autoatendimento eleitoral — TSE",
                href: "https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral",
              },
              {
                label: "Consulta de título e local de votação — TSE",
                href: "https://www.tse.jus.br/institucional/corregedoria-geral-eleitoral/sistemas-e-servicos-1/consulta-titulo-e-local-de-votacao",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
