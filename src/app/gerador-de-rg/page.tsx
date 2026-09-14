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
import { CodeBlock } from "@/components/guias/code-block";
import { JsonLd } from "@/components/json-ld";
import {
  RgFormatterPanel,
  RgGeneratorPanel,
  RgValidatorPanel,
} from "@/components/rg/panels";
import { RG_SEGMENTS } from "@/components/rg/segments";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RG_FAQ } from "@/lib/faq";
import { MAX_BATCH_SIZE, RG_LENGTH, RG_MASKED_REGEX, RG_REGEX } from "@/lib/rg";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de RG (padrão SSP-SP) com validador de dígito";
const PAGE_DESCRIPTION =
  "Gere RGs fictícios no padrão SSP-SP com dígito verificador correto, inclusive os terminados em X, e valide ou formate a máscara 00.000.000-0 para testes.";

/** Modelagem do campo em banco — mostrada na seção sobre como guardar o RG. */
const RG_SCHEMA_SQL = `-- Errado: descarta zeros à esquerda e não comporta o DV "X"
rg              numeric(9),

-- Certo: texto normalizado, mais a origem do documento
rg_numero       varchar(20) not null,   -- normalizado: 245989730, sem pontuação
rg_orgao        varchar(20),            -- SSP, DETRAN, Marinha, PF, OAB...
rg_uf           char(2)                 -- sem isto não dá para escolher o algoritmo`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-rg",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-rg",
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
  name: "Gerador de RG",
  path: "/gerador-de-rg",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de RG válido em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Padrão SSP-SP com dígito verificador por módulo 11",
    "Validação e formatação da máscara 00.000.000-0",
  ],
});

