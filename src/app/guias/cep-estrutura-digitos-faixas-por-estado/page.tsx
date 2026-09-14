import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable } from "@/components/guias/worked-table";
import { CEP_LENGTH, CEP_UFS, mask } from "@/lib/cep";
import { getGuide } from "@/lib/guias";

const guide = getGuide("cep-estrutura-digitos-faixas-por-estado")!;

export const metadata: Metadata = guideMetadata(guide);

function formatCepNumber(value: number): string {
  return mask(String(value).padStart(CEP_LENGTH, "0"));
}

/** Faixas por UF a partir da mesma tabela que o gerador usa. */
const UF_ROWS = CEP_UFS.map((entry) => [
  entry.uf,
  entry.name,
  entry.ranges
    .map(([start, end]) => `${formatCepNumber(start)} a ${formatCepNumber(end)}`)
    .join(" · "),
]);

const REGION_ROWS = [
  ["0", "São Paulo — capital e municípios da Grande São Paulo"],
  ["1", "São Paulo — interior e litoral"],
  ["2", "Rio de Janeiro e Espírito Santo"],
  ["3", "Minas Gerais"],
  ["4", "Bahia e Sergipe"],
  ["5", "Pernambuco, Alagoas, Paraíba e Rio Grande do Norte"],
  ["6", "Ceará, Piauí, Maranhão, Pará, Amazonas, Acre, Amapá e Roraima"],
  ["7", "Distrito Federal, Goiás, Tocantins, Mato Grosso, Mato Grosso do Sul e Rondônia"],
  ["8", "Paraná e Santa Catarina"],
  ["9", "Rio Grande do Sul"],
];

const BREAKDOWN_ROWS = [
  ["0", "1ª — Região", "Região postal 0: São Paulo, capital e Grande São Paulo."],
  ["1", "2ª — Sub-região", "Recorte dentro da região 0."],
  ["3", "3ª — Setor", "Divisão de triagem dentro da sub-região 01."],
  ["1", "4ª — Subsetor", "Divisão dentro do setor 013."],
  ["0", "5ª — Divisor de subsetor", "Fecha o prefixo 01310."],
  ["100", "6ª a 8ª — Sufixo", "Identifica o logradouro atendido por esse prefixo."],
];

