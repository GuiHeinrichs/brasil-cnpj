import type { Metadata } from "next";

import { CnhGeneratorPanel, CnhValidatorPanel } from "@/components/cnh/panels";
import { CNH_SEGMENTS } from "@/components/cnh/segments";
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
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CNH_LENGTH, CNH_REGEX, MAX_BATCH_SIZE } from "@/lib/cnh";
import { CNH_FAQ } from "@/lib/faq";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de CNH: número de registro com os dois DVs";
const PAGE_DESCRIPTION =
  "Gere registros de CNH fictícios com os dois dígitos verificadores fechando e valide os que você já tem. Explica registro, espelho, RENACH e o caso do resto 10.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-cnh",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-cnh",
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
  name: "Gerador de CNH",
  path: "/gerador-de-cnh",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de CNH válida em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Validação dos dois dígitos verificadores (módulo 11)",
    "Números compatíveis com as duas famílias de validadores",
  ],
});

export default function GeradorDeCnh() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(CNH_FAQ)} />

      <SiteHeader
        active="cnh"
        badge="Registro nacional · dois DVs"
        heading="Gerador de CNH (número de registro)"
        lead="Monta o registro de onze dígitos com os dois verificadores fechando, em lote, e descarta a faixa de bases em que as duas convenções de cálculo podem discordar. A aba Validador confere os números que você já tem."
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <CnhGeneratorPanel />
        </TabsContent>

        <TabsContent value="validator" className="mt-5">
          <CnhValidatorPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Números de CNH gerados nesta ferramenta são fictícios e destinados
            exclusivamente a testes de software. Não correspondem a condutores
            reais.
          </DocsWarning>

          <GuideSection title="Registro, espelho e RENACH: três números na mesma carteira">
            <p>
              A CNH traz mais de um número impresso, e o campo que um cadastro
              pede quase sempre é o <strong>registro</strong>. Trocar um pelo
              outro é a origem mais comum de bug em formulário de motorista: ou
              o sistema rejeita um número correto, ou aceita e grava como
              identificador do condutor algo que muda na renovação seguinte.
            </p>

            <h3>Número de registro</h3>
            <p>
              Identifica o condutor no cadastro nacional. É atribuído na
              primeira habilitação e acompanha a pessoa daí em diante: renovar a
              carteira, acrescentar categoria ou transferir o cadastro para
              outro estado não muda o registro. São onze dígitos — nove de base
              e dois verificadores —, e é o único dos três números com uma
              fórmula pública de verificação, razão pela qual é o único que um
              gerador consegue produzir de maneira conferível.
            </p>

            <h3>Número do espelho</h3>
            <p>
              Identifica a via emitida, não a pessoa. Cada renovação ou segunda
              via gera um espelho diferente, de modo que o mesmo condutor
              acumula vários ao longo dos anos. Serve para rastrear o documento
              físico; usá-lo como chave do motorista no banco quebra na primeira
              troca de carteira.
            </p>

            <h3>RENACH</h3>
            <p>
              A sigla nomeia o Registro Nacional de Condutores Habilitados, mas
              no dia a dia &ldquo;o RENACH&rdquo; costuma designar o número do
              processo aberto no DETRAN — o que a pessoa usa para acompanhar
              exames, aulas e prova enquanto ainda não tem a carteira. Combina a
              sigla do estado com uma sequência numérica e pertence ao processo,
              não ao condutor: abrir um novo processo em outro estado produz
              outro RENACH. Não siga o módulo 11 para validá-lo — a regra do
              registro não vale aqui.
            </p>
            <p>
              O guia{" "}
              <a href="/guias/cnh-numero-registro-digito-verificador">
                número da CNH: registro, espelho, RENACH e o dígito verificador
              </a>{" "}
              mostra onde cada um aparece no documento e o que muda na versão
              digital da carteira.
            </p>
          </GuideSection>

          <AnatomySection
            title="Anatomia da CNH"
            sample="21436587946"
            segments={CNH_SEGMENTS}
            length={CNH_LENGTH}
            details={[
              "Número de registro nacional: nove dígitos, sempre numéricos.",
              "Dígitos verificadores: dois cálculos de módulo 11 sobre a base.",
            ]}
          />

          <div className="space-y-3">
            <SectionLabel>Regex</SectionLabel>
            <CopyableCode value={CNH_REGEX.source} label="Regex da CNH" />
          </div>

          <AlgorithmSection
            intro={
              <>
                Base <code className="font-mono text-foreground">214365879</code>{" "}
                → DV <code className="font-mono text-foreground">46</code> → CNH{" "}
                <code className="font-mono text-foreground">21436587946</code>
              </>
            }
            steps={[
              "Multiplicar os nove dígitos da base pelos pesos 9, 8, 7 … 1, da esquerda para a direita; o resto da soma dividida por 11 é o primeiro verificador (resto 10 vira 0).",
              "Repetir com os mesmos nove dígitos e os pesos 1, 2, 3 … 9; o resto dessa segunda soma é o segundo verificador, pela mesma regra.",
              "Se o resto do primeiro cálculo for 10, o segundo verificador recebe um desconto de 2 — o ponto em que as implementações se separam.",
            ]}
            worked={[
              {
                title: "Primeiro dígito verificador",
                steps: [
                  { char: "2", weight: 9 },
                  { char: "1", weight: 8 },
                  { char: "4", weight: 7 },
                  { char: "3", weight: 6 },
                  { char: "6", weight: 5 },
                  { char: "5", weight: 4 },
                  { char: "8", weight: 3 },
                  { char: "7", weight: 2 },
                  { char: "9", weight: 1 },
                ],
                sum: 169,
                remainder: 4,
                rule: "O resto é o próprio dígito; resto 10 viraria 0.",
                result: "4",
              },
              {
                title: "Segundo dígito verificador",
                steps: [
                  { char: "2", weight: 1 },
                  { char: "1", weight: 2 },
                  { char: "4", weight: 3 },
                  { char: "3", weight: 4 },
                  { char: "6", weight: 5 },
                  { char: "5", weight: 6 },
                  { char: "8", weight: 7 },
                  { char: "7", weight: 8 },
                  { char: "9", weight: 9 },
                ],
                sum: 281,
                remainder: 6,
                rule: "Mesma base, pesos invertidos; como o primeiro resto não foi 10, não há desconto.",
                result: "6",
              },
            ]}
            note="Repare que o segundo cálculo usa a base original, e não a base mais o primeiro dígito — diferente de CPF e CNPJ, onde o segundo DV consome o primeiro."
          />

          <GuideSection title="O resto 10 e a divergência entre validadores">
            <p>
              Duas implementações de DV de CNH circulam há anos em código
              copiado entre projetos. A desta ferramenta é a convenção clássica
              descrita acima: pesos 9→1 e 1→9, o resto vira o dígito, resto 10
              vira 0 e o desconto de 2 no segundo cálculo quando o primeiro
              resto foi 10. A outra, comum em bibliotecas JavaScript, usa pesos
              2 a 10 no primeiro cálculo com dígito igual a 11 menos o resto, e
              pesos 3 a 11 mais 2 no segundo, já incluindo o primeiro
              verificador na conta.
            </p>
            <p>
              Fora do caso do resto 10 as duas concordam sempre, e{" "}
              <em>sempre</em> aqui é literal: varrendo todas as bases de nove
              dígitos — um bilhão de combinações — não existe uma única
              divergência fora dessa faixa. A diferença de pesos se cancela na
              aritmética modular.
            </p>
            <p>
              A faixa de risco, o resto 10 no primeiro cálculo, cobre cerca de
              uma base a cada onze. Mas ela não é uma zona de desacordo inteira:
              lá dentro as duas convenções ainda fecham o mesmo par de dígitos
              na maioria dos casos. O desacordo se concentra em três dos onze
              valores possíveis do segundo resto — 0, 1 e 10 —, o que dá{" "}
              <strong>3 bases em cada 121</strong>, cerca de 2,5% do total, ou
              uma a cada quarenta. Nos outros oito valores o resultado é
              idêntico.
            </p>
            <p>
              Quando o desacordo aparece, porém, ele é radical, não uma questão
              de um dígito para cima ou para baixo. Tome a base{" "}
              <code>987654321</code>. Pela convenção clássica, a primeira soma
              dá 285 e deixa resto 10; o primeiro dígito vira 0 e o segundo
              cálculo (soma 165, resto 0) recebe o desconto, chegando a −2 — ou
              seja, essa base <strong>não tem DV válido</strong>. Pela outra
              convenção, a mesma base produz 09, e <code>98765432109</code>{" "}
              passa sem reclamação. Nos segundos restos 0 e 1 a disputa é sempre
              essa, &ldquo;sem DV&rdquo; contra um número aceito; no resto 10 as
              duas fecham dígitos diferentes — 00 pela clássica, 08 pela outra.
            </p>
            <p>
              Por isso o gerador descarta a faixa inteira, todas as bases cujo
              primeiro resto é 10, em vez de filtrar só os três restos
              problemáticos: é um critério mais simples e sobra margem se uma
              terceira implementação aparecer. Perde-se cerca de 9% do espaço
              possível para eliminar 2,5% de casos ambíguos, e em troca todo
              registro que sai daqui é aceito pelas duas famílias. Se você
              precisa justamente testar esse caso-limite, monte a base à mão:
              qualquer sequência de nove dígitos cuja soma ponderada por 9…1
              deixe resto 10 serve, e os segundos restos 0, 1 e 10 são os que
              separam os validadores. Outras armadilhas do mesmo tipo estão
              reunidas em{" "}
              <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
                erros comuns em validadores de documentos
              </a>
              , e a mecânica do módulo 11 está no{" "}
              <a href="/guias/modulo-11-digito-verificador">guia do algoritmo</a>
              .
            </p>
          </GuideSection>

          <GuideSection title="Quando usar (e quando não)">
            <h3>Faz sentido</h3>
            <ul>
              <li>
                Popular seeds e fixtures de cadastro de motorista — mobilidade,
                entrega, frota, locadora — em que o campo precisa passar pela
                validação antes de o teste seguir adiante. O guia de{" "}
                <a href="/guias/massa-de-dados-de-teste-fixtures-seeds-faker">
                  massa de dados de teste
                </a>{" "}
                trata de como manter esse lote estável entre execuções.
              </li>
              <li>
                Exercitar o formulário: gere um número válido, troque o último
                dígito e confira se a mensagem de erro aparece. Vale testar
                também comprimento diferente de 11 e entrada com letras.
              </li>
              <li>
                Conferir importações em lote. Um CSV com dezenas de registros
                distintos revela travas de unicidade e deduplicação que um mesmo
                número repetido esconde.
              </li>
              <li>
                Capturas de tela, demonstrações e documentação, sem expor a
                carteira de ninguém.
              </li>
            </ul>

            <h3>Não serve</h3>
            <ul>
              <li>
                Preencher cadastro real, formulário de órgão público ou qualquer
                sistema de trânsito. Número fictício em cadastro real é fraude, e
                o fato de ter saído de uma ferramenta não muda isso.
              </li>
              <li>
                Deduzir categoria, validade, restrições médicas, pontuação ou
                estado emissor. Nenhum desses atributos está no número — eles
                vivem no cadastro, e a consulta oficial é o único caminho.
              </li>
              <li>
                Concluir que um condutor existe. DV correto significa apenas que
                os onze dígitos são internamente consistentes, o mesmo limite que
                vale para{" "}
                <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
                  CPF válido e CPF existente
                </a>
                .
              </li>
              <li>
                Justificar a permanência de CNHs reais em ambiente de
                desenvolvimento. Substituí-las por números gerados é o objetivo;
                manter as verdadeiras &ldquo;só em homologação&rdquo; continua
                sendo tratamento de dado pessoal, como explica o guia{" "}
                <a href="/guias/lgpd-dados-de-teste">LGPD e dados de teste</a>.
              </li>
            </ul>

            <h3>Como guardar o campo</h3>
            <p>
              Armazene o registro como texto de comprimento fixo, nunca como
              inteiro: bases com zero à esquerda são perfeitamente possíveis e um
              campo numérico devolveria dez dígitos. A CNH não tem máscara
              oficial como o CPF, então guarde os onze dígitos crus e deixe a
              formatação para a camada de exibição. E valide no servidor: máscara
              de front-end cuida da digitação, não da integridade do dado que
              chega na API.
            </p>
          </GuideSection>

          <FaqSection items={CNH_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "Portal de Serviços do SENATRAN",
                href: "https://portalservicos.senatran.serpro.gov.br/",
              },
              {
                label: "Trânsito — Ministério dos Transportes",
                href: "https://www.gov.br/transportes/pt-br/assuntos/transito",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
