"use client";

import { ExternalLinkIcon, TriangleAlertIcon } from "lucide-react";

import { CPF_SEGMENTS, CpfText } from "@/components/cpf/cpf-text";
import { GuideSection } from "@/components/doc-tool/reference";
import { CopyableCode, SectionLabel } from "@/components/docs";
import { CPF_MASKED_REGEX, CPF_REGEX, FISCAL_REGIONS } from "@/lib/cpf";
import { CPF_FAQ } from "@/lib/faq";
import { cn } from "@/lib/utils";

const REFERENCES = [
  {
    label: "Consulta de situação cadastral do CPF — Receita Federal",
    href: "https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp",
  },
  {
    label: "Inscrição no CPF — gov.br",
    href: "https://www.gov.br/pt-br/servicos/inscrever-no-cadastro-de-pessoas-fisicas",
  },
];

const SEGMENT_DETAILS = [
  {
    ...CPF_SEGMENTS[0],
    description: "Número-base da inscrição: oito dígitos, sempre numéricos.",
  },
  {
    ...CPF_SEGMENTS[1],
    description: "Identifica a região fiscal que emitiu o CPF — tabela abaixo.",
  },
  {
    ...CPF_SEGMENTS[2],
    description: "Dígitos verificadores: módulo 11 sobre os dígitos anteriores.",
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
          CPFs gerados nesta ferramenta são fictícios e destinados
          exclusivamente a testes de software. Não correspondem a pessoas
          reais.
        </p>
      </div>

      <GuideSection title="O que é o CPF e o que os dígitos significam">
        <p>
          O Cadastro de Pessoas Físicas é o número que identifica cada
          contribuinte perante a Receita Federal. São onze dígitos: os nove
          primeiros formam o <strong>número-base</strong> e os dois últimos são{" "}
          <strong>dígitos verificadores</strong> calculados por módulo 11. Um
          detalhe pouco conhecido é que o nono dígito indica a{" "}
          <strong>região fiscal</strong> em que o CPF foi emitido — cada valor de
          0 a 9 corresponde a um grupo de estados, como mostra a tabela adiante.
          Por isso é possível gerar CPFs vinculados a um estado específico.
        </p>
        <p>
          Os dígitos verificadores existem para detectar erros de digitação: uma
          troca ou inversão de algarismos quase sempre invalida o número. Vale
          notar que sequências com todos os dígitos iguais, como{" "}
          <code className="font-mono text-foreground">111.111.111-11</code>,
          satisfazem o cálculo matemático, mas são rejeitadas por convenção — um
          bom validador precisa tratar esses casos. O CPF real também carrega uma
          situação cadastral (regular, suspensa, cancelada) que só a Receita
          conhece; um número gerado tem apenas o formato e o DV corretos, sem
          qualquer situação associada.
        </p>
        <p>
          Números fictícios são a forma segura de testar cadastros, checkouts,
          emissão de notas e integrações que exigem um CPF válido no formato.
          Usar CPFs de teste em vez de dados reais é também uma boa prática de
          proteção de dados: como o CPF é um dado pessoal protegido pela LGPD,
          mantê-lo fora de ambientes de desenvolvimento e homologação reduz o
          risco de vazamento de informação de pessoas verdadeiras.
        </p>
      </GuideSection>

      <div className="space-y-5">
        <SectionLabel>Anatomia do CPF</SectionLabel>
        <p className="text-center">
          <CpfText
            value="123.456.789-09"
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
        <SectionLabel>Regiões fiscais</SectionLabel>
        <p className="text-sm text-muted-foreground">
          O 9º dígito do CPF revela a região fiscal de emissão. No Gerador,
          selecione uma região para criar CPFs de um estado específico.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {FISCAL_REGIONS.map((region) => (
            <div
              key={region.digit}
              className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2"
            >
              <span className="font-mono text-lg font-medium text-primary">
                {region.digit}
              </span>
              <div className="flex flex-1 items-baseline justify-between gap-2">
                <span className="text-sm">{region.states}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {region.ordinal} RF
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <SectionLabel>Regex</SectionLabel>
        <CopyableCode value={CPF_REGEX.source} label="Regex sem máscara" />
        <CopyableCode value={CPF_MASKED_REGEX.source} label="Regex com máscara" />
      </div>

      <div className="space-y-3">
        <SectionLabel>Exemplo — cálculo do DV</SectionLabel>
        <p className="text-sm text-muted-foreground">
          Base <code className="font-mono text-foreground">123456789</code> →
          DV <code className="font-mono text-foreground">09</code> → CPF
          formatado{" "}
          <code className="font-mono text-foreground">123.456.789-09</code>
        </p>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Multiplicar os 9 dígitos pelos pesos 10 a 2, da esquerda para a
            direita.
          </li>
          <li>
            Somar, calcular resto ÷ 11; se resto &lt; 2, DV = 0; senão DV = 11
            − resto.
          </li>
          <li>Repetir com os 10 dígitos (pesos 11 a 2) para obter o 2º DV.</li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Mesma regra de módulo 11 do CNPJ — mudam apenas os pesos. Sequências
          com todos os dígitos iguais (111.111.111-11) passam no cálculo, mas
          são rejeitadas.
        </p>
      </div>

      <div className="space-y-4">
        <SectionLabel>Perguntas frequentes</SectionLabel>
        <div className="grid gap-3">
          {CPF_FAQ.map((item) => (
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
        <SectionLabel>Links oficiais</SectionLabel>
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
