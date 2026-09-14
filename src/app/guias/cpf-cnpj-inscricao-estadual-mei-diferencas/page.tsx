import type { Metadata } from "next";
import Link from "next/link";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("cpf-cnpj-inscricao-estadual-mei-diferencas")!;

export const metadata: Metadata = guideMetadata(guide);

const CADASTROS = [
  [
    "CPF",
    "Receita Federal, cadastro nacional único",
    "11 algarismos, sempre numéricos",
    "Sim, dois dígitos calculados por módulo 11",
    "Identificação de pessoa física em qualquer cadastro, público ou privado",
  ],
  [
    "CNPJ",
    "Receita Federal, cadastro nacional único",
    "14 posições: 8 de raiz, 4 de ordem e 2 de verificação; as 12 primeiras admitem letras a partir de 2026",
    "Sim, dois dígitos calculados por módulo 11",
    "Identificação de pessoa jurídica e de estabelecimento perante a União",
  ],
  [
    "Inscrição estadual",
    "Secretaria da Fazenda de cada estado e do Distrito Federal",
    "Um formato por unidade federativa, com comprimento e regra próprios",
    "Quase sempre, mas com regra específica de cada estado",
    "Cadastro de contribuinte de ICMS: quem circula mercadoria, e não quem apenas existe",
  ],
  [
    "Inscrição municipal",
    "Prefeitura de cada município",
    "Sem padrão nacional; cada município define o seu",
    "Varia; muitos municípios não usam nenhum",
    "Cadastro de contribuinte de ISS, para quem presta serviço no município",
  ],
];

const DIMENSOES = [
  [
    "Natureza jurídica",
    "Tabela oficial de códigos usada no registro e replicada no CNPJ",
    "Empresário individual, sociedade limitada, sociedade limitada unipessoal, sociedade anônima, associação, fundação",
    "Há alteração do ato constitutivo, registrada no órgão competente",
  ],
  [
    "Porte",
    "Faixas de receita bruta anual definidas em norma",
    "Microempresa (ME), empresa de pequeno porte (EPP), demais",
    "O faturamento cruza a faixa e o enquadramento é atualizado",
  ],
  [
    "Regime tributário",
    "Opção da empresa, dentro do que a legislação permite para o seu caso",
    "Simples Nacional, lucro presumido, lucro real",
    "A empresa opta nas janelas previstas, ou é excluída por deixar de se enquadrar",
  ],
  [
    "Enquadramento como MEI",
    "Condição dentro do Simples Nacional, aberta ao empresário individual que cabe nos limites",
    "Enquadrado ou não enquadrado",
    "Ultrapassa o teto, exerce atividade fora da lista permitida ou pede desenquadramento",
  ],
];