export default function GeradorDeRg() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(RG_FAQ)} />

      <SiteHeader
        active="rg"
        badge="Padrão SSP-SP · módulo 11"
        heading="Gerador de RG (padrão SSP-SP)"
        lead="Oito dígitos de base e um verificador por módulo 11, como a Secretaria de Segurança Pública de São Paulo numera. Gere em lote, confira RGs que você já tem e aplique ou remova a máscara 00.000.000-0."
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
          <TabsTrigger value="formatter">Formatador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <RgGeneratorPanel />
        </TabsContent>

        <TabsContent value="validator" className="mt-5">
          <RgValidatorPanel />
        </TabsContent>

        <TabsContent value="formatter" className="mt-5">
          <RgFormatterPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Números de RG gerados nesta ferramenta são fictícios e destinados
            exclusivamente a testes de software. Não correspondem a documentos
            reais nem constam em nenhuma Secretaria de Segurança Pública.
          </DocsWarning>

          <GuideSection title="Por que o RG não tem um padrão único">
            <p>
              O Registro Geral nasce em um instituto de identificação estadual,
              não em um cadastro federal. Cada Secretaria de Segurança Pública
              mantém a própria série de numeração, decide quantos dígitos ela tem
              e se haverá dígito verificador — parte dos estados usa, parte não.
              Não existe, portanto, uma função única de validação de RG que valha
              para o país inteiro: existe uma regra por unidade federativa, e para
              várias delas a única checagem possível é o comprimento.
            </p>

            <h3>O padrão SSP-SP, adotado aqui</h3>
            <p>
              Esta página gera e valida na convenção de São Paulo: oito dígitos de
              base e um verificador calculado por módulo 11 com os pesos 2 a 9,
              exibido na máscara{" "}
              <code>00.000.000-0</code>. A escolha não é arbitrária — é a
              convenção que a maioria dos validadores em circulação implementa, e
              por isso a que um número fictício precisa satisfazer para atravessar
              um formulário de teste. O verificador sai como algarismo de 0 a 9 ou
              como a letra <code>X</code>, quando a conta resulta em 10. O passo a
              passo do cálculo, com o tratamento de cada resto possível, está no
              guia{" "}
              <a href="/guias/modulo-11-digito-verificador">
                módulo 11 explicado
              </a>
              .
            </p>

            <h3>Por que um RG de outro estado não valida aqui</h3>
            <p>
              Cole no Validador um RG emitido no Rio Grande do Sul, no Paraná ou
              na Bahia e o resultado mais provável é{" "}
              <em>dígito verificador inválido</em>. O número não está errado: ele
              foi construído por outra regra, ou por regra nenhuma. Quando o
              documento de origem tem mais ou menos de nove caracteres, a recusa
              acontece antes, no teste de comprimento — o que já indica que nem o
              tamanho serve de critério nacional.
            </p>
            <p>
              Daí vem a inversão que costuma pegar quem escreve a validação: um RG
              reprovado aqui pode estar perfeitamente correto na origem, e um RG
              aprovado aqui pode nunca ter sido emitido por ninguém. As variações
              entre estados e o que muda com a Carteira de Identidade Nacional
              estão no guia{" "}
              <a href="/guias/rg-por-estado-e-cin-carteira-identidade-nacional">
                RG por estado e a nova CIN
              </a>
              .
            </p>

            <h3>Como modelar o campo em um sistema</h3>
            <ul>
              <li>
                Guarde como <strong>texto</strong>. Coluna numérica descarta
                zeros à esquerda e não comporta o <code>X</code>.
              </li>
              <li>
                Guarde <strong>órgão emissor e UF</strong> em campos separados. O
                número sozinho é ambíguo: a mesma sequência pode existir em dois
                estados, para duas pessoas diferentes. Sem a UF não há sequer como
                decidir qual algoritmo aplicar.
              </li>
              <li>
                Aceite emissores que não são SSP. A identidade civil também sai de
                DETRAN, Marinha, Aeronáutica, Polícia Federal e conselhos
                profissionais, cada um com numeração própria.
              </li>
              <li>
                Normalize antes de gravar (sem pontos nem traço, <code>X</code> em
                maiúscula) e aplique a máscara apenas na exibição.
              </li>
              <li>
                Torne o cálculo do DV <strong>condicional à UF</strong>, nunca uma
                validação global — e, fora de São Paulo, prefira tratar a
                divergência como aviso em vez de bloqueio de cadastro.
              </li>
            </ul>
            <CodeBlock
              language="SQL"
              caption="Três colunas em vez de uma: o número perde o sentido quando separado de quem o emitiu."
              code={RG_SCHEMA_SQL}
            />
          </GuideSection>

          <AnatomySection
            title="Anatomia do RG"
            sample="24.598.973-0"
            segments={RG_SEGMENTS}
            length={RG_LENGTH}
            details={[
              "Base: oito dígitos do número de registro geral.",
              "Dígito verificador: módulo 11 sobre a base; pode ser 0-9 ou X.",
            ]}
          />

          <div className="space-y-3">
            <SectionLabel>Regex</SectionLabel>
            <CopyableCode value={RG_REGEX.source} label="Regex sem máscara" />
            <CopyableCode
              value={RG_MASKED_REGEX.source}
              label="Regex com máscara"
            />
          </div>

          <AlgorithmSection
            intro={
              <>
                Pesos 2 a 9 sobre os oito dígitos da base, da esquerda para a
                direita. Os dois casos abaixo cobrem as saídas menos óbvias: o
                resto 0, que devolve o dígito <code className="font-mono text-foreground">0</code>,
                e o resto 1, que devolve <code className="font-mono text-foreground">X</code>.
              </>
            }
            steps={[
              "Multiplicar os 8 dígitos pelos pesos 2, 3, 4, 5, 6, 7, 8 e 9, da esquerda para a direita.",
              "Somar os produtos e calcular o resto da divisão por 11.",
              "DV = 11 − resto; resultado 10 vira X e 11 vira 0.",
            ]}
            worked={[
              {
                title: "24.598.973-0 — quando o resto é 0",
                steps: [
                  { char: "2", weight: 2 },
                  { char: "4", weight: 3 },
                  { char: "5", weight: 4 },
                  { char: "9", weight: 5 },
                  { char: "8", weight: 6 },
                  { char: "9", weight: 7 },
                  { char: "7", weight: 8 },
                  { char: "3", weight: 9 },
                ],
                sum: 275,
                remainder: 0,
                rule: "11 − 0 = 11, e 11 não é um dígito: por convenção, vira 0.",
                result: "0",
              },
              {
                title: "82.345.678-X — quando o resto é 1",
                steps: [
                  { char: "8", weight: 2 },
                  { char: "2", weight: 3 },
                  { char: "3", weight: 4 },
                  { char: "4", weight: 5 },
                  { char: "5", weight: 6 },
                  { char: "6", weight: 7 },
                  { char: "7", weight: 8 },
                  { char: "8", weight: 9 },
                ],
                sum: 254,
                remainder: 1,
                rule: "11 − 1 = 10, que não cabe em uma posição: o dígito é a letra X.",
                result: "X",
              },
            ]}
            note="Cada estado emite o RG com regras próprias. Esta ferramenta usa a convenção da SSP-SP, a mais difundida entre os validadores."
          />

          <GuideSection title="Erros comuns no campo RG">
            <h3>A coluna só aceita dígitos e o X é recusado</h3>
            <p>
              Como o verificador é o resto da divisão por 11, aproximadamente um
              em cada onze RGs do padrão paulista termina em <code>X</code>. É
              frequência suficiente para o problema aparecer em produção e baixa
              o bastante para passar em branco na homologação. Os três sintomas
              são sempre variações da mesma causa: a máscara de entrada aceita
              apenas <code>[0-9]</code>, o regex de validação é{" "}
              <code>{"^\\d{9}$"}</code> ou a coluna do banco é numérica. O padrão
              correto é o publicado na seção Regex acima, com{" "}
              <code>[0-9X]</code> na última posição — e convém aceitar o{" "}
              <code>x</code> minúsculo digitado pelo usuário, normalizando para
              maiúscula antes de comparar. Gere um lote aqui até sair um número
              terminado em <code>X</code> e use-o como caso de teste fixo. Esse
              descuido e o de barrar RG emitido fora de São Paulo estão
              detalhados, com sintoma e reprodução, em{" "}
              <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
                erros comuns em validadores de documentos
              </a>
              .
            </p>

            <h3>RG usado como chave única de pessoa</h3>
            <p>
              Enquanto não havia base unificada, quem morou em estados diferentes
              podia obter um RG em cada um, sem relação entre os números. Uma
              coluna <code>rg</code> com restrição de unicidade embute duas
              suposições erradas de uma vez: que cada pessoa tem exatamente um RG
              e que dois RGs iguais pertencem à mesma pessoa. A segunda causa mais
              estrago, porque sequências curtas de estados distintos colidem de
              verdade — o resultado vai de cadastro duplicado a dois clientes
              fundidos no mesmo registro. Para identificar pessoa física, a chave
              é o CPF, que é justamente o identificador adotado pela CIN.
            </p>

            <h3>Deslizes menores que aparecem depois</h3>
            <ul>
              <li>
                Comparar valor com máscara contra valor sem máscara: o mesmo
                documento vira dois registros distintos. Normalize os dois lados
                antes de comparar ou de aplicar índice único.
              </li>
              <li>
                Deduzir data ou local de emissão a partir do número. A base é
                sequencial dentro do estado, mas nada nela codifica quando ou onde
                o documento foi expedido.
              </li>
              <li>
                Exigir RG em cadastro que não precisa dele. Dado pessoal coletado
                sem finalidade definida é passivo — o tema está em{" "}
                <a href="/guias/lgpd-dados-de-teste">LGPD e dados de teste</a>.
              </li>
              <li>
                Popular homologação com RGs de pessoas reais, copiados da base de
                produção. É exatamente o cenário que um gerador de números
                fictícios existe para substituir.
              </li>
            </ul>
          </GuideSection>

          <FaqSection items={RG_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "Poupatempo — RG em São Paulo",
                href: "https://www.poupatempo.sp.gov.br/",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
