import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable, WorkedDvTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("titulo-de-eleitor-estrutura-uf-zona-secao")!;

export const metadata: Metadata = guideMetadata(guide);

/**
 * Tabela de UFs com um título de exemplo por estado. Todos usam o mesmo
 * sequencial 12345678, o que torna visível que o 1º DV (9) não muda com a UF.
 * Valores conferidos contra `calculateCheckDigits` em src/lib/titulo-eleitor.
 */
const UF_ROWS: [string, string, string][] = [
  ["01", "São Paulo (SP)", "1234 5678 0191"],
  ["02", "Minas Gerais (MG)", "1234 5678 0299"],
  ["03", "Rio de Janeiro (RJ)", "1234 5678 0396"],
  ["04", "Rio Grande do Sul (RS)", "1234 5678 0493"],
  ["05", "Bahia (BA)", "1234 5678 0590"],
  ["06", "Paraná (PR)", "1234 5678 0698"],
  ["07", "Ceará (CE)", "1234 5678 0795"],
  ["08", "Pernambuco (PE)", "1234 5678 0892"],
  ["09", "Santa Catarina (SC)", "1234 5678 0990"],
  ["10", "Goiás (GO)", "1234 5678 1090"],
  ["11", "Maranhão (MA)", "1234 5678 1198"],
  ["12", "Paraíba (PB)", "1234 5678 1295"],
  ["13", "Pará (PA)", "1234 5678 1392"],
  ["14", "Espírito Santo (ES)", "1234 5678 1490"],
  ["15", "Piauí (PI)", "1234 5678 1597"],
  ["16", "Rio Grande do Norte (RN)", "1234 5678 1694"],
  ["17", "Alagoas (AL)", "1234 5678 1791"],
  ["18", "Mato Grosso (MT)", "1234 5678 1899"],
  ["19", "Mato Grosso do Sul (MS)", "1234 5678 1996"],
  ["20", "Distrito Federal (DF)", "1234 5678 2097"],
  ["21", "Sergipe (SE)", "1234 5678 2194"],
  ["22", "Amazonas (AM)", "1234 5678 2291"],
  ["23", "Rondônia (RO)", "1234 5678 2399"],
  ["24", "Acre (AC)", "1234 5678 2496"],
  ["25", "Amapá (AP)", "1234 5678 2593"],
  ["26", "Roraima (RR)", "1234 5678 2690"],
  ["27", "Tocantins (TO)", "1234 5678 2798"],
  ["28", "Exterior (ZZ)", "1234 5678 2895"],
];