const SQL_MODELO = `-- Cada cadastro tem emissor, formato e ciclo de vida próprios.
-- Um campo "documento" genérico apaga essas três diferenças de uma vez.
CREATE TABLE cliente (
  id             BIGSERIAL PRIMARY KEY,
  tipo_pessoa    CHAR(1) NOT NULL CHECK (tipo_pessoa IN ('F', 'J')),

  -- Guardado sem máscara. TEXT, nunca tipo numérico: zero à esquerda
  -- desaparece em coluna numérica e o CNPJ passou a aceitar letras.
  cpf            TEXT,
  cnpj           TEXT,

  -- Estadual e municipal não são do mesmo emissor que o CNPJ:
  -- sem a UF ao lado, o número não pode nem ser validado.
  ie             TEXT,
  ie_uf          CHAR(2),
  ie_isento      BOOLEAN NOT NULL DEFAULT FALSE,
  inscricao_municipal      TEXT,
  inscricao_municipal_ibge CHAR(7),

  CONSTRAINT documento_por_tipo CHECK (
    (tipo_pessoa = 'F' AND cpf IS NOT NULL AND cnpj IS NULL) OR
    (tipo_pessoa = 'J' AND cnpj IS NOT NULL AND cpf IS NULL)
  ),
  -- Inscrição estadual sem UF é um número que ninguém consegue conferir.
  CONSTRAINT ie_exige_uf CHECK (ie IS NULL OR ie_uf IS NOT NULL),
  -- Isento e número preenchido são estados mutuamente exclusivos.
  CONSTRAINT ie_isento_sem_numero CHECK (NOT (ie_isento AND ie IS NOT NULL))
);

-- Unicidade por documento, não por "documento genérico".
CREATE UNIQUE INDEX cliente_cpf_key  ON cliente (cpf)  WHERE cpf  IS NOT NULL;
CREATE UNIQUE INDEX cliente_cnpj_key ON cliente (cnpj) WHERE cnpj IS NOT NULL;
-- A mesma inscrição estadual pode repetir entre estados diferentes.
CREATE UNIQUE INDEX cliente_ie_key ON cliente (ie_uf, ie) WHERE ie IS NOT NULL;`;

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Todo cadastro de cliente no Brasil acaba tropeçando na mesma pergunta: o
        número que chegou no formulário identifica uma pessoa, uma empresa, um
        estabelecimento ou uma habilitação tributária? São coisas diferentes,
        emitidas por entes diferentes, com ciclos de vida independentes. Quem
        modela os quatro como se fossem variações de um mesmo campo descobre o
        erro tarde, geralmente quando o time fiscal pede para emitir uma nota e o
        dado necessário não existe em lugar nenhum.
      </p>

      <h2>Pessoa física e pessoa jurídica: CPF e CNPJ</h2>
      <p>
        A divisão mais básica é de direito civil, não de software. Pessoa física é
        o ser humano; pessoa jurídica é a entidade criada por um ato de
        constituição registrado. A Receita Federal mantém um cadastro para cada
        uma: o CPF para a primeira, o CNPJ para a segunda. Os dois são federais,
        valem em todo o território e não dependem de onde a pessoa mora ou de onde
        a empresa opera.
      </p>
      <p>
        O que eles <strong>não</strong> dizem é tão importante quanto o que dizem.
        Nenhum dos dois autoriza a operar em nada. O CNPJ registra que a pessoa
        jurídica existe perante a União; não afirma que ela pode vender mercadoria,
        prestar serviço ou emitir documento fiscal. Essas autorizações moram em
        outros cadastros, de outros entes federativos, e é aí que aparecem a
        inscrição estadual e a municipal.
      </p>
      <DataTable
        caption="Os quatro cadastros que um sistema brasileiro costuma precisar guardar, lado a lado."
        headers={[
          "Cadastro",
          "Quem emite",
          "Formato",
          "Tem dígito verificador",
          "Onde aparece",
        ]}
        rows={CADASTROS}
      />
      <p>
        A coluna do emissor explica quase tudo o que vem depois. CPF e CNPJ têm um
        emissor só, então têm um formato só e um algoritmo só — o{" "}
        <a href="/guias/modulo-11-digito-verificador">módulo 11</a>, com pesos e
        regras de resto documentados. Inscrição estadual tem vinte e sete
        emissores. Inscrição municipal tem milhares.
      </p>

      <h2>Raiz, ordem, matriz e filiais</h2>
      <p>
        O CNPJ não identifica apenas a empresa: identifica o{" "}
        <strong>estabelecimento</strong>. As oito primeiras posições formam a raiz
        e pertencem à pessoa jurídica. As quatro seguintes são a ordem do
        estabelecimento: <code>0001</code> para o primeiro, normalmente a matriz,
        e os números seguintes para cada filial aberta depois. As duas últimas
        posições são os dígitos verificadores.
      </p>
      <p>
        Uma rede com sete lojas tem uma raiz e sete CNPJs completos. Os catorze
        caracteres mudam entre eles — inclusive os dois verificadores, porque a
        conta é feita sobre as doze posições anteriores e a ordem faz parte da
        base. Por isso não dá para &ldquo;derivar&rdquo; o CNPJ de uma filial
        trocando <code>0001</code> por <code>0002</code> e mantendo o final: os DVs
        precisam ser recalculados.
      </p>
      <p>
        Na modelagem, isso vira uma decisão concreta: a chave natural de
        &ldquo;empresa&rdquo; é a raiz, e a de &ldquo;estabelecimento&rdquo; é o
        CNPJ inteiro. Guardar só o número completo empurra{" "}
        <code>substring(cnpj, 1, 8)</code> para dezenas de consultas; guardar só a
        raiz apaga qual filial emitiu a nota. Cada filial tem endereço próprio e
        pode ter inscrição estadual própria enquanto a matriz não tem nenhuma.
        Desde 2026 raiz e ordem podem conter letras, o que reforça guardar tudo
        como texto; os detalhes estão no guia do{" "}
        <a href="/guias/cnpj-alfanumerico-2026">CNPJ alfanumérico</a>.
      </p>

      <h2>Natureza jurídica, porte e regime tributário são três coisas diferentes</h2>
      <p>
        Este é o ponto em que mais sistemas erram, e o erro quase sempre tem a
        mesma forma: um único campo chamado <code>tipo_empresa</code> com valores
        misturados do tipo &ldquo;LTDA&rdquo;, &ldquo;MEI&rdquo;, &ldquo;ME&rdquo;
        e &ldquo;Simples&rdquo;. Esses quatro valores respondem a perguntas
        distintas e mudam por motivos distintos.
      </p>
      <DataTable
        caption="Quatro dimensões independentes que costumam ser espremidas em um campo só."
        headers={["Dimensão", "Quem define", "Valores típicos", "Muda quando"]}
        rows={DIMENSOES}
      />
      <p>
        Um exemplo concreto separa as camadas. Uma padaria pode ser uma{" "}
        <em>sociedade empresária limitada</em> (natureza jurídica), enquadrada como{" "}
        <em>microempresa</em> (porte) e optante pelo <em>Simples Nacional</em>{" "}
        (regime). No ano seguinte o faturamento cresce: o porte passa a EPP e as
        outras duas dimensões seguem intactas. Anos depois a empresa é excluída do
        Simples e vai para o lucro presumido — de novo sem mexer no contrato
        social.
      </p>
      <p>
        A confusão mais cara é tratar ME e EPP como se fossem tipos societários.
        Não são: uma sociedade limitada, uma sociedade limitada unipessoal e um
        empresário individual podem todos ser microempresa. E ser ME não significa
        estar no Simples — o enquadramento por porte e a opção pelo regime são
        atos separados, com efeitos separados.
      </p>
      <p>
        A EIRELI é o exemplo histórico dessa mistura. Ela era mesmo uma natureza
        jurídica, com regra de capital mínimo, e por anos apareceu em formulários
        ao lado de &ldquo;MEI&rdquo; e &ldquo;ME&rdquo; como se fossem opções do
        mesmo conjunto. A Lei nº 14.195/2021 extinguiu a figura e determinou que as
        EIRELIs existentes fossem transformadas em sociedades limitadas
        unipessoais, independentemente de alteração no ato constitutivo. Todo
        select que ainda ofereça &ldquo;EIRELI&rdquo; hoje está oferecendo um tipo
        que não se constitui mais. O{" "}
        <a href="/gerador-de-empresas">gerador de empresas</a> daqui foi ajustado
        exatamente por isso: a EIRELI saiu da lista de naturezas jurídicas e o
        porte virou um campo à parte, porque emitir uma ficha fictícia com os dois
        conceitos no mesmo campo ensinaria o erro em vez de expor o acerto.
      </p>

      <h2>Inscrição estadual: um formato por estado</h2>
      <p>
        A inscrição estadual identifica o contribuinte de ICMS no cadastro da
        Secretaria da Fazenda do seu estado. Ela é por estabelecimento, não por
        empresa: uma rede com lojas em três estados tem três inscrições, uma em
        cada SEFAZ, além de poder ter inscrições adicionais no mesmo estado.
      </p>
      <p>
        Como cada unidade federativa monta o próprio cadastro, cada uma definiu o
        próprio formato. O comprimento varia, a posição dos dígitos verificadores
        varia — há estados em que o verificador não é o último caractere — e as
        regras de cálculo, ainda que parentes do módulo 11, usam pesos e tratamentos
        de resto diferentes. Não existe um algoritmo nacional, e por isso não existe
        um validador único: qualquer implementação séria é um mapa de UF para
        função, e validar uma inscrição estadual sem saber de que estado ela veio é
        impossível por construção.
      </p>
      <p>
        Há ainda dois valores que quebram validadores ingênuos. O primeiro é a
        condição de <strong>isento</strong>: empresas não contribuintes de ICMS
        aparecem em documentos fiscais com a inscrição marcada como isenta, e o
        campo recebe uma palavra em vez de um número. O segundo é o produtor rural
        pessoa física, que em vários estados recebe inscrição estadual mesmo tendo
        CPF e não CNPJ — o caso que derruba a suposição de que inscrição estadual
        implica pessoa jurídica.
      </p>

      <h2>Inscrição municipal e quando ela aparece</h2>
      <p>
        Se o ICMS é estadual, o ISS é municipal, e quem presta serviço se inscreve
        na prefeitura. O nome muda de cidade para cidade — inscrição municipal,
        cadastro mobiliário, CCM — assim como o formato, a existência de dígito
        verificador e o próprio fato de haver um cadastro informatizado.
      </p>
      <p>
        Para software, a consequência prática é que a inscrição municipal quase
        nunca deve ser validada por formato. O que faz sentido é guardá-la como
        texto livre, ao lado do código IBGE do município que a emitiu, e deixar a
        conferência para o momento da emissão da nota de serviço, quando o próprio
        sistema municipal responde. Validar contra um formato inventado rejeita
        cliente legítimo, e é um erro que só aparece em produção, no município que
        ninguém testou.
      </p>
      <p>
        Uma mesma empresa pode precisar das duas. A oficina que vende peças e
        presta mão de obra é contribuinte dos dois impostos, e o campo
        &ldquo;inscrição&rdquo; único obriga o usuário a escolher qual dado perder.
      </p>

      <h2>O MEI tem um CNPJ comum</h2>
      <p>
        O microempreendedor individual gera uma quantidade desproporcional de bugs
        porque muita gente acredita que ele tem um documento próprio. Não tem. O
        MEI recebe um CNPJ de catorze posições, com raiz, ordem <code>0001</code>{" "}
        e os mesmos dois dígitos verificadores calculados pela mesma regra. Nada no
        número indica que aquele registro é de um MEI.
      </p>
      <p>
        O que existe é um <strong>enquadramento</strong>. A natureza jurídica
        continua sendo a de empresário individual, e o MEI é uma condição dentro do
        Simples Nacional, com recolhimento mensal em valor fixo, sujeita a um teto
        anual de faturamento definido em norma e a uma lista de atividades
        permitidas. Quem ultrapassa o teto ou passa a exercer atividade fora da
        lista é desenquadrado — e segue com o mesmo CNPJ.
      </p>
      <p>
        Três consequências valem para o código. Primeira: não existe validação de
        &ldquo;CNPJ de MEI&rdquo;; a informação vem de consulta cadastral, nunca do
        número. Segunda: o MEI é ponte entre pessoa física e jurídica — mesmo
        titular, endereço muitas vezes residencial — e é exatamente aqui que o
        atalho de tratar &ldquo;dado de empresa&rdquo; como impessoal falha.
        Terceira: MEI de serviço costuma não ter inscrição estadual, então o
        cadastro precisa aceitar CNPJ válido sem ela.
      </p>

      <h2>Erros de modelagem: o campo &ldquo;documento&rdquo; genérico</h2>
      <p>
        A tentação é conhecida: uma coluna <code>documento VARCHAR(20)</code> que
        recebe CPF, CNPJ, inscrição estadual e o que mais aparecer, com um{" "}
        <code>tipo_documento</code> ao lado. Ela sobrevive ao primeiro sprint e
        cobra o preço depois. Unicidade deixa de significar alguma coisa, porque a
        mesma inscrição estadual pode existir em dois estados e o índice único
        global barra um cliente legítimo. A validação vira um <code>switch</code>{" "}
        que adivinha o algoritmo pelo comprimento da string.
      </p>
      <CodeBlock
        language="SQL"
        caption="Cada cadastro na sua coluna, com o contexto que a validação exige ao lado."
        code={SQL_MODELO}
      />
      <p>
        Repare no que as restrições protegem. O <code>CHECK</code> por tipo de
        pessoa impede o registro híbrido que tem CPF e CNPJ ao mesmo tempo. A
        exigência de <code>ie_uf</code> junto de <code>ie</code> impede guardar um
        número que ninguém conseguirá conferir depois. O índice único de inscrição
        estadual é composto com a UF, porque a unicidade é estadual e não nacional.
        E a flag de isento resolve, no esquema, o que muitos sistemas resolvem
        gravando a palavra <code>ISENTO</code> dentro da coluna numérica — com os
        problemas que isso traz na hora de exportar.
      </p>
      <p>
        Vale separar também o que é dado de pessoa jurídica do que é dado de
        estabelecimento. Raiz, razão social, natureza jurídica e porte pertencem à
        empresa; ordem, endereço, inscrição estadual e inscrição municipal
        pertencem ao estabelecimento. Uma tabela para cada, ligadas pela raiz, evita
        a duplicação silenciosa que aparece quando a segunda filial é cadastrada.
      </p>

      <h2>Massa de teste por tipo de contribuinte</h2>
      <p>
        Um cadastro exercitado só com sociedade limitada paulista optante do Simples
        passa em todos os testes e quebra na primeira semana. Os cenários que
        merecem fixture própria são os que combinam os campos de formas que o
        formulário não previu:
      </p>
      <ul>
        <li>
          <strong>Pessoa física simples:</strong> CPF, sem inscrição de espécie
          alguma. Confere que o formulário não exige dado de empresa de quem não é
          empresa.
        </li>
        <li>
          <strong>Produtor rural pessoa física:</strong> CPF com inscrição
          estadual. Quebra a regra implícita de que inscrição estadual pressupõe
          CNPJ.
        </li>
        <li>
          <strong>MEI de serviço:</strong> CNPJ com ordem <code>0001</code>,
          inscrição municipal e nenhuma inscrição estadual.
        </li>
        <li>
          <strong>Matriz com filiais:</strong> vários CNPJs com a mesma raiz e
          ordens diferentes, para exercitar agrupamento por empresa e unicidade por
          estabelecimento.
        </li>
        <li>
          <strong>Empresa multiestadual:</strong> estabelecimentos em UFs
          diferentes, cada um com inscrição estadual no formato do seu estado.
        </li>
        <li>
          <strong>Não contribuinte de ICMS:</strong> CNPJ ativo com inscrição
          estadual isenta, para o caminho em que o campo não é número.
        </li>
        <li>
          <strong>Sociedade anônima de grande porte:</strong> fora do Simples, para
          garantir que porte e regime não estão amarrados no código.
        </li>
      </ul>
      <p>
        O <a href="/gerador-de-empresas">gerador de empresas</a> cobre a base
        dessas fichas: razão social, CNPJ, natureza jurídica e porte em campos
        separados, com endereço coerente com a UF escolhida. Para lotes de CNPJ,
        inclusive alfanuméricos, o <Link href="/">gerador de CNPJ</Link> resolve a
        parte numérica. Nenhum dos dois consulta cadastro algum — o número sai bem
        formado e não corresponde a empresa nenhuma, distinção detalhada no guia
        sobre{" "}
        <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
          CPF válido e CPF existente
        </a>
        . A inscrição estadual de teste é o item que exige atenção manual: só um
        número no formato do estado escolhido exercita o validador certo.
      </p>
    </ArticleLayout>
  );
}
