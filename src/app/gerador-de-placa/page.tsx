import type { Metadata } from "next";

import { CopyableCode, SectionLabel } from "@/components/docs";
import {
  AnatomySection,
  DocsWarning,
  FaqSection,
  OfficialLinksSection,
} from "@/components/doc-tool/reference";
import { JsonLd } from "@/components/json-ld";
import {
  PlacaGeneratorPanel,
  PlacaValidatorPanel,
} from "@/components/placa/panels";
import { PLACA_SEGMENTS } from "@/components/placa/segments";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLACA_FAQ } from "@/lib/faq";
import {
  MAX_BATCH_SIZE,
  PLACA_ANTIGA_REGEX,
  PLACA_LENGTH,
  PLACA_MERCOSUL_REGEX,
} from "@/lib/placa";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de Placa de Veículos — Mercosul e antiga, em lote";
const PAGE_DESCRIPTION =
  "Gere placas de veículos para testes, grátis e em lote, no padrão Mercosul (ABC1D23) ou antigo (ABC-1234). Valide o formato e identifique o padrão de cada placa.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-placa",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-placa",
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
  name: "Gerador de Placa de Veículos",
  path: "/gerador-de-placa",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de placas em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Padrão Mercosul (ABC1D23) e antigo (ABC-1234)",
    "Validação de formato com identificação do padrão",
  ],
});

export default function GeradorDePlaca() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(PLACA_FAQ)} />

      <SiteHeader
        active="placa"
        badge="Mercosul · ABC1D23"
        heading="Gerador de Placa de Veículos — padrão Mercosul e antigo, com validador e geração em lote para testes de software."
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <PlacaGeneratorPanel />
        </TabsContent>

        <TabsContent value="validator" className="mt-5">
          <PlacaValidatorPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            As placas geradas são combinações aleatórias e fictícias, destinadas
            exclusivamente a testes de software. Não correspondem a veículos
            emplacados.
          </DocsWarning>

          <AnatomySection
            title="Anatomia da placa"
            sample="ABC1D23"
            segments={PLACA_SEGMENTS}
            length={PLACA_LENGTH}
            details={[
              "Letras: três letras iniciais, em ambos os padrões.",
              "Identificador: no Mercosul, número-letra-número-número; no antigo, quatro números.",
            ]}
          />

          <div className="space-y-3">
            <SectionLabel>Regex</SectionLabel>
            <CopyableCode
              value={PLACA_MERCOSUL_REGEX.source}
              label="Regex Mercosul"
            />
            <CopyableCode
              value={PLACA_ANTIGA_REGEX.source}
              label="Regex antiga"
            />
          </div>

          <div className="space-y-3">
            <SectionLabel>Conversão antiga → Mercosul</SectionLabel>
            <p className="text-sm text-muted-foreground">
              Na migração, o segundo número (quinta posição) vira uma letra pela
              tabela{" "}
              <code className="font-mono text-foreground">0=A 1=B 2=C … 9=J</code>.
              Assim, <code className="font-mono text-foreground">ABC-1234</code>{" "}
              corresponde a{" "}
              <code className="font-mono text-foreground">ABC1C34</code> — letras
              e demais números não mudam.
            </p>
          </div>

          <FaqSection items={PLACA_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "Gov.br — Placa de Identificação Veicular (Mercosul)",
                href: "https://www.gov.br/pt-br/servicos/emitir-placa-de-identificacao-veicular",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
