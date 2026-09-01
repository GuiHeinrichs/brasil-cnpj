import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { getGuide } from "@/lib/guias";

const guide = getGuide("modulo-11-digito-verificador")!;

export const metadata: Metadata = guideMetadata(guide);

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Quase todo documento brasileiro com número — CPF, CNPJ, PIS/PASEP, RG,
        título de eleitor, RENAVAM — termina com um ou dois algarismos especiais
        chamados de <strong>dígitos verificadores</strong>. Eles não fazem parte
        da identificação em si: são calculados a partir dos outros números e
        servem para detectar erros de digitação. Se alguém troca ou inverte um
        algarismo ao digitar, a conta não bate e o sistema recusa o documento
        antes de gravá-lo. O algoritmo por trás da maioria desses cálculos é o{" "}
        <strong>módulo 11</strong>.
      </p>

      <h2>Por que dígitos verificadores existem</h2>
      <p>
        Imagine um cadastro em que o CPF é digitado errado por um único número. Sem
        nenhuma checagem, esse erro só apareceria muito depois — em uma cobrança
        que não chega, em uma nota fiscal rejeitada, em um relatório que não
        fecha. O dígito verificador antecipa esse problema: como ele é derivado
        matematicamente dos demais dígitos, qualquer alteração isolada quebra a
        relação e é detectada na hora. É o mesmo princípio de códigos de barras,
        números de conta bancária e o código de barras de boletos.
      </p>
      <p>
        O módulo 11 é especialmente bom nisso porque usa <strong>pesos
        diferentes</strong> para cada posição. Isso permite detectar não só a
        troca de um dígito, mas também a <strong>transposição</strong> — quando
        dois algarismos vizinhos trocam de lugar, um erro de digitação muito
        comum que um dígito verificador mais simples deixaria passar.
      </p>

      <h2>A receita geral do módulo 11</h2>
      <p>
        Todo cálculo de módulo 11 segue quatro passos, mudando apenas os pesos e a
        regra final conforme o documento:
      </p>
      <ol>
        <li>
          Multiplique cada algarismo da base por um <strong>peso</strong>. Os
          pesos costumam ir de 2 a 9 e se repetir da direita para a esquerda.
        </li>
        <li>Some todos os produtos.</li>
        <li>
          Calcule o <strong>resto</strong> da divisão dessa soma por 11 (a
          operação de módulo).
        </li>
        <li>
          Converta o resto no dígito verificador segundo a regra do documento —
          geralmente <code>DV = 11 − resto</code>, com um tratamento especial
          para os casos em que o resultado seria 10 ou 11.
        </li>
      </ol>
      <p>
        A parte que mais confunde é justamente esse tratamento final. Como o resto
        da divisão por 11 pode ser qualquer valor de 0 a 10, às vezes o cálculo
        produziria um &quot;dígito&quot; de dois algarismos (10). Cada documento
        resolve isso de um jeito: alguns transformam 10 em 0, outros usam a letra{" "}
        <code>X</code> para representar o 10.
      </p>

      <h2>Exemplo resolvido: o dígito verificador de um CPF</h2>
      <p>
        O CPF tem nove algarismos de base e dois dígitos verificadores. Vamos
        calcular os DVs da base <code>123.456.789</code>, que resulta no CPF{" "}
        <code>123.456.789-09</code>.
      </p>
      <h3>Primeiro dígito</h3>
      <p>
        Multiplique os nove algarismos pelos pesos 10, 9, 8, 7, 6, 5, 4, 3 e 2, da
        esquerda para a direita:
      </p>
      <p>
        <code>
          1×10 + 2×9 + 3×8 + 4×7 + 5×6 + 6×5 + 7×4 + 8×3 + 9×2 = 210
        </code>
      </p>
      <p>
        O resto de <code>210 ÷ 11</code> é <code>1</code>. A regra do CPF diz: se
        o resto for menor que 2, o dígito é 0; caso contrário, é{" "}
        <code>11 − resto</code>. Como 1 é menor que 2, o{" "}
        <strong>primeiro dígito é 0</strong>.
      </p>
      <h3>Segundo dígito</h3>
      <p>
        Agora incluímos o primeiro DV na conta e usamos dez pesos, de 11 a 2:
      </p>
      <p>
        <code>
          1×11 + 2×10 + 3×9 + 4×8 + 5×7 + 6×6 + 7×5 + 8×4 + 9×3 + 0×2 = 255
        </code>
      </p>
      <p>
        O resto de <code>255 ÷ 11</code> é <code>2</code>. Como não é menor que 2,
        aplicamos <code>11 − 2 = 9</code>. O <strong>segundo dígito é 9</strong>.
        Juntando tudo, chegamos a <code>123.456.789-09</code> — que é exatamente o
        exemplo canônico usado para explicar o CPF.
      </p>

      <h2>Os mesmos passos, pesos diferentes</h2>
      <p>
        Cada documento é uma variação da mesma ideia. O que muda são os pesos, a
        quantidade de dígitos verificadores e o tratamento do resto:
      </p>
      <ul>
        <li>
          <strong>CNPJ</strong>: 12 algarismos de base e dois DVs. Os pesos vão de
          2 a 9, repetindo da direita para a esquerda. No novo formato
          alfanumérico, cada caractere entra na conta pelo seu valor{" "}
          <code>ASCII − 48</code> (então <code>0</code> vale 0, <code>A</code>{" "}
          vale 17, e assim por diante), mas os dois DVs continuam numéricos.
        </li>
        <li>
          <strong>PIS/PASEP (NIS/NIT)</strong>: 10 de base e um DV, com pesos 3,
          2, 9, 8, 7, 6, 5, 4, 3 e 2. Resultados 10 e 11 viram 0.
        </li>
        <li>
          <strong>RG (padrão SSP-SP)</strong>: 8 de base e um DV, pesos de 2 a 9.
          Aqui o resto 10 vira a letra <code>X</code> e o 11 vira 0 — por isso
          alguns RGs terminam em X.
        </li>
        <li>
          <strong>RENAVAM</strong>: 10 de base e um DV. A soma ponderada é
          multiplicada por 10 antes de tirar o resto; o resultado 10 vira 0.
        </li>
        <li>
          <strong>Título de eleitor</strong>: dois DVs calculados sobre o
          sequencial e o código da UF. Títulos de São Paulo e Minas Gerais têm uma
          exceção: quando o resto dá 0, o dígito vira 1.
        </li>
      </ul>

      <h2>Casos-limite que enganam validadores</h2>
      <p>
        Dois detalhes derrubam muitos validadores feitos às pressas. O primeiro é
        o tratamento do resto igual a 10: quem esquece de convertê-lo (em 0 ou em{" "}
        <code>X</code>, conforme o documento) gera números inválidos ou rejeita
        números válidos. O segundo é a{" "}
        <strong>sequência de dígitos repetidos</strong>: números como{" "}
        <code>111.111.111-11</code> ou <code>000.000.000-00</code>{" "}
        <em>passam</em> no cálculo do módulo 11 — a matemática fecha —, mas são
        considerados inválidos por convenção, justamente por serem placeholders
        óbvios. Um validador correto precisa rejeitá-los explicitamente, mesmo que
        a conta bata.
      </p>
      <p>
        É por isso que gerar documentos de teste manualmente é arriscado: é fácil
        produzir um número que parece válido mas tropeça em um desses casos. As
        ferramentas do bateCarimbo aplicam a regra completa de cada documento —
        pesos, tratamento do resto e rejeição de sequências repetidas —, então
        todo número gerado passa nos validadores que seguem a especificação
        oficial.
      </p>
    </ArticleLayout>
  );
}
