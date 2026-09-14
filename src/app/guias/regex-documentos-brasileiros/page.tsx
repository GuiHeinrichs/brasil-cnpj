import type { Metadata } from "next";
import Link from "next/link";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("regex-documentos-brasileiros")!;

export const metadata: Metadata = guideMetadata(guide);

const PLAIN_ROWS: string[][] = [
  [
    "CPF",
    String.raw`^\d{11}$`,
    "Onze algarismos. A mesma expressão casa PIS, RENAVAM e CNH — é o campo, não a regex, que diz qual documento é.",
  ],
  [
    "CNPJ numérico",
    String.raw`^\d{14}$`,
    "Oito de raiz, quatro de ordem do estabelecimento, dois de dígito verificador.",
  ],
  [
    "CNPJ alfanumérico",
    String.raw`^[0-9A-Z]{12}\d{2}$`,
    "A base aceita letras; os dois verificadores continuam numéricos. É um superconjunto: casa também o CNPJ só de números.",
  ],
  [
    "CEP",
    String.raw`^\d{8}$`,
    "Cinco dígitos do CEP mais três do sufixo de distribuição.",
  ],
  [
    "RG (padrão SSP-SP)",
    String.raw`^\d{8}[0-9X]$`,
    "O último caractere pode ser a letra X, que representa o verificador 10. Vale só para São Paulo.",
  ],
  [
    "PIS / PASEP / NIS",
    String.raw`^\d{11}$`,
    "Mesmo formato do CPF, mas um único verificador e outra tabela de pesos.",
  ],
  [
    "Título de eleitor",
    String.raw`^\d{12}$`,
    "Oito sequenciais, dois de código da UF e dois verificadores.",
  ],
  [
    "RENAVAM",
    String.raw`^\d{11}$`,
    "Dez de base e um verificador. Registros mais curtos aparecem completados com zeros à esquerda — não corte esses zeros.",
  ],
  [
    "CNH",
    String.raw`^\d{11}$`,
    "Número de registro, não o número do espelho impresso no documento.",
  ],
  [
    "Placa antiga",
    String.raw`^[A-Z]{3}\d{4}$`,
    "Três letras e quatro algarismos, sem o hífen.",
  ],
  [
    "Placa Mercosul",
    String.raw`^[A-Z]{3}\d[A-Z]\d{2}$`,
    "A quinta posição é letra. É o único ponto que separa os dois padrões.",
  ],
  [
    "Placa (os dois padrões)",
    String.raw`^[A-Z]{3}\d[A-Z0-9]\d{2}$`,
    "Quinta posição letra ou algarismo. Use quando só precisa aceitar, não classificar.",
  ],
  [
    "Celular",
    String.raw`^\d{2}9\d{8}$`,
    "DDD, o nono dígito e mais oito algarismos.",
  ],
  [
    "Telefone fixo",
    String.raw`^\d{2}[2-5]\d{7}$`,
    String.raw`DDD e oito algarismos. Troque [2-5] por \d se não quiser depender da faixa do primeiro dígito.`,
  ],
];

const MASKED_ROWS: string[][] = [
  ["CPF", String.raw`^\d{3}\.\d{3}\.\d{3}-\d{2}$`, "123.456.789-09"],
  [
    "CNPJ numérico",
    String.raw`^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$`,
    "11.222.333/0001-81",
  ],
  [
    "CNPJ alfanumérico",
    String.raw`^[0-9A-Z]{2}\.[0-9A-Z]{3}\.[0-9A-Z]{3}\/[0-9A-Z]{4}-\d{2}$`,
    "12.ABC.345/01DE-35",
  ],
  ["CEP", String.raw`^\d{5}-\d{3}$`, "01310-100"],
  ["RG (SSP-SP)", String.raw`^\d{2}\.\d{3}\.\d{3}-[0-9X]$`, "24.598.973-0"],
  ["PIS", String.raw`^\d{3}\.\d{5}\.\d{2}-\d$`, "120.16619.18-1"],
  ["Título de eleitor", String.raw`^\d{4}\s\d{4}\s\d{4}$`, "1234 5678 2097"],
  ["Placa antiga", String.raw`^[A-Z]{3}-\d{4}$`, "ABC-1234"],
  ["Celular", String.raw`^\(\d{2}\)\s9\d{4}-\d{4}$`, "(11) 91234-5678"],
  ["Telefone fixo", String.raw`^\(\d{2}\)\s[2-5]\d{3}-\d{4}$`, "(11) 3123-4567"],
];

