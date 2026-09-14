import type { Metadata } from "next";

import { CopyableCode, SectionLabel } from "@/components/docs";
import {
  AnatomySection,
  DocsWarning,
  FaqSection,
  GuideSection,
  OfficialLinksSection,
} from "@/components/doc-tool/reference";
import { DataTable } from "@/components/guias/worked-table";
import { JsonLd } from "@/components/json-ld";
import {
  PlacaGeneratorPanel,
  PlacaValidatorPanel,
} from "@/components/placa/panels";
import { PLACA_SEGMENTS } from "@/components/placa/segments";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLACA_FAQ } from "@/lib/faq";
import {
  MAX_BATCH_SIZE,
  PLACA_ANTIGA_REGEX,
  PLACA_LENGTH,
  PLACA_MERCOSUL_REGEX,
} from "@/lib/placa";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de Placa — Mercosul (ABC1D23) e antiga (ABC-1234)";
const PAGE_DESCRIPTION =
  "Placas fictícias nos dois padrões que convivem no Brasil: Mercosul ABC1D23 e antiga ABC-1234. Gere em lote, identifique o padrão de uma sequência e monte os casos-limite do campo de placa.";

/** Entradas conferidas contra validatePlaca() de src/lib/placa. */
const CASOS_ROWS: string[][] = [
  ["ABC-1234", "Válida · antiga", "O hífen é descartado antes do teste."],
  ["abc1d23", "Válida · Mercosul", "A caixa é normalizada para maiúscula."],
  [
    "ABC 1234",
    "Válida · antiga",
    "O espaço some e a saída volta formatada com hífen.",
  ],
  [
    "A.B.C/1234",
    "Válida · antiga",
    "A normalização remove qualquer separador, não só o hífen.",
  ],
  ["ABÇ1D23", "Erro de tamanho", "O Ç é descartado e sobram 6 caracteres."],
  [
    "ABCD123",
    "Formato inválido",
    "Letra na quarta posição, que é sempre algarismo.",
  ],
  ["ABC1D234", "Erro de tamanho", "Oito caracteres depois de normalizar."],
  [
    "ABC1O34",
    "Válida · Mercosul",
    "O 0 lido como O vira outra placa, também válida.",
  ],
];

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-placa",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-placa",
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
  name: "Gerador de Placa de Veículos",
  path: "/gerador-de-placa",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de placas em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Padrão Mercosul (ABC1D23) e antigo (ABC-1234)",
    "Validação de formato com identificação do padrão",
  ],
});

