import type { Metadata } from "next";

import { SectionLabel } from "@/components/docs";
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
import {
  TituloGeneratorPanel,
  TituloValidatorPanel,
} from "@/components/titulo-eleitor/panels";
import { TITULO_SEGMENTS } from "@/components/titulo-eleitor/segments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TITULO_FAQ } from "@/lib/faq";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";
import { MAX_BATCH_SIZE, TITULO_LENGTH, TITULO_UFS } from "@/lib/titulo-eleitor";

const PAGE_TITLE =
  "Gerador de título de eleitor por estado (com validador de DV)";
const PAGE_DESCRIPTION =
  "Escolha a UF e gere inscrições eleitorais fictícias com os dois dígitos verificadores fechados. O validador lê o código de estado nos dígitos 9 e 10 e trata a exceção de SP e MG.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-titulo-de-eleitor",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-titulo-de-eleitor",
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
  name: "Gerador de Título de Eleitor",
  path: "/gerador-de-titulo-de-eleitor",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de título de eleitor válido em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Escolha da UF (dígitos 9–10) para gerar título por estado",
    "Validação dos dígitos verificadores com detecção da UF",
    "Regra oficial do TSE, incluindo a exceção de SP e MG",
  ],
});

export default function GeradorDeTituloDeEleitor() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(TITULO_FAQ)} />

      <SiteHeader
        active="titulo"
        badge="UF nos dígitos 9–10"
        heading="Gerador de Título de Eleitor por estado"
        lead={
          <>
            Escolhe a unidade federativa, sorteia o sequencial e fecha os dois
            verificadores — um número por vez ou até {MAX_BATCH_SIZE} por
            rodada. O Validador faz o caminho inverso: confere a conta e diz de
            qual estado é o código dos dígitos 9 e 10.
          </>
        }
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <TituloGeneratorPanel />
        </TabsContent>

        <TabsContent value="validator" className="mt-5">
          <TituloValidatorPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Títulos gerados nesta ferramenta são fictícios e destinados
            exclusivamente a testes de software. Não correspondem a eleitores
            reais.
          </DocsWarning>

          <GuideSection title="Como o número do título de eleitor é montado">
            <p>
              A inscrição eleitoral é um número de doze dígitos atribuído pela
              Justiça Eleitoral no alistamento e exibido, no documento e nos
              serviços do TSE, em três blocos de quatro. Essa separação visual
              não corresponde à estrutura interna: para quem valida o número, a
              quebra que importa é 8 + 2 + 2.
            </p>

            <h3>Sequencial, código da UF e dois verificadores</h3>
            <p>
              Os oito primeiros dígitos são o sequencial da inscrição. Os dois
              seguintes identificam a unidade federativa em que o alistamento
              foi feito. Os dois últimos são verificadores calculados sobre o
              que vem antes. Como o código da UF entra na conta do segundo
              dígito, não existe a operação de &ldquo;trocar o estado&rdquo; de
              um título mantendo o final: alterar os dígitos 9 e 10 invalida o
              número. É por isso que o Gerador pede a UF antes de sortear o
              sequencial, e não depois.
            </p>
            <p>
              Os códigos vão de <code>01</code> a <code>28</code> e não seguem
              ordem alfabética — <code>01</code> é São Paulo, <code>02</code>{" "}
              Minas Gerais, <code>03</code> Rio de Janeiro, e <code>28</code>{" "}
              fica reservado a quem se inscreveu no exterior. Qualquer par fora
              dessa faixa é inválido antes do cálculo do DV: um número com{" "}
              <code>35</code> nas posições 9 e 10 está malformado ainda que os
              dois últimos dígitos fechem por coincidência. Validador que só
              roda o módulo 11 deixa essa classe de erro passar; o desta página
              confere a faixa primeiro e devolve a UF reconhecida.
            </p>

            <h3>O verificador é o próprio resto, não 11 menos o resto</h3>
            <p>
              Quem já implementou CPF, RG ou PIS escreve a subtração por
              reflexo. No título ela não existe. O sequencial recebe os pesos de
              2 a 9 e o resto da divisão por 11 <em>é</em> o primeiro dígito;
              depois os dois dígitos da UF e esse primeiro verificador recebem
              os pesos 7, 8 e 9, e o resto da nova divisão é o segundo dígito.
              Nos dois cálculos, resto 10 vira 0. A mecânica de pesos e resto é
              a mesma descrita no guia sobre{" "}
              <a href="/guias/modulo-11-digito-verificador">
                módulo 11 e dígito verificador
              </a>
              ; muda o que se faz com o resto no fim.
            </p>

            <h3>A exceção de São Paulo e Minas Gerais</h3>
            <p>
              Nas inscrições de SP (<code>01</code>) e MG (<code>02</code>) vale
              uma exceção do TSE: quando o resto dá zero, o dígito
              correspondente é 1, não 0. É a maior fonte de divergência entre
              implementações de validador de título — parte das bibliotecas
              aplica a regra, parte ignora, e as duas se dizem corretas.
            </p>
            <p>
              O efeito prático aparece em teste. O mesmo sequencial com UF{" "}
              <code>01</code> gera dois números diferentes conforme a
              biblioteca, e uma fixture copiada de um projeto para outro passa
              em um e falha no outro sem que nada no código tenha mudado. Por
              isso o Gerador descarta os sequenciais em que as duas
              interpretações discordam: os títulos de SP e MG que saem daqui são
              aceitos com ou sem a exceção implementada. Se o objetivo é
              justamente exercitar o caso ambíguo, monte o número à mão a partir
              de um sequencial cujo resto seja zero — o sequencial{" "}
              <code>12345677</code> com UF <code>01</code> serve: ele fecha em{" "}
              <code>1234 5677 0116</code> com a exceção e em{" "}
              <code>1234 5677 0108</code> sem ela. Esse caso está destrinchado
              dígito a dígito, ao lado de outros defeitos que derrubam
              validadores em produção, no guia{" "}
              <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
                erros comuns em validadores de documentos brasileiros
              </a>
              . E, para massa compartilhada entre serviços escritos em
              linguagens diferentes, fixar a UF em um estado fora da exceção
              economiza uma investigação futura.
            </p>

            <h3>Zona e seção não fazem parte do número</h3>
            <p>
              Zona eleitoral e seção dizem onde a pessoa vota; a inscrição diz
              quem ela é no cadastro. São campos separados, e nenhum dos doze
              dígitos codifica zona ou seção. Guardar zona concatenada ao
              título, ou tentar deduzi-la dos últimos dígitos, produz uma base
              que não sobrevive à primeira transferência de domicílio eleitoral
              — zona e seção mudam, o número da inscrição permanece.
            </p>
            <p>
              Pela mesma razão, o código nas posições 9 e 10 é o estado do
              alistamento, não o estado atual do eleitor. Um título terminado em{" "}
              <code>02</code> nos dígitos de UF pertence a alguém que se
              inscreveu em Minas Gerais, o que não impede que hoje vote em outra
              unidade da federação. Relatório que agrupa eleitores por estado a
              partir do
              número do título está medindo outra coisa. O guia{" "}
              <a href="/guias/titulo-de-eleitor-estrutura-uf-zona-secao">
                estrutura do título, código da UF, zona e seção
              </a>{" "}
              detalha a tabela completa e o cálculo passo a passo.
            </p>

            <h3>Onde entram os números fictícios</h3>
            <p>
              Cadastros que pedem o título como campo opcional, sistemas de
              apoio a mesário, pesquisas eleitorais e qualquer formulário que
              rode o DV antes de aceitar a inscrição precisam de massa que passe
              na validação sem pertencer a ninguém. Um título com dígitos
              corretos continua sendo apenas um número bem formado: não consta
              no cadastro eleitoral e não diz nada sobre quitação. Gerar em vez
              de reaproveitar o título de uma pessoa real é o que evita levar
              dado de eleitor para ambiente de homologação, log de erro ou dump
              de banco — assunto do guia sobre{" "}
              <a href="/guias/lgpd-dados-de-teste">
                LGPD e dados de teste
              </a>
              .
            </p>
          </GuideSection>

          <AnatomySection
            title="Anatomia do título"
            sample="1234 5678 2097"
            segments={TITULO_SEGMENTS}
            length={TITULO_LENGTH}
            details={[
              "Número sequencial de inscrição: oito dígitos.",
              "Código da UF de emissão — tabela abaixo.",
              "Dígitos verificadores: módulo 11 sobre sequencial e UF.",
            ]}
          />

          <div className="space-y-4">
            <SectionLabel>Códigos de UF</SectionLabel>
            <p className="text-sm text-muted-foreground">
              São 28 códigos, do 01 ao 28, atribuídos fora da ordem alfabética.
              O último cobre as inscrições feitas no exterior. No Gerador,
              selecione a UF para criar títulos de um estado específico; no
              Validador, o código lido aqui é o que identifica o estado de
              alistamento do número colado.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TITULO_UFS.map((entry) => (
                <div
                  key={entry.code}
                  className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2"
                >
                  <span className="font-mono text-sm font-medium text-primary">
                    {entry.code}
                  </span>
                  <span className="text-sm">{entry.uf}</span>
                </div>
              ))}
            </div>
          </div>

          <AlgorithmSection
            intro={
              <>
                Sequencial{" "}
                <code className="font-mono text-foreground">12345678</code> + UF{" "}
                <code className="font-mono text-foreground">20</code> (DF) → DV{" "}
                <code className="font-mono text-foreground">97</code> → título{" "}
                <code className="font-mono text-foreground">1234 5678 2097</code>
              </>
            }
            steps={[
              "Multiplicar os 8 dígitos do sequencial pelos pesos 2 a 9; o resto da soma ÷ 11 é o 1º DV (resto 10 vira 0).",
              "Multiplicar os 2 dígitos da UF e o 1º DV pelos pesos 7, 8 e 9; o resto da soma ÷ 11 é o 2º DV (resto 10 vira 0).",
              "Em títulos de SP (01) e MG (02), resto 0 vira 1 — exceção oficial do TSE.",
            ]}
            worked={[
              {
                title: "Primeiro dígito verificador",
                steps: [
                  { char: "1", weight: 2 },
                  { char: "2", weight: 3 },
                  { char: "3", weight: 4 },
                  { char: "4", weight: 5 },
                  { char: "5", weight: 6 },
                  { char: "6", weight: 7 },
                  { char: "7", weight: 8 },
                  { char: "8", weight: 9 },
                ],
                sum: 240,
                remainder: 9,
                rule: "O resto é o próprio dígito — aqui não se subtrai de 11. Resto 10 viraria 0.",
                result: "9",
              },
              {
                title: "Segundo dígito verificador (UF + 1º DV)",
                steps: [
                  { char: "2", weight: 7 },
                  { char: "0", weight: 8 },
                  { char: "9", weight: 9 },
                ],
                sum: 95,
                remainder: 7,
                rule: "Resto vira dígito direto. A UF é 20 (DF), então a exceção do resto zero de SP e MG não se aplica.",
                result: "7",
              },
            ]}
            note="Nem todo validador implementa a exceção de SP/MG; o gerador evita os casos ambíguos, então os números passam nas duas interpretações."
          />

          <FaqSection items={TITULO_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "Autoatendimento eleitoral — TSE",
                href: "https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral",
              },
              {
                label: "Consulta de título e local de votação — TSE",
                href: "https://www.tse.jus.br/institucional/corregedoria-geral-eleitoral/sistemas-e-servicos-1/consulta-titulo-e-local-de-votacao",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
