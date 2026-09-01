import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { getGuide } from "@/lib/guias";

const guide = getGuide("placa-mercosul-vs-antiga")!;

export const metadata: Metadata = guideMetadata(guide);

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Se você desenvolve qualquer sistema que lida com veículos — frota,
        estacionamento, pedágio, seguro, multas —, precisa entender os dois padrões
        de placa que hoje convivem nas ruas: a <strong>placa antiga</strong>, no
        formato <code>ABC-1234</code>, e a <strong>placa Mercosul</strong>, no
        formato <code>ABC1D23</code>. Este guia explica a diferença, por que a
        mudança aconteceu e a regra exata que converte uma na outra.
      </p>

      <h2>O padrão antigo</h2>
      <p>
        Por décadas o Brasil usou placas com <strong>três letras seguidas de
        quatro números</strong>, exibidas com um hífen: <code>ABC-1234</code>. Esse
        modelo, adotado nos anos 1990, oferecia um número enorme, porém finito, de
        combinações, atreladas ao município e ao estado de emplacamento.
      </p>

      <h2>O padrão Mercosul</h2>
      <p>
        Desde 2018 as novas placas seguem o padrão <strong>Mercosul</strong>, que
        troca a quarta posição por uma letra. O formato passa a ser{" "}
        <strong>letra, letra, letra, número, letra, número, número</strong> —{" "}
        <code>ABC1D23</code>. Foram dois os objetivos: <strong>unificar</strong> a
        identificação veicular entre os países do bloco (Brasil, Argentina,
        Uruguai e Paraguai), facilitando fiscalização e circulação, e{" "}
        <strong>ampliar</strong> a quantidade de combinações possíveis, já que uma
        letra a mais multiplica o total.
      </p>

      <h2>Como os dois padrões convivem</h2>
      <p>
        A migração não foi obrigatória de uma vez. Veículos que já tinham placa
        antiga <strong>continuam com ela</strong> e só precisam trocar para o
        modelo Mercosul em situações específicas, como:
      </p>
      <ul>
        <li>primeiro emplacamento de um veículo novo;</li>
        <li>transferência de propriedade (venda);</li>
        <li>transferência do veículo entre municípios ou estados;</li>
        <li>substituição por dano, roubo ou furto da placa.</li>
      </ul>
      <p>
        Na prática, isso significa que sistemas reais precisam{" "}
        <strong>aceitar e validar os dois formatos por muitos anos</strong>. Um
        cadastro que só aceite <code>ABC-1234</code> vai rejeitar carros novos, e
        um que só aceite <code>ABC1D23</code> vai rejeitar a maioria dos carros
        usados.
      </p>

      <h2>A regra de conversão</h2>
      <p>
        A conversão de uma placa antiga para o padrão Mercosul é mecânica e afeta{" "}
        <strong>apenas um caractere</strong>: o segundo número (a quinta posição)
        vira uma letra, seguindo a tabela em que <code>0=A, 1=B, 2=C, 3=D, 4=E,
        5=F, 6=G, 7=H, 8=I e 9=J</code>. As três letras iniciais e os demais
        números não mudam.
      </p>
      <p>
        Por exemplo, <code>ABC-1234</code> vira <code>ABC1C34</code>: as letras{" "}
        <code>ABC</code> permanecem, o primeiro número <code>1</code> permanece, o
        segundo número <code>2</code> vira <code>C</code>, e <code>34</code>{" "}
        continuam iguais. Note que a placa <strong>não tem dígito
        verificador</strong>: diferentemente de CPF ou RENAVAM, a validação de uma
        placa se resume a conferir se ela bate com um dos dois formatos.
      </p>

      <h2>Placas para testes</h2>
      <p>
        Como não há cálculo de dígito envolvido, o que importa em uma placa de
        teste é o <strong>formato</strong>. Gerar placas fictícias válidas nos dois
        padrões é útil para exercitar máscaras de entrada, leitura por OCR,
        cadastros de frota e qualquer campo de placa — sem usar identificadores de
        veículos reais. O <a href="/gerador-de-placa">gerador de placa</a> do
        bateCarimbo produz tanto o padrão Mercosul quanto o antigo, e o validador
        identifica automaticamente qual é qual. Para o número que identifica o
        veículo no cadastro nacional, veja também o{" "}
        <a href="/gerador-de-renavam">gerador de RENAVAM</a>.
      </p>
    </ArticleLayout>
  );
}
