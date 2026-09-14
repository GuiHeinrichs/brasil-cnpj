import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable, WorkedDvTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("modulo-11-digito-verificador")!;

export const metadata: Metadata = guideMetadata(guide);

const TS_MODULO11 = `/**
 * Soma ponderada e resto da divisão por 11, sem opinião sobre o dígito final.
 * O parâmetro "fator" existe por causa do RENAVAM, que multiplica a soma por 10
 * antes de tirar o resto. Todos os outros documentos usam fator 1.
 */
export function modulo11(base: string, pesos: number[], fator = 1): number {
  if (base.length !== pesos.length) {
    throw new Error(
      "base de " + base.length + " caracteres para " + pesos.length + " pesos",
    );
  }

  let soma = 0;
  for (let i = 0; i < base.length; i++) {
    soma += Number(base[i]) * pesos[i];
  }

  return (soma * fator) % 11;
}

// Cada documento decide o que fazer com o resto.
const dvCpf = (resto: number) => (resto < 2 ? 0 : 11 - resto);
const dvPis = (resto: number) => (11 - resto >= 10 ? 0 : 11 - resto);
const dvRg = (resto: number) => {
  const dv = 11 - resto;
  if (dv === 10) return "X";
  if (dv === 11) return "0";
  return String(dv);
};

modulo11("123456789", [10, 9, 8, 7, 6, 5, 4, 3, 2]); // 1 → dvCpf(1) = 0
modulo11("24598973", [2, 3, 4, 5, 6, 7, 8, 9]); // 0 → dvRg(0) = "0"
modulo11("1201661918", [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]); // 10 → dvPis(10) = 1
modulo11("1234567890", [3, 2, 9, 8, 7, 6, 5, 4, 3, 2], 10); // 0 → DV 0 (RENAVAM)`;

const PY_MODULO11 = `from collections.abc import Sequence


def modulo11(base: str, pesos: Sequence[int], fator: int = 1) -> int:
    """Soma ponderada e resto da divisão por 11."""
    if len(base) != len(pesos):
        raise ValueError(f"base de {len(base)} caracteres para {len(pesos)} pesos")

    soma = sum(int(c) * p for c, p in zip(base, pesos))
    return (soma * fator) % 11


def dv_cpf(resto: int) -> int:
    return 0 if resto < 2 else 11 - resto


def dv_pis(resto: int) -> int:
    dv = 11 - resto
    return 0 if dv >= 10 else dv


def dv_rg(resto: int) -> str:
    dv = 11 - resto
    return {10: "X", 11: "0"}.get(dv, str(dv))


assert dv_cpf(modulo11("123456789", [10, 9, 8, 7, 6, 5, 4, 3, 2])) == 0
assert dv_rg(modulo11("24598973", [2, 3, 4, 5, 6, 7, 8, 9])) == "0"
assert dv_pis(modulo11("1201661918", [3, 2, 9, 8, 7, 6, 5, 4, 3, 2])) == 1`;

