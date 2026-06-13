import type { Metadata } from "next";

import {
  CartaoFormatterPanel,
  CartaoGeneratorPanel,
  CartaoValidatorPanel,
} from "@/components/cartao-credito/panels";
import { CARTAO_SEGMENTS } from "@/components/cartao-credito/segments";
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
import {
  CARTAO_LENGTH,
  CARTAO_MASKED_REGEX,
  CARTAO_REGEX,
  MAX_BATCH_SIZE,
} from "@/lib/cartao-credito";
import { CARTAO_FAQ } from "@/lib/faq";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de Cartão de Crédito válido — Visa, Mastercard, Elo e Hipercard";
const PAGE_DESCRIPTION =
  "Gere números de cartão de crédito de teste, grátis e em lote, com dígito de Luhn válido. Escolha a bandeira (Visa, Mastercard, Elo, Hipercard), valide e formate. Apenas para testes — sem saldo.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-cartao-de-credito",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-cartao-de-credito",
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
  name: "Gerador de Cartão de Crédito",
  path: "/gerador-de-cartao-de-credito",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de cartões válidos (Luhn) em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Bandeiras Visa, Mastercard, Elo e Hipercard",
    "Validação pelo algoritmo de Luhn com detecção de bandeira",
    "Formatação em blocos de 4 dígitos",
  ],
});

export default function GeradorDeCartaoDeCredito() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(CARTAO_FAQ)} />

      <SiteHeader
        active="cartao"
        badge="Algoritmo de Luhn · 16 dígitos"
        heading="Gerador de Cartão de Crédito de teste — Visa, Mastercard, Elo e Hipercard, com validador e formatador para testes de software."
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
          <TabsTrigger value="formatter">Formatador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <CartaoGeneratorPanel />
        </TabsContent>

        <TabsContent value="validator" className="mt-5">
          <CartaoValidatorPanel />
        </TabsContent>

        <TabsContent value="formatter" className="mt-5">
          <CartaoFormatterPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Os números gerados são fictícios e só satisfazem o algoritmo de Luhn
            e os prefixos das bandeiras. Não têm saldo, não passam em autorização
            e servem exclusivamente para testes de software.
          </DocsWarning>

          <AnatomySection
            title="Anatomia do cartão"
            sample="4111 1111 1111 1111"
            segments={CARTAO_SEGMENTS}
            length={CARTAO_LENGTH}
            details={[
              "BIN/IIN: os 6 primeiros dígitos identificam a bandeira e o emissor.",
              "Número da conta: dígitos definidos pelo emissor do cartão.",
              "Dígito verificador: fecha o número pelo algoritmo de Luhn.",
            ]}
          />

          <div className="space-y-3">
            <SectionLabel>Regex</SectionLabel>
            <CopyableCode value={CARTAO_REGEX.source} label="Regex sem máscara" />
            <CopyableCode
              value={CARTAO_MASKED_REGEX.source}
              label="Regex com espaços"
            />
          </div>

          <AlgorithmSection
            intro={
              <>
                Base{" "}
                <code className="font-mono text-foreground">411111111111111</code>{" "}
                → DV <code className="font-mono text-foreground">1</code> → cartão{" "}
                <code className="font-mono text-foreground">4111 1111 1111 1111</code>
              </>
            }
            steps={[
              "Da direita para a esquerda, dobre cada segundo dígito; se o resultado passar de 9, subtraia 9.",
              "Some todos os dígitos — os dobrados e os demais.",
              "O dígito verificador é o valor que leva a soma ao próximo múltiplo de 10.",
            ]}
            note="A bandeira é identificada pelos primeiros dígitos (BIN): 4 para Visa, 51–55 e 2221–2720 para Mastercard, e prefixos específicos para Elo e Hipercard."
          />

          <FaqSection items={CARTAO_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "ABECS — entidade das bandeiras e credenciadoras",
                href: "https://www.abecs.org.br/",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
