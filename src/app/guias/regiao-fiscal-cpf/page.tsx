import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { getGuide } from "@/lib/guias";

const guide = getGuide("regiao-fiscal-cpf")!;

export const metadata: Metadata = guideMetadata(guide);

const REGIONS = [
  { digit: "1", states: "DF, GO, MS, MT e TO" },
  { digit: "2", states: "AC, AM, AP, PA, RO e RR" },
  { digit: "3", states: "CE, MA e PI" },
  { digit: "4", states: "AL, PB, PE e RN" },
  { digit: "5", states: "BA e SE" },
  { digit: "6", states: "MG" },
  { digit: "7", states: "ES e RJ" },
  { digit: "8", states: "SP" },
  { digit: "9", states: "PR e SC" },
  { digit: "0", states: "RS" },
];

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        O CPF não é só uma sequência aleatória de números. Escondido nele há um
        dado geográfico: o <strong>nono dígito</strong> indica a{" "}
        <strong>região fiscal</strong> da Receita Federal em que o documento foi
        emitido. Saber ler esse dígito ajuda a entender por que é possível gerar um
        CPF &quot;de um estado&quot; e onde essa informação costuma ser mal
        interpretada.
      </p>

      <h2>Onde fica o dígito da região</h2>
      <p>
        O CPF tem onze algarismos: os nove primeiros formam o número-base e os dois
        últimos são os dígitos verificadores. O <strong>último dígito da
        base</strong> — o nono, logo antes do hífen — é o que carrega a região
        fiscal. No exemplo <code>123.456.789-09</code>, o nono dígito é{" "}
        <code>9</code>, que corresponde à 9ª região fiscal (Paraná e Santa
        Catarina).
      </p>

      <h2>As dez regiões fiscais</h2>
      <p>
        A Receita Federal divide o país em dez regiões fiscais. Cada uma
        corresponde a um dígito, de 1 a 9 mais o 0 (usado pela décima região):
      </p>
      <div className="my-4 overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left">
              <th className="px-4 py-2 font-medium">Dígito</th>
              <th className="px-4 py-2 font-medium">Estados</th>
            </tr>
          </thead>
          <tbody>
            {REGIONS.map((region) => (
              <tr key={region.digit} className="border-b last:border-0">
                <td className="px-4 py-2 font-mono text-primary">{region.digit}</td>
                <td className="px-4 py-2 text-muted-foreground">{region.states}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>O que o dígito realmente diz (e o que não diz)</h2>
      <p>
        Aqui mora o mal-entendido mais comum. O nono dígito indica onde o CPF foi{" "}
        <strong>emitido</strong> — não necessariamente onde a pessoa nasceu, mora
        hoje ou tem domicílio fiscal. Alguém nascido no Rio Grande do Sul pode ter
        tirado o CPF em São Paulo e, nesse caso, o dígito será 8, não 0. Por isso o
        dígito é um bom indício da origem do documento, mas <strong>não é uma prova
        do estado da pessoa</strong> e não deve ser usado como tal em regras de
        negócio.
      </p>
      <p>
        Vale lembrar também que o dígito da região não substitui a validação: ele
        faz parte da base sobre a qual os dois dígitos verificadores são
        calculados. Um CPF continua sendo validado pelo{" "}
        <a href="/guias/modulo-11-digito-verificador">módulo 11</a> normalmente — a
        região é apenas uma leitura adicional de um dígito que já estava lá.
      </p>

      <h2>Gerando CPF por estado</h2>
      <p>
        Como o dígito da região é conhecido, dá para gerar CPFs fictícios
        &quot;ancorados&quot; em um estado: basta fixar o nono dígito no valor da
        região correspondente e calcular os verificadores em cima disso. É assim
        que o <a href="/gerador-de-cpf">gerador de CPF</a> do bateCarimbo permite
        escolher a região fiscal, e é o mesmo mecanismo que mantém as fichas do{" "}
        <a href="/gerador-de-pessoas">gerador de pessoas</a> coerentes: quando você
        escolhe um estado, o CPF sai com o dígito de região certo e o endereço cai
        na faixa de CEP daquela UF.
      </p>
    </ArticleLayout>
  );
}
