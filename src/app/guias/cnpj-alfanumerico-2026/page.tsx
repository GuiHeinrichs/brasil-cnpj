import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { getGuide } from "@/lib/guias";

const guide = getGuide("cnpj-alfanumerico-2026")!;

export const metadata: Metadata = guideMetadata(guide);

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        A partir de <strong>julho de 2026</strong>, as novas inscrições no
        Cadastro Nacional da Pessoa Jurídica passam a usar o formato{" "}
        <strong>alfanumérico</strong>: além dos números, o CNPJ poderá conter
        letras de A a Z. É a maior mudança na estrutura do documento desde a sua
        criação, e afeta praticamente todo sistema brasileiro que armazena, valida
        ou exibe um CNPJ. Este guia explica o que muda, por que a mudança
        acontece e o que precisa ser adaptado.
      </p>

      <h2>Como o CNPJ é estruturado hoje</h2>
      <p>
        O CNPJ tem catorze posições divididas em três partes. As oito primeiras
        são a <strong>raiz</strong>, que identifica a empresa. As quatro seguintes
        são a <strong>ordem</strong> do estabelecimento: <code>0001</code> é a
        matriz e os números seguintes são as filiais. As duas últimas são os{" "}
        <strong>dígitos verificadores</strong>, calculados por módulo 11. Uma
        matriz e suas filiais compartilham a mesma raiz e diferem apenas na ordem.
      </p>
      <p>
        No formato atual, todas as doze posições da base são numéricas. É
        justamente aí que está o problema: as combinações puramente numéricas
        estão se esgotando à medida que novas empresas são abertas.
      </p>

      <h2>O que muda no formato alfanumérico</h2>
      <p>
        A mudança, definida pela Receita Federal em conjunto com o SERPRO, é
        direta: <strong>a raiz e a ordem passam a aceitar letras e números</strong>{" "}
        (0–9 e A–Z), enquanto os <strong>dois dígitos verificadores continuam
        sempre numéricos</strong>. Um CNPJ alfanumérico se parece com{" "}
        <code>12.ABC.345/01DE-35</code>: a mesma máscara de sempre, mas com letras
        em algumas posições.
      </p>
      <p>
        Dois pontos importantes tranquilizam quem já tem sistemas rodando. Primeiro:
        os <strong>CNPJs numéricos existentes continuam válidos para sempre</strong>{" "}
        e não mudam — nenhuma empresa precisará trocar de número. Segundo: os dois
        formatos <strong>convivem</strong>. Depois de julho de 2026, um sistema
        vai receber tanto CNPJs antigos (só números) quanto novos (com letras), e
        precisa aceitar os dois.
      </p>

      <h2>Como fica o cálculo do dígito verificador</h2>
      <p>
        O algoritmo continua sendo o módulo 11, com uma adaptação para lidar com
        letras. Cada caractere entra na conta pelo seu <strong>valor numérico
        derivado do código ASCII</strong>: pega-se o código ASCII do caractere e
        subtrai-se 48. Assim, os algarismos <code>0</code> a <code>9</code>{" "}
        mantêm os valores 0 a 9 (porque <code>&apos;0&apos;</code> é 48 no ASCII),
        e as letras seguem a partir daí — <code>A</code> vale 17, <code>B</code>{" "}
        vale 18, e assim por diante até <code>Z</code>. Com esses valores em mãos,
        os pesos de 2 a 9 e a divisão por 11 funcionam como sempre, e os dois
        dígitos verificadores resultantes são numéricos.
      </p>

      <h2>O que os sistemas precisam adaptar</h2>
      <p>
        A adaptação raramente é difícil, mas costuma estar espalhada por muitos
        pontos do código. Vale revisar:
      </p>
      <ul>
        <li>
          <strong>Banco de dados</strong>: colunas de CNPJ que hoje são numéricas
          (inteiro/bigint) precisam virar texto. Guardar CNPJ como número sempre
          foi arriscado por causa dos zeros à esquerda; com letras, passa a ser
          inviável.
        </li>
        <li>
          <strong>Validações e expressões regulares</strong>: qualquer{" "}
          <code>regex</code> que só aceite dígitos (<code>[0-9]</code>) precisa
          passar a aceitar letras maiúsculas nas posições da raiz e da ordem.
        </li>
        <li>
          <strong>Máscaras de entrada</strong>: campos de formulário que bloqueiam
          a digitação de letras precisam liberá-las, mantendo o DV numérico.
        </li>
        <li>
          <strong>Cálculo do DV</strong>: qualquer rotina própria de validação
          precisa usar a conversão <code>ASCII − 48</code> para os caracteres.
        </li>
        <li>
          <strong>Integrações e relatórios</strong>: exportações, ordenações e
          integrações fiscais (NF-e, SPED) devem ser testadas com CNPJs
          alfanuméricos antes do prazo.
        </li>
      </ul>

      <h2>Como se preparar com antecedência</h2>
      <p>
        A melhor forma de não ser pego de surpresa é testar os fluxos agora, com
        CNPJs alfanuméricos fictícios, e garantir que cadastro, validação,
        armazenamento e exibição funcionam com letras. É exatamente para isso que
        o gerador de CNPJ do bateCarimbo oferece os dois formatos lado a lado:
        gere lotes no formato numérico legado e no novo alfanumérico, ambos com
        dígitos verificadores corretos, e use-os como massa de teste para deixar
        seus sistemas prontos antes de julho de 2026.
      </p>
    </ArticleLayout>
  );
}
