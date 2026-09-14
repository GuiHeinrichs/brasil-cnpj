import type { Metadata } from "next";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GUIDES, guidesByTag } from "@/lib/guias";
import { WEBSITE_ID } from "@/lib/schema";
import { AUTHOR, SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_TITLE = "Guias — documentos e dados brasileiros explicados";
const PAGE_DESCRIPTION =
  "Acervo de guias técnicos sobre documentos brasileiros: módulo 11, CNPJ alfanumérico, validadores em JavaScript, Python e SQL, regex, estrutura de CEP, RG por estado, LGPD e massa de dados de teste.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/guias" },
  openGraph: {
    type: "website",
    url: "/guias",
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

const GROUPS = guidesByTag();

/**
 * Texto de abertura de cada categoria. A chave é a `tag` do guia em
 * `src/lib/guias.ts`; categorias sem entrada aqui simplesmente não exibem
 * parágrafo, então adicionar um guia nunca quebra o índice.
 */
const TAG_INTRO: Record<string, string> = {
  Algoritmos:
    "Uma conta só, repetida com pesos diferentes, sustenta o dígito verificador de quase todo documento brasileiro. Aqui ela aparece resolvida no papel, posição por posição, incluindo o caso do resto 10 — o ponto em que CPF, PIS e título de eleitor deixam de se comportar igual.",
  Regras:
    "Mudanças de formato que já valem e obrigam alteração de código. O CNPJ alfanumérico passou a sair em novas inscrições desde julho de 2026 e convive com o numérico: o que muda no cálculo do dígito, no tamanho da coluna e nas validações que assumiam apenas algarismos.",
  "Boas práticas":
    "Antes de gerar qualquer massa, vale entender por que copiar a base de produção para homologação é um problema jurídico, e não só um mau hábito. Dado pessoal, anonimização e pseudonimização na LGPD, e como documentos fictícios cumprem o mesmo papel em teste sem expor ninguém.",
  Documentos:
    "Leitura de número documento a documento: o que cada posição significa, o que dá para inferir dela e o que é palpite. Útil para quem precisa explicar um campo em tela, escrever uma mensagem de erro precisa ou decidir se aquele trecho do número vira regra de negócio.",
  Veículos:
    "Placa e emplacamento, do padrão de três letras e quatro algarismos ao Mercosul. Cobre a conversão posição a posição, por que os dois padrões convivem na mesma frota e o que isso exige de quem valida placa em formulário, relatório ou integração de rastreamento.",
  Código:
    "A parte executável do acervo: validadores comentados em JavaScript, TypeScript, Python, Java, C# e SQL, mais a tabela de expressões regulares para os formatos com e sem máscara. Todos partem da mesma regra e da mesma bateria de casos, para o resultado não divergir entre tela, API e banco.",
  Identidade:
    "O RG é o documento que mais quebra validação genérica: cada estado numera do seu jeito e nem todos usam a mesma regra de dígito. Como modelar o campo sem inventar regra, e o que a Carteira de Identidade Nacional muda ao adotar o CPF como número único.",
  Trabalho:
    "PIS, PASEP, NIS e NIT são quatro nomes para o mesmo número de onze dígitos, e a confusão reaparece em folha, eSocial e integração previdenciária. Quem atribui cada sigla, onde ela aparece na prática e o dígito verificador resolvido com os pesos corretos.",
  Eleitoral:
    "O título de eleitor carrega o código da unidade federativa nos dígitos 9 e 10, e é aí que a maioria dos validadores erra: São Paulo e Minas Gerais seguem uma exceção no cálculo. Tabela dos códigos por estado e a conta resolvida até os dois dígitos finais.",
  Endereçamento:
    "CEP não é um número opaco: região, sub-região, setor, subsetor e sufixo estão codificados nas oito posições. Exemplos reais decompostos, as faixas por unidade federativa e o que dá para verificar sem depender de uma API de consulta de endereço.",
  "Dados de teste":
    "Como montar massa brasileira que aguenta um pipeline inteiro: fixtures pequenas no teste unitário, seeds reproduzíveis no ambiente de desenvolvimento, factories para os casos-limite. Inclui a coerência entre UF, CPF, CEP e DDD, detalhe que costuma faltar quando a massa vem de gerador genérico.",
  Fiscal:
    "Cadastro é diferente de formato. Estes textos separam os três níveis de verificação — formato, dígito verificador e existência no cadastro — e arrumam a confusão entre CPF, CNPJ, inscrição estadual, inscrição municipal e MEI, que decide como o sistema modela cliente pessoa física e jurídica.",
  "Erros comuns":
    "Catálogo de defeitos reais em validadores brasileiros, cada um com sintoma, causa, teste que reproduz o problema e correção comentada. Se um documento válido está sendo recusado em produção, ou um inválido passou pela tela e chegou ao banco, comece por aqui antes de reescrever a validação inteira.",
};

type Trail = {
  title: string;
  summary: string;
  steps: { href: string; label: string }[];
};

/** Sequências sugeridas de leitura, para quem chega com um problema, não com um tema. */
const TRAILS: Trail[] = [
  {
    title: "Validando documentos no seu sistema",
    summary: "Do algoritmo às camadas em que a regra precisa existir.",
    steps: [
      { href: "/guias/modulo-11-digito-verificador", label: "Módulo 11" },
      {
        href: "/guias/validar-cpf-cnpj-javascript-typescript",
        label: "Validar em JavaScript",
      },
      {
        href: "/guias/validar-cpf-cnpj-sql-postgres-mysql-sqlserver",
        label: "Validar no banco",
      },
      {
        href: "/guias/erros-comuns-validadores-documentos-brasileiros",
        label: "Erros comuns",
      },
    ],
  },
  {
    title: "Montando massa de dados de teste",
    summary: "Por que não usar dados reais, como produzir massa coerente e onde gerá-la.",
    steps: [
      { href: "/guias/lgpd-dados-de-teste", label: "LGPD e dados de teste" },
      {
        href: "/guias/massa-de-dados-de-teste-fixtures-seeds-faker",
        label: "Fixtures, seeds e factories",
      },
      { href: "/gerador-de-pessoas", label: "Gerador de Pessoas" },
    ],
  },
  {
    title: "Adequando o cadastro ao CNPJ alfanumérico",
    summary: "O que mudou no formato e onde as validações antigas ficam presas.",
    steps: [
      { href: "/guias/cnpj-alfanumerico-2026", label: "CNPJ alfanumérico" },
      {
        href: "/guias/cpf-cnpj-inscricao-estadual-mei-diferencas",
        label: "CPF, CNPJ, IE e MEI",
      },
      { href: "/guias/regex-documentos-brasileiros", label: "Regex dos documentos" },
      {
        href: "/guias/validar-cpf-cnpj-sql-postgres-mysql-sqlserver",
        label: "Validar no banco",
      },
    ],
  },
];

const MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

/** Formata AAAA-MM-DD como "31 ago 2026" sem depender do relógio do servidor. */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
}

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: `${SITE_URL}/guias`,
  inLanguage: "pt-BR",
  isPartOf: { "@id": WEBSITE_ID },
  about: GROUPS.map((group) => ({ "@type": "Thing", name: group.tag })),
  hasPart: GUIDES.map((guide) => ({
    "@type": "TechArticle",
    headline: guide.title,
    description: guide.description,
    url: `${SITE_URL}/guias/${guide.slug}`,
    inLanguage: "pt-BR",
    datePublished: guide.published,
    dateModified: guide.updated,
    articleSection: guide.tag,
    author: { "@type": "Person", name: AUTHOR.name, url: `${SITE_URL}${AUTHOR.path}` },
  })),
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: GUIDES.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: GUIDES.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.title,
      url: `${SITE_URL}/guias/${guide.slug}`,
    })),
  },
};

