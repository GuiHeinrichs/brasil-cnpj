import type { Metadata } from "next";
import Link from "next/link";

import { DocsWarning, FaqSection } from "@/components/doc-tool/reference";
import { SectionLabel } from "@/components/docs";
import { JsonLd } from "@/components/json-ld";
import { PessoaGeneratorPanel } from "@/components/pessoa/panels";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PESSOA_FAQ } from "@/lib/faq";
import { MAX_BATCH_SIZE } from "@/lib/pessoa";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de Pessoas — ficha completa com CPF, RG e endereço";
const PAGE_DESCRIPTION =
  "Gere pessoas fictícias completas para testes: nome, CPF, RG, data de nascimento, e-mail, telefone e endereço — todos coerentes com o estado escolhido. Grátis e em lote.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-pessoas",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-pessoas",
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
  name: "Gerador de Pessoas",
  path: "/gerador-de-pessoas",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de fichas completas em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "CPF, RG, CEP, cidade e DDD coerentes com a UF escolhida",
    "Nome, data de nascimento, nome da mãe, e-mail e telefone",
    "Cópia campo a campo ou da ficha inteira",
  ],
});

const RELATED = [
  { href: "/gerador-de-cpf", label: "Gerador de CPF" },
  { href: "/gerador-de-rg", label: "Gerador de RG" },
  { href: "/gerador-de-cep", label: "Gerador de CEP" },
];

export default function GeradorDePessoas() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(PESSOA_FAQ)} />

      <SiteHeader
        active="pessoas"
        badge="Ficha coerente por estado"
        heading="Gerador de Pessoas — ficha completa com CPF, RG, endereço e contato fictícios para testes de software."
      />

      <div className="mt-8">
        <PessoaGeneratorPanel />
      </div>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            As fichas são inteiramente fictícias e destinadas a testes de
            software. Os documentos têm dígitos verificadores válidos, mas não
            pertencem a nenhuma pessoa real — não use em sistemas de produção.
          </DocsWarning>

          <div className="space-y-3">
            <SectionLabel>Documentos da ficha</SectionLabel>
            <p className="text-sm text-muted-foreground">
              Cada campo reusa os geradores dedicados do bateCarimbo, com o mesmo
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

          <FaqSection items={PESSOA_FAQ} />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