const VALIDATION_CODE = `import { CEP_UFS } from "./cep-ufs";

export type CepCheck =
  | { level: "formato"; ok: false; reason: string }
  | { level: "faixa"; ok: true; uf: string | null };

export function checkCep(input: string): CepCheck {
  const digits = input.replace(/\\D/g, "");

  if (digits.length !== 8) {
    return { level: "formato", ok: false, reason: "CEP deve ter 8 dígitos." };
  }

  const value = Number(digits);
  const entry = CEP_UFS.find((uf) =>
    uf.ranges.some(([start, end]) => value >= start && value <= end),
  );

  // uf === null significa "fora das faixas conhecidas", nunca "CEP inválido".
  return { level: "faixa", ok: true, uf: entry?.uf ?? null };
}`;

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Um CEP não identifica um endereço: identifica uma posição na árvore de
        distribuição dos Correios. Essa distinção explica quase tudo que
        atrapalha quem implementa cadastro de endereço — por que um município
        inteiro cabe em um único número, por que dois prédios da mesma rua têm
        CEPs diferentes e por que não existe conta matemática capaz de dizer se
        um CEP existe. Os oito dígitos são lidos da esquerda para a direita, do
        país inteiro até um trecho de calçada.
      </p>

      <h2>De cinco para oito dígitos</h2>
      <p>
        O CEP nasceu na década de 1970 com cinco dígitos, quando o volume de
        correspondência passou a exigir uma chave numérica para ordenar a
        triagem antes que qualquer pessoa lesse o endereço escrito no envelope.
        Cinco dígitos dão cem mil combinações — o bastante para separar
        municípios e bairros, insuficiente para chegar ao logradouro nas capitais
        que cresceram nas duas décadas seguintes.
      </p>
      <p>
        Na década de 1990 vieram os três dígitos do sufixo, separados por hífen.
        O prefixo antigo foi preservado: quem tinha 01310 continuou com 01310, e
        o sufixo passou a detalhar o que havia dentro dele. Foi uma extensão, não
        uma renumeração — detalhe que importa quando você encontra uma base
        legada com CEPs de cinco posições.
      </p>
      <p>
        A migração dessas bases costuma ser feita completando o número com{" "}
        <code>000</code>, e isso só está certo quando o prefixo corresponde ao
        CEP geral de uma localidade. Em cidades grandes, <code>01310-000</code>{" "}
        não é o &ldquo;CEP genérico da Avenida Paulista&rdquo;: é um número que
        pode simplesmente não existir. Guarde sempre as oito posições e trate o
        hífen como formatação de exibição, não como dado.
      </p>

      <h2>Decompondo um CEP dígito a dígito</h2>
      <p>
        Cada posição do prefixo estreita a anterior. O primeiro dígito divide o
        país, o segundo divide aquela região, o terceiro divide aquela
        sub-região, e assim por diante. Nenhum dígito tem significado isolado: o
        setor <code>3</code> de São Paulo não tem relação nenhuma com o setor{" "}
        <code>3</code> da Bahia. Vale a decomposição de{" "}
        <code>01310-100</code>, na Avenida Paulista, em São Paulo:
      </p>
      <DataTable
        caption="01310-100 — Avenida Paulista, São Paulo/SP"
        headers={["Dígito", "Posição", "O que delimita"]}
        rows={BREAKDOWN_ROWS}
      />
      <p>
        O prefixo <code>01310</code> é a unidade de endereçamento propriamente
        dita; o sufixo <code>100</code> aponta para dentro dele. Como a leitura é
        hierárquica, cortar um CEP pela esquerda produz informação válida, só que
        mais grossa: <code>01</code> continua sendo São Paulo capital, e{" "}
        <code>013</code> continua sendo um setor de triagem dessa sub-região.
        Cortar pela direita não produz nada — <code>10-100</code> não significa
        coisa alguma.
      </p>
      <p>
        Um segundo exemplo mostra o outro extremo da escala. Em{" "}
        <code>78200-000</code>, o primeiro dígito é <code>7</code>, região que
        cobre o Centro-Oeste e Rondônia, e o número inteiro cai na faixa de Mato
        Grosso segundo a tabela de faixas mais abaixo. O sufixo <code>000</code>{" "}
        indica que não há detalhamento por logradouro: o CEP vale para a
        localidade toda. A estrutura entrega a região, a UF e o tipo de CEP. Que
        município é esse, ela não entrega — para isso é preciso consultar a base
        dos Correios.
      </p>

      <h2>As dez regiões postais e a lógica geográfica</h2>
      <p>
        O país é dividido em dez regiões postais, numeradas de 0 a 9 a partir da
        capital paulista e seguindo pelo restante do território. São Paulo é a
        única unidade federativa que ocupa duas regiões inteiras — a 0, com a
        capital e a Grande São Paulo, e a 1, com o interior e o litoral —, o que
        reflete o volume de correspondência do estado na época em que a numeração
        foi desenhada.
      </p>
      <DataTable
        caption="Primeiro dígito do CEP e abrangência de cada região postal"
        headers={["Dígito", "Abrangência"]}
        rows={REGION_ROWS}
      />
      <p>
        Como a numeração acompanha a geografia, ordenar uma lista de CEPs é quase
        ordenar por proximidade. Isso é útil na prática: tabelas de frete por
        faixa, roteirização e regras de cobertura de entrega quase sempre são
        expressas como intervalos de CEP justamente porque um intervalo contínuo
        tende a corresponder a uma área contígua. A garantia não é absoluta nas
        bordas entre regiões, mas erra pouco.
      </p>
      <p>
        É o mesmo tipo de leitura geográfica embutida em outro documento
        brasileiro: o{" "}
        <a href="/guias/regiao-fiscal-cpf">nono dígito do CPF</a> indica a região
        fiscal em que o cadastro foi feito. A diferença é que o dígito do CPF
        registra onde o documento foi emitido, enquanto o CEP descreve onde o
        endereço está agora.
      </p>

      <h2>Tabela completa de faixas por unidade federativa</h2>
      <p>
        Estas são as faixas que o{" "}
        <a href="/gerador-de-cep">gerador de CEP</a> usa para sortear números
        dentro do estado escolhido e para localizar a UF de um CEP colado na
        ferramenta. Repare que a maioria das UFs ocupa um intervalo contínuo, mas
        três delas não: Amazonas, Distrito Federal e Goiás aparecem com duas
        faixas cada, porque os intervalos se intercalam.
      </p>
      <DataTable
        caption="Faixas de CEP por unidade federativa"
        headers={["UF", "Estado", "Faixa"]}
        rows={UF_ROWS}
      />
      <p>
        Duas observações que economizam tempo de depuração. A primeira: a tabela
        começa em <code>01000-000</code>, e não em <code>00000-000</code> — todo
        o intervalo iniciado por <code>00</code> está fora de uso, o que faz de{" "}
        <code>00000-000</code> um ótimo caso de teste para o caminho de erro. A
        segunda: a cobertura das faixas não é total. O intervalo{" "}
        <code>78900-000</code> a <code>78999-999</code>, por exemplo, não é
        atribuído a nenhuma UF nesta tabela, de modo que uma função de busca
        devolve &ldquo;não encontrado&rdquo; para números ali dentro. Trate esse
        resultado como <em>desconhecido</em>, nunca como <em>inválido</em>.
      </p>

      <h2>CEP geral de município, CEP de logradouro e os sufixos especiais</h2>
      <p>
        O sufixo é o que diferencia os tipos de CEP, e ignorar essa distinção é a
        origem do bug mais comum em telas de endereço. Quando o sufixo é{" "}
        <code>000</code>, o CEP atende uma localidade inteira: municípios
        pequenos, distritos e boa parte da zona rural não têm numeração por
        logradouro. Uma consulta a esse CEP devolve município e UF, e devolve o
        campo de logradouro vazio — corretamente.
      </p>
      <p>
        Nas cidades com detalhamento, o sufixo identifica o logradouro, e ruas
        longas são fatiadas em vários CEPs por trecho ou por lado da via. Existem
        ainda sufixos reservados para casos que não são ruas: unidades dos
        Correios, caixas postais e os chamados grandes usuários — empresas,
        universidades e órgãos que recebem correspondência em volume suficiente
        para ganhar um CEP próprio. Um CEP de grande usuário aponta para uma
        entidade, não para um trecho de via, e é por isso que uma consulta pode
        devolver o nome de uma empresa onde seu formulário esperava o nome de uma
        rua. A documentação dos Correios, linkada nas fontes, detalha quais
        intervalos de sufixo correspondem a cada caso.
      </p>
      <p>
        A consequência prática é direta: nenhum campo preenchido por consulta de
        CEP pode ser obrigatório só porque a consulta costuma preenchê-lo. Se o
        seu formulário exige logradouro não vazio, ele rejeita endereços legítimos
        de milhares de municípios.
      </p>

      <h2>Por que o CEP não tem dígito verificador</h2>
      <p>
        Dígitos verificadores existem para proteger números que circulam
        sozinhos, ditados ao telefone ou digitados sem nenhum contexto que
        permita checá-los — é o caso do CPF, do CNPJ e do PIS, todos apoiados no{" "}
        <a href="/guias/modulo-11-digito-verificador">cálculo de módulo 11</a>.
        O CEP nunca viaja sozinho: ele chega acompanhado de rua, número, cidade e
        estado, e cada um desses campos é uma chance de detectar a inconsistência
        sem precisar de aritmética.
      </p>
      <p>
        Há também um motivo estrutural. Um DV consumiria uma das oito posições,
        e as oito já estavam comprometidas com a hierarquia geográfica. Gastar um
        dígito com controle significaria dividir por dez a capacidade de
        endereçamento que o sufixo acabara de criar.
      </p>
      <p>
        O preço disso é que erros de digitação são silenciosos. Trocar{" "}
        <code>01310-100</code> por <code>01810-100</code> gera outro número com
        formato impecável, na mesma região, provavelmente também existente. A
        única defesa é a redundância do próprio endereço: comparar a UF derivada
        da faixa com a UF que o usuário selecionou, comparar a cidade retornada
        pela consulta com a cidade digitada, e avisar quando divergirem. Esse é
        um caso em que a validação forte não está no número, e sim na coerência
        entre campos — assunto que aparece de outras formas no guia de{" "}
        <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
          erros comuns em validadores
        </a>
        .
      </p>

      <h2>Validar formato e faixa contra consultar existência</h2>
      <p>
        Vale separar três perguntas que costumam ser tratadas como uma só. A
        primeira é se o valor <em>tem formato de CEP</em>: oito dígitos, com ou
        sem máscara. A segunda é se ele <em>pertence a uma faixa conhecida</em>,
        o que já entrega a UF sem nenhuma chamada de rede. A terceira é se ele{" "}
        <em>existe</em> e a que logradouro corresponde — e essa só a base dos
        Correios responde. É a mesma escada de{" "}
        <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
          formato, verificação e existência
        </a>{" "}
        que vale para CPF e CNPJ.
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Os dois primeiros níveis rodam offline. O terceiro exige consulta."
        code={VALIDATION_CODE}
      />
      <p>
        Repare no tipo de retorno: <code>uf: null</code> não é erro. Faixas são
        redistribuídas ao longo do tempo, e uma tabela embutida no código
        envelhece. Um validador que rejeita o que não reconhece transforma
        desatualização em bloqueio de cadastro. Se o objetivo é apenas normalizar
        e conferir formato, uma expressão regular resolve — o guia de{" "}
        <a href="/guias/regex-documentos-brasileiros">
          regex para documentos brasileiros
        </a>{" "}
        traz os padrões com e sem máscara.
      </p>
      <p>
        Para o terceiro nível, trate a consulta como qualquer integração externa:
        timeout curto, cache por CEP consultado (o dado muda pouco) e degradação
        graciosa. Um checkout não pode ficar impossível de concluir porque um
        serviço de endereço está fora do ar; quando a consulta falha, libere o
        preenchimento manual e siga.
      </p>

      <h2>Boas práticas de formulário de endereço</h2>
      <ul>
        <li>
          Armazene os oito dígitos, sem hífen, em coluna de tamanho fixo.
          Formatação é responsabilidade da camada de apresentação.
        </li>
        <li>
          Aceite a colagem suja. O usuário vai colar <code>01310-100</code>,{" "}
          <code>01310 100</code> e <code>01.310-100</code>; normalize retirando
          tudo que não é dígito antes de validar.
        </li>
        <li>
          Use <code>inputMode=&quot;numeric&quot;</code> para abrir o teclado
          numérico no celular e os valores de <code>autocomplete</code> corretos
          em cada campo — <code>postal-code</code>, <code>address-level2</code>{" "}
          para cidade e <code>address-level1</code> para estado.
        </li>
        <li>
          Não bloqueie os campos preenchidos pela consulta. Loteamentos novos
          entram na base com atraso, e o morador precisa poder corrigir.
        </li>
        <li>
          Divergência entre a UF da faixa e a UF escolhida merece um aviso
          visível, não um erro que impede o envio: em regiões de fronteira
          municipal a confusão é genuína.
        </li>
        <li>
          Ofereça caminho para quem não sabe o CEP. Endereços rurais e
          comunidades sem logradouro nomeado dependem do CEP geral do município,
          e o restante da localização vai no complemento.
        </li>
      </ul>

      <h2>Massa de teste coerente por estado</h2>
      <p>
        Um CEP de teste isolado serve para pouco. O que quebra em homologação é a
        incoerência entre campos: ficha com endereço em Recife, DDD de Porto
        Alegre e CPF com dígito de região de Minas. Ao montar a massa, fixe a UF
        primeiro e derive os demais campos dela — é assim que o{" "}
        <a href="/gerador-de-pessoas">gerador de pessoas</a> e o{" "}
        <a href="/gerador-de-empresas">gerador de empresas</a> mantêm CEP,
        telefone e documento apontando para o mesmo estado.
      </p>
      <p>
        Além dos casos felizes sorteados dentro de cada faixa, mantenha fixtures
        fixas para os limites que a estrutura do CEP impõe: um CEP geral com
        sufixo <code>000</code>, para exercitar o caminho em que o logradouro
        volta vazio; um número no intervalo <code>00000-000</code>, que não
        pertence a faixa nenhuma; um valor de cinco dígitos vindo de base legada;
        e as bordas exatas de uma faixa, como <code>01000-000</code> e{" "}
        <code>19999-999</code>, onde comparações com <code>&lt;</code> em vez de{" "}
        <code>&lt;=</code> costumam se esconder. A estratégia geral de montagem
        está no guia de{" "}
        <a href="/guias/massa-de-dados-de-teste-fixtures-seeds-faker">
          massa de dados de teste
        </a>
        , e o motivo de nada disso vir de base de produção está no de{" "}
        <a href="/guias/lgpd-dados-de-teste">LGPD e dados de teste</a>.
      </p>
    </ArticleLayout>
  );
}
