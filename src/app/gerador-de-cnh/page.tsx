import type { Metadata } from "next";

import { CnhGeneratorPanel, CnhValidatorPanel } from "@/components/cnh/panels";
import { CNH_SEGMENTS } from "@/components/cnh/segments";
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

          <GuideSection title="Para que serve o gerador de CNH">
            <p>
              A Carteira Nacional de Habilitação tem um{" "}
              <strong>número de registro nacional</strong> de 11 dígitos, que é
              o identificador único do condutor no cadastro do SENATRAN e
              acompanha a pessoa por toda a vida, mesmo quando a via física é
              renovada. Ele não deve ser confundido com o número do documento
              (número do espelho), que muda a cada emissão, nem com o número de
              segurança impresso no verso da carteira — esses três campos
              existem no cartão, mas apenas o registro tem dígitos verificadores
              calculados por fórmula.
            </p>
            <p>
              O número é formado por nove dígitos de base mais dois dígitos
              verificadores obtidos por dois cálculos de módulo 11. A categoria
              da habilitação (A para motos, B para carros, C, D e E para veículos
              de carga e transporte de passageiros, além das combinações como
              AB) não faz parte do número: é um atributo separado do cadastro.
              Por isso um gerador de CNH produz apenas o registro numérico
              válido, sem vincular categoria, validade ou pontuação.
            </p>
            <p>
              Na prática, esses números servem para preencher cadastros de
              motoristas em aplicativos de mobilidade e entrega, telas de
              conferência de documentos, importações de planilhas e testes
              automatizados que exigem um registro com DV correto. Usar números
              fictícios em vez de CNHs reais mantém o ambiente de teste em
              conformidade com a LGPD e evita expor dados de pessoas verdadeiras
              em bases de desenvolvimento.
            </p>
          </GuideSection>

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
