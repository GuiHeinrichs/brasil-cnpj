import type { Metadata } from "next";
import Link from "next/link";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable, WorkedDvTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("validar-cpf-cnpj-javascript-typescript")!;

export const metadata: Metadata = guideMetadata(guide);

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Todo sistema brasileiro acaba precisando de duas funções:{" "}
        <code>validarCpf</code> e <code>validarCnpj</code>. Elas costumam ser
        copiadas de um gist antigo, funcionam por anos e um dia rejeitam um
        documento legítimo — ou aceitam um número que ninguém emitiu. Este guia
        monta as duas do zero em TypeScript, com uma única rotina de módulo 11
        compartilhada, suporte ao CNPJ alfanumérico e uma bateria de testes que
        cobre os casos que costumam passar batido.
      </p>

      <h2>Por que regex não basta</h2>
      <p>
        Uma expressão regular descreve <strong>formato</strong>, não{" "}
        <strong>validade</strong>. Ela sabe dizer que há três grupos de três
        algarismos, um hífen e mais dois algarismos; não sabe dizer se esses dois
        últimos algarismos são o resultado correto da conta feita sobre os nove
        anteriores.
      </p>

      <CodeBlock
        language="TypeScript"
        caption="A regex acerta o formato e erra em tudo que importa."
        code={`const CPF_MASCARADO = /^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$/;

CPF_MASCARADO.test("123.456.789-09"); // true  — e realmente é válido
CPF_MASCARADO.test("123.456.789-00"); // true  — mas os dígitos estão errados
CPF_MASCARADO.test("111.111.111-11"); // true  — sequência repetida
CPF_MASCARADO.test("12345678909");    // false — válido, só que sem máscara`}
      />

      <p>
        Os dois últimos casos mostram os dois tipos de erro possíveis. O falso
        positivo deixa entrar lixo no banco: <code>111.111.111-11</code> passa
        até no cálculo do dígito verificador, porque uma soma ponderada de onze
        algarismos iguais fecha a conta por acidente. O falso negativo é pior na
        experiência do usuário: quem digita o documento sem pontuação vê um erro
        que não existe.
      </p>
      <p>
        Regex continua útil — para extrair documentos de um texto, para decidir
        rapidamente se uma string tem qualquer chance de ser um CNPJ, para
        aplicar máscara. O papel dela é filtrar o formato antes do cálculo, nunca
        substituí-lo. Os padrões prontos de cada documento estão no guia de{" "}
        <a href="/guias/regex-documentos-brasileiros">
          regex para documentos brasileiros
        </a>
        .
      </p>

      <h2>Normalizando a entrada antes de validar</h2>
      <p>
        O primeiro passo de qualquer validador é reduzir a entrada a uma forma
        canônica. Sem isso você acaba escrevendo quatro variações da mesma função
        — uma para a string com máscara, outra para a sem, outra para a que veio
        de um CSV com espaço sobrando.
      </p>

      <CodeBlock
        language="TypeScript"
        caption="Uma normalização serve para CPF e CNPJ, inclusive alfanumérico."
        code={`/** Apara espaços, sobe para maiúsculas e descarta tudo que não é 0-9 ou A-Z. */
export function normalizar(entrada: string): string {
  return entrada.trim().toUpperCase().replace(/[^0-9A-Z]/g, "");
}

normalizar("  123.456.789-09  "); // "12345678909"
normalizar("12.abc.345/01de-35"); // "12ABC34501DE35"
normalizar("");                   // ""`}
      />

      <p>
        Três decisões estão embutidas nessas três linhas, e vale explicitar cada
        uma.
      </p>
      <p>
        <strong>Maiúsculas.</strong> O CNPJ alfanumérico usa letras de A a Z
        maiúsculas. Como o valor numérico de cada caractere sai do código ASCII,
        a letra minúscula produziria um número completamente diferente:{" "}
        <code>a</code> tem código 97, e 97 menos 48 dá 49. Subir para maiúsculas
        antes de calcular evita que um usuário que digitou em caixa baixa receba
        um erro.
      </p>
      <p>
        <strong>Espaços.</strong> Espaço nas pontas sempre deve ser aparado — é
        resíduo de copiar e colar, não intenção do usuário. Espaço no meio é uma
        escolha de produto: a normalização acima os remove, o que aceita{" "}
        <code>123 456 789 09</code>. Se o seu domínio exige entrada estrita
        (importação de arquivo de terceiro, por exemplo), valide o formato com
        regex <em>antes</em> de limpar, e rejeite o que não bater exatamente com
        a máscara esperada.
      </p>
      <p>
        <strong>String vazia.</strong> <code>normalizar(&quot;&quot;)</code>{" "}
        devolve string vazia, e a validação de tamanho que vem logo depois vai
        reprovar. Isso é correto, mas não é a mesma coisa que{" "}
        <em>campo obrigatório</em>. Um formulário em que o CPF é opcional precisa
        tratar vazio como &ldquo;sem valor&rdquo; e não como
        &ldquo;inválido&rdquo;, senão o usuário fica travado num campo que ele
        nem precisaria preencher.
      </p>

      <h2>A rotina de módulo 11, escrita uma vez só</h2>
      <p>
        CPF e CNPJ usam o mesmo algoritmo: multiplica-se cada caractere da base
        por um peso, soma-se tudo, tira-se o resto da divisão por 11 e aplica-se
        a regra final. O que muda entre os dois documentos é apenas a{" "}
        <strong>lista de pesos</strong>. Então o correto é escrever uma função
        que recebe a base e os pesos, e deixar cada documento fornecer os seus. A
        origem da conta está detalhada no guia do{" "}
        <a href="/guias/modulo-11-digito-verificador">
          módulo 11 e do dígito verificador
        </a>
        .
      </p>

      <CodeBlock
        language="TypeScript"
        caption="O coração dos dois validadores: onze linhas que não mudam."
        code={`/** Valor numérico do caractere: dígitos viram 0-9; letras seguem ASCII − 48. */
function valorDoCaractere(caractere: string): number {
  return caractere.charCodeAt(0) - 48;
}

/** Soma ponderada da base, resto por 11 e a regra: resto 0 ou 1 → dígito 0. */
export function modulo11(base: string, pesos: number[]): number {
  let soma = 0;
  for (let i = 0; i < base.length; i++) {
    soma += valorDoCaractere(base[i]) * pesos[i];
  }

  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}`}
      />

      <p>
        A linha <code>resto &lt; 2 ? 0 : 11 - resto</code> é onde mora o bug mais
        frequente de todos. Se o resto for 0 ou 1, a subtração daria 11 ou 10 —
        dois valores que não cabem em um único algarismo. A regra oficial manda
        usar 0 nesses dois casos. Implementações que escrevem{" "}
        <code>11 - resto</code> sem a guarda geram dígito 10 e depois tentam
        salvar com gambiarras do tipo <code>dv % 10</code>, que produz 1 no lugar
        de 0 e rejeita documentos legítimos.
      </p>

      <h2>Validando CPF passo a passo</h2>
      <p>
        O CPF tem onze algarismos: nove de base e dois verificadores. O primeiro
        verificador é calculado sobre a base de nove com pesos de 10 a 2; o
        segundo, sobre a base de dez (base original mais o primeiro dígito) com
        pesos de 11 a 2. Os pesos são sempre decrescentes até 2 e nunca
        reiniciam.
      </p>

      <h3>Rejeitar as onze sequências repetidas</h3>
      <p>
        Antes de calcular qualquer coisa, elimine <code>00000000000</code>,{" "}
        <code>11111111111</code> e as outras nove. Esses números passam no módulo
        11 legitimamente — a matemática não tem como separá-los dos demais — e a Receita
        não os emite. Aparecem em produção o tempo todo porque são o que alguém
        digita quando quer pular o campo.
      </p>

      <CodeBlock
        language="TypeScript"
        caption="A referência para trás exige que todos os caracteres sejam iguais ao primeiro."
        code={`const CPF_REPETIDO = /^(\\d)\\1{10}$/;

CPF_REPETIDO.test("11111111111"); // true  → rejeitar
CPF_REPETIDO.test("12345678909"); // false → seguir para o cálculo`}
      />

      <p>
        O grupo <code>(\d)</code> captura o primeiro algarismo e{" "}
        <code>\1{"{10}"}</code> exige mais dez ocorrências do mesmo caractere.
        Uma lista fixa com as onze strings também funciona, mas envelhece pior
        quando você precisar da mesma ideia para o CNPJ, que tem quatorze
        posições.
      </p>

      <h3>Primeiro dígito verificador</h3>
      <p>
        Com a base <code>123456789</code>, os pesos vão de 10 a 2 na ordem em que
        os algarismos aparecem:
      </p>

      <WorkedDvTable
        title="Primeiro dígito verificador (base 123456789)"
        steps={[
          { char: "1", weight: 10 },
          { char: "2", weight: 9 },
          { char: "3", weight: 8 },
          { char: "4", weight: 7 },
          { char: "5", weight: 6 },
          { char: "6", weight: 5 },
          { char: "7", weight: 4 },
          { char: "8", weight: 3 },
          { char: "9", weight: 2 },
        ]}
        sum={210}
        remainder={1}
        rule="Resto menor que 2, então o dígito é 0."
        result="0"
      />

      <p>
        Esse exemplo já exercita a guarda do resto: 210 dividido por 11 deixa
        resto 1, e um validador sem a condição <code>resto &lt; 2</code>{" "}
        devolveria 10 aqui.
      </p>

      <h3>Segundo dígito verificador</h3>
      <p>
        A base agora é <code>1234567890</code> — os nove algarismos originais mais
        o primeiro verificador recém-calculado. Os pesos começam em 11:
      </p>

      <WorkedDvTable
        title="Segundo dígito verificador (base 1234567890)"
        steps={[
          { char: "1", weight: 11 },
          { char: "2", weight: 10 },
          { char: "3", weight: 9 },
          { char: "4", weight: 8 },
          { char: "5", weight: 7 },
          { char: "6", weight: 6 },
          { char: "7", weight: 5 },
          { char: "8", weight: 4 },
          { char: "9", weight: 3 },
          { char: "0", weight: 2 },
        ]}
        sum={255}
        remainder={2}
        rule="Resto maior ou igual a 2, então o dígito é 11 − 2."
        result="9"
      />

      <p>
        O CPF completo é <code>123.456.789-09</code>. Note que o segundo cálculo
        depende do primeiro: um erro no dígito inicial se propaga e torna os dois
        verificadores inválidos, o que é justamente o comportamento desejado.
      </p>

      <h3>A função completa em TypeScript</h3>

      <CodeBlock
        language="TypeScript"
        caption="Pesos decrescentes gerados a partir do tamanho da base."
        code={`/** 10..2 para uma base de 9; 11..2 para uma base de 10. */
function pesosCpf(tamanho: number): number[] {
  return Array.from({ length: tamanho }, (_, i) => tamanho + 1 - i);
}

const SOMENTE_DIGITOS = /^\\d{11}$/;
const CPF_REPETIDO = /^(\\d)\\1{10}$/;

export function validarCpf(entrada: string): boolean {
  const cpf = normalizar(entrada);

  if (!SOMENTE_DIGITOS.test(cpf)) return false;
  if (CPF_REPETIDO.test(cpf)) return false;

  const base = cpf.slice(0, 9);
  const primeiro = modulo11(base, pesosCpf(9));
  const segundo = modulo11(base + primeiro, pesosCpf(10));

  return cpf.slice(9) === String(primeiro) + String(segundo);
}`}
      />

      <p>
        A verificação de tamanho e a de caracteres saem de graça na mesma regex:{" "}
        <code>^\d{"{11}"}$</code> só aceita exatamente onze algarismos, então
        entradas curtas, longas ou com letra caem fora antes do cálculo. Comparar
        a string dos dois dígitos calculados com a fatia final é mais simples do
        que comparar número a número e evita armadilhas de conversão.
      </p>

      <h2>Validando CNPJ numérico</h2>
      <p>
        O CNPJ tem quatorze caracteres: doze de base e dois verificadores. A
        diferença em relação ao CPF está nos pesos, que valem de 2 a 9 contados da
        direita para a esquerda e <strong>reiniciam a cada oito posições</strong>,
        porque a base é maior do que a faixa disponível de pesos.
      </p>

      <CodeBlock
        language="TypeScript"
        caption="O módulo 8 é o que faz a sequência de pesos voltar ao início."
        code={`const PESOS_CNPJ = [2, 3, 4, 5, 6, 7, 8, 9];

/** Da direita para a esquerda: 2, 3, 4, ... 9, 2, 3, 4, ... */
function pesosCnpj(tamanho: number): number[] {
  return Array.from(
    { length: tamanho },
    (_, i) => PESOS_CNPJ[(tamanho - 1 - i) % 8],
  );
}

pesosCnpj(12); // [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
pesosCnpj(13); // [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]`}
      />

      <p>
        Muitas implementações trazem esses dois vetores digitados à mão. Funciona,
        mas esconde a regra e convida ao erro de copiar o vetor de doze posições
        para o cálculo do segundo dígito, que precisa de treze. Derivar os pesos
        do tamanho elimina essa classe de bug.
      </p>

      <CodeBlock
        language="TypeScript"
        caption="Mesma estrutura do CPF, com outra origem de pesos."
        code={`const CNPJ_FORMATO = /^[0-9A-Z]{12}\\d{2}$/;
const CNPJ_REPETIDO = /^(\\d)\\1{13}$/;

export function validarCnpj(entrada: string): boolean {
  const cnpj = normalizar(entrada);

  if (!CNPJ_FORMATO.test(cnpj)) return false;
  if (CNPJ_REPETIDO.test(cnpj)) return false;

  const base = cnpj.slice(0, 12);
  const primeiro = modulo11(base, pesosCnpj(12));
  const segundo = modulo11(base + primeiro, pesosCnpj(13));

  return cnpj.slice(12) === String(primeiro) + String(segundo);
}`}
      />

      <p>
        Testando com <code>11.222.333/0001-81</code>: a base{" "}
        <code>112223330001</code> ponderada pelos pesos de 12 posições soma 102,
        que deixa resto 3 na divisão por 11 e produz o dígito 8; a base estendida
        soma 120, resto 10, dígito 1. Os verificadores conferem.
      </p>

      <h2>Adaptando para o CNPJ alfanumérico</h2>
      <p>
        Desde julho de 2026, novas inscrições podem trazer letras nas doze
        posições da base. Os dois dígitos verificadores continuam numéricos, e a
        conta continua sendo módulo 11 com os mesmos pesos — o único acréscimo é
        uma regra de conversão de caractere para número, definida pela Receita
        Federal: subtrai-se 48 do código ASCII do caractere.
      </p>

      <DataTable
        caption="Conversão de caractere para valor (ASCII menos 48)"
        headers={["Caractere", "Código ASCII", "Valor no cálculo"]}
        rows={[
          ["0", 48, 0],
          ["9", 57, 9],
          ["A", 65, 17],
          ["B", 66, 18],
          ["Z", 90, 42],
        ]}
      />

      <p>
        A escolha do 48 não é arbitrária: é exatamente o código ASCII do
        caractere <code>0</code>. Para os algarismos, portanto, a subtração
        devolve o próprio valor — <code>&quot;7&quot;.charCodeAt(0) - 48</code>{" "}
        dá 7. É por isso que o mesmo <code>valorDoCaractere</code> serve para os
        dois formatos e a função <code>validarCnpj</code> escrita acima já aceita
        letras sem nenhuma alteração. Um CNPJ puramente numérico é apenas o caso
        particular em que nenhum caractere passa de 9.
      </p>
      <p>
        O exemplo oficial do SERPRO é <code>12.ABC.345/01DE-35</code>. Os valores
        entram como 1, 2, 17, 18, 19, 3, 4, 5, 0, 1, 20 e 21; com os pesos 5, 4,
        3, 2, 9, 8, 7, 6, 5, 4, 3 e 2 a soma dá 459, que deixa resto 8 e produz o
        dígito 3. Repetindo sobre a base acrescida desse 3, com treze pesos, a
        soma dá 424, resto 6, dígito 5.
      </p>
      <p>
        Dois cuidados na migração de um sistema existente. O primeiro é a{" "}
        <strong>coluna do banco</strong>: CNPJ nunca deveria ter sido{" "}
        <code>bigint</code>, e agora deixou de ser possível. O segundo são as
        regexes espalhadas pelo código que exigem{" "}
        <code>\d{"{14}"}</code> — elas vão rejeitar silenciosamente os documentos
        novos. O checklist completo está no guia sobre o{" "}
        <a href="/guias/cnpj-alfanumerico-2026">CNPJ alfanumérico</a>.
      </p>

      <h2>Testes: os casos que todo validador deve passar</h2>
      <p>
        A tabela abaixo é o mínimo. Cada linha existe porque corresponde a um bug
        real que já derrubou algum validador em produção.
      </p>

      <DataTable
        caption="Casos de teste obrigatórios"
        headers={["Entrada", "Esperado", "O que o caso protege"]}
        rows={[
          ["123.456.789-09", "válido", "CPF com máscara, o formato mais comum em formulário"],
          ["12345678909", "válido", "mesmo CPF sem máscara, vindo de API ou importação"],
          ["  12345678909  ", "válido", "espaços nas pontas de copiar e colar"],
          ["100.000.000-19", "válido", "primeiro dígito nasce de resto 10"],
          ["100.000.006-04", "válido", "primeiro dígito nasce de resto 0"],
          ["111.111.111-11", "inválido", "sequência repetida passa no módulo 11 e precisa de guarda"],
          ["123.456.789-00", "inválido", "formato perfeito, dígitos verificadores errados"],
          ["1234567890", "inválido", "um caractere a menos"],
          ["(vazio)", "inválido", "campo em branco não pode virar exceção"],
          ["11.222.333/0001-81", "válido", "CNPJ numérico clássico"],
          ["12.ABC.345/01DE-35", "válido", "CNPJ alfanumérico, exemplo oficial"],
          ["12abc34501de35", "válido", "letras minúsculas depois da normalização"],
          ["12ABC34501DEAB", "inválido", "os dois verificadores têm de ser numéricos"],
          ["12345678９09", "inválido", "algarismo Unicode de largura total não é 0-9"],
        ]}
      />

      <p>
        O último caso merece atenção. Um usuário com teclado japonês ou um PDF
        exportado de certos sistemas pode produzir <code>９</code> — um caractere
        que parece nove, mas tem outro ponto de código. Em JavaScript,{" "}
        <code>\d</code> sem a flag <code>u</code> casa apenas com o intervalo de 0
        a 9 do ASCII, então a normalização o descarta e o tamanho passa a não
        bater. O comportamento correto é rejeitar, e o teste garante que ele não
        mude por acidente quando alguém resolver &ldquo;melhorar&rdquo; a regex.
      </p>

      <CodeBlock
        language="TypeScript"
        caption="Vitest com it.each — a tabela de casos vira a suíte inteira."
        code={`import { describe, expect, it } from "vitest";

import { validarCnpj, validarCpf } from "./documentos";

describe("validarCpf", () => {
  it.each([
    ["123.456.789-09", true],
    ["12345678909", true],
    ["  12345678909  ", true],
    ["100.000.000-19", true],
    ["100.000.006-04", true],
    ["111.111.111-11", false],
    ["000.000.000-00", false],
    ["123.456.789-00", false],
    ["1234567890", false],
    ["", false],
  ])("%s → %s", (entrada, esperado) => {
    expect(validarCpf(entrada)).toBe(esperado);
  });
});

describe("validarCnpj", () => {
  it.each([
    ["11.222.333/0001-81", true],
    ["12.ABC.345/01DE-35", true],
    ["12abc34501de35", true],
    ["11.222.333/0001-80", false],
    ["00.000.000/0000-00", false],
    ["12ABC34501DEAB", false],
    ["", false],
  ])("%s → %s", (entrada, esperado) => {
    expect(validarCnpj(entrada)).toBe(esperado);
  });
});`}
      />

      <p>
        Precisando de mais massa do que os exemplos fixos — para teste de carga,
        para popular um ambiente de homologação, para um teste de propriedade que
        roda mil documentos —, gere números fictícios com o{" "}
        <a href="/gerador-de-cpf">gerador de CPF</a> e o{" "}
        <Link href="/">gerador de CNPJ</Link> em vez de recorrer a documentos reais de
        colegas ou de clientes.
      </p>

      <h2>Onde validar em uma aplicação React</h2>
      <p>
        Validar a cada tecla digitada é hostil: o campo fica vermelho enquanto o
        usuário ainda está no terceiro algarismo. O momento certo no cliente é o{" "}
        <code>onBlur</code>, quando ele terminou de preencher e saiu do campo, com
        o erro limpo assim que ele volta a digitar.
      </p>

      <CodeBlock
        language="TSX"
        caption="Campo controlado que só acusa erro depois que o usuário sai dele."
        code={`"use client";

import { useState } from "react";

import { validarCpf } from "@/lib/documentos";

export function CampoCpf() {
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  function conferir() {
    // Campo vazio é problema de "obrigatório", não de validação.
    if (valor.trim() === "") return setErro(null);
    setErro(validarCpf(valor) ? null : "CPF inválido. Confira os números.");
  }

  return (
    <div>
      <label htmlFor="cpf">CPF</label>
      <input
        id="cpf"
        inputMode="numeric"
        autoComplete="off"
        value={valor}
        onChange={(evento) => {
          setValor(evento.target.value);
          setErro(null);
        }}
        onBlur={conferir}
        aria-invalid={erro !== null}
        aria-describedby={erro ? "cpf-erro" : undefined}
      />
      {erro && (
        <p id="cpf-erro" role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}`}
      />

      <p>
        No envio, revalide antes de chamar a API — o usuário pode ter colado o
        valor e enviado o formulário com Enter sem nunca disparar o{" "}
        <code>onBlur</code>. E revalide de novo no servidor, sempre. A validação
        no cliente é ergonomia, não segurança: qualquer pessoa consegue enviar uma
        requisição direta ao endpoint, e integrações sistema a sistema nem passam
        pela sua interface. Como a função é pura e não depende de DOM, o mesmo
        arquivo roda nos dois lados.
      </p>

      <CodeBlock
        language="TypeScript"
        caption="A mesma função pura reaproveitada no schema do servidor."
        code={`import { z } from "zod";

import { validarCnpj, validarCpf } from "@/lib/documentos";

export const cadastroSchema = z.object({
  cpf: z.string().refine(validarCpf, "CPF inválido."),
  cnpjEmpresa: z.string().refine(validarCnpj, "CNPJ inválido."),
});`}
      />

      <p>
        Grave o documento normalizado, sem máscara, e aplique a formatação só na
        exibição. Persistir ora <code>12345678909</code>, ora{" "}
        <code>123.456.789-09</code> transforma qualquer busca por igualdade em
        loteria e impede um índice único de funcionar.
      </p>

      <h2>Bibliotecas prontas e quando usar uma</h2>
      <p>
        O ecossistema JavaScript tem pacotes maduros para isso, e usar um é uma
        escolha defensável. A pergunta útil não é
        &ldquo;biblioteca ou código próprio&rdquo;, e sim quanto do seu domínio o
        pacote cobre.
      </p>
      <p>
        Uma dependência de terceiro faz sentido quando você precisa de muito mais
        do que CPF e CNPJ — inscrição estadual por estado, PIS, título de eleitor,
        renavam, cada um com sua regra —, quando a equipe é grande e você quer uma
        única implementação canônica, ou quando não há apetite para manter a
        regra do resto 10 documentada em algum canto. Cerca de cinquenta linhas
        sem dependências, por outro lado, custam pouco para manter, não entram no
        seu orçamento de bundle e não expõem você a um incidente de cadeia de
        suprimentos por conta de duas funções matemáticas.
      </p>
      <p>
        Escolhendo um pacote, confira três coisas antes: se ele já suporta o CNPJ
        alfanumérico (esse é hoje o melhor indicador de manutenção ativa), se ele
        rejeita as sequências repetidas e se a API aceita entrada com e sem
        máscara. Um pacote que falha em qualquer um desses pontos vai exigir que
        você escreva código em volta dele, e aí a economia evaporou.
      </p>

      <h2>Erros comuns</h2>
      <p>
        <strong>Tratar o documento como número.</strong> Converter para{" "}
        <code>Number</code> ou gravar em coluna inteira come o zero à esquerda:{" "}
        <code>012.345.678-90</code> vira dez algarismos e nunca mais valida. Com o
        CNPJ alfanumérico o problema deixou de ser sutil e passou a ser
        impossível de ignorar.
      </p>
      <p>
        <strong>Usar a mesma função de tamanho para os dois documentos.</strong>{" "}
        Um campo único que aceita CPF ou CNPJ deve rotear pelo comprimento
        normalizado: onze caracteres vão para <code>validarCpf</code>, quatorze
        para <code>validarCnpj</code>, qualquer outro valor é inválido. Tentar as
        duas funções e aceitar se alguma passar produz mensagens de erro
        incompreensíveis.
      </p>
      <p>
        <strong>Confundir válido com existente.</strong> Um CPF aprovado pelo
        módulo 11 é apenas matematicamente consistente. Ele pode nunca ter sido
        emitido, ou estar suspenso, ou pertencer a outra pessoa. Se a sua regra de
        negócio depende de existência ou de titularidade, é consulta à Receita —
        assunto do guia{" "}
        <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
          CPF válido não é CPF existente
        </a>
        .
      </p>
      <p>
        <strong>Exigir máscara na API.</strong> A interface pode e deve mascarar;
        o endpoint não deve recusar <code>12345678909</code>. Normalize na
        entrada, aceite os dois formatos e devolva sempre o mesmo.
      </p>
      <p>
        <strong>Não testar a fronteira do resto.</strong> Sem um caso de teste com
        resto 0 e outro com resto 10, a guarda <code>resto &lt; 2</code> pode ser
        removida num refactor e ninguém percebe até o primeiro cliente reclamar. A
        lista completa de armadilhas está no guia de{" "}
        <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
          erros comuns em validadores
        </a>
        .
      </p>
    </ArticleLayout>
  );
}
