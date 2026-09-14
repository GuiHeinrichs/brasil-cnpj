import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("placa-mercosul-vs-antiga")!;

export const metadata: Metadata = guideMetadata(guide);

const CONVERSAO_ROWS: string[][] = [
  ["0", "A", "ABC-1034 → ABC1A34"],
  ["1", "B", "ABC-1134 → ABC1B34"],
  ["2", "C", "ABC-1234 → ABC1C34"],
  ["3", "D", "ABC-1334 → ABC1D34"],
  ["4", "E", "ABC-1434 → ABC1E34"],
  ["5", "F", "ABC-1534 → ABC1F34"],
  ["6", "G", "ABC-1634 → ABC1G34"],
  ["7", "H", "ABC-1734 → ABC1H34"],
  ["8", "I", "ABC-1834 → ABC1I34"],
  ["9", "J", "ABC-1934 → ABC1J34"],
];

const CATEGORIA_ROWS: string[][] = [
  [
    "Particular",
    "Preta",
    "Carros e motos de uso comum, de pessoa física ou jurídica.",
  ],
  [
    "Comercial",
    "Vermelha",
    "Transporte remunerado: táxi, ônibus, vans escolares, caminhões de aluguel.",
  ],
  ["Oficial", "Azul", "Veículos da administração pública."],
  [
    "Diplomática",
    "Dourada",
    "Corpo diplomático, repartições consulares e organismos internacionais.",
  ],
  ["Colecionador", "Prateada", "Veículos antigos registrados como de coleção."],
  [
    "Aprendizagem",
    "Verde",
    "Veículos de autoescola usados na formação de condutores.",
  ],
];

