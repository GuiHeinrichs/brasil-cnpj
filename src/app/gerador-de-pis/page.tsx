import type { Metadata } from "next";

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
import {
  PisFormatterPanel,
  PisGeneratorPanel,
  PisValidatorPanel,
} from "@/components/pis/panels";
import { PIS_SEGMENTS } from "@/components/pis/segments";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PIS_FAQ } from "@/lib/faq";
import { MAX_BATCH_SIZE, PIS_LENGTH, PIS_MASKED_REGEX, PIS_REGEX } from "@/lib/pis";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de PIS, PASEP, NIS e NIT para testes";
const PAGE_DESCRIPTION =
  "Gere números de PIS/PASEP fictícios com dígito verificador válido, em lote. Valide NIS e NIT que já estão na sua base e converta entre a máscara 999.99999.99-9 e os onze dígitos crus.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-pis",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-pis",
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
  name: "Gerador de PIS/PASEP",
  path: "/gerador-de-pis",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de PIS/PASEP válido em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Validação do dígito verificador (módulo 11)",
    "Formatação e remoção da máscara 999.99999.99-9",
  ],
});

export default function GeradorDePis() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(PIS_FAQ)} />

      <SiteHeader
        active="pis"
        badge="Mesmo número do NIS/NIT"
        heading="Gerador de PIS, PASEP, NIS e NIT"
        lead="As quatro siglas designam o mesmo número de onze dígitos. Gere lotes com o dígito verificador fechando para popular folhas de pagamento e cargas do eSocial em homologação, confira os números que já estão na sua base e alterne entre a máscara 999.99999.99-9 e os dígitos crus."
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
          <TabsTrigger value="formatter">Formatador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <PisGeneratorPanel />
        </TabsContent>

        <TabsContent value="validator" className="mt-5">
          <PisValidatorPanel />
        </TabsContent>

        <TabsContent value="formatter" className="mt-5">
          <PisFormatterPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Números de PIS gerados nesta ferramenta são fictícios e destinados
            exclusivamente a testes de software. Não correspondem a
            trabalhadores reais.
          </DocsWarning>

          <GuideSection title="Um número de onze dígitos com quatro nomes">
            <p>
              O cadastro é único; o rótulo muda conforme quem consulta.{" "}
              <strong>PIS</strong> é como o número se apresenta a quem trabalha
              na iniciativa privada, com a inscrição operada pela Caixa.{" "}
              <strong>PASEP</strong> cumpre o mesmo papel no setor público, pela
              via do Banco do Brasil. Quando a inscrição nasce no INSS — o
              caminho usual de autônomos e contribuintes individuais — o mesmo
              número é chamado de <strong>NIT</strong>. Nos programas sociais e
              no CadÚnico, de <strong>NIS</strong>. Os dois programas que dão
              nome às duas primeiras siglas foram criados em 1970, por leis
              complementares distintas, e mais tarde passaram a compartilhar a
              mesma numeração de inscrição.
            </p>
            <p>
              Para quem escreve software, a consequência prática é simples: são
              onze dígitos, uma regra de dígito verificador e um só campo. A
              diferença entre as siglas é de origem e de contexto, não de
              formato.
            </p>

            <h3>Onde cada sigla aparece na prática</h3>
            <ul>
              <li>
                <strong>Folha de pagamento e eSocial</strong> — o número
                identifica o trabalhador nos eventos de admissão e nos de
                remuneração. O campo normalmente vem rotulado como NIS.
              </li>
              <li>
                <strong>CNIS</strong> — no extrato do INSS, vínculos,
                remunerações e contribuições ficam pendurados nesse número, que
                ali aparece como NIT. É o registro que a aposentadoria consulta.
              </li>
              <li>
                <strong>Abono salarial</strong> — extratos, terminais e o
                aplicativo da Caixa se referem a ele como PIS, e é por ele que o
                trabalhador consulta se tem valor a receber.
              </li>
              <li>
                <strong>Benefícios sociais e CadÚnico</strong> — NIS, usado
                tanto na inscrição da família quanto nas consultas de
                pagamento.
              </li>
              <li>
                <strong>Guias de contribuição</strong> — o contribuinte
                individual recolhe informando o NIT.
              </li>
            </ul>
            <p>
              O detalhamento de quem atribui cada sigla, o que muda entre elas e
              por que a mesma pessoa pode ter mais de uma inscrição está no guia{" "}
              <a href="/guias/pis-pasep-nis-nit-diferencas">
                PIS, PASEP, NIS e NIT: diferenças e como validar
              </a>
              .
            </p>

            <h3>O que os dígitos não carregam</h3>
            <p>
              O CPF revela a região fiscal no nono dígito e o título de eleitor
              carrega o código da unidade federativa em duas posições fixas. O
              PIS não oferece nada parecido em documentação pública: trate os
              dez primeiros dígitos como opacos e o décimo primeiro como
              verificação. Qualquer regra de negócio que tente deduzir estado,
              faixa de cadastro ou ano de inscrição a partir das posições vai
              apoiar-se em suposição, não em especificação.
            </p>
          </GuideSection>

          <AnatomySection
            title="Anatomia do PIS"
            sample="120.16619.18-1"
            segments={PIS_SEGMENTS}
            length={PIS_LENGTH}
            details={[
              "Número de Identificação Social: dez dígitos do cadastro.",
              "Dígito verificador: módulo 11 sobre a base.",
            ]}
          />

          <div className="space-y-3">
            <SectionLabel>Regex</SectionLabel>
            <CopyableCode value={PIS_REGEX.source} label="Regex sem máscara" />
            <CopyableCode
              value={PIS_MASKED_REGEX.source}
              label="Regex com máscara"
            />
          </div>

          <AlgorithmSection
            intro={
              <>
                Base{" "}
                <code className="font-mono text-foreground">1201661918</code> →
                DV <code className="font-mono text-foreground">1</code> → PIS
                formatado{" "}
                <code className="font-mono text-foreground">120.16619.18-1</code>
              </>
            }
            steps={[
              "Multiplicar os 10 dígitos pelos pesos 3, 2, 9, 8, 7, 6, 5, 4, 3 e 2, da esquerda para a direita.",
              "Somar os produtos e calcular o resto da divisão por 11.",
              "DV = 11 − resto; resultados 10 e 11 viram 0.",
            ]}
            worked={[
              {
                title: "Dígito verificador de 1201661918",
                steps: [
                  { char: "1", weight: 3 },
                  { char: "2", weight: 2 },
                  { char: "0", weight: 9 },
                  { char: "1", weight: 8 },
                  { char: "6", weight: 7 },
                  { char: "6", weight: 6 },
                  { char: "1", weight: 5 },
                  { char: "9", weight: 4 },
                  { char: "1", weight: 3 },
                  { char: "8", weight: 2 },
                ],
                sum: 153,
                remainder: 10,
                rule: "11 − 10 = 1. O dígito só viraria 0 se a subtração resultasse em 10 ou 11.",
                result: "1",
              },
            ]}
            note={
              <>
                A mecânica do módulo 11 — por que o divisor é 11 e por que
                existe a exceção para 10 e 11 — está detalhada no guia{" "}
                <a
                  href="/guias/modulo-11-digito-verificador"
                  className="text-primary underline underline-offset-4"
                >
                  módulo 11 explicado
                </a>
                . Muda apenas a sequência de pesos de um documento para outro.
              </>
            }
          />

          <GuideSection title="Erros comuns em sistemas de RH">
            <p>
              Os defeitos que aparecem com o PIS em folha e integrações raramente
              estão no cálculo do dígito. Estão em como o número é guardado,
              copiado e comparado.
            </p>

            <h3>Colunas separadas para PIS, NIS e NIT</h3>
            <p>
              É o erro mais caro, porque só se manifesta meses depois. O
              cadastro ganha três campos, cada tela preenche o seu, e a mesma
              pessoa passa a ter valores que divergem — um digitado com máscara,
              outro sem, um terceiro vazio. Um campo só, com o rótulo mudando
              conforme o contexto da tela, resolve o problema na origem.
            </p>

            <h3>Guardar o número como inteiro</h3>
            <p>
              Onze dígitos chegam a 99.999.999.999, muito acima do teto de um
              inteiro de 32 bits (2.147.483.647), então a coluna precisa ser
              pelo menos <code>BIGINT</code> para não estourar. O problema maior
              é outro: inteiro descarta zero à esquerda. Um PIS que começa em 0
              volta do banco com dez caracteres, a máscara quebra e o validador
              reprova um número que estava correto na entrada. Guarde como{" "}
              <code>CHAR(11)</code> ou <code>VARCHAR</code>. A mesma armadilha
              existe em planilha: abrir o CSV da carga no editor converte a
              coluna em número e devolve notação científica.
            </p>

            <h3>Máscara e dígitos crus na mesma coluna</h3>
            <p>
              <code>120.16619.18-1</code> e <code>12016619181</code> são o mesmo
              trabalhador e dois valores distintos para qualquer{" "}
              <code>JOIN</code>, índice único ou deduplicação. Normalize na
              escrita, removendo pontos e hífen, e aplique a máscara só na
              exibição — é o que o painel Formatador desta página faz nos dois
              sentidos.
            </p>

            <h3>Reaproveitar o validador de CPF</h3>
            <p>
              A família do algoritmo é a mesma, os parâmetros não. O PIS tem
              onze dígitos com <strong>um</strong> verificador, contra nove mais{" "}
              <strong>dois</strong> no CPF, e usa a sequência de pesos 3, 2, 9,
              8, 7, 6, 5, 4, 3 e 2 — que não é decrescente como a do CPF.
              Validador copiado de um para o outro reprova números bons e
              aprova números ruins.
            </p>
            <p>
              O que de fato se transfere é o tratamento do resto: PIS e CPF
              resolvem igual — <code>11 − resto</code>, com o resultado 10 ou 11
              caindo para 0, que é a mesma coisa que dizer dígito 0 quando o
              resto é menor que 2. A armadilha está em supor que isso vale para
              todo documento: no RG do padrão SSP-SP o resultado 10 vira{" "}
              <code>X</code>, e no RENAVAM a soma é multiplicada por 10 antes da
              divisão. Cada variação aparece com o número que a reproduz em{" "}
              <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
                erros comuns em validadores de documentos brasileiros
              </a>
              .
            </p>

            <h3>Aceitar sequências de dígitos iguais</h3>
            <p>
              <code>00000000000</code> passa na aritmética: a soma dá zero, o
              resto dá zero, 11 − 0 = 11 e a regra converte 11 em 0, que é
              exatamente o dígito final. Por isso o validador precisa rejeitar
              sequências repetidas antes de calcular — é o que esta ferramenta
              faz, e o gerador também evita produzi-las. As demais sequências
              caem sozinhas: como a soma dos pesos é 49,{" "}
              <code>11111111111</code> deixa resto 5 e exigiria dígito 6.
            </p>

            <h3>Confundir dígito correto com cadastro existente</h3>
            <p>
              O verificador prova apenas que o número está bem formado. Saber se
              ele está atribuído a alguém depende de consulta ao CNIS ou aos
              canais da Caixa, e nenhum número gerado aqui consta nesses
              cadastros. A distinção, com o que cada situação cadastral
              significa, está em{" "}
              <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
                válido não é o mesmo que existente
              </a>
              .
            </p>
          </GuideSection>

          <FaqSection items={PIS_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "Meu INSS — consulta ao cadastro (CNIS)",
                href: "https://meu.inss.gov.br/",
              },
              {
                label: "INSS — portal oficial",
                href: "https://www.gov.br/inss/pt-br",
              },
              {
                label: "Caixa — PIS",
                href: "https://www.caixa.gov.br/beneficios-programas/pis/",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
