import type { Metadata } from "next";
import Link from "next/link";

import {
  DocsWarning,
  FaqSection,
  GuideSection,
} from "@/components/doc-tool/reference";
import { SectionLabel } from "@/components/docs";
import { EmpresaGeneratorPanel } from "@/components/empresa/panels";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MAX_BATCH_SIZE } from "@/lib/empresa";
import { EMPRESA_FAQ } from "@/lib/faq";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de Empresas — razão social, CNPJ e endereço fictícios";
const PAGE_DESCRIPTION =
  "Gere empresas fictícias completas para testes: razão social, nome fantasia, CNPJ válido, natureza jurídica, e-mail, telefone e endereço por estado. Grátis e em lote.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-empresas",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-empresas",
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
  name: "Gerador de Empresas",
  path: "/gerador-de-empresas",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de empresas fictícias em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Razão social, nome fantasia e natureza jurídica",
    "CNPJ válido e endereço coerente com a UF",
    "Cópia campo a campo ou da ficha inteira",
  ],
});

const RELATED = [
  { href: "/", label: "Gerador de CNPJ" },
  { href: "/gerador-de-cep", label: "Gerador de CEP" },
];

export default function GeradorDeEmpresas() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(EMPRESA_FAQ)} />

      <SiteHeader
        active="empresas"
        badge="Razão social · CNPJ · endereço"
        heading="Gerador de Empresas — razão social, nome fantasia, CNPJ e endereço fictícios para testes de software."
      />

      <div className="mt-8">
        <EmpresaGeneratorPanel />
      </div>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            As empresas são inteiramente fictícias e destinadas a testes de
            software. O CNPJ tem dígitos verificadores válidos, mas não há
            inscrição na Receita Federal — não use em produção fiscal.
          </DocsWarning>

          <GuideSection title="O que compõe uma ficha de empresa">
            <p>
              Uma pessoa jurídica no Brasil é identificada por vários campos que
              costumam ser confundidos. A <strong>razão social</strong> é o nome
              oficial registrado, usado em contratos e notas fiscais; o{" "}
              <strong>nome fantasia</strong> é a marca pela qual o público conhece
              a empresa, e pode ser diferente da razão social. A{" "}
              <strong>natureza jurídica</strong> indica o tipo societário — como
              LTDA, S.A., EIRELI ou MEI —, o que afeta obrigações fiscais e a
              forma da razão social. O gerador monta esses campos de modo
              consistente, do jeito que apareceriam em um cadastro real.
            </p>
            <p>
              O <strong>CNPJ</strong> da ficha é gerado com os dígitos
              verificadores corretos e acompanha um endereço coerente com o estado
              escolhido: o CEP cai na faixa oficial da UF, e cidade e DDD seguem a
              mesma lógica. Assim, sistemas que validam o CNPJ e cruzam o endereço
              recebem um registro que passa nas checagens de formato sem
              corresponder a nenhuma empresa efetivamente inscrita na Receita.
            </p>
            <p>
              Essa massa de dados serve para testar cadastros de fornecedores e
              clientes B2B, emissores de nota fiscal em ambiente de homologação,
              integrações com ERPs e telas administrativas que listam empresas.
              Trabalhar com pessoas jurídicas fictícias evita usar dados de
              empresas reais — que, além de exporem terceiros, poderiam disparar
              rotinas fiscais indevidas em ambientes de teste.
            </p>
          </GuideSection>

          <div className="space-y-3">
            <SectionLabel>Documentos da ficha</SectionLabel>
            <p className="text-sm text-muted-foreground">
              A ficha reusa os geradores dedicados do bateCarimbo, com o mesmo
              cálculo de dígitos verificadores:
            </p>
            <ul className="flex flex-wrap gap-2">
              {RELATED.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="inline-flex rounded-lg border bg-card px-3 py-1.5 text-sm transition-colors hover:border-ring/40"
                  >
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <FaqSection items={EMPRESA_FAQ} />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