const LUHN = `/** Módulo 10 (Luhn): dobra alternadamente a partir da direita. */
export function luhn(numero: string): boolean {
  let soma = 0;
  let dobra = false;

  for (let i = numero.length - 1; i >= 0; i--) {
    let d = Number(numero[i]);
    if (dobra) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    soma += d;
    dobra = !dobra;
  }

  return soma % 10 === 0;
}`;

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Quase todo documento brasileiro com número — CPF, CNPJ, PIS/PASEP, RG,
        título de eleitor, RENAVAM, CNH — termina com um ou dois algarismos
        especiais chamados de <strong>dígitos verificadores</strong>. Eles não
        identificam nada: são calculados a partir dos outros números e existem
        só para detectar erro de digitação. O algoritmo por trás da maioria
        deles é o <strong>módulo 11</strong>, e a parte difícil não é a conta —
        é o punhado de regras diferentes que cada documento aplica ao resultado
        dela.
      </p>

      <h2>Por que 11, e não 10</h2>
      <p>
        Um dígito verificador transforma um erro silencioso em erro imediato.
        Sem ele, um CPF digitado com um algarismo trocado só aparece semanas
        depois, numa nota fiscal rejeitada ou numa cobrança que não chega. Como
        o dígito é derivado matematicamente dos demais, qualquer alteração
        isolada quebra a relação e é pega no momento do cadastro.
      </p>
      <p>
        A escolha do 11 como divisor não é estética. Onze é primo, e os pesos
        usados nos documentos brasileiros vão de 1 a 11 — a CNH chega a usar
        peso 1 nas duas escadas, e o CPF usa peso 11 na primeira posição do
        segundo dígito. Se um algarismo <code>a</code> na posição de peso{" "}
        <code>w</code> vira <code>b</code>, a soma muda em <code>(a − b) × w</code>.
        Para o resto continuar o mesmo, esse produto teria de ser múltiplo de
        11; como 11 é primo e a diferença entre dois algarismos fica entre −9 e
        9, isso só acontece quando o próprio peso é múltiplo de 11. Com
        qualquer peso de 1 a 10, trocar um algarismo muda o resto da divisão —
        é essa propriedade que faz o módulo 11 valer a pena.
      </p>
      <p>
        A <strong>transposição</strong> — trocar dois algarismos vizinhos de
        lugar, o segundo erro de digitação mais comum — cai na mesma conta. Com
        pesos consecutivos, inverter <code>a</code> e <code>b</code> muda a soma
        em <code>(a − b) × 1</code>, de novo um valor entre −9 e 9, e portanto
        muda o resto, desde que os dois algarismos sejam diferentes.
      </p>
      <p>
        O único peso múltiplo de 11 em uso nos documentos brasileiros é o 11 do
        CPF, e ele tem uma consequência concreta. No segundo dígito
        verificador, o primeiro algarismo é multiplicado por 11, que é
        congruente a zero módulo 11: aquele algarismo não altera a soma do
        segundo DV. Trocá-lo mantendo o primeiro DV produziria o mesmo segundo
        dígito, sempre. Quem cobre a primeira posição do CPF é o primeiro DV,
        onde o mesmo algarismo pesa 10 — é um caso literal de dois dígitos
        tapando, cada um, o buraco que o outro deixa.
      </p>
      <p>
        Vale a ressalva de que mudar o resto não é o mesmo que mudar o dígito.
        A regra final do CPF manda os restos 0 e 1 para o dígito 0, e essa
        colisão reintroduz uma fresta: varrendo todas as trocas de um algarismo
        da base em CPFs válidos, cerca de <strong>0,22%</strong> resultam em
        outro CPF válido, e mais de 90% delas estão justamente na primeira
        posição, onde o segundo dígito é cego. O módulo 11 detecta todo erro de
        um algarismo <em>na soma ponderada</em>; a conversão do resto em dígito
        é que devolve um pouco da ambiguidade.
      </p>
      <p>
        O limite de −9 a 9 na diferença também só vale enquanto os caracteres
        são algarismos. No{" "}
        <a href="/guias/cnpj-alfanumerico-2026">CNPJ alfanumérico</a>, cada
        caractere entra pelo valor <code>ASCII − 48</code>, então <code>6</code>{" "}
        vale 6 e <code>A</code> vale 17: a diferença é exatamente 11, e trocar
        um pelo outro não mexe em nenhum dos dois dígitos verificadores.{" "}
        <code>12.ABC.345/01DE-35</code>, <code>12.6BC.345/01DE-35</code> e{" "}
        <code>12.LBC.345/01DE-35</code> são todos válidos pelo mesmo par de
        DVs. É um efeito colateral de reaproveitar o módulo 11 com um alfabeto
        de 36 símbolos, e é bom saber que ele existe antes de prometer ao
        cliente que o dígito pega qualquer erro de digitação.
      </p>

      <h2>A receita geral, em código</h2>
      <p>
        Todo cálculo de módulo 11 tem a mesma espinha: multiplique cada
        caractere da base por um peso, some os produtos, tire o resto da divisão
        por 11 e converta esse resto em dígito. O que varia entre documentos é o
        vetor de pesos e a última etapa. Vale a pena escrever a parte comum uma
        vez só e deixar a conversão do resto como responsabilidade de quem
        chama:
      </p>
      <CodeBlock
        language="TypeScript"
        caption="A função devolve o resto cru. Cada documento tem seu próprio conversor."
        code={TS_MODULO11}
      />
      <CodeBlock
        language="Python"
        caption="Mesma separação: soma ponderada genérica, regra final por documento."
        code={PY_MODULO11}
      />
      <p>
        A assinatura pede o vetor de pesos já na ordem dos caracteres, da
        esquerda para a direita, e a checagem de comprimento no início existe
        por um motivo. Boa parte das especificações descreve os pesos{" "}
        <em>de trás para frente</em> — &ldquo;2 a 9, da direita para a
        esquerda&rdquo; é a formulação clássica do CNPJ — e quem transcreve essa
        frase para um laço que percorre a string do começo aplica o vetor
        invertido. O resultado é um validador que funciona por acaso em números
        palindrômicos e falha em todo o resto. Fixar uma única convenção na
        função genérica e escrever os pesos expandidos elimina a classe inteira
        de bugs.
      </p>
      <p>
        Repare que <code>dvCpf</code> e <code>dvPis</code> são a mesma regra
        escrita de dois jeitos. Dizer &ldquo;se o resto for menor que 2, o
        dígito é 0&rdquo; é idêntico a dizer &ldquo;se <code>11 − resto</code>{" "}
        der 10 ou 11, o dígito é 0&rdquo;: resto 0 produz 11 e resto 1 produz
        10. Boa parte da confusão em torno do módulo 11 vem de documentações que
        descrevem a mesma regra com palavras diferentes.
      </p>

      <h2>CPF resolvido, linha a linha</h2>
      <p>
        O CPF tem nove algarismos de base e dois dígitos verificadores. Com a
        base <code>123456789</code>, os pesos do primeiro dígito vão de 10 a 2,
        da esquerda para a direita:
      </p>
      <WorkedDvTable
        title="CPF 123456789 — primeiro dígito verificador"
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
        rule="Resto menor que 2: o dígito é 0."
        result="0"
      />
      <p>
        O segundo dígito repete a conta sobre a base acrescida do primeiro DV,
        agora com dez pesos, de 11 a 2:
      </p>
      <WorkedDvTable
        title="CPF 1234567890 — segundo dígito verificador"
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
        rule="Resto maior ou igual a 2: o dígito é 11 − 2."
        result="9"
      />
      <p>
        Daí sai <code>123.456.789-09</code>. O CNPJ segue exatamente a mesma
        regra final, mudando apenas os pesos, que ciclam de 2 a 9 da direita
        para a esquerda; no{" "}
        <a href="/guias/cnpj-alfanumerico-2026">formato alfanumérico</a>, cada
        caractere entra na soma pelo seu valor <code>ASCII − 48</code>, de modo
        que <code>0</code> vale 0 e <code>A</code> vale 17.
      </p>

      <h2>Um algoritmo, sete tratamentos do resto</h2>
      <p>
        A tabela abaixo é o resumo que costuma faltar quando alguém vai escrever
        um validador para mais de um documento. A coluna da direita é onde
        moram praticamente todos os bugs:
      </p>
      <DataTable
        caption="Pesos e regra final por documento, na ordem em que aparecem no número."
        headers={["Documento", "Pesos (esquerda → direita)", "DVs", "Tratamento do resto"]}
        rows={[
          [
            "CPF",
            "10…2 no 1º DV; 11…2 no 2º",
            "2",
            "Resto < 2 → 0; senão 11 − resto",
          ],
          [
            "CNPJ",
            "5,4,3,2,9,8,7,6,5,4,3,2 no 1º; 6,5,4,3,2,9,8,7,6,5,4,3,2 no 2º",
            "2",
            "Resto < 2 → 0; senão 11 − resto",
          ],
          [
            "PIS/PASEP",
            "3,2,9,8,7,6,5,4,3,2",
            "1",
            "11 − resto; 10 e 11 viram 0",
          ],
          [
            "RENAVAM",
            "3,2,9,8,7,6,5,4,3,2",
            "1",
            "Resto de (soma × 10); 10 vira 0",
          ],
          [
            "RG (SSP-SP)",
            "2,3,4,5,6,7,8,9",
            "1",
            "11 − resto; 10 vira X e 11 vira 0",
          ],
          [
            "Título de eleitor",
            "2…9 sobre o sequencial; 7,8,9 sobre UF e 1º DV",
            "2",
            "DV = resto; 10 vira 0; resto 0 vira 1 em SP e MG",
          ],
          [
            "CNH",
            "9…1 no 1º DV; 1…9 no 2º",
            "2",
            "DV = resto; 10 vira 0 e desconta 2 do 2º DV",
          ],
        ]}
      />
      <p>
        Duas linhas fogem do padrão e merecem atenção. O{" "}
        <a href="/guias/titulo-de-eleitor-estrutura-uf-zona-secao">
          título de eleitor
        </a>{" "}
        e a <a href="/guias/cnh-numero-registro-digito-verificador">CNH</a> usam
        o resto <em>diretamente</em> como dígito, sem o <code>11 − resto</code>.
        E a CNH tem o caso mais esquisito do conjunto: quando o resto do
        primeiro DV é 10, o segundo dígito sofre um desconto de 2 — regra em que
        implementações conhecidas divergem entre si, motivo pelo qual o gerador
        do bateCarimbo evita produzir bases nessa faixa.
      </p>

      <h2>O caso do resto 0, que quebra a fórmula ingênua</h2>
      <p>
        Quem escreve <code>dv = 11 - soma % 11</code> e para por aí produz
        dígitos 10 e 11, que não existem. O resto 10 é o caso lembrado com mais
        frequência; o resto 0, que gera <code>11 − 0 = 11</code>, é o que passa
        despercebido, porque aparece com menos frequência nos números de teste
        escolhidos à mão. O{" "}
        <a href="/gerador-de-rg">RG no padrão SSP-SP</a> de base{" "}
        <code>24598973</code> cai exatamente nele:
      </p>
      <WorkedDvTable
        title="RG 24598973 — dígito verificador"
        steps={[
          { char: "2", weight: 2 },
          { char: "4", weight: 3 },
          { char: "5", weight: 4 },
          { char: "9", weight: 5 },
          { char: "8", weight: 6 },
          { char: "9", weight: 7 },
          { char: "7", weight: 8 },
          { char: "3", weight: 9 },
        ]}
        sum={275}
        remainder={0}
        rule="11 − 0 = 11, e no RG o resultado 11 vira 0 (o resultado 10 viraria X)."
        result="0"
      />
      <p>
        O RG é o único documento da lista em que o dígito pode ser uma letra. É
        a mesma solução do ISBN-10, que também usa módulo 11 e também representa
        o valor 10 com <code>X</code> — a diferença é que o RG converte só o 10
        em letra, mantendo o 11 como 0. Por isso um campo de RG precisa ser{" "}
        <code>char(9)</code> ou equivalente, nunca inteiro.
      </p>

      <h2>Módulo 10 (Luhn) contra módulo 11</h2>
      <p>
        Nem todo dígito verificador é módulo 11. O outro algoritmo que você
        encontra o tempo todo é o <strong>módulo 10</strong>, popularmente
        chamado de Luhn, usado em números de cartão de crédito e em IMEI de
        celulares. Ele não tem vetor de pesos: percorre o número da direita para
        a esquerda dobrando um algarismo sim, outro não, subtrai 9 dos
        resultados maiores que 9 e exige que a soma final seja múltipla de 10.
      </p>
      <CodeBlock
        language="TypeScript"
        caption="O Luhn valida o número inteiro, incluindo o próprio dígito verificador."
        code={LUHN}
      />
      <p>
        A diferença prática aparece na cobertura de erros. O Luhn detecta
        qualquer troca de um único dígito e quase toda transposição de vizinhos
        — com um furo conhecido: <code>09</code> e <code>90</code> produzem a
        mesma soma e trocam de lugar sem que ele perceba. O módulo 11, com pesos
        distintos por posição, não tem esse furo, mas paga o preço de precisar
        de uma regra extra para os restos que não cabem em um algarismo. É a
        troca clássica entre um algoritmo que sempre devolve um dígito de 0 a 9 e
        outro que detecta mais erros.
      </p>
      <p>
        Os dois convivem no mesmo documento com mais frequência do que se
        imagina. A linha digitável de um boleto bancário usa módulo 10 nos
        dígitos de cada campo e módulo 11 no dígito geral do código de barras;
        livros usam módulo 11 no ISBN-10 e módulo 10 no ISBN-13. Ao portar um
        validador de um domínio para outro, confira qual dos dois está em jogo
        antes de reaproveitar código: o formato do número não denuncia o
        algoritmo.
      </p>

      <h2>Os casos de teste que todo validador deveria ter</h2>
      <p>
        Um validador de documento é um dos raros pedaços de código em que a
        suíte de testes pode ser praticamente exaustiva, e mesmo assim a maioria
        cobre só o caminho feliz. Estes são os casos que separam uma
        implementação correta de uma que passou no primeiro exemplo que
        encontraram:
      </p>
      <DataTable
        caption="Casos mínimos. Repita o conjunto para cada documento que o sistema aceita."
        headers={["Entrada", "Esperado", "O que o caso pega"]}
        rows={[
          [
            "123.456.789-09",
            "válido",
            "Caminho feliz com máscara — garante que a normalização remove pontos e hífen",
          ],
          [
            "123.456.789-19",
            "inválido",
            "Um dígito verificador trocado, o erro de digitação mais comum",
          ],
          [
            "111.111.111-11",
            "inválido",
            "A conta do módulo 11 fecha; a rejeição precisa ser explícita",
          ],
          [
            "24.598.973-0",
            "válido",
            "RG em que o resto é 0 — quebra quem escreveu 11 − resto sem tratamento",
          ],
          [
            "12.ABC.345/01DE-35",
            "válido",
            "CNPJ alfanumérico: cada caractere entra pelo valor ASCII − 48",
          ],
          [
            "12.abc.345/01de-35",
            "decisão consciente",
            "Minúsculas mudam o valor ASCII; normalizar ou recusar, mas com teste",
          ],
          [
            "1234567890",
            "inválido",
            "Comprimento errado, recusado antes de qualquer multiplicação",
          ],
          [
            "(vazio), null, undefined",
            "inválido, sem exceção",
            "Campo de formulário vazio chegando ao validador",
          ],
        ]}
      />
      <p>
        Faltam ainda dois testes que não cabem em tabela. O primeiro é o de ida
        e volta: gere alguns milhares de documentos com o seu gerador e valide
        todos. Se gerador e validador foram escritos a partir da mesma regra
        errada, esse teste passa e não prova nada — então acrescente o segundo,
        que é o de mutação: pegue um número válido, altere um algarismo qualquer
        da base e confirme que o validador recusa. É esse par que flagra o
        validador que só confere o comprimento.
      </p>
      <p>
        Documentos que mudaram de tamanho pedem um teste próprio. O RENAVAM é o
        exemplo: números emitidos antes de 2013 tinham nove algarismos e
        continuam válidos hoje preenchidos com zeros à esquerda até onze. Um
        validador que recusa entradas de nove dígitos em vez de completá-las
        rejeita veículos antigos inteiros, e nenhum teste com números recentes
        revela isso.
      </p>
      <p>
        Um caso de borda extra vale para qualquer linguagem de tipagem fraca:
        teste uma base que comece com zeros. Validadores que convertem a entrada
        para inteiro antes de percorrer os dígitos perdem os zeros à esquerda,
        encurtam a base e desalinham todo o vetor de pesos. O sintoma é sempre o
        mesmo — funciona com 99% dos números e falha com os que começam em 0.
      </p>

      <h2>O que o módulo 11 não garante</h2>
      <p>
        Sequências de algarismos repetidos passam na conta. <code>111.111.111-11</code>{" "}
        e <code>000.000.000-00</code> fecham a matemática do módulo 11 sem
        nenhum problema, mas são considerados inválidos por convenção, e todo
        validador sério os rejeita com uma verificação separada, antes ou depois
        do cálculo.
      </p>
      <p>
        Mais importante: um número aprovado pelo módulo 11 é apenas{" "}
        <em>bem formado</em>. Ele não prova que o documento existe, que está
        regular ou que pertence a alguém — essa checagem só a base oficial faz.
        É exatamente essa separação que torna possível gerar massa de teste sem
        tocar em dado pessoal: os números do bateCarimbo satisfazem todos os
        validadores porque a regra de cada documento está implementada por
        inteiro — pesos, tratamento do resto e rejeição de sequências repetidas
        —, e ao mesmo tempo não correspondem a ninguém. Se você está
        implementando isso agora, os guias de{" "}
        <a href="/guias/validar-cpf-cnpj-javascript-typescript">
          validação em JavaScript
        </a>{" "}
        e{" "}
        <a href="/guias/validar-cpf-cnpj-python-java-csharp">
          em Python, Java e C#
        </a>{" "}
        trazem o código completo, e o guia de{" "}
        <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
          erros comuns em validadores
        </a>{" "}
        reúne as armadilhas que aparecem fora do cálculo do dígito.
      </p>
    </ArticleLayout>
  );
}
