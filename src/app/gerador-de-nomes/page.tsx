import type { Metadata } from "next";

import {
  DocsWarning,
  FaqSection,
  GuideSection,
} from "@/components/doc-tool/reference";
import { SectionLabel } from "@/components/docs";
import { JsonLd } from "@/components/json-ld";
import { NomeGeneratorPanel } from "@/components/nome/panels";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { NOME_FAQ } from "@/lib/faq";
import { MAX_BATCH_SIZE } from "@/lib/nome";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de Nomes brasileiros — masculinos e femininos, em lote";
const PAGE_DESCRIPTION =
  "Gere nomes brasileiros aleatórios para testes, mockups e protótipos. Filtre por sexo, gere em lote e copie individualmente ou tudo de uma vez. Grátis.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-nomes",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-nomes",
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
  name: "Gerador de Nomes",
  path: "/gerador-de-nomes",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de nomes brasileiros em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Filtro por sexo (masculino, feminino ou aleatório)",
    "Prenome com um ou dois sobrenomes",
  ],
});

const USE_CASES = [
  {
    title: "Seeds e fixtures",
    description:
      "Popular tabelas de usuários em bancos de dados de desenvolvimento com nomes verossímeis em vez de \"Teste Teste\" ou \"AAAA BBBB\".",
  },
  {
    title: "Testes automatizados",
    description:
      "Gerar dados de entrada para testes de formulários de cadastro, validação de campos de nome e fluxos de criação de conta.",
  },
  {
    title: "Protótipos e mockups",
    description:
      "Substituir placeholders genéricos em Figma, Storybook ou templates HTML por nomes que tornam o design mais realista durante apresentações.",
  },
  {
    title: "Demonstrações",
    description:
      "Exibir listas de clientes, colaboradores ou participantes em demos de produto sem expor dados de pessoas reais.",
  },
];

export default function GeradorDeNomes() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(NOME_FAQ)} />

      <SiteHeader
        active="nomes"
        badge="Nomes brasileiros · por sexo"
        heading="Gerador de Nomes brasileiros — masculinos e femininos, em lote para testes, mockups e protótipos."
      />

      <div className="mt-8">
        <NomeGeneratorPanel />
      </div>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Os nomes são combinações aleatórias de prenomes e sobrenomes comuns,
            destinadas a testes de software. Qualquer coincidência com pessoas
            reais é casual.
          </DocsWarning>

          <GuideSection title="Por que nomes realistas encontram mais bugs">
            <p>
              Preencher testes com <code className="font-mono text-foreground">
              Teste Teste</code> esconde justamente os problemas que só aparecem
              com nomes de verdade. Nomes brasileiros trazem acentuação e cedilha
              (Conceição, Muñoz), nomes compostos (Maria Eduarda), partículas em
              minúsculas (de, da, dos) e sobrenomes longos que quebram larguras de
              coluna, truncam campos e revelam falhas de ordenação alfabética e de
              codificação de caracteres. Uma amostra de nomes plausíveis exercita
              esses casos sem esforço extra.
            </p>
            <p>
              Por isso vale usar nomes verossímeis desde as fases iniciais de
              desenvolvimento — e não apenas em produção. Eles deixam protótipos e
              demonstrações mais convincentes e, ao mesmo tempo, servem de entrada
              para validar campos de nome, buscas e relatórios, tudo sem tocar em
              dados de pessoas reais.
            </p>
          </GuideSection>

          <div className="space-y-4">
            <SectionLabel>Como os nomes são gerados</SectionLabel>
            <p className="text-sm text-muted-foreground">
              A ferramenta combina aleatoriamente prenomes e sobrenomes comuns no
              Brasil. Os prenomes masculinos e femininos são mantidos em listas
              separadas para que o filtro de sexo funcione corretamente. Os
              sobrenomes — geralmente de origem portuguesa, italiana, alemã,
              japonesa ou indígena, refletindo a diversidade da imigração
              brasileira — são compartilhados entre os sexos. Cada nome gerado
              tem um prenome e um ou dois sobrenomes, seguindo o padrão mais
              comum nos registros civis brasileiros.
            </p>
          </div>

          <div className="space-y-4">
            <SectionLabel>Casos de uso comuns</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {USE_CASES.map((item) => (
                <div key={item.title} className="rounded-xl border bg-card p-4">
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <SectionLabel>Integração com outros geradores</SectionLabel>
            <p className="text-sm text-muted-foreground">
              Para fichas completas — com CPF, RG, endereço e contato coerentes
              por estado — use o{" "}
              <a
                href="/gerador-de-pessoas"
                className="text-foreground underline underline-offset-4 hover:text-foreground/80"
              >
                Gerador de Pessoas
              </a>
              . Ele usa o mesmo banco de nomes e combina todos os campos em uma
              ficha coerente, pronta para copiar.
            </p>
          </div>

          <FaqSection items={NOME_FAQ} />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
