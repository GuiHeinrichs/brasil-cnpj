import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable, WorkedDvTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("cnh-numero-registro-digito-verificador")!;

export const metadata: Metadata = guideMetadata(guide);

const CNH_DV_CODE = `const BASE_LENGTH = 9;

function calculateCheckDigits(base9: string): string | null {
  let sum1 = 0;
  for (let i = 0; i < BASE_LENGTH; i++) {
    sum1 += Number(base9[i]) * (9 - i);
  }
  const rest1 = sum1 % 11;
  const dv1 = rest1 >= 10 ? 0 : rest1;
  const discount = rest1 >= 10 ? 2 : 0;

  let sum2 = 0;
  for (let i = 0; i < BASE_LENGTH; i++) {
    sum2 += Number(base9[i]) * (i + 1);
  }
  const rest2 = sum2 % 11;
  const dv2 = rest2 >= 10 ? 0 : rest2 - discount;

  // Sem DV possível: a base cai na zona contestada e o segundo
  // dígito ficaria negativo depois do desconto.
  if (dv2 < 0) return null;

  return String(dv1) + String(dv2);
}`;

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Pegue uma CNH e conte os números impressos nela. São pelo menos três, em
        campos distintos, e apenas um é o que os sistemas costumam chamar de
        &ldquo;número da CNH&rdquo;. Confundir um com o outro é a origem de boa
        parte dos cadastros de condutor que não batem entre o RH, a
        transportadora e o aplicativo de entrega — e também da pergunta que
        aparece toda semana em fórum de desenvolvedor: por que dois validadores
        de CNH devolvem dígitos diferentes para o mesmo número.
      </p>

      <h2>Três números, três funções: registro, espelho e RENACH</h2>
      <p>
        O <strong>número de registro</strong> é o identificador nacional do
        condutor. Tem onze algarismos, sendo nove de base e dois dígitos
        verificadores, e é o único dos três que segue uma fórmula pública de
        conferência. É esse número que deve ser gravado quando um sistema fala em
        &ldquo;número da CNH&rdquo;.
      </p>
      <p>
        O <strong>número do espelho</strong> identifica a via física — o cartão
        em si. Cada emissão gera um espelho novo, então esse número é um dado do
        documento, não da pessoa. Ele serve para dizer qual via está em circulação
        e para casar o plástico com o registro do processo de emissão.
      </p>
      <p>
        O <strong>RENACH</strong> é o cadastro nacional de condutores habilitados;
        o campo que aparece com esse nome em formulários e telas de DETRAN é, na
        prática, o número do processo aberto no órgão estadual, normalmente
        exibido como a sigla da UF seguida de uma sequência numérica. Ele
        acompanha o trâmite (exames, aulas, prova, emissão) e é o identificador
        que o despachante e o atendente usam para consultar o andamento. Não tem
        dígito verificador publicado, não é nacionalmente único no mesmo sentido
        do registro e não deve ser usado como chave de condutor.
      </p>
      <p>
        Há ainda um <strong>código de segurança</strong> impresso no documento, que
        serve à conferência da via e não identifica o condutor. Se o seu cadastro
        tem um único campo chamado &ldquo;CNH&rdquo;, ele precisa guardar o
        registro — os outros são dados auxiliares, quando muito.
      </p>

      <h2>O que muda quando o condutor renova ou tira segunda via</h2>
      <p>
        O registro é atribuído na primeira habilitação e acompanha a pessoa. Na
        renovação, na mudança de categoria, na troca de estado ou na segunda via
        por perda, o registro continua o mesmo; o que muda é o espelho, a data de
        validade e, eventualmente, o processo RENACH aberto para aquela emissão.
      </p>
      <p>
        Essa distinção tem consequência prática em modelagem. Se o seu sistema
        trata a CNH como campo mutável do cadastro e reescreve o valor a cada
        atualização de documento, você provavelmente está gravando o número do
        espelho em algum momento e o registro em outro — e aí dois cadastros do
        mesmo motorista deixam de se reconhecer. O registro é estável o bastante
        para servir de chave natural de condutor dentro do seu domínio; o espelho,
        não.
      </p>
      <p>
        A CNH digital não cria um número novo. Ela é a mesma habilitação exibida
        no aplicativo oficial de carteira digital de trânsito, com um QR Code que
        resolve contra a base do órgão de trânsito. O registro exibido ali é
        idêntico ao do plástico.
      </p>

      <h2>Como o dígito verificador é calculado</h2>
      <p>
        Os nove primeiros algarismos formam a base. Os dois últimos saem de dois
        cálculos de{" "}
        <a href="/guias/modulo-11-digito-verificador">módulo 11</a> feitos sobre a
        mesma base, com escadas de pesos espelhadas: o primeiro usa os pesos 9 a
        1, da esquerda para a direita; o segundo usa 1 a 9, na mesma direção.
      </p>
      <p>
        Duas particularidades separam a CNH do CPF. A primeira: o segundo cálculo{" "}
        <strong>não inclui o primeiro dígito verificador</strong>, ao contrário do
        que acontece no CPF e no CNPJ. Os dois DVs são calculados em paralelo, a
        partir do mesmo insumo. A segunda: o dígito é o{" "}
        <strong>próprio resto</strong> da divisão por 11, e não{" "}
        <code>11 − resto</code>.
      </p>
      <p>
        Como os pesos aplicados a cada posição somam 10 nas duas escadas (9 e 1 na
        primeira posição, 8 e 2 na segunda, e assim por diante), as duas somas
        guardam uma relação fixa: juntas, dão dez vezes a soma dos algarismos da
        base. É um bom teste de sanidade quando se está depurando a
        implementação.
      </p>
      <p>
        Vamos calcular os dois dígitos da base <code>064725819</code>. O zero
        inicial é proposital: registros com zero à esquerda são comuns e já
        derrubaram muita importação que tratou o campo como número inteiro.
      </p>
      <WorkedDvTable
        title="Primeiro dígito verificador — pesos 9 a 1"
        steps={[
          { char: "0", weight: 9 },
          { char: "6", weight: 8 },
          { char: "4", weight: 7 },
          { char: "7", weight: 6 },
          { char: "2", weight: 5 },
          { char: "5", weight: 4 },
          { char: "8", weight: 3 },
          { char: "1", weight: 2 },
          { char: "9", weight: 1 },
        ]}
        sum={183}
        remainder={7}
        rule="O dígito é o próprio resto, desde que ele seja menor que 10."
        result="7"
      />
      <WorkedDvTable
        title="Segundo dígito verificador — pesos 1 a 9, sobre a mesma base"
        steps={[
          { char: "0", weight: 1 },
          { char: "6", weight: 2 },
          { char: "4", weight: 3 },
          { char: "7", weight: 4 },
          { char: "2", weight: 5 },
          { char: "5", weight: 6 },
          { char: "8", weight: 7 },
          { char: "1", weight: 8 },
          { char: "9", weight: 9 },
        ]}
        sum={237}
        remainder={6}
        rule="Resto menor que 10 e sem desconto a aplicar: o dígito é o resto."
        result="6"
      />
      <p>
        O registro completo é <code>06472581976</code>. Conferindo a relação entre
        as somas: os algarismos da base somam 42, e{" "}
        <code>183 + 237 = 420</code>, dez vezes 42.
      </p>
      <CodeBlock
        language="TypeScript"
        caption="A função devolve null quando a base cai na zona em que a regra do desconto não produz um dígito válido — ver a seção seguinte."
        code={CNH_DV_CODE}
      />

      <h2>O caso do resto 10 e por que validadores discordam</h2>
      <p>
        O resto da divisão por 11 vai de 0 a 10, mas um dígito verificador só
        comporta 0 a 9. Quando o primeiro cálculo dá resto 10, a regra clássica
        dos DETRANs faz duas coisas: registra 0 como primeiro dígito e aplica um{" "}
        <strong>desconto de 2</strong> no segundo. É essa correção que as
        bibliotecas implementam de maneiras diferentes.
      </p>
      <p>
        A discordância não é difusa: enquanto o primeiro resto for diferente de
        10, todas as implementações que testamos devolvem exatamente o mesmo par
        de dígitos. O desacordo mora inteiro dentro da zona do resto 10, que
        cobre cerca de um em cada onze números-base, e mesmo lá só aparece em três
        dos onze valores possíveis do segundo resto.
      </p>
      <DataTable
        caption="Zona contestada: comportamento quando o primeiro resto é 10 (primeiro DV = 0)"
        headers={[
          "Resto do 2º cálculo",
          "Regra do desconto",
          "Implementações que fazem o desconto circular",
        ]}
        rows={[
          ["0", "sem dígito possível (0 − 2 seria negativo)", "09"],
          ["1", "sem dígito possível (1 − 2 seria negativo)", "00"],
          ["2 a 9", "resto − 2 (ex.: resto 4 → DV 02)", "igual"],
          ["10", "00 (o 10 vira 0 antes do desconto)", "08"],
        ]}
      />
      <p>
        O exemplo mais claro é a base <code>646897755</code>. Os dois cálculos dão
        soma 285 e resto 10 cada um. Pela regra do desconto direto, o número fica{" "}
        <code>64689775500</code>; por uma implementação que trata o desconto como
        operação circular sobre o módulo 11, fica <code>64689775508</code>. Os
        dois validadores estão convictos e nenhum dos dois aceita o número do
        outro.
      </p>
      <p>
        Do outro lado estão as bases como <code>379393858</code>, em que o
        primeiro resto é 10 e o segundo é 1: o desconto levaria o segundo dígito a
        −1, e a implementação estrita conclui que aquela base simplesmente não tem
        registro válido, enquanto a circular devolve <code>00</code>.
      </p>
      <p>
        A consequência para quem gera dados de teste é direta:{" "}
        <strong>nunca gere um número cuja base caia nessa zona</strong>. O{" "}
        <a href="/gerador-de-cnh">gerador de CNH</a> descarta bases com resto 10 no
        primeiro cálculo e sorteia outra, de modo que todo número produzido passa
        nas duas famílias de validadores. Custa cerca de 9% de descarte no sorteio
        e elimina a classe inteira de falso negativo em ambiente de homologação.
      </p>
      <p>
        Se você mantém um validador próprio, a recomendação é a mesma vista do
        outro lado: seja permissivo nessa faixa. Aceitar os dois resultados
        quando o primeiro resto é 10 é preferível a recusar o documento de um
        condutor real por divergência de arredondamento.
      </p>

      <h2>O que o número não diz: categoria, validade e pontuação</h2>
      <p>
        Diferente do CPF, que carrega a{" "}
        <a href="/guias/regiao-fiscal-cpf">região fiscal</a> no nono algarismo, o
        registro da CNH não codifica nada legível. Não dá para extrair dele o
        estado emissor, o ano da primeira habilitação nem a categoria.
      </p>
      <p>
        A categoria (A para motocicletas, B para automóveis, C, D e E para carga e
        transporte de passageiros, além das combinações como AB) é um atributo
        separado do cadastro, que muda ao longo da vida do condutor sem tocar no
        registro. A validade depende da faixa etária e da aptidão no exame médico,
        e também vive fora do número. A pontuação por infrações fica no prontuário
        do condutor, atualizada por eventos que nada têm a ver com o documento
        impresso.
      </p>
      <p>
        Em outras palavras, um número de CNH com dígitos verificadores corretos
        não afirma que existe um condutor, que ele está habilitado, que a
        habilitação está no prazo ou que ele pode dirigir aquele caminhão. O DV é
        uma barreira contra erro de digitação, não uma prova de nada — a mesma
        distinção que vale para o{" "}
        <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
          CPF válido que não existe
        </a>
        .
      </p>

      <h2>Como verificar uma CNH de verdade</h2>
      <p>
        A checagem real passa pelos canais oficiais. No Portal de Serviços do
        SENATRAN, o próprio condutor, autenticado com a conta gov.br, consulta a
        situação da habilitação, a pontuação e os veículos vinculados. O
        aplicativo oficial de carteira digital exibe o documento com QR Code, que
        um fiscal ou um balcão pode conferir contra a base. DETRANs estaduais
        oferecem consultas complementares para quem tem processo aberto naquela
        UF.
      </p>
      <p>
        O que não existe é uma consulta pública aberta que, a partir do número,
        confirme para terceiros se a CNH existe e está válida. Empresas que
        precisam verificar habilitação de motoristas em escala fazem isso por
        convênio com o órgão de trânsito ou por intermediários autorizados, com
        base legal para tratar o dado. Se a sua regra de negócio depende de
        confirmar habilitação, planeje essa integração desde o começo: validar o
        DV localmente é o primeiro filtro, nunca a resposta.
      </p>

      <h2>Modelando o campo em sistemas de frota, mobilidade e RH</h2>
      <p>
        O registro é uma sequência de onze algarismos com zeros significativos à
        esquerda. Guarde como texto de tamanho fixo, com{" "}
        <code>CHAR(11)</code> ou <code>VARCHAR(11)</code>, nunca como inteiro. A
        normalização de entrada deve remover pontos, hifens e espaços antes de
        validar, porque o número é digitado de todo jeito.
      </p>
      <CodeBlock
        language="SQL — PostgreSQL"
        caption="O CHECK garante o formato; a validação dos dígitos continua sendo responsabilidade da aplicação."
        code={`CREATE TABLE condutor (
  id            bigserial PRIMARY KEY,
  nome          text NOT NULL,
  cnh_registro  char(11) NOT NULL UNIQUE
                CHECK (cnh_registro ~ '^[0-9]{11}$'),
  cnh_categoria text NOT NULL,
  cnh_validade  date NOT NULL,
  renach        text,
  criado_em     timestamptz NOT NULL DEFAULT now()
);`}
      />
      <p>
        Três decisões que costumam ser esquecidas nessa tabela. A categoria é
        campo próprio porque muda sem que o registro mude. A validade é{" "}
        <code>date</code> e pertence à via atual, então precisa ser atualizada a
        cada renovação. E o RENACH, se for guardado, fica em coluna separada e{" "}
        <strong>sem restrição de unicidade</strong> — ele identifica processo, não
        pessoa.
      </p>
      <p>
        Em cadastros de frota, a chave de negócio que interessa quase sempre é o
        par condutor + veículo, e o veículo tem os seus próprios identificadores,
        como o <a href="/gerador-de-renavam">RENAVAM</a> e a placa. Misturar os
        dois domínios em uma tabela só é o começo de uma migração dolorosa.
      </p>
      <p>
        Para popular ambientes de desenvolvimento, homologação e demonstração, use
        números fictícios com DV correto. Registros reais de motoristas em base de
        teste são dado pessoal circulando fora da finalidade para a qual foram
        coletados — o assunto do guia sobre{" "}
        <a href="/guias/lgpd-dados-de-teste">LGPD e dados de teste</a>.
      </p>

      <h2>Erros comuns em cadastros de condutores</h2>
      <ul>
        <li>
          <strong>Gravar o espelho no lugar do registro.</strong> Acontece quando
          a tela de cadastro pede &ldquo;número do documento&rdquo; e o atendente
          lê o campo errado do plástico. O sintoma é o mesmo motorista duplicado
          depois de uma renovação.
        </li>
        <li>
          <strong>Perder o zero à esquerda.</strong> Planilha, coluna numérica,
          importação por CSV: o registro <code>06472581976</code> vira{" "}
          <code>6472581976</code> e nunca mais valida. Converta a coluna para
          texto antes de exportar.
        </li>
        <li>
          <strong>Aceitar sequências repetidas.</strong>{" "}
          <code>11111111111</code> passa nos dois cálculos de módulo 11 e não é
          um registro plausível. Barre explicitamente os onze algarismos iguais,
          como se faz no CPF.
        </li>
        <li>
          <strong>Validar o DV e concluir que o condutor está habilitado.</strong>{" "}
          Esses são problemas distintos, e o segundo não tem solução local.
        </li>
        <li>
          <strong>Trocar de biblioteca de validação sem testar a zona do resto
          10.</strong> A migração parece inofensiva porque 97,5% dos números
          continuam válidos. Os registros que quebram são poucos, aparecem meses
          depois e sempre em produção.
        </li>
        <li>
          <strong>Usar CNHs reais para demonstração.</strong> Uma tela de demo com
          documento verdadeiro na frente de um cliente é vazamento com plateia.
        </li>
      </ul>
    </ArticleLayout>
  );
}
