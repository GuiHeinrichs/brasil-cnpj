import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("regiao-fiscal-cpf")!;

export const metadata: Metadata = guideMetadata(guide);

const REGION_ROWS = [
  [
    "1",
    "1ª",
    "DF, GO, MS, MT e TO",
    "Cinco UFs; a única região que inclui o Distrito Federal.",
  ],
  [
    "2",
    "2ª",
    "AC, AM, AP, PA, RO e RR",
    "Seis UFs — o dígito que menos restringe o estado.",
  ],
  ["3", "3ª", "CE, MA e PI", "Três UFs do Nordeste."],
  ["4", "4ª", "AL, PB, PE e RN", "Quatro UFs do Nordeste oriental."],
  ["5", "5ª", "BA e SE", "Duas UFs, separadas do restante do Nordeste."],
  ["6", "6ª", "MG", "UF única: o dígito 6 só sai em Minas Gerais."],
  ["7", "7ª", "ES e RJ", "Duas UFs do Sudeste, sem SP e sem MG."],
  [
    "8",
    "8ª",
    "SP",
    "UF única; como concentra a maior população do país, tende a ser o dígito mais frequente em bases reais.",
  ],
  ["9", "9ª", "PR e SC", "Duas UFs do Sul; o RS fica de fora, na 10ª."],
  [
    "0",
    "10ª",
    "RS",
    "UF única e o único dígito que não coincide com o número da região.",
  ],
];