export default function GuiasIndex() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={collectionJsonLd} />

      <SiteHeader
        badge="Guias & referência"
        heading="Guias sobre documentos e dados brasileiros"
      />

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          São {GUIDES.length} textos sobre como os números de documento
          brasileiros são construídos, por que eles falham em sistemas reais e o
          que fazer com isso em código. Cada um nasceu de um problema concreto
          encontrado ao manter as ferramentas deste site: o resto 10 que nem todo
          documento trata igual, o RG que não tem padrão nacional, a coluna
          numérica que parou de servir quando o CNPJ ganhou letras.
        </p>
        <p>
          O acervo está dividido por categoria abaixo. Os guias de{" "}
          <strong>Código</strong> trazem implementação pronta e testes; os de{" "}
          <strong>Documentos</strong>, <strong>Fiscal</strong> e{" "}
          <strong>Identidade</strong> explicam o que o número significa e o que
          ele não prova. Contas aparecem resolvidas dígito a dígito, e toda
          afirmação sobre norma ou tabela oficial é fechada com a fonte no fim do
          artigo.
        </p>
        <p>
          Quem escreve e revisa é{" "}
          <Link
            href="/sobre#autor"
            rel="author"
            className="text-foreground underline underline-offset-4"
          >
            {AUTHOR.name}
          </Link>
          , que também mantém os geradores. O critério de fontes, datas e revisão
          está descrito na{" "}
          <Link
            href="/sobre#editorial"
            className="text-foreground underline underline-offset-4"
          >
            política editorial
          </Link>
          .
        </p>
      </div>

      <section
        aria-labelledby="trilhas"
        className="mt-10 rounded-2xl border bg-card p-5 sm:p-6"
      >
        <h2
          id="trilhas"
          className="font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase"
        >
          Trilhas de leitura
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Três sequências para quem chega com uma tarefa específica em vez de um
          tema. A ordem importa: cada passo assume o anterior.
        </p>

        <ol className="mt-5 space-y-5">
          {TRAILS.map((trail, index) => (
            <li key={trail.title} className="border-t pt-5 first:border-t-0 first:pt-0">
              <h3 className="flex items-baseline gap-2 text-sm font-semibold tracking-tight">
                <span aria-hidden className="font-mono text-[11px] text-muted-foreground">
                  {index + 1}
                </span>
                {trail.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {trail.summary}
              </p>
              <ol className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2">
                {trail.steps.map((step, stepIndex) => (
                  <li key={step.href} className="flex items-center gap-1.5">
                    {stepIndex > 0 && (
                      <ChevronRightIcon
                        aria-hidden
                        className="size-3 shrink-0 text-muted-foreground"
                      />
                    )}
                    <Link
                      href={step.href}
                      className="inline-flex rounded-lg border bg-background px-2.5 py-1 text-xs transition-colors hover:border-ring/40"
                    >
                      {step.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-14 space-y-12">
        {GROUPS.map((group) => {
          const intro = TAG_INTRO[group.tag];
          const count = group.guides.length;

          return (
            <section key={group.tag}>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight">
                  {group.tag}
                </h2>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {count} {count === 1 ? "guia" : "guias"}
                </span>
              </div>

              {intro && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {intro}
                </p>
              )}

              <div className="mt-5 grid gap-4">
                {group.guides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guias/${guide.slug}`}
                    className="group rounded-2xl border bg-card p-5 transition-colors hover:border-ring/40"
                  >
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-muted-foreground">
                      <time dateTime={guide.published}>
                        {formatDate(guide.published)}
                      </time>
                      <span aria-hidden>·</span>
                      <span>{guide.minutes} min</span>
                      {guide.updated !== guide.published && (
                        <>
                          <span aria-hidden>·</span>
                          <span>
                            revisado em{" "}
                            <time dateTime={guide.updated}>
                              {formatDate(guide.updated)}
                            </time>
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="mt-3 flex items-start gap-2 text-base font-semibold tracking-tight">
                      {guide.title}
                      <ArrowRightIcon
                        aria-hidden
                        className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      />
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {guide.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <SiteFooter />
    </div>
  );
}
