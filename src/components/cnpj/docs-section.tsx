"use client";

import { ExternalLinkIcon, TriangleAlertIcon } from "lucide-react";

import { CNPJ_SEGMENTS, CnpjText } from "@/components/cnpj/cnpj-text";
import { GuideSection } from "@/components/doc-tool/reference";
import { CopyableCode, SectionLabel } from "@/components/docs";
import { Badge } from "@/components/ui/badge";
import { ALPHANUMERIC_REGEX, NUMERIC_REGEX } from "@/lib/cnpj";
import { CNPJ_FAQ } from "@/lib/faq";
import { cn } from "@/lib/utils";

const REFERENCES = [
  {
    label: "FAQ Receita Federal — CNPJ alfanumérico",
    href: "https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/cnpj/cnpj-alfanumerico.pdf",
  },
  {
    label: "Manual Serpro — cálculo do DV",
    href: "https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf",
  },
];

const SEGMENT_DETAILS = [
  {
    ...CNPJ_SEGMENTS[0],
    description: "Identifica a empresa. Dígitos 0–9 no legado; 0–9 e A–Z no novo.",
  },
  {
    ...CNPJ_SEGMENTS[1],
    description: "Ordem do estabelecimento (matriz/filial). Mesma regra da raiz.",
  },
  {
    ...CNPJ_SEGMENTS[2],
    description: "Dígitos verificadores: sempre numéricos, nos dois formatos.",
  },
];

const FORMATS = [
  {
    name: "Numérico",
    tag: "legado",
    items: [
      "14 dígitos 0–9 em todas as posições.",
      "Atual e permanece válido — nada muda para inscrições existentes.",
    ],
  },
  {
    name: "Alfanumérico",
    tag: "novo",
    items: [
      "Raiz e ordem aceitam 0–9 e A–Z; DV continua numérico.",
      "Novas inscrições a partir de jul/2026.",
    ],
    badge: "SERPRO",
  },
];

export function DocsSection() {
  return (
    <section aria-label="Referência" className="space-y-10">
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
        <TriangleAlertIcon
          aria-hidden
          className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
        />
        <p>
          CNPJs gerados nesta ferramenta são fictícios e destinados
          exclusivamente a testes de software. Não representam empresas reais.
        </p>
      </div>

      <GuideSection title="O que é o CNPJ e como ele muda em 2026">
        <p>
          O Cadastro Nacional da Pessoa Jurídica é o número que identifica
          empresas e outras entidades perante a Receita Federal. Ele tem catorze
          posições divididas em três partes: os oito primeiros dígitos são a{" "}
          <strong>raiz</strong>, que identifica a empresa; os quatro seguintes
          são a <strong>ordem</strong> do estabelecimento, em que{" "}
          <code className="font-mono text-foreground">0001</code> designa a matriz
          e os números seguintes as filiais; e os dois últimos são{" "}
          <strong>dígitos verificadores</strong> calculados por módulo 11. Ou
          seja, matriz e filiais de uma mesma empresa compartilham a raiz e
          diferem apenas na ordem.
        </p>
        <p>
          A grande novidade é o <strong>CNPJ alfanumérico</strong>: a partir de
          julho de 2026, as novas inscrições passam a aceitar letras de A a Z,
          além dos números, na raiz e na ordem — só os dois dígitos verificadores
          continuam sempre numéricos. A mudança foi necessária porque as
          combinações puramente numéricas estão se esgotando. Os CNPJs numéricos
          já existentes permanecem válidos e não mudam; o novo formato convive com
          o antigo. O cálculo do DV foi adaptado para tratar cada caractere pelo
          seu valor (código ASCII menos 48), o que faz A valer 17, B valer 18, e
          assim por diante.
        </p>
        <p>
          Ter os dois formatos à mão importa para quem desenvolve: bancos de
          dados, máscaras de entrada, validadores e integrações fiscais precisam
          ser testados contra o formato numérico legado e o alfanumérico novo
          antes de 2026. Gerar CNPJs fictícios com DV correto, em lote, permite
          preparar essas rotinas com antecedência sem depender de números de
          empresas reais.
        </p>
      </GuideSection>

      <div className="space-y-5">
        <SectionLabel>Anatomia do CNPJ</SectionLabel>
        <p className="text-center">
          <CnpjText
            value="12.ABC.345/01DE-35"
            className="text-xl font-medium tracking-tight sm:text-2xl"
          />
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {SEGMENT_DETAILS.map((segment) => (
            <div key={segment.label} className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn("size-2 rounded-full", segment.dotClassName)}
                />
                <h3 className="text-sm font-semibold">{segment.label}</h3>
                <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                  {segment.positions}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {segment.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <SectionLabel>Formatos</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {FORMATS.map((format) => (
            <div key={format.name} className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{format.name}</h3>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {format.tag}
                </span>
                {format.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {format.badge}
                  </Badge>
                )}
              </div>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {format.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <SectionLabel>Regex (sem máscara)</SectionLabel>
        <CopyableCode value={NUMERIC_REGEX.source} label="Regex numérico" />
        <CopyableCode
          value={ALPHANUMERIC_REGEX.source}
          label="Regex alfanumérico"
        />
      </div>

      <div className="space-y-3">
        <SectionLabel>Exemplo Serpro — cálculo do DV</SectionLabel>
        <p className="text-sm text-muted-foreground">
          Base <code className="font-mono text-foreground">12ABC34501DE</code>{" "}
          → DV <code className="font-mono text-foreground">35</code> → CNPJ
          formatado{" "}
          <code className="font-mono text-foreground">12.ABC.345/01DE-35</code>
        </p>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>Converter cada caractere: valor = código ASCII − 48 (A=17, 0=0).</li>
          <li>
            Multiplicar pelos pesos 2–9 da direita para esquerda (reinicia a
            cada 8).
          </li>
          <li>
            Somar, calcular resto ÷ 11; se resto &lt; 2, DV = 0; senão DV = 11 −
            resto.
          </li>
          <li>Repetir incluindo o 1º DV para obter o 2º.</li>
        </ol>
      </div>

      <div className="space-y-4">
        <SectionLabel>Perguntas frequentes</SectionLabel>
        <div className="grid gap-3">
          {CNPJ_FAQ.map((item) => (
            <div key={item.question} className="rounded-xl border bg-card p-4">
              <h3 className="text-sm font-semibold">{item.question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <SectionLabel>Documentação oficial</SectionLabel>
        <ul className="space-y-2">
          {REFERENCES.map((ref) => (
            <li key={ref.href}>
              <a
                href={ref.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
              >
                {ref.label}
                <ExternalLinkIcon aria-hidden className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