/** Massa de teste com sequenciais variados; nenhum é ambíguo em SP/MG. */
const FIXTURE_ROWS: [string, string, string][] = [
  ["SP (01)", "2468 0135 0124", "resto 2 no 1º DV, resto 4 no 2º"],
  ["MG (02)", "9182 7364 0213", "resto 1 no 1º DV — a exceção não se aplica"],
  ["RJ (03)", "5550 0012 0353", "sequencial com zeros no meio"],
  ["RJ (03)", "1000 0007 0302", "resto 10 no 1º DV, que vira 0"],
  ["RS (04)", "3321 0987 0493", "mesmo par de DV do exemplo 1234 5678 0493"],
  ["BA (05)", "7065 4321 0515", "—"],
  ["PR (06)", "4801 2377 0620", "resto 0 no 2º DV, que permanece 0 fora de SP/MG"],
  ["SC (09)", "8237 0145 0906", "resto 10 no 1º DV"],
  ["DF (20)", "6021 9483 2003", "resto 0 no 1º DV, que permanece 0 fora de SP/MG"],
  ["AM (22)", "1739 5028 2208", "sequencial idêntico ao anterior em soma"],
];

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        O número do título de eleitor quase sempre aparece em três blocos de
        quatro dígitos — <code>1234 5678 2097</code> — e esse agrupamento não
        corresponde aos campos internos do número. Os campos têm oito, dois e
        dois dígitos. O último bloco impresso mistura o código da unidade
        federativa com os dois dígitos verificadores, o que é suficiente para
        quebrar qualquer parser escrito olhando apenas para a máscara.
      </p>

      <h2>Anatomia dos doze dígitos</h2>
      <p>
        São doze algarismos decimais, sem letras e sem separador obrigatório. A
        divisão é fixa:
      </p>
      <ul>
        <li>
          <strong>Posições 1 a 8</strong> — sequencial de inscrição atribuído
          pela Justiça Eleitoral no alistamento. Não há data, faixa etária nem
          código de município embutidos: é um contador, e nada nele é
          decodificável.
        </li>
        <li>
          <strong>Posições 9 e 10</strong> — código da unidade federativa
          vinculada à inscrição, de <code>01</code> a <code>28</code>.
        </li>
        <li>
          <strong>Posições 11 e 12</strong> — dígitos verificadores calculados
          por módulo 11, cada um com uma regra diferente.
        </li>
      </ul>
      <p>
        O sequencial pode começar com zero, e o código de UF de São Paulo é
        literalmente <code>01</code>. Guardar o título como inteiro perde esses
        zeros e transforma um número válido em um número de onze dígitos que
        nenhum validador aceita. A coluna correta é textual e de tamanho fixo:{" "}
        <code>char(12)</code> ou <code>varchar(12)</code>, com a máscara aplicada
        só na exibição. A normalização é a de sempre — remover pontos, hífens e
        espaços, conferir que sobraram doze dígitos e validar sobre a forma
        limpa. Um padrão pronto para isso está no{" "}
        <a href="/guias/regex-documentos-brasileiros">
          guia de regex para documentos brasileiros
        </a>
        .
      </p>

      <h2>A tabela completa dos códigos por unidade federativa</h2>
      <p>
        São 28 códigos: os 27 entes federativos mais o código <code>28</code>,
        usado por inscrições do exterior e normalmente exibido como{" "}
        <code>ZZ</code>. A ordem não é alfabética nem a numeração do IBGE — é uma
        sequência própria da Justiça Eleitoral, que começa por São Paulo e Minas
        Gerais. Qualquer par fora da faixa <code>01</code>–<code>28</code>,
        incluindo <code>00</code>, invalida o número antes mesmo do cálculo do
        dígito.
      </p>
      <DataTable
        caption="Códigos de UF nos dígitos 9–10, com um título de exemplo para cada um (todos derivados do sequencial 12345678)."
        headers={["Código", "Unidade federativa", "Exemplo"]}
        rows={UF_ROWS}
      />
      <p>
        Repare na coluna de exemplos: o primeiro dígito verificador é{" "}
        <code>9</code> nos 28 casos. Isso não é coincidência nem erro da tabela —
        é consequência direta do algoritmo, que calcula o primeiro dígito apenas
        sobre o sequencial. Trocar a UF muda somente o segundo.
      </p>

      <h2>Zona e seção não estão no número</h2>
      <p>
        A confusão nasce do documento físico, onde o número da inscrição, a zona
        e a seção são impressos lado a lado, no mesmo bloco visual. Muita gente
        conclui que o terceiro grupo de quatro dígitos é a zona. Não é: nos doze
        dígitos não existe campo de zona nem de seção, e nenhuma operação
        aritmética sobre eles recupera essa informação.
      </p>
      <p>
        Zona e seção descrevem <em>onde</em> a pessoa vota. A zona é a
        circunscrição da Justiça Eleitoral que administra o eleitorado de uma
        área, com seu cartório; a seção é o agrupamento menor, associado a um
        local e a uma mesa de votação. São atributos da situação eleitoral
        corrente, consultáveis nos serviços do TSE, e mudam com transferências e
        com a reorganização dos locais de votação — sem que isso esteja refletido
        nos doze dígitos.
      </p>
      <p>
        Na modelagem, isso significa três campos independentes:{" "}
        <code>titulo</code>, <code>zona</code> e <code>secao</code>. Derivar os
        dois últimos do primeiro é impossível, e formulários que pedem zona e
        seção junto com o número estão pedindo dados que só vêm da consulta
        oficial ou do próprio eleitor.
      </p>

      <h2>O cálculo dos dois dígitos verificadores, resolvido</h2>
      <p>
        O título usa módulo 11 em dois estágios, e o segundo estágio é incomum:
        ele não percorre o número inteiro. O primeiro dígito sai dos oito
        algarismos do sequencial, com pesos crescentes de 2 a 9. Tomando o
        sequencial <code>12345678</code> e o Distrito Federal (<code>20</code>):
      </p>
      <WorkedDvTable
        title="Primeiro dígito verificador — pesos 2 a 9 sobre o sequencial"
        steps={[
          { char: "1", weight: 2 },
          { char: "2", weight: 3 },
          { char: "3", weight: 4 },
          { char: "4", weight: 5 },
          { char: "5", weight: 6 },
          { char: "6", weight: 7 },
          { char: "7", weight: 8 },
          { char: "8", weight: 9 },
        ]}
        sum={240}
        remainder={9}
        rule="O resto é o próprio dígito (só o resto 10 recebe tratamento especial)."
        result="9"
      />
      <p>
        O segundo dígito opera sobre apenas três valores: os dois algarismos do
        código da UF e o primeiro dígito recém-calculado, com pesos 7, 8 e 9. O
        sequencial não entra nessa conta.
      </p>
      <WorkedDvTable
        title="Segundo dígito verificador — pesos 7, 8 e 9 sobre UF e 1º DV"
        steps={[
          { char: "2", weight: 7 },
          { char: "0", weight: 8 },
          { char: "9", weight: 9 },
        ]}
        sum={95}
        remainder={7}
        rule="O resto é o próprio dígito."
        result="7"
      />
      <p>
        Juntando tudo: <code>12345678</code> + <code>20</code> + <code>97</code>{" "}
        = <code>1234 5678 2097</code>. Quando o resto de qualquer um dos dois
        estágios é 10, o dígito vira 0. É o caso de{" "}
        <code>1000 0007 0302</code>, do Rio de Janeiro: a soma do sequencial dá
        65, o resto é 10 e o primeiro dígito vira 0; o segundo estágio soma{" "}
        <code>0×7 + 3×8 + 0×9 = 24</code>, resto 2.
      </p>
      <p>
        A consequência prática dessa estrutura é que o segundo dígito é função
        exclusiva do par (código da UF, primeiro dígito). São no máximo 280
        combinações de entrada, o que permite substituir o segundo estágio por
        uma tabela pré-calculada quando a validação é feita em volume — e explica
        por que o dígito verificador do título detecta bem erros de digitação,
        mas serve de muito pouco como evidência de que o número existe. A ideia
        geral do algoritmo está no{" "}
        <a href="/guias/modulo-11-digito-verificador">guia de módulo 11</a>.
      </p>

      <h2>A exceção de São Paulo e Minas Gerais</h2>
      <p>
        Nos títulos emitidos em São Paulo (<code>01</code>) e Minas Gerais (
        <code>02</code>), o resto 0 não produz o dígito 0: produz o dígito 1. A
        regra vale para os dois estágios do cálculo, e é a única diferença de
        tratamento por estado em todo o algoritmo.
      </p>
      <p>
        O sequencial <code>11111111</code> mostra o efeito. A soma ponderada dá{" "}
        <code>1×(2+3+4+5+6+7+8+9) = 44</code>, e 44 é divisível por 11 — resto 0.
        Em qualquer outro estado o primeiro dígito seria 0. Em São Paulo ele é 1,
        e o segundo estágio passa a somar <code>0×7 + 1×8 + 1×9 = 17</code>,
        resto 6: o título é <code>1111 1111 0116</code>. O mesmo sequencial em
        Minas Gerais soma <code>0×7 + 2×8 + 1×9 = 25</code>, resto 3, gerando{" "}
        <code>1111 1111 0213</code>.
      </p>
      <p>
        Fora desses dois códigos, o resto 0 continua valendo 0, e isso aparece na
        massa de teste mais abaixo: <code>6021 9483 2003</code>, do Distrito
        Federal, tem resto 0 no primeiro estágio e primeiro dígito 0.{" "}
        <code>4801 2377 0620</code>, do Paraná, tem resto 0 no segundo estágio e
        segundo dígito 0. Nenhum dos dois seria escrito assim se a UF fosse{" "}
        <code>01</code> ou <code>02</code>.
      </p>

      <h2>Por que dois validadores discordam do mesmo título</h2>
      <p>
        Boa parte das implementações que circulam por aí ignora a exceção de
        SP/MG. Para essas, o sequencial <code>11111111</code> em São Paulo
        produz <code>1111 1111 0108</code>, e não <code>1111 1111 0116</code>.
        Os dois números não podem estar certos ao mesmo tempo: cada validador
        aceita o seu e rejeita o do outro. Quando um cadastro reclama que um
        título &quot;válido no outro sistema&quot; foi recusado, é aqui que se
        deve olhar primeiro.
      </p>
      <p>
        A divergência só acontece quando algum dos dois restos dá 0 em um título
        de SP ou MG. É um subconjunto pequeno e perfeitamente identificável,
        então dá para calcular os dígitos nas duas interpretações e comparar:
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Implementação usada pelo gerador. O parâmetro withException permite reproduzir as duas leituras da regra."
        code={`const SP_MG = new Set(["01", "02"]);

function applyRest(rest: number, ufCode: string, withException: boolean): number {
  if (rest === 10) return 0;
  if (withException && rest === 0 && SP_MG.has(ufCode)) return 1;
  return rest;
}

function checkDigits(seq8: string, ufCode: string, withException: boolean): string {
  let sum1 = 0;
  for (let i = 0; i < 8; i++) {
    sum1 += Number(seq8[i]) * (i + 2);
  }
  const dv1 = applyRest(sum1 % 11, ufCode, withException);

  const sum2 = Number(ufCode[0]) * 7 + Number(ufCode[1]) * 8 + dv1 * 9;
  const dv2 = applyRest(sum2 % 11, ufCode, withException);

  return String(dv1) + String(dv2);
}

/** Sequenciais de SP/MG em que as duas interpretações divergem. */
function isContestedBase(seq8: string, ufCode: string): boolean {
  if (!SP_MG.has(ufCode)) return false;
  return checkDigits(seq8, ufCode, true) !== checkDigits(seq8, ufCode, false);
}`}
      />
      <p>
        O <a href="/gerador-de-titulo-de-eleitor">gerador de título</a> descarta
        os sequenciais em que <code>isContestedBase</code> retorna verdadeiro.
        Números gerados por ele passam nas duas leituras da regra, o que evita
        que uma massa de teste falhe por causa de uma decisão de implementação de
        terceiros em vez de um defeito real. Para testar a exceção de propósito,
        o caminho é o contrário: use justamente um sequencial ambíguo e fixe qual
        interpretação o seu sistema adota.
      </p>

      <h2>O que o número não prova</h2>
      <p>
        Dígitos verificadores corretos dizem que a sequência é bem formada, e só.
        Não dizem que a inscrição existe, que está regular, que não há
        pendências, nem se a pessoa é obrigada a votar. Essa informação vem dos
        serviços do TSE, não da aritmética — a mesma distinção entre forma e
        existência que vale para o CPF e está detalhada em{" "}
        <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
          válido não é o mesmo que existente
        </a>
        .
      </p>
      <p>
        O código de UF também é frequentemente superinterpretado. Ele identifica
        a unidade federativa vinculada à inscrição, não o estado de nascimento,
        não o endereço atual e não o local onde a pessoa vota hoje. Usar esse par
        de dígitos como filtro de domicílio em regra de negócio produz falsos
        negativos silenciosos, do mesmo tipo que a leitura da{" "}
        <a href="/guias/regiao-fiscal-cpf">região fiscal do CPF</a> costuma
        provocar.
      </p>
      <p>
        Números reais de título são dado pessoal e vinculam identidade civil a
        exercício político, o que os coloca entre os campos que menos convém
        arrastar para bancos de homologação. A alternativa, aqui e nos demais
        documentos, é massa fictícia com dígito válido —{" "}
        <a href="/guias/lgpd-dados-de-teste">o guia sobre LGPD e dados de teste</a>{" "}
        trata do porquê.
      </p>

      <h2>Massa de teste por estado</h2>
      <p>
        Os títulos abaixo têm sequenciais variados, cobrem os casos-limite do
        algoritmo e foram conferidos contra a implementação do site. Nenhum deles
        é ambíguo, então servem tanto para validadores que aplicam a exceção de
        SP/MG quanto para os que não aplicam.
      </p>
      <DataTable
        caption="Títulos fictícios para fixtures. A terceira coluna indica o caso-limite exercitado."
        headers={["UF", "Título", "O que exercita"]}
        rows={FIXTURE_ROWS}
      />
      <p>
        Para gerar os seus em vez de copiar os de cima, vale fixar o sequencial e
        variar a UF — a massa fica determinística e o teste não depende de
        aleatoriedade:
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Um título por estado, sempre os mesmos entre execuções."
        code={`const UF_CODES = ["01", "03", "06", "20", "26"];
const SEQ = "12345678";

export const TITULOS_FIXTURE = UF_CODES.map(
  (uf) => SEQ + uf + checkDigits(SEQ, uf, true),
);
// ["123456780191", "123456780396", "123456780698", ...]`}
      />
      <p>
        Quando o volume é maior, ou quando você precisa de títulos de uma UF
        específica já formatados em blocos de quatro, o{" "}
        <a href="/gerador-de-titulo-de-eleitor">gerador de título de eleitor</a>{" "}
        faz isso em lote e valida números existentes na mesma tela, mostrando a
        UF detectada nos dígitos 9 e 10.
      </p>
    </ArticleLayout>
  );
}
