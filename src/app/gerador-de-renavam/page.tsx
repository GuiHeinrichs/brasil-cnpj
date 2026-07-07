import type { Metadata } from "next";

import { CopyableCode, SectionLabel } from "@/components/docs";
import {
  AlgorithmSection,
  AnatomySection,
  DocsWarning,
  FaqSection,
  GuideSection,
  OfficialLinksSection,
} from "@/components/doc-tool/reference";
import { JsonLd } from "@/components/json-ld";
import {
  RenavamGeneratorPanel,
  RenavamValidatorPanel,
} from "@/components/renavam/panels";
import { RENAVAM_SEGMENTS } from "@/components/renavam/segments";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RENAVAM_FAQ } from "@/lib/faq";
import { MAX_BATCH_SIZE, RENAVAM_LENGTH, RENAVAM_REGEX } from "@/lib/renavam";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de RENAVAM válido — em lote para testes";
const PAGE_DESCRIPTION =
  "Gere números de RENAVAM válidos para testes, grátis e em lote. Valide o dígito verificador, com suporte a números antigos de 9 dígitos.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-renavam",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-renavam",
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
  name: "Gerador de RENAVAM",
  path: "/gerador-de-renavam",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de RENAVAM válido em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Validação do dígito verificador (módulo 11)",
    "Suporte a números antigos de 9 dígitos (zeros à esquerda)",
  ],
});

export default function GeradorDeRenavam() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(RENAVAM_FAQ)} />

      <SiteHeader
        active="renavam"
        badge="11 dígitos desde 2013"
        heading="Gerador de RENAVAM válido — com validador e geração em lote para testes de software."
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <RenavamGeneratorPanel />
        </TabsContent>

        <TabsContent value="validator" className="mt-5">
          <RenavamValidatorPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            RENAVAMs gerados nesta ferramenta são fictícios e destinados
            exclusivamente a testes de software. Não correspondem a veículos
            reais.
          </DocsWarning>

          <GuideSection title="O que é o RENAVAM">
            <p>
              RENAVAM é a sigla do <strong>Registro Nacional de Veículos
              Automotores</strong>, a base mantida pelo Departamento Nacional de
              Trânsito que reúne todos os veículos licenciados no país. O número
              do RENAVAM identifica o veículo nesse cadastro de forma única e
              permanente: ele é atribuído no primeiro emplacamento e acompanha o
              carro por toda a vida útil, mesmo que a placa, o proprietário ou o
              estado de registro mudem. Não confunda com a placa nem com o número
              do chassi — são identificadores diferentes do mesmo veículo.
            </p>
            <p>
              Desde 2013 o RENAVAM tem onze dígitos: dez de base mais um dígito
              verificador por módulo 11. Veículos registrados antes dessa
              padronização tinham nove dígitos e continuam válidos; para
              compatibilizar, basta completar com zeros à esquerda até chegar aos
              onze. É por isso que um bom validador aceita tanto o formato antigo
              quanto o novo.
            </p>
            <p>
              O número é exigido em praticamente toda operação de trânsito:
              licenciamento anual, pagamento de IPVA, transferência de
              propriedade, consulta de multas e comunicação de venda. Em
              desenvolvimento, ele aparece em sistemas de despachantes,
              seguradoras, revendas e marketplaces de veículos. Gerar RENAVAMs
              fictícios com DV correto permite popular esses cadastros e testar as
              máscaras de entrada sem usar dados de veículos reais.
            </p>
          </GuideSection>

          <AnatomySection
            title="Anatomia do RENAVAM"
            sample="12345678900"
            segments={RENAVAM_SEGMENTS}
            length={RENAVAM_LENGTH}
            details={[
              "Número do registro nacional do veículo: dez dígitos.",
              "Dígito verificador: módulo 11 sobre a base.",
            ]}
          />

          <div className="space-y-3">
            <SectionLabel>Regex</SectionLabel>
            <CopyableCode value={RENAVAM_REGEX.source} label="Regex do RENAVAM" />
          </div>

          <AlgorithmSection
            intro={
              <>
                Base{" "}
                <code className="font-mono text-foreground">1234567890</code> →
                DV <code className="font-mono text-foreground">0</code> →
                RENAVAM{" "}
                <code className="font-mono text-foreground">12345678900</code>
              </>
            }
            steps={[
              "Multiplicar os 10 dígitos pelos pesos 3, 2, 9, 8, 7, 6, 5, 4, 3 e 2, da esquerda para a direita.",
              "Somar os produtos e multiplicar a soma por 10.",
              "DV = resto da divisão por 11; resto 10 vira 0.",
            ]}
            note="Números anteriores a 2013 tinham 9 dígitos e continuam válidos com zeros à esquerda — o Validador completa automaticamente."
          />

          <FaqSection items={RENAVAM_FAQ} />

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
