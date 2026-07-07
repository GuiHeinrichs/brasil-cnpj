import type { Metadata } from "next";
import Link from "next/link";

import {
  DocsWarning,
  FaqSection,
  GuideSection,
} from "@/components/doc-tool/reference";
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

          <GuideSection title="Dados de teste coerentes, não apenas aleatórios">
            <p>
              O diferencial de uma ficha de pessoa gerada aqui é a{" "}
              <strong>coerência interna</strong>: em vez de sortear cada campo de
              forma isolada, a ferramenta monta um registro em que os dados
              conversam entre si. Ao escolher um estado, o CPF sai com o nono
              dígito da região fiscal correta, o CEP cai na faixa oficial daquela
              UF e a cidade e o DDD acompanham. Isso importa porque muitos
              sistemas cruzam esses campos, e dados incoerentes fariam a validação
              falhar por um motivo que não tem a ver com o que você quer testar.
            </p>
            <p>
              Cada ficha reúne nome, CPF, RG, data de nascimento, nome da mãe,
              e-mail, telefone e endereço completo — o suficiente para preencher um
              cadastro típico de ponta a ponta. Os documentos usam os mesmos
              cálculos de dígito verificador dos geradores dedicados, então
              passam nas rotinas de validação como um registro real passaria, sem
              corresponder a ninguém.
            </p>
            <p>
              É o tipo de massa de dados ideal para popular ambientes de
              desenvolvimento e homologação, montar fixtures e seeds, demonstrar
              telas em apresentações e rodar testes de carga. Usar pessoas
              fictícias em vez de exportar uma base real de clientes é também uma
              prática recomendada de proteção de dados: elimina o risco de vazar
              informação pessoal em ambientes que não têm o mesmo controle da
              produção.
            </p>
          </GuideSection>

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