const CONVERSAO_CODE = `const PLACA_ANTIGA = /^[A-Z]{3}\\d{4}$/;
const PLACA_MERCOSUL = /^[A-Z]{3}\\d[A-Z]\\d{2}$/;
const PLACA_QUALQUER = /^[A-Z]{3}\\d[A-Z0-9]\\d{2}$/;

const DIGITO_PARA_LETRA = "ABCDEFGHIJ";

function normalizar(entrada: string): string {
  return entrada.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

function paraMercosul(entrada: string): string | null {
  const placa = normalizar(entrada);
  if (PLACA_MERCOSUL.test(placa)) return placa; // já migrada
  if (!PLACA_ANTIGA.test(placa)) return null; // não é placa brasileira
  const letra = DIGITO_PARA_LETRA[Number(placa[4])];
  return placa.slice(0, 4) + letra + placa.slice(5);
}

paraMercosul("ABC-1234"); // "ABC1C34"
paraMercosul("abc 1234"); // "ABC1C34"
paraMercosul("ABCD123"); // null`;

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Se você desenvolve qualquer sistema que lida com veículos — frota,
        estacionamento, pedágio, seguro, multas —, precisa entender os dois padrões
        de placa que hoje convivem nas ruas: a <strong>placa antiga</strong>, no
        formato <code>ABC-1234</code>, e a <strong>placa Mercosul</strong>, no
        formato <code>ABC1D23</code>. Este guia explica a diferença posição a
        posição, as cores que separam as categorias, quando a troca é obrigatória e
        a regra exata que converte uma placa na outra.
      </p>

      <h2>O padrão antigo</h2>
      <p>
        Por décadas o Brasil usou placas com <strong>três letras seguidas de
        quatro algarismos</strong>, exibidas com um hífen: <code>ABC-1234</code>.
        As combinações de letras eram distribuídas em faixas por estado e
        município, e a própria placa trazia impressos o nome do município e a UF de
        emplacamento. Daí vinham duas consequências para quem escrevia software:
        dava para tentar inferir a origem do veículo a partir das letras, e mudar
        de cidade obrigava a trocar a placa.
      </p>
      <p>
        O espaço de combinações é fácil de calcular: 26³ prefixos de letras
        multiplicados por 10.000 números dão 175.760.000 placas possíveis — um
        número grande, mas finito, e repartido entre as faixas de cada UF, o que
        esgotava algumas regiões muito antes do total nacional.
      </p>

      <h2>O que muda no padrão Mercosul</h2>
      <p>
        Desde 2018 as novas placas seguem o padrão <strong>Mercosul</strong>, que
        substitui o <strong>segundo algarismo por uma letra</strong>. Em termos de
        posição, é o <strong>quinto caractere</strong> da placa que muda de
        natureza: o formato passa a ser letra, letra, letra, algarismo, letra,
        algarismo, algarismo — <code>ABC1D23</code>. As três letras iniciais, o
        primeiro algarismo e os dois últimos ficam onde estavam.
      </p>
      <p>
        O total de combinações sobe para 456.976.000, exatamente 2,6 vezes o
        anterior, já que uma posição de dez valores virou uma de vinte e seis. O
        segundo objetivo foi <strong>unificar</strong> a identificação veicular
        entre os países do bloco, com o mesmo leiaute de sete caracteres, a tarja
        azul superior com a palavra MERCOSUL e a identificação do país de registro.
      </p>
      <p>
        Duas mudanças passam despercebidas e importam mais do que parecem. A
        primeira: a placa Mercosul <strong>não traz mais município e UF</strong>,
        e a numeração deixou de ser repartida por faixas regionais — qualquer
        heurística que adivinhava o estado a partir das letras morre aqui. A
        segunda: a quantidade de caracteres continua sendo <strong>sete</strong>,
        então colunas, máscaras e campos de formulário dimensionados para o padrão
        antigo não precisaram crescer. A versão brasileira ainda imprime um QR Code
        no canto direito, usado para conferir a autenticidade da placa em
        fiscalização.
      </p>

      <h2>A tabela de conversão</h2>
      <p>
        A conversão de uma placa antiga para o equivalente Mercosul é mecânica e
        afeta <strong>apenas um caractere</strong>. O algarismo da quinta posição
        vira letra segundo uma tabela direta, de <code>0=A</code> até{" "}
        <code>9=J</code>:
      </p>
      <DataTable
        caption="Conversão do quinto caractere (placa antiga → Mercosul)"
        headers={["Algarismo", "Letra", "Exemplo"]}
        rows={CONVERSAO_ROWS}
      />
      <p>
        Em <code>ABC-1234</code>, os caracteres <code>ABC</code> permanecem, o{" "}
        <code>1</code> permanece, o <code>2</code> vira <code>C</code> e{" "}
        <code>34</code> continuam iguais: a placa equivalente é{" "}
        <code>ABC1C34</code>. Como a tabela usa dez letras distintas para dez
        algarismos distintos, a conversão é injetiva — duas placas antigas
        diferentes nunca produzem a mesma placa Mercosul, o que permite migrar uma
        base inteira sem risco de colisão de chave.
      </p>
      <p>
        Note que a placa <strong>não tem dígito verificador</strong>. Ao contrário
        de CPF, PIS ou{" "}
        <a href="/guias/modulo-11-digito-verificador">qualquer documento de módulo
        11</a>, não há como detectar um caractere digitado errado: se o resultado
        ainda casa com um dos dois formatos, ele é aceito. Em campos preenchidos à
        mão ou por OCR, isso torna a conferência contra a base do{" "}
        <a href="/gerador-de-renavam">RENAVAM</a> ou do chassi a única defesa real
        contra erro de digitação.
      </p>

      <h2>Cores e categorias</h2>
      <p>
        No padrão antigo, a categoria do veículo era indicada pela cor de fundo da
        placa — cinza para particular, vermelha para aluguel, branca para oficial.
        O Mercosul inverteu a lógica: <strong>o fundo é sempre branco</strong> e
        quem carrega a informação é a <strong>cor dos caracteres</strong>.
      </p>
      <DataTable
        caption="Categorias no padrão Mercosul"
        headers={["Categoria", "Cor dos caracteres", "Uso"]}
        rows={CATEGORIA_ROWS}
      />
      <p>
        Para software, o ponto prático é que a cor <strong>não está codificada na
        sequência de caracteres</strong>. Nenhuma faixa de letras identifica táxi,
        veículo oficial ou de autoescola: a categoria vive no cadastro do veículo,
        não na placa. Um sistema que precise tratar frota comercial de forma
        diferente da particular tem de guardar esse dado em campo próprio.
      </p>

      <h2>Motocicletas</h2>
      <p>
        Motos, motonetas e ciclomotores usam a <strong>mesma combinação</strong> de
        sete caracteres, <code>ABC1D23</code>, com a mesma regra de conversão. O
        que difere é o leiaute físico: a placa de moto é disposta em duas linhas,
        com as três letras em cima e os quatro caracteres restantes embaixo, em um
        retângulo mais alto que largo. Para validação, normalização e armazenamento,
        não há nada de especial a fazer — a mesma expressão regular atende carro e
        moto.
      </p>

      <h2>Quando a troca é obrigatória</h2>
      <p>
        A migração não foi feita de uma vez. Veículos que já tinham placa antiga{" "}
        <strong>continuam com ela</strong> enquanto nada muda no registro, e a
        substituição é exigida em situações específicas:
      </p>
      <ul>
        <li>primeiro emplacamento de um veículo novo;</li>
        <li>transferência de propriedade;</li>
        <li>transferência do veículo para outro município ou outro estado;</li>
        <li>mudança de categoria, como de particular para aluguel;</li>
        <li>substituição por dano, roubo, furto ou extravio da placa.</li>
      </ul>
      <p>
        Quem já tem placa Mercosul e muda de cidade não precisa trocar de novo,
        justamente porque o novo modelo não estampa o município. A troca voluntária
        também é permitida a quem quiser antecipar a migração.
      </p>
      <p>
        A consequência para sistemas em produção é direta: os dois formatos vão
        conviver por muitos anos. Um cadastro que só aceite <code>ABC-1234</code>{" "}
        rejeita carros novos; um que só aceite <code>ABC1D23</code> rejeita a maior
        parte da frota usada. E a placa de um mesmo veículo pode mudar ao longo do
        tempo, o que desqualifica a placa como chave primária — o RENAVAM e o
        chassi são identificadores estáveis, a placa não.
      </p>

      <h2>Validando os dois formatos</h2>
      <p>
        Sem dígito verificador, validar uma placa é comparar a sequência
        normalizada com dois padrões. A expressão unificada serve quando você só
        precisa aceitar a entrada; as duas separadas servem quando precisa saber
        qual é qual — para decidir se exibe o hífen, por exemplo:
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Normalize antes de testar: a entrada chega com hífen, espaço ou minúscula."
        code={CONVERSAO_CODE}
      />
      <p>
        Repare que <code>PLACA_QUALQUER</code> aceita letra ou algarismo na quinta
        posição e, com isso, apaga a única informação que distingue os padrões.
        Outras armadilhas comuns — âncoras esquecidas, uso da flag <code>i</code> em
        vez de normalizar a caixa — estão reunidas no guia de{" "}
        <a href="/guias/regex-documentos-brasileiros">regex de documentos
        brasileiros</a>.
      </p>

      <h2>Placas para testes</h2>
      <p>
        Como não há cálculo de dígito envolvido, o que importa em uma placa de
        teste é o <strong>formato</strong>. Um conjunto mínimo de casos cobre placa
        antiga, placa Mercosul, a mesma placa nos dois padrões (para exercitar a
        conversão), e negativos como letra na quarta posição em vez da quinta,
        placa com seis ou oito caracteres e entrada em minúsculas.
      </p>
      <p>
        O <a href="/gerador-de-placa">gerador de placa</a> do bateCarimbo produz
        lotes nos dois padrões e o validador identifica automaticamente qual é
        qual, sem tocar em identificadores de veículos reais. Para o número que
        identifica o veículo no cadastro nacional, veja o{" "}
        <a href="/gerador-de-renavam">gerador de RENAVAM</a> — esse sim tem dígito
        verificador e pode ser conferido matematicamente.
      </p>
    </ArticleLayout>
  );
}