export default function GeradorDePlaca() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(PLACA_FAQ)} />

      <SiteHeader
        active="placa"
        badge="ABC1D23 · ABC-1234"
        heading="Gerador de Placa (Mercosul e antiga)"
        lead="Sorteia placas nos dois padrões que hoje circulam juntos, em lotes de até 100. O validador diz se a sequência é Mercosul, antiga ou nenhuma das duas — a placa não tem dígito verificador, então a checagem é de formato."
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <PlacaGeneratorPanel />
        </TabsContent>

        <TabsContent value="validator" className="mt-5">
          <PlacaValidatorPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            As placas geradas são combinações aleatórias e fictícias, destinadas
            exclusivamente a testes de software. Não correspondem a veículos
            emplacados.
          </DocsWarning>

          <GuideSection title="Como a placa brasileira é montada">
            <p>
              Sete caracteres, três letras na frente e nenhuma conta para
              conferir: a placa é o identificador veicular mais fácil de gerar e
              o mais ingrato de validar. Duas gerações de placa circulam ao mesmo
              tempo, e um cadastro que aceite apenas uma delas recusa boa parte
              da frota.
            </p>

            <h3>Os dois padrões em circulação</h3>
            <p>
              O padrão antigo tem <strong>três letras e quatro algarismos</strong>,
              exibido com hífen — <code>ABC-1234</code> — e traz estampados o
              município e a UF de emplacamento. Desde 2018 as placas novas seguem
              o <strong>padrão Mercosul</strong>, <code>ABC1D23</code>, em que a{" "}
              <strong>quinta posição</strong> — o que antes era o segundo
              algarismo — passou a ser uma letra. A ordem fica letra, letra,
              letra, algarismo, letra, algarismo, algarismo.
            </p>
            <p>
              O comprimento não mudou: continuam sendo sete caracteres, então
              colunas, máscaras e limites de formulário dimensionados para o
              modelo antigo seguem servindo. A conversão de uma placa antiga para
              a equivalente Mercosul mexe num único caractere — o algarismo da
              quinta posição vira letra por uma tabela fixa, de 0=A a 9=J — e a
              categoria do veículo não está codificada em lugar nenhum da
              sequência: no Mercosul ela aparece apenas na cor dos caracteres,
              sobre fundo branco. A tabela inteira, as seis categorias de cor e
              as situações em que a troca da placa é obrigatória estão no guia{" "}
              <a href="/guias/placa-mercosul-vs-antiga">
                placa Mercosul e placa antiga
              </a>
              . Esta página não converte placas: ela sorteia lotes nos dois
              padrões e diz a qual deles uma sequência pertence.
            </p>

            <h3>A placa não tem dígito verificador</h3>
            <p>
              Diferente do <a href="/gerador-de-renavam">RENAVAM</a>, do CPF e de
              outros documentos que fecham a conta com{" "}
              <a href="/guias/modulo-11-digito-verificador">módulo 11</a>, a
              placa não tem nenhum caractere de controle. Se a sequência
              digitada continua casando com um dos dois formatos, ela passa —
              inclusive quando um caractere foi trocado por engano.
            </p>
            <p>
              Isso pesa em dois lugares. Em leitura por OCR, as confusões
              clássicas (O com 0, I com 1, B com 8, S com 5) produzem placas
              sintaticamente perfeitas e semanticamente erradas, sem nenhum
              alarme possível no lado do software. E em digitação manual, a única
              defesa real é cruzar a placa com outro identificador do veículo,
              como RENAVAM ou chassi. Por isso o validador desta página responde
              só três coisas: é formato Mercosul, é formato antigo, ou não é
              placa. Qualquer promessa além disso seria falsa.
            </p>

            <h3>Quando usar (e quando não)</h3>
            <p>
              Faz sentido gerar placas fictícias para popular cadastros de frota
              e de veículos, montar fixtures de estacionamento, pedágio, seguro e
              multas, exercitar a máscara e a expressão regular do campo, e
              checar se a rotina de importação trata os dois padrões. O gerador
              tem a opção <strong>Aleatório</strong> justamente para isso: um
              lote misto obriga o código a lidar com as duas formas na mesma
              carga, em vez de acertar só a que o desenvolvedor tinha em mente.
            </p>
            <p>
              O que não fazer: tratar uma placa gerada aqui como referência a um
              veículo. Sem dígito verificador, todo o espaço de sete caracteres é
              formalmente válido, então uma combinação sorteada pode coincidir
              com uma placa realmente emplacada — ela não é um número
              &ldquo;impossível&rdquo;, apenas um número que não consultamos em
              lugar nenhum. Nada de usar essas placas em consulta de débitos, em
              base publicada junto a dados pessoais ou em qualquer fluxo que
              trate a sequência como identidade de veículo. E, mesmo com placas
              reais, evite usá-la como chave primária: a placa de um veículo pode
              mudar, o chassi não.
            </p>
          </GuideSection>

          <GuideSection title="O que testar num campo de placa">
            <p>
              O campo de placa é curto e parece trivial, e é justamente por isso
              que costuma sair errado: quase todo defeito aparece antes da
              validação, na hora de decidir o que conta como &ldquo;a mesma
              placa&rdquo;. A lista abaixo é o que vale exercitar com os lotes
              gerados aqui.
            </p>

            <h3>Aceitar os dois formatos, sem perder qual é qual</h3>
            <p>
              A primeira regra é óbvia e mesmo assim é a que mais quebra
              cadastro: o campo precisa aceitar <code>ABC-1234</code> e{" "}
              <code>ABC1D23</code>. A tentação é resolver com uma expressão só,
              aceitando letra ou algarismo na quinta posição. Funciona para
              barrar lixo, mas apaga a única informação que separa os dois
              padrões — e você vai precisar dela para decidir se exibe o hífen,
              para relatórios de frota antiga e para saber se uma importação
              trouxe placas já migradas. Teste com os dois padrões separados e
              guarde o resultado, como faz o validador desta página, que devolve
              o selo Mercosul ou Antiga junto do veredito.
            </p>
            <p>
              Vale também testar o campo com uma placa antiga sem hífen:{" "}
              <code>ABC1234</code> é a mesma coisa que <code>ABC-1234</code> e
              precisa ser aceita, porque é assim que a maior parte dos sistemas
              exporta. O hífen é apresentação, não dado.
            </p>

            <h3>Normalizar antes de validar</h3>
            <p>
              A normalização usada aqui descarta tudo que não é letra ou
              algarismo e sobe a caixa: <code>abc-1234</code>,{" "}
              <code>ABC 1234</code> e <code>abc1234</code> chegam ao teste como a
              mesma sequência de sete caracteres. Três decisões escondidas nesse
              passo merecem teste próprio. A primeira é{" "}
              <strong>quando</strong> normalizar: reescrever o valor a cada tecla
              atrapalha quem cola o texto ou apaga o meio da placa para corrigir,
              e o comum é normalizar ao sair do campo e antes de gravar,
              guardando a forma limpa e exibindo a formatada.
            </p>
            <p>
              A segunda é o que fazer com <strong>espaços</strong>. Colar de
              planilha traz espaço nas pontas e, com frequência, um espaço
              rígido (U+00A0) que <code>trim()</code> não remove — descartar
              qualquer caractere não alfanumérico resolve os dois casos de uma
              vez. A terceira é o quanto de permissividade você quer: uma
              normalização que remove tudo aceita também{" "}
              <code>A.B.C/1234</code> como placa válida. Para digitação manual
              isso é bom; para uma importação em lote, talvez você prefira
              rejeitar separadores estranhos e registrar a linha suspeita em vez
              de consertá-la em silêncio. Decida e escreva o teste que fixa a
              decisão.
            </p>

            <h3>Tamanho e tipo da coluna</h3>
            <p>
              Guardada normalizada, a placa ocupa exatamente sete caracteres nos
              dois padrões — <code>char(7)</code> serve e nunca vai precisar
              crescer por causa do Mercosul. Se optar por gravar a forma exibida,
              com hífen, reserve oito e lembre que a comparação entre as duas
              formas passa a exigir normalizar dos dois lados. O campo do
              formulário pode ter <code>maxlength=&quot;8&quot;</code> para
              acomodar o hífen digitado, mas a validação roda sobre a sequência
              limpa, não sobre o que está na tela.
            </p>
            <p>
              Normalize a caixa na escrita: em coluna com collation sensível a
              maiúsculas, <code>abc1d23</code> e <code>ABC1D23</code> viram duas
              linhas diferentes e a busca por uma não acha a outra. E, se criar
              índice único, faça-o valer apenas entre os
              veículos ativos: uma placa pode ser substituída e a sequência
              antiga reaparece no histórico do mesmo veículo — ou, anos depois,
              em outro.
            </p>

            <h3>O que o teste não pode afirmar</h3>
            <p>
              Como não há dígito verificador, não escreva caso esperando que uma
              placa trocada por engano seja recusada por cálculo: qualquer
              sequência com a forma certa passa. O que dá para testar é o
              contrário — que o sistema <em>não</em> finge uma certeza que não
              tem. Se o fluxo depende de a placa estar correta, a asserção útil é
              sobre a conferência contra{" "}
              <a href="/gerador-de-renavam">RENAVAM</a> ou chassi; sobre a placa
              isolada, a única afirmação honesta é que a forma bate.
            </p>
          </GuideSection>

          <GuideSection title="Casos-limite para a suíte de testes">
            <p>
              As entradas abaixo foram conferidas contra o validador desta
              página e cobrem os pontos em que um campo de placa costuma se
              comportar de forma diferente do que o teste ingênuo assume.
            </p>
            <DataTable
              caption="Entradas úteis num teste de formulário de placa"
              headers={["Entrada", "Resultado", "Por quê"]}
              rows={CASOS_ROWS}
            />
            <p>
              Duas linhas merecem atenção. <code>ABÇ1D23</code> falha por{" "}
              <strong>tamanho</strong>, não por formato: o cedilha é descartado
              na normalização e sobram seis caracteres, então a mensagem que
              chega ao usuário fala de comprimento quando o problema era outro.
              Vale decidir se a sua mensagem de erro deve distinguir os dois
              casos — e, se deve, o teste precisa comparar o texto do erro, não
              só o booleano.
            </p>
            <p>
              A outra é <code>ABC1O34</code>. Uma placa antiga{" "}
              <code>ABC-1034</code> lida por OCR com o zero virando a letra O
              produz uma placa Mercosul perfeitamente válida — de outro veículo.
              É o exemplo mais limpo de que aceitar não é reconhecer, e por isso
              todo teste de leitura automática deve incluir pelo menos um par
              assim, em que o erro não gera exceção nenhuma.
            </p>
            <p>
              Um conjunto mínimo razoável tem, além dessas: campo vazio e campo
              só com separadores (ambos caem na regra de sete caracteres), uma
              placa de cada padrão para o caminho feliz, uma entrada com quebra
              de linha no meio de uma colagem múltipla, e o limite do lote — o
              gerador entrega no máximo {MAX_BATCH_SIZE} placas por vez, e um
              teste de importação que assuma esse teto vai falhar no primeiro
              arquivo maior que ele. Se o formulário aceita colar várias placas
              de uma vez, teste também a separação por vírgula, por ponto e
              vírgula e por linha — as três que o validador daqui aceita —,
              porque a origem costuma ser uma planilha e cada usuário exporta de
              um jeito.
            </p>
          </GuideSection>

          <AnatomySection
            title="Anatomia da placa"
            sample="ABC1D23"
            segments={PLACA_SEGMENTS}
            length={PLACA_LENGTH}
            details={[
              "Letras: três letras iniciais, iguais nos dois padrões.",
              "Identificador: no Mercosul, algarismo-letra-algarismo-algarismo; no antigo, quatro algarismos.",
            ]}
          />

          <div className="space-y-3">
            <SectionLabel>Regex</SectionLabel>
            <CopyableCode
              value={PLACA_MERCOSUL_REGEX.source}
              label="Regex Mercosul"
            />
            <CopyableCode
              value={PLACA_ANTIGA_REGEX.source}
              label="Regex antiga"
            />
            <p className="text-sm text-muted-foreground">
              As duas expressões assumem a placa já normalizada: sem hífen, sem
              espaço e em caixa alta. Formas unificadas e as armadilhas mais
              comuns estão no guia de{" "}
              <a
                href="/guias/regex-documentos-brasileiros"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                regex de documentos brasileiros
              </a>
              .
            </p>
          </div>

          <FaqSection items={PLACA_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "Ministério dos Transportes — Trânsito",
                href: "https://www.gov.br/transportes/pt-br/assuntos/transito",
              },
              {
                label: "Portal de Serviços do SENATRAN",
                href: "https://portalservicos.senatran.serpro.gov.br/",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