const JS_GROUPS = String.raw`const CNPJ = /^(?<raiz>[0-9A-Z]{8})(?<ordem>[0-9A-Z]{4})(?<dv>\d{2})$/;

export function partesCnpj(entrada: string) {
  const normalizado = entrada.replace(/[.\-/]/g, "").toUpperCase();
  const match = CNPJ.exec(normalizado);

  // Em TypeScript, groups é Record<string, string> | undefined.
  // Sem essa checagem o compilador reclama, e com razão.
  if (!match?.groups) return null;

  const { raiz, ordem, dv } = match.groups;
  return { raiz, ordem, dv, matriz: ordem === "0001" };
}

partesCnpj("12.ABC.345/01DE-35");
// { raiz: "12ABC345", ordem: "01DE", dv: "35", matriz: false }`;

const PY_GROUPS = String.raw`import re

CNPJ = re.compile(
    r"^(?P<raiz>[0-9A-Z]{8})(?P<ordem>[0-9A-Z]{4})(?P<dv>[0-9]{2})\Z"
)

def partes_cnpj(entrada: str) -> dict[str, str] | None:
    normalizado = re.sub(r"[.\-/]", "", entrada).upper()
    achou = CNPJ.match(normalizado)
    return achou.groupdict() if achou else None

partes_cnpj("12.ABC.345/01DE-35")
# {'raiz': '12ABC345', 'ordem': '01DE', 'dv': '35'}`;

const CPF_GROUPS = String.raw`const CPF = /^(?<base>\d{8})(?<regiao>\d)(?<dv>\d{2})$/;

const { groups } = CPF.exec("12345678909") ?? {};
groups?.regiao; // "9" — 9ª região fiscal (PR e SC)`;

