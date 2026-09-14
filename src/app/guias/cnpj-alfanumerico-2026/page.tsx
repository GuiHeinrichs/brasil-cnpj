import type { Metadata } from "next";
import Link from "next/link";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable, WorkedDvTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("cnpj-alfanumerico-2026")!;

export const metadata: Metadata = guideMetadata(guide);

const CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9];

const charValue = (char: string) => char.charCodeAt(0) - 48;

const CHAR_ROWS: (string | number)[][] = Array.from({ length: 12 }, (_, i) => [
  CHARSET[i],
  charValue(CHARSET[i]),
  CHARSET[i + 12],
  charValue(CHARSET[i + 12]),
  CHARSET[i + 24],
  charValue(CHARSET[i + 24]),
]);

function buildSteps(base: string) {
  return Array.from(base, (char, index) => ({
    char,
    value: charValue(char),
    weight: WEIGHTS[(base.length - 1 - index) % 8],
  }));
}

const sumOf = (steps: ReturnType<typeof buildSteps>) =>
  steps.reduce((total, step) => total + step.value * step.weight, 0);

const BASE = "12ABC34501DE";
const FIRST_STEPS = buildSteps(BASE);
const FIRST_SUM = sumOf(FIRST_STEPS);
const SECOND_STEPS = buildSteps(`${BASE}3`);
const SECOND_SUM = sumOf(SECOND_STEPS);

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Desde julho de 2026, as novas inscrições no Cadastro Nacional da Pessoa
        Jurídica saem no formato <strong>alfanumérico</strong>: a raiz e a ordem
        do estabelecimento aceitam letras de A a Z além dos algarismos. Foi a
        maior alteração na estrutura do documento desde a criação do cadastro, e
        continua derrubando integrações em sistemas que trataram CNPJ como
        número. Este guia mostra o que mudou, como o dígito verificador passou a
        ser calculado e o que ainda precisa ser revisado num sistema legado.
      </p>

      <h2>A estrutura do CNPJ, posição por posição</h2>
      <p>
        São catorze posições em três blocos. As oito primeiras formam a{" "}
        <strong>raiz</strong>, que identifica a empresa. As quatro seguintes são
        a <strong>ordem</strong> do estabelecimento — <code>0001</code> na matriz,
        valores crescentes nas filiais. As duas últimas são os{" "}
        <strong>dígitos verificadores</strong>, calculados por{" "}
        <a href="/guias/modulo-11-digito-verificador">módulo 11</a> sobre as doze
        anteriores. Matriz e filiais compartilham a raiz e diferem só na ordem.
      </p>
      <p>
        Essa divisão não mudou, e a máscara também não: continua{" "}
        <code>XX.XXX.XXX/XXXX-XX</code>, com os mesmos pontos, a mesma barra e o
        mesmo hífen. O que mudou foi o alfabeto aceito em cada posição.
      </p>

      <h2>O que mudou na prática</h2>
      <p>
        As doze posições da base passaram a aceitar <code>0-9</code> e{" "}
        <code>A-Z</code> maiúsculo. Os dois dígitos verificadores permaneceram{" "}
        <strong>sempre numéricos</strong>. Um CNPJ alfanumérico tem esta cara:{" "}
        <code>12.ABC.345/01DE-35</code>.
      </p>
      <p>
        Nenhuma empresa trocou de número. Os CNPJs emitidos antes da mudança
        seguem válidos por tempo indeterminado e nunca serão convertidos, o que
        tem uma consequência prática desconfortável: não existe data de corte
        depois da qual o formato numérico deixa de circular. Os dois convivem em
        produção, misturados no mesmo banco, na mesma fila e no mesmo arquivo de
        integração — o suporte ao legado é permanente, não transitório.
      </p>
      <p>
        Vale registrar o que ficou igual, porque é o que evita retrabalho: o
        comprimento seguiu em catorze caracteres, a máscara é a mesma, a
        separação entre raiz e ordem é a mesma, filiais continuam diferindo da
        matriz apenas no bloco da ordem e os dois últimos caracteres continuam
        sendo dígitos. Quem já guardava o documento como texto de catorze
        posições, sem máscara, tem quase nada a fazer além do cálculo do DV.
      </p>
      <p>
        O motivo da mudança é aritmético. Com oito posições numéricas, a raiz
        oferece 10<sup>8</sup> combinações, cerca de cem milhões, das quais boa
        parte já foi consumida em décadas de aberturas, baixas e reservas. Com 36
        símbolos por posição, o mesmo campo passa a 36<sup>8</sup>, algo em torno
        de 2,8 trilhões de combinações. O formato do documento foi preservado e o
        espaço de numeração deixou de ser um problema de curto prazo.
      </p>

      <h2>A tabela de conversão de caracteres</h2>
      <p>
        Para que o módulo 11 continuasse funcionando, cada caractere precisou de
        um valor numérico. A regra adotada é o <strong>código ASCII menos
        48</strong>. Como <code>&apos;0&apos;</code> vale 48 no ASCII, os
        algarismos mapeiam para eles mesmos — <code>0</code> continua 0,{" "}
        <code>9</code> continua 9. As letras começam em <code>A</code>, que é 65
        no ASCII e portanto vale 17, e seguem sem interrupção até{" "}
        <code>Z</code>, que vale 42. Repare no salto de 9 para 17: as sete
        posições ASCII entre <code>9</code> e <code>A</code> são ocupadas por
        outros símbolos e ficam de fora da tabela.
      </p>
      <DataTable
        caption="Valor de cada caractere na conta do dígito verificador (ASCII − 48)"
        headers={["Caractere", "Valor", "Caractere", "Valor", "Caractere", "Valor"]}
        rows={CHAR_ROWS}
      />
      <p>
        A elegância da escolha está aí: como os algarismos mapeiam para si
        mesmos, a mesma rotina serve para os dois formatos. Não é preciso um
        caminho de código para CNPJ antigo e outro para CNPJ novo.
      </p>

      <h2>O exemplo oficial resolvido</h2>
      <p>
        O exemplo divulgado pela Receita Federal e pelo SERPRO é{" "}
        <code>12.ABC.345/01DE-35</code>. A base é <code>12ABC34501DE</code> e os
        pesos são os mesmos de sempre: 2 a 9 ciclicamente, da direita para a
        esquerda. Para os doze caracteres da base, isso resulta em 5, 4, 3, 2, 9,
        8, 7, 6, 5, 4, 3 e 2 na leitura da esquerda para a direita.
      </p>
      <WorkedDvTable
        title="Primeiro dígito verificador de 12ABC34501DE"
        steps={FIRST_STEPS}
        sum={FIRST_SUM}
        remainder={FIRST_SUM % 11}
        rule="Resto 8, maior ou igual a 2, então o dígito é 11 − 8."
        result="3"
        showValueColumn
      />
      <p>
        O segundo dígito repete a conta sobre treze caracteres — a base mais o
        dígito recém-obtido —, o que empurra todos os pesos uma casa e adiciona o
        peso 6 no início:
      </p>
      <WorkedDvTable
        title="Segundo dígito verificador de 12ABC34501DE3"
        steps={SECOND_STEPS}
        sum={SECOND_SUM}
        remainder={SECOND_SUM % 11}
        rule="Resto 6, maior ou igual a 2, então o dígito é 11 − 6."
        result="5"
        showValueColumn
      />
      <p>
        Daí o sufixo <code>-35</code>. A regra do resto continua idêntica à do
        CPF e dos demais documentos de módulo 11: resto 0 ou 1 produz dígito 0,
        qualquer outro resto produz <code>11 − resto</code>.
      </p>

      <h2>Validando os dois formatos em TypeScript</h2>
      <p>
        A implementação abaixo aceita numérico e alfanumérico com um único
        cálculo. Os dois detalhes que costumam passar despercebidos são a
        normalização (remover a máscara <em>e</em> passar para maiúsculas, já que{" "}
        <code>&apos;a&apos;</code> vale 97 no ASCII e produziria 49 em vez de 17)
        e a distinção entre os dois formatos apenas na expressão regular de
        estrutura.
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Uma rotina só para os dois formatos: os algarismos mapeiam para si mesmos na conversão ASCII − 48."
        code={`const NUMERIC = /^\\d{14}$/;
const ALPHANUMERIC = /^[0-9A-Z]{12}\\d{2}$/;
const WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9];

// '0'-'9' -> 0-9 ; 'A'-'Z' -> 17-42
const charValue = (char: string) => char.charCodeAt(0) - 48;

function checkDigit(base: string): number {
  let sum = 0;
  for (let i = base.length - 1, w = 0; i >= 0; i--, w++) {
    sum += charValue(base[i]) * WEIGHTS[w % 8];
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCnpj(input: string): boolean {
  const cnpj = input.replace(/[.\\-/]/g, "").toUpperCase();

  if (!NUMERIC.test(cnpj) && !ALPHANUMERIC.test(cnpj)) return false;
  if (/^(\\d)\\1{13}$/.test(cnpj)) return false; // 00000000000000 e afins

  const base = cnpj.slice(0, 12);
  const first = checkDigit(base);
  const second = checkDigit(\`\${base}\${first}\`);

  return cnpj.slice(12) === \`\${first}\${second}\`;
}

isValidCnpj("12.ABC.345/01DE-35"); // true
isValidCnpj("11.222.333/0001-81"); // true
isValidCnpj("12.ABC.345/01DE-34"); // false`}
      />
      <p>
        Versões comentadas em outras linguagens, com os casos de teste
        equivalentes, estão nos guias de{" "}
        <a href="/guias/validar-cpf-cnpj-javascript-typescript">
          validação em JavaScript e TypeScript
        </a>{" "}
        e de{" "}
        <a href="/guias/validar-cpf-cnpj-python-java-csharp">
          validação em Python, Java e C#
        </a>
        .
      </p>

      <h2>Mensagens de erro que vale separar</h2>
      <p>
        Um booleano resolve a validação, mas atende mal quem está digitando. Com
        dois formatos em circulação, quatro situações de recusa têm causas
        diferentes e merecem mensagens diferentes:
      </p>
      <ul>
        <li>
          <strong>Comprimento errado</strong> depois de remover a máscara. Quase
          sempre é um caractere a mais ou a menos na digitação, não um documento
          inexistente.
        </li>
        <li>
          <strong>Caractere fora do conjunto permitido</strong>. Acentos, cedilha
          ou espaço no meio indicam texto colado de outro sistema. Aqui a
          mensagem útil diz o conjunto aceito: <code>0-9</code> e{" "}
          <code>A-Z</code> nas doze primeiras posições.
        </li>
        <li>
          <strong>Letra em um dos dois dígitos verificadores</strong>. Esse é o
          erro novo, e o mais confuso para o usuário, que viu letras no começo do
          número e supôs que elas valessem em qualquer posição.
        </li>
        <li>
          <strong>Dígito verificador incorreto</strong>. Estrutura certa, conta
          errada. Vale dizer isso explicitamente, porque muda o que a pessoa deve
          conferir: o número em si, e não o jeito de digitá-lo.
        </li>
      </ul>
      <p>
        No formato numérico ainda cabe a recusa explícita das sequências
        repetidas, do tipo <code>00.000.000/0000-00</code>, rejeitadas por
        convenção mesmo quando a conta fecha. É uma guarda extra, não parte do
        módulo 11, e continua valendo só para o formato antigo.
      </p>

      <h2>Exibição e conferência humana</h2>
      <p>
        O conjunto de caracteres vai de A a Z sem exclusões, então{" "}
        <code>O</code> e <code>0</code>, <code>I</code> e <code>1</code>,{" "}
        <code>S</code> e <code>5</code> podem aparecer no mesmo documento. Quem
        lê um CNPJ em voz alta ao telefone ou confere um número impresso perde a
        pista que os catorze algarismos davam. Em telas de conferência, uma fonte
        monoespaçada com zero cortado e a máscara sempre aplicada reduzem bastante
        o ruído; em comprovantes, separar visualmente os blocos ajuda mais do que
        aumentar o corpo da fonte.
      </p>
      <p>
        Do lado da entrada, aceite o que o usuário colar e normalize por conta
        própria: minúsculas, espaços nas pontas, máscara parcial, máscara
        completa. Rejeitar por causa de um espaço colado junto é a forma mais
        fácil de transformar uma mudança de formato em chamado de suporte.
      </p>

      <h2>Checklist de adequação para sistemas legados</h2>
      <p>
        A adaptação costuma ser rasa em dificuldade e larga em superfície: são
        muitos pontos pequenos espalhados pela aplicação. Os que mais aparecem:
      </p>
      <ul>
        <li>
          <strong>Tipo da coluna</strong>. CNPJ guardado em{" "}
          <code>integer</code>, <code>bigint</code> ou <code>numeric</code> já era
          arriscado por causa dos zeros à esquerda; com letras, simplesmente não
          entra. A coluna precisa ser <code>char(14)</code> ou{" "}
          <code>varchar(14)</code>. O guia de{" "}
          <a href="/guias/validar-cpf-cnpj-sql-postgres-mysql-sqlserver">
            validação no banco de dados
          </a>{" "}
          traz as funções e as restrições <code>CHECK</code> correspondentes.
        </li>
        <li>
          <strong>Conversões implícitas para número</strong>. Procure por{" "}
          <code>parseInt</code>, <code>Number()</code>, <code>::bigint</code> e
          equivalentes aplicados ao documento. <code>parseInt</code> em{" "}
          <code>12ABC34501DE35</code> devolve <code>12</code> em silêncio, sem
          erro e sem aviso — é o tipo de falha que só aparece em produção.
        </li>
        <li>
          <strong>Expressões regulares</strong>. Todo <code>\d{"{14}"}</code>{" "}
          precisa virar uma alternativa entre os dois formatos, com os dois
          últimos caracteres presos a dígitos. Padrões prontos para os demais
          documentos estão no guia de{" "}
          <a href="/guias/regex-documentos-brasileiros">
            expressões regulares de documentos brasileiros
          </a>
          .
        </li>
        <li>
          <strong>Normalização de entrada</strong>. Antes de calcular o DV,
          remova a máscara e aplique <code>toUpperCase()</code>. Sem isso, um
          usuário que digita minúsculas recebe &quot;CNPJ inválido&quot; para um
          documento correto.
        </li>
        <li>
          <strong>Campos de formulário</strong>. Máscaras que bloqueiam teclas não
          numéricas passam a rejeitar letras legítimas, e{" "}
          <code>inputmode=&quot;numeric&quot;</code> abre o teclado errado no
          celular. Os dois últimos caracteres continuam numéricos, então a
          máscara pode ser mista.
        </li>
        <li>
          <strong>Ordenação e comparação</strong>. Uma coluna de texto ordena por
          ASCII, e os algarismos vêm antes das letras. Relatórios que agrupavam
          por faixa numérica de CNPJ precisam de outro critério; comparações
          devem ser feitas sempre sobre a forma normalizada, nunca sobre a
          mascarada.
        </li>
        <li>
          <strong>Arquivos de largura fixa e integrações</strong>. O tamanho não
          mudou, então o leiaute cabe. O que quebra são os parsers que
          interpretam o campo como inteiro e os bancos intermediários com coluna
          numérica no caminho. Vale rodar um lote alfanumérico ponta a ponta,
          incluindo os sistemas de terceiros.
        </li>
        <li>
          <strong>Buscas e índices</strong>. Se a coluna passar de numérica para
          texto, o índice muda de natureza e consultas por prefixo de raiz
          precisam usar comparação de texto. Guardar também a forma normalizada,
          sem máscara e em maiúsculas, em coluna própria evita busca com{" "}
          <code>LIKE</code> sobre o valor formatado.
        </li>
        <li>
          <strong>Chaves de cache e deduplicação</strong>. Se em algum ponto o
          sistema usa o CNPJ como chave, a normalização precisa ser idêntica em
          todos eles. Uma rotina que passa para maiúsculas e outra que não passa
          produzem duas entradas para a mesma empresa.
        </li>
        <li>
          <strong>Testes</strong>. Fixtures que só contêm CNPJs numéricos passam a
          dar falsa sensação de cobertura. Cada caso de teste de CNPJ merece um
          par alfanumérico ao lado, e ao menos um caso negativo com letra nos
          dígitos verificadores.
        </li>
      </ul>

      <h2>Gerando massa de teste com os dois formatos</h2>
      <p>
        Nenhum desses pontos é verificável sem dados. O{" "}
        <Link href="/">gerador de CNPJ</Link> do bateCarimbo produz lotes nos dois
        formatos, com dígitos verificadores calculados pela mesma regra descrita
        aqui, e valida uma lista colada de uma vez informando qual formato foi
        detectado em cada linha. Para cenários que precisam de razão social,
        endereço e demais campos coerentes, o{" "}
        <a href="/gerador-de-empresas">gerador de empresas</a> monta a ficha
        inteira. Como organizar essas fixtures no repositório é assunto do guia
        de{" "}
        <a href="/guias/massa-de-dados-de-teste-fixtures-seeds-faker">
          massa de dados de teste
        </a>
        . Todos os documentos gerados são fictícios e existem para exercitar
        código, não para representar empresas reais.
      </p>
    </ArticleLayout>
  );
}