const REGION_CODE = `const REGIOES = [
  { digito: "1", regiao: "1ª", ufs: ["DF", "GO", "MS", "MT", "TO"] },
  { digito: "2", regiao: "2ª", ufs: ["AC", "AM", "AP", "PA", "RO", "RR"] },
  { digito: "3", regiao: "3ª", ufs: ["CE", "MA", "PI"] },
  { digito: "4", regiao: "4ª", ufs: ["AL", "PB", "PE", "RN"] },
  { digito: "5", regiao: "5ª", ufs: ["BA", "SE"] },
  { digito: "6", regiao: "6ª", ufs: ["MG"] },
  { digito: "7", regiao: "7ª", ufs: ["ES", "RJ"] },
  { digito: "8", regiao: "8ª", ufs: ["SP"] },
  { digito: "9", regiao: "9ª", ufs: ["PR", "SC"] },
  { digito: "0", regiao: "10ª", ufs: ["RS"] },
] as const;

export type RegiaoFiscal = (typeof REGIOES)[number];

/**
 * Lê a região fiscal de um CPF já validado.
 * Retorna null quando a entrada não tem 11 dígitos — e nunca "adivinha" a UF:
 * quem consome o resultado recebe a lista inteira de estados da região.
 */
export function regiaoFiscal(cpf: string): RegiaoFiscal | null {
  const digitos = cpf.replace(/\\D/g, "");
  if (digitos.length !== 11) return null;

  return REGIOES.find((regiao) => regiao.digito === digitos[8]) ?? null;
}`;

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        O CPF carrega um único dado legível a olho nu: o{" "}
        <strong>nono dígito</strong> indica a <strong>região fiscal</strong> da
        Receita Federal responsável pela inscrição. É o que permite gerar um CPF
        fictício &ldquo;de um estado&rdquo;, e é também a informação do documento
        mais usada fora do lugar — porque região fiscal de emissão e estado da
        pessoa são coisas diferentes, e ninguém percebe isso até o relatório sair
        errado.
      </p>

      <h2>Onde fica o dígito da região</h2>
      <p>
        São onze algarismos: oito de número-base sequencial, o nono com a região
        fiscal e os dois últimos de verificação. A contagem é da esquerda para a
        direita, sobre os dígitos sem máscara — em{" "}
        <code>123.456.789-09</code> o nono dígito é o <code>9</code>, o último
        antes do hífen, correspondente à 9ª região fiscal (Paraná e Santa
        Catarina). Com máscara, esse caractere está na posição 11 da string, o
        que já rendeu muito <code>cpf[8]</code> aplicado ao texto formatado e
        lendo um ponto em vez de um algarismo.
      </p>
      <p>
        O dígito da região não é um campo separado pendurado no número: ele entra
        no cálculo dos dois verificadores como qualquer outro. Trocá-lo para
        &ldquo;converter&rdquo; um CPF de estado invalida o documento, a menos
        que os dois DVs sejam recalculados pelo{" "}
        <a href="/guias/modulo-11-digito-verificador">módulo 11</a>.
      </p>

      <h2>As dez regiões fiscais</h2>
      <p>
        A Receita divide o país em dez regiões fiscais. Nove usam o dígito
        homônimo e a décima usa o <code>0</code> — a exceção que costuma faltar
        nos mapas escritos às pressas.
      </p>
      <DataTable
        caption="Dígito na nona posição do CPF, região fiscal correspondente e o que ele permite (ou não) concluir."
        headers={["Dígito", "RF", "Estados", "Observação"]}
        rows={REGION_ROWS}
      />
      <p>
        Repare na assimetria: só três dígitos — <code>6</code>, <code>8</code> e{" "}
        <code>0</code> — apontam para uma UF única. Nos outros sete, o número
        devolve um conjunto de dois a seis estados, e não existe desempate
        possível dentro do próprio CPF. Qualquer código que transforme dígito em
        sigla de estado está escolhendo um elemento arbitrário desse conjunto.
      </p>

      <h2>Lendo o dígito em código</h2>
      <p>
        A leitura é barata: normalizar, conferir o tamanho e indexar. O que vale
        decidir com cuidado é o formato do retorno — devolver uma UF única
        mentiria em sete dos dez casos, então a função entrega a região inteira e
        deixa a ambiguidade visível para quem chama.
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Leia a região só depois de validar o CPF: em um número inválido, o nono dígito é apenas um algarismo qualquer."
        code={REGION_CODE}
      />
      <p>
        Duas armadilhas ficam de fora dessa função de propósito. Ela não valida
        os dígitos verificadores, porque validação e interpretação são
        responsabilidades distintas; e não rejeita sequências repetidas como{" "}
        <code>111.111.111-11</code>, que passam no módulo 11 e devolveriam
        alegremente a 1ª região fiscal.
      </p>

      <h2>CPF emitido no exterior</h2>
      <p>
        Brasileiros que moram fora e estrangeiros que precisam de CPF para abrir
        conta, comprar imóvel ou receber rendimentos no Brasil também se
        inscrevem — pela rede consular ou pelos canais eletrônicos da Receita. O
        número que sai é um CPF comum, de onze dígitos, com nono dígito dentro da
        mesma tabela de dez regiões.
      </p>
      <p>
        E é justamente aí que a interpretação geográfica desmorona. O CPF{" "}
        <strong>não tem código de exterior</strong>. O{" "}
        <a href="/guias/titulo-de-eleitor-estrutura-uf-zona-secao">
          título de eleitor
        </a>{" "}
        tem: seus dígitos de UF reservam o valor <code>28</code> para ZZ, o
        exterior. No CPF, a inscrição feita de fora do país recebe o dígito da
        unidade que a processou, e nada no número diz que a pessoa não mora no
        Brasil. Um cadastro que exige UF brasileira coerente com a região fiscal
        rejeita esses usuários por definição, sem log que explique o porquê.
      </p>

      <h2>O que muda com o CPF como número único de identificação</h2>
      <p>
        Desde a Lei nº 14.534/2023, o CPF é o número suficiente e único de
        identificação do cidadão nas bases de dados dos serviços públicos. Na
        prática, ele deixou de ser mais um campo do cadastro e virou a chave de
        junção entre sistemas — o mesmo papel que a{" "}
        <a href="/guias/rg-por-estado-e-cin-carteira-identidade-nacional">
          Carteira de Identidade Nacional
        </a>{" "}
        consolida ao estampar o CPF como número do documento.
      </p>
      <p>
        Para quem escreve software, três consequências. A primeira é de
        armazenamento: chave de junção nacional exige coluna de texto com onze
        posições, porque CPF que começa com zero perde o dígito em coluna
        numérica — e note que o zero da 10ª região fiscal está na nona posição,
        protegido, enquanto o zero à esquerda do número-base é o que some. A
        segunda é de integração: quanto mais sistemas cruzam dados pelo mesmo
        número, mais barato fica derivar atributos dele em vez de perguntar ao
        usuário. A terceira é a que este guia insiste: nada disso mudou a tabela
        de regiões nem transformou o nono dígito em informação de domicílio.
      </p>

      <h2>Por que não usar esse dígito em regra de negócio</h2>
      <p>
        O dígito diz onde o CPF foi <strong>emitido</strong>, não onde a pessoa
        nasceu, mora ou paga imposto. Quem tirou o CPF aos dezoito anos morando
        em Brasília e se mudou para Recife carrega o dígito <code>1</code> pelo
        resto da vida. O número não acompanha mudança de endereço.
      </p>
      <p>
        O estrago costuma acontecer em dois tempos. Primeiro alguém escreve um
        script para preencher a coluna <code>uf</code> vazia de meio milhão de
        cadastros antigos a partir do CPF, e resolve a ambiguidade com um{" "}
        <code>regiao.ufs[0]</code>. Todo cliente com dígito <code>2</code> vira
        acreano, todo dígito <code>3</code> vira cearense, e o relatório regional
        do trimestre seguinte mostra o Acre como praça em ascensão. Depois, uma
        regra antifraude passa a pontuar divergência entre a UF do endereço e a
        região fiscal do CPF — e começa a barrar exatamente os clientes de sempre:
        quem mudou de estado, quem tirou o documento na infância em outra cidade
        e todo mundo que se inscreveu no exterior.
      </p>
      <p>
        O antídoto é curto. UF de cliente se pergunta no formulário ou se deriva
        do endereço; o nono dígito serve para explicar o número, montar massa de
        teste e conferir se um gerador respeitou a região pedida. Ele é um indício
        fraco de origem do documento — parente do fato de que{" "}
        <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
          CPF válido não é CPF existente
        </a>
        : o número passa no cálculo, mas isso não autoriza nenhuma conclusão sobre
        a pessoa por trás dele.
      </p>

      <h2>Gerando CPF por estado para testes</h2>
      <p>
        No sentido inverso, o dígito é útil e previsível: fixa-se o nono valor na
        região desejada e calculam-se os dois verificadores em cima da base
        resultante. É assim que o{" "}
        <a href="/gerador-de-cpf">gerador de CPF</a> permite escolher a região
        fiscal e que o <a href="/gerador-de-pessoas">gerador de pessoas</a> mantém
        a ficha coerente — o CPF sai com o dígito da UF escolhida e o endereço cai
        na faixa de CEP daquele estado.
      </p>
      <p>
        Um aviso sobre a massa produzida assim: sortear regiões uniformemente
        gera dez grupos do mesmo tamanho, distribuição que nenhuma base real tem.
        Se o objetivo é testar desempenho de índice ou de agrupamento por estado,
        vale ponderar o sorteio pela população que você espera atender, em vez de
        deixar o Acre com o mesmo peso de São Paulo.
      </p>
    </ArticleLayout>
  );
}