const NORMALIZE = String.raw`// Entrada: qualquer coisa que o usuário colou.
// Saída: o que vai para o banco, para a comparação e para a regex.
export function normalizar(valor: string): string {
  return valor.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
}

normalizar("12.ABC.345/01DE-35"); // "12ABC34501DE35"
normalizar(" 123.456.789-09 ");   // "12345678909"`;

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Um campo de CPF precisa aceitar <code>123.456.789-09</code>, aceitar{" "}
        <code>12345678909</code> e recusar <code>1234567890</code>. Uma expressão
        regular resolve os três casos em uma linha, e é por isso que ela costuma
        ser a primeira checagem de qualquer formulário brasileiro. O problema
        aparece quando ela vira a <em>única</em> checagem e passa a responder uma
        pergunta que não é dela.
      </p>

      <h2>O que regex resolve e o que ela nunca vai resolver</h2>
      <p>
        Regex é boa em uma coisa só: <strong>forma</strong>. Quantos caracteres,
        quais caracteres são permitidos em cada posição, onde ficam os
        separadores. Isso já basta para três usos legítimos — barrar lixo no
        cliente antes do submit, virar uma restrição <code>CHECK</code> no banco
        e filtrar linhas de log antes de tentar parsear qualquer coisa.
      </p>
      <p>
        O que ela não faz, e nenhuma variação esperta muda isso:
      </p>
      <ul>
        <li>
          <strong>Dígito verificador.</strong> Módulo 11 é aritmética sobre os
          algarismos — soma ponderada, resto de divisão, tratamento de resto 0 e
          1. Não existe jeito prático de expressar isso em uma expressão
          regular. A conta está explicada no guia de{" "}
          <a href="/guias/modulo-11-digito-verificador">
            módulo 11 e dígito verificador
          </a>
          .
        </li>
        <li>
          <strong>Dizer qual documento é.</strong>{" "}
          <code>{String.raw`^\d{11}$`}</code> vale igualmente para CPF, PIS,
          RENAVAM e CNH. Se a sua tabela tem uma coluna genérica{" "}
          <code>documento</code>, a regex não vai desempatar; no máximo o cálculo
          do verificador elimina algumas hipóteses, e mesmo assim há colisões.
        </li>
        <li>
          <strong>Barrar sequências triviais.</strong> <code>00000000000</code> e{" "}
          <code>11111111111</code> passam em qualquer regex de onze dígitos, e
          vários deles também passam em implementações desatentas do módulo 11.
          Esse e outros tropeços estão reunidos em{" "}
          <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
            erros comuns em validadores
          </a>
          .
        </li>
        <li>
          <strong>Dizer se o documento existe.</strong> Formato certo e
          verificador certo não significam que o número foi emitido, nem que está
          regular — a diferença está em{" "}
          <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
            CPF válido não é CPF existente
          </a>
          .
        </li>
      </ul>
      <p>
        A divisão de trabalho que funciona: a regex é o porteiro de formato, e a
        validação do verificador é uma função pura, separada e testada. Quem
        junta as duas coisas acaba com uma expressão ilegível que continua
        deixando passar o que importa.
      </p>

      <h2>Tabela completa de expressões</h2>
      <p>
        As expressões abaixo são as mesmas que os geradores deste site usam para
        validar o que você cola nos campos. Todas assumem a entrada já{" "}
        <strong>normalizada</strong>: separadores removidos e letras em maiúscula.
        Normalizar primeiro e testar depois reduz o número de expressões pela
        metade e elimina a maior fonte de bugs.
      </p>
      <DataTable
        caption="Texto puro, sem máscara"
        headers={["Documento", "Expressão", "Observação"]}
        rows={PLAIN_ROWS}
      />
      <p>
        Duas linhas merecem atenção. A do{" "}
        <a href="/guias/cnpj-alfanumerico-2026">CNPJ alfanumérico</a> é um
        superconjunto da numérica — todo CNPJ de catorze algarismos também casa
        com <code>{String.raw`^[0-9A-Z]{12}\d{2}$`}</code>. Se o seu código
        precisa saber qual dos dois formatos chegou, teste a expressão numérica
        primeiro e só então a alfanumérica; se precisa apenas aceitar, uma
        expressão basta.
      </p>
      <p>
        A outra é a placa. Quem só precisa aceitar o que o usuário digitou pode
        usar a versão unificada, com{" "}
        <code>{String.raw`[A-Z0-9]`}</code> na quinta posição. Quem precisa saber
        se aquilo é uma placa antiga ou{" "}
        <a href="/guias/placa-mercosul-vs-antiga">Mercosul</a> — para decidir se
        exibe o hífen, por exemplo — tem de testar as duas expressões
        separadamente, porque a unificada apaga exatamente a informação que
        distingue os padrões.
      </p>
      <p>
        Quando a validação acontece sobre o texto já mascarado (um{" "}
        <code>CHECK</code> em coluna que guarda máscara, ou a conferência de um
        arquivo de importação), as expressões mudam:
      </p>
      <DataTable
        caption="Com máscara"
        headers={["Documento", "Expressão", "Exemplo"]}
        rows={MASKED_ROWS}
      />
      <p>
        Repare no escape do ponto e da barra. <code>.</code> sem barra invertida
        casa qualquer caractere, e <code>/</code> sem escape fecha o literal de
        regex em JavaScript. São os dois erros de digitação mais comuns dessa
        tabela inteira.
      </p>

      <h2>Grupos nomeados para extrair raiz, ordem e dígitos</h2>
      <p>
        Validar é metade do trabalho; a outra metade é quebrar o número em
        pedaços úteis. Em vez de espalhar <code>slice(0, 8)</code> pelo código,
        dá para nomear os pedaços dentro da própria expressão. No CNPJ isso
        separa a raiz (que identifica a empresa), a ordem (que identifica o
        estabelecimento) e os verificadores:
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Grupos nomeados em JavaScript e TypeScript usam a sintaxe (?<nome>…)."
        code={JS_GROUPS}
      />
      <p>
        Duas armadilhas nessa versão. A primeira é que{" "}
        <code>match.groups</code> é tipado como possivelmente indefinido — não é
        firula do TypeScript, é o comportamento real quando a expressão não tem
        nenhum grupo nomeado. A segunda é o <code>toUpperCase()</code>: sem ele,
        um CNPJ alfanumérico digitado em minúsculas falha na expressão, e se você
        &ldquo;consertar&rdquo; com a flag <code>i</code> o número passa e depois
        quebra no cálculo do verificador, que trabalha sobre o valor ASCII do
        caractere.
      </p>
      <p>
        Em Python a sintaxe do grupo nomeado é outra, e há mais um detalhe:
      </p>
      <CodeBlock
        language="Python"
        caption="Em Python, (?P<nome>…) nomeia o grupo e groupdict() devolve tudo de uma vez."
        code={PY_GROUPS}
      />
      <p>
        O <code>\Z</code> no lugar do <code>$</code> não é preciosismo. Em Python,{" "}
        <code>$</code> também casa imediatamente antes de uma quebra de linha
        final, então <code>&quot;12345678909\n&quot;</code> passaria numa
        expressão ancorada com <code>$</code> — e uma quebra de linha perdida é
        exatamente o que sobra ao ler CSV linha a linha. <code>\Z</code> casa só o
        fim absoluto da string.
      </p>
      <p>
        O mesmo recurso serve para ler o dígito de{" "}
        <a href="/guias/regiao-fiscal-cpf">região fiscal do CPF</a>, que é o nono
        algarismo:
      </p>
      <CodeBlock
        language="TypeScript"
        code={CPF_GROUPS}
      />

      <h2>Máscara na digitação, texto puro no banco</h2>
      <p>
        Essas são duas responsabilidades diferentes, e tentar cobrir as duas com
        uma expressão só é o caminho curto para um campo que trava enquanto o
        usuário digita. Uma regex ancorada só aceita o valor completo; durante a
        digitação, <code>123.4</code> nunca vai casar com nada. Máscara é trabalho
        de uma função de formatação que insere separadores conforme o
        comprimento, não de validação.
      </p>
      <p>
        No armazenamento, a regra é guardar texto puro e formatar só na
        exibição. Isso evita o clássico de ter <code>123.456.789-09</code> e{" "}
        <code>12345678909</code> como registros distintos da mesma pessoa, e
        deixa índice e chave única funcionando:
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Uma única normalização, aplicada na fronteira do sistema."
        code={NORMALIZE}
      />
      <p>
        Duas decisões de esquema acompanham isso. A coluna precisa ser textual de
        largura fixa (<code>char(11)</code> para CPF, <code>char(14)</code> para
        CNPJ), nunca numérica — tipo numérico come o zero à esquerda de{" "}
        <code>01234567890</code> e, no caso do CNPJ, simplesmente não aceita
        letras. E a restrição de formato no próprio banco, com a mesma expressão
        da tabela acima, está detalhada no guia de{" "}
        <a href="/guias/validar-cpf-cnpj-sql-postgres-mysql-sqlserver">
          validação em SQL
        </a>
        .
      </p>

      <h2>Anti-padrões</h2>
      <p>
        <strong>Expressão sem âncora.</strong>{" "}
        <code>{String.raw`\d{11}`}</code> sem <code>^</code> e <code>$</code> casa
        onze dígitos em qualquer lugar de uma string de vinte — o cartão de
        crédito do cliente passa como CPF. Se a busca é dentro de um texto
        corrido, o certo não é remover a âncora, é trocá-la por{" "}
        <code>{String.raw`\b`}</code> nas duas pontas.
      </p>
      <p>
        <strong>Reaproveitar uma regex com a flag <code>g</code>.</strong> Em
        JavaScript, uma expressão com <code>g</code> guarda{" "}
        <code>lastIndex</code> entre chamadas, então{" "}
        <code>{String.raw`RE.test(x)`}</code> alterna entre verdadeiro e falso
        para a mesma entrada. Regex de validação nunca leva <code>g</code>.
      </p>
      <p>
        <strong>Ponto não escapado na máscara.</strong>{" "}
        <code>{String.raw`^\d{3}.\d{3}.\d{3}-\d{2}$`}</code> aceita{" "}
        <code>123X456Y789-09</code> sem reclamar, porque o ponto casa qualquer
        caractere. É um bug silencioso: a expressão parece certa e passa nos
        testes felizes.
      </p>
      <p>
        <strong>Supor que <code>{String.raw`\d`}</code> é{" "}
        <code>[0-9]</code>.</strong> Em JavaScript é, mas em Python 3 e em .NET{" "}
        <code>{String.raw`\d`}</code> casa qualquer algarismo decimal do Unicode.
        Um CPF escrito com algarismos árabes orientais passa na regex, passa no{" "}
        <code>int()</code> do Python e chega ao banco como uma string que não bate
        com nenhuma outra. Escrever <code>[0-9]</code> custa dois caracteres a
        mais e vale em todas as linguagens; em Python, <code>re.ASCII</code>{" "}
        resolve de uma vez para o padrão inteiro.
      </p>
      <p>
        <strong>Quantificador aninhado.</strong> Uma expressão como{" "}
        <code>{String.raw`^(\d+\.?)+$`}</code>, escrita para aceitar pontos
        opcionais em qualquer posição, tem um número exponencial de formas de
        dividir a mesma entrada. Contra um texto longo que quase casa, o
        interpretador fica minutos tentando todas — e, rodando no servidor sobre
        entrada de usuário, isso é uma negação de serviço. A defesa é a mesma
        receita de sempre: normalize antes, e aí a expressão vira um padrão de
        comprimento fixo, ancorado, sem ambiguidade nenhuma.
      </p>
      <p>
        <strong>Flag <code>i</code> em placa e CNPJ alfanumérico.</strong> Aceitar{" "}
        <code>abc1c34</code> parece gentileza, mas o valor minúsculo segue vivo
        pelo sistema até bater em alguma comparação que diferencia caixa. Aplique{" "}
        <code>toUpperCase()</code> na normalização e mantenha a expressão restrita
        a <code>[A-Z]</code>.
      </p>

      <h2>Testando suas regex com números gerados aqui</h2>
      <p>
        Uma expressão regular só está pronta quando você a submeteu a casos que
        deveriam falhar. Os casos positivos são fáceis de conseguir: os geradores
        de <a href="/gerador-de-cpf">CPF</a>, <Link href="/">CNPJ</Link>,{" "}
        <a href="/gerador-de-cep">CEP</a>, <a href="/gerador-de-placa">placa</a> e{" "}
        <a href="/gerador-de-pis">PIS</a> entregam lotes de até cem valores
        fictícios, com e sem máscara, que você cola direto na tabela de testes.
      </p>
      <p>
        Os negativos você constrói a partir deles, e são esses que encontram os
        bugs. Vale ter no conjunto, no mínimo: um valor com um dígito a menos e
        outro com um a mais; um com separador no lugar errado; um com espaço no
        começo e no fim; um todo de dígitos iguais; uma placa com letra na quarta
        posição em vez da quinta; um CNPJ alfanumérico com letra em um dos dois
        verificadores, que a expressão precisa recusar; e uma string longa com um
        CPF válido no meio, que é o caso que denuncia a falta de âncora.
      </p>
      <p>
        Para montar esse conjunto de uma vez, o{" "}
        <a href="/gerador-de-pessoas">gerador de pessoas</a> devolve fichas
        completas e coerentes — CPF, RG, CEP e telefone da mesma UF — que servem
        tanto para a regex quanto para os testes de integração que vêm depois
        dela. E, se o próximo passo for o cálculo do verificador, a implementação
        comentada está em{" "}
        <a href="/guias/validar-cpf-cnpj-javascript-typescript">
          validar CPF e CNPJ em JavaScript e TypeScript
        </a>
        .
      </p>
    </ArticleLayout>
  );
}
