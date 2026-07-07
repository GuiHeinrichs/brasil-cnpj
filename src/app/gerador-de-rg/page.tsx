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
  RgFormatterPanel,
  RgGeneratorPanel,
  RgValidatorPanel,
} from "@/components/rg/panels";
import { RG_SEGMENTS } from "@/components/rg/segments";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RG_FAQ } from "@/lib/faq";
import { MAX_BATCH_SIZE, RG_LENGTH, RG_MASKED_REGEX, RG_REGEX } from "@/lib/rg";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de RG válido — padrão SSP-SP em lote para testes";
const PAGE_DESCRIPTION =
  "Gere números de RG (padrão SSP-SP) válidos para testes, grátis e em lote. Valide o dígito verificador (módulo 11) e aplique ou remova a máscara 00.000.000-0.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-rg",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-rg",
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
  name: "Gerador de RG",
  path: "/gerador-de-rg",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de RG válido em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Padrão SSP-SP com dígito verificador por módulo 11",
    "Validação e formatação da máscara 00.000.000-0",
  ],
});

export default function GeradorDeRg() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(RG_FAQ)} />

      <SiteHeader
        active="rg"
        badge="Padrão SSP-SP · módulo 11"
        heading="Gerador de RG válido — com validador, formatador e geração em lote para testes de software."
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
          <TabsTrigger value="formatter">Formatador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <RgGeneratorPanel />
        </TabsContent>

        <TabsContent value="validator" className="mt-5">
          <RgValidatorPanel />
        </TabsContent>

        <TabsContent value="formatter" className="mt-5">
          <RgFormatterPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Números de RG gerados nesta ferramenta são fictícios e destinados
            exclusivamente a testes de software. Não correspondem a documentos
            reais nem constam em nenhuma Secretaria de Segurança Pública.
          </DocsWarning>

          <GuideSection title="Por que o RG não tem um padrão único">
            <p>
              Ao contrário do CPF, o Registro Geral não é nacional: cada estado
              emite o RG pela sua Secretaria de Segurança Pública, com numeração,
              tamanho e regra de dígito verificador próprios. Uma pessoa pode
              inclusive ter mais de um RG, emitido em estados diferentes. Isso faz
              com que não exista uma fórmula única de validação — o número que é
              válido em São Paulo pode não seguir a regra de outro estado.
            </p>
            <p>
              Esta ferramenta adota o <strong>padrão da SSP-SP</strong>, o mais
              difundido e o que a maioria dos validadores online implementa: oito
              dígitos de base mais um dígito verificador calculado por módulo 11,
              que pode assumir os valores de 0 a 9 ou <strong>X</strong> quando o
              resultado é 10. A máscara usual de exibição é{" "}
              <code className="font-mono text-foreground">00.000.000-0</code>.
            </p>
            <p>
              Vale registrar que o RG está sendo gradualmente substituído pela{" "}
              <strong>CIN</strong> (Carteira de Identidade Nacional), que unifica o
              documento em todo o país usando o número do CPF como identificador.
              Enquanto a transição não termina, o RG no formato SSP-SP continua
              amplamente pedido em cadastros — e gerar números fictícios com DV
              correto é a maneira de testar esses formulários sem manipular a
              identidade de pessoas reais.
            </p>
          </GuideSection>

          <AnatomySection
            title="Anatomia do RG"
            sample="24.598.973-0"
            segments={RG_SEGMENTS}
            length={RG_LENGTH}
            details={[
              "Base: oito dígitos do número de registro geral.",
              "Dígito verificador: módulo 11 sobre a base; pode ser 0-9 ou X.",
            ]}
          />

          <div className="space-y-3">
            <SectionLabel>Regex</SectionLabel>
            <CopyableCode value={RG_REGEX.source} label="Regex sem máscara" />
            <CopyableCode
              value={RG_MASKED_REGEX.source}
              label="Regex com máscara"
            />
          </div>

          <AlgorithmSection
            intro={
              <>
                Base <code className="font-mono text-foreground">24598973</code> →
                DV <code className="font-mono text-foreground">0</code> → RG
                formatado{" "}
                <code className="font-mono text-foreground">24.598.973-0</code>
              </>
            }
            steps={[
              "Multiplicar os 8 dígitos pelos pesos 2, 3, 4, 5, 6, 7, 8 e 9, da esquerda para a direita.",
              "Somar os produtos e calcular o resto da divisão por 11.",
              "DV = 11 − resto; resultado 10 vira X e 11 vira 0.",
            ]}
            note="O RG é emitido por cada estado com regras próprias. Esta ferramenta usa a convenção da SSP-SP, a mais difundida entre os validadores."
          />

          <FaqSection items={RG_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "Poupatempo — RG em São Paulo",
                href: "https://www.poupatempo.sp.gov.br/",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
