import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable, WorkedDvTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("rg-por-estado-e-cin-carteira-identidade-nacional")!;

export const metadata: Metadata = guideMetadata(guide);

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Um formulário pede RG. O time aplica a máscara{" "}
        <code>00.000.000-0</code>, copia de algum repositório uma função de
        dígito verificador e considera o campo resolvido. Semanas depois chegam
        três chamados: um cliente do Paraná não consegue concluir o cadastro, o
        RG de outro termina em <code>X</code> e a coluna do banco recusa, e uma
        mesma pessoa aparece duas vezes na base com números diferentes. Nenhum
        dos três é erro de implementação. Os três vêm da mesma premissa
        equivocada — a de que o RG é um documento nacional com um formato só.
      </p>

      <h2>O RG é estadual, e isso explica quase tudo</h2>
      <p>
        O CPF nasce de um cadastro nacional mantido por um único órgão, a
        Receita Federal. O Registro Geral não. Ele é atribuído pelo órgão de
        identificação de cada unidade federativa, que mantém a própria série
        numérica, define o próprio comprimento e decide se usa ou não dígito
        verificador. Não existe uma autoridade que coordene essas séries entre
        si.
      </p>
      <p>
        A consequência prática é direta: o mesmo número pode existir em dois
        estados apontando para duas pessoas diferentes. A unicidade, quando
        existe, vale dentro do estado emissor. É por isso que o RG nunca aparece
        sozinho em um documento — vem sempre acompanhado do órgão e da sigla da
        unidade federativa, e é esse par que identifica de qual série o número
        saiu.
      </p>

      <h2>Quem emite: SSP, IIRGD, Polícia Civil e as variações de formato</h2>
      <p>
        Na maioria dos estados a emissão fica a cargo de um instituto de
        identificação vinculado à Polícia Civil, que por sua vez responde à
        Secretaria de Segurança Pública — daí a sigla <code>SSP</code> impressa
        na carteira. Em São Paulo, o órgão é o Instituto de Identificação
        Ricardo Gumbleton Daunt, o IIRGD, e o atendimento ao cidadão acontece
        pelos postos do Poupatempo. Outros estados usam siglas próprias, e há
        casos em que o serviço está sob o Detran em vez da SSP.
      </p>
      <p>
        Some-se a isso o fato de que a carteira de identidade não é o único
        documento de identificação em circulação. Passaporte, CNH, carteiras de
        conselho de classe e carteiras funcionais também identificam o portador,
        e o número de qualquer um deles pode acabar digitado em um campo
        rotulado como RG. Um cadastro que assume o formato paulista está
        rejeitando essas entradas sem perceber.
      </p>
      <DataTable
        caption="O que varia de um estado para outro no campo RG"
        headers={["Dimensão", "Variação encontrada em cadastros reais"]}
        rows={[
          [
            "Comprimento",
            "De sete a dez caracteres, dependendo da série e da época de emissão",
          ],
          [
            "Dígito verificador",
            "Parte dos estados calcula um; outros não têm nenhum dígito de controle",
          ],
          [
            "Letras",
            "O verificador pode ser X; há números que circulam com a sigla da UF na frente",
          ],
          [
            "Máscara",
            "Pontos e hífen em posições diferentes, ou nenhuma pontuação",
          ],
          [
            "Órgão emissor",
            "SSP, Detran, institutos de identificação, conselhos de classe",
          ],
          [
            "Zeros à esquerda",
            "Bases divergem entre gravar e descartar, mudando o comprimento do mesmo RG",
          ],
        ]}
      />

      <h2>Por que não existe validador universal de RG</h2>
      <p>
        Nenhum órgão nacional publica um algoritmo de dígito verificador para o
        RG, pela razão simples de que não há um número nacional de RG para
        verificar. Toda biblioteca que promete validar RG está, na prática,
        validando a convenção de um estado — quase sempre a de São Paulo — e
        chamando isso de validação genérica.
      </p>
      <p>
        Isso muda o cálculo de risco do campo. Rejeitar um CPF com dígito
        verificador errado é seguro: a regra é nacional e determinística, e um
        falso negativo praticamente só acontece se a pessoa digitou errado. No
        RG, o falso negativo é o caso comum, e o custo dele é alto — você está
        bloqueando um cadastro legítimo por causa de um número que é válido no
        estado em que foi emitido. Esse é um dos{" "}
        <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
          erros mais frequentes em validadores de documentos brasileiros
        </a>
        , e ele passa despercebido porque o time de desenvolvimento costuma
        testar com o próprio RG.
      </p>
      <p>
        Dá para medir esse desperdício sem adivinhação. Instrumente o formulário
        registrando qual campo causou cada rejeição e, quando houver, a UF
        informada pelo usuário. Se as recusas de RG se concentram fora de São
        Paulo, o validador é o problema, não o preenchimento. É um gráfico que
        costuma encerrar a discussão sobre afrouxar a regra mais rápido do que
        qualquer argumento técnico.
      </p>

      <h2>O padrão SSP-SP, o mais implementado</h2>
      <p>
        A convenção paulista virou padrão de fato porque é a que a maioria dos
        validadores online implementa: oito dígitos de base, um dígito
        verificador calculado por{" "}
        <a href="/guias/modulo-11-digito-verificador">módulo 11</a> com os pesos
        2 a 9 aplicados da esquerda para a direita, e a máscara{" "}
        <code>00.000.000-0</code>. Tomando a base <code>24598973</code>:
      </p>
      <WorkedDvTable
        title="Dígito verificador no padrão SSP-SP"
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
        rule="Resto zero: 11 − 0 = 11, e o resultado 11 é convertido para 0."
        result="0"
      />
      <p>
        O RG completo fica <code>24.598.973-0</code>. Há dois resultados que
        exigem tratamento explícito. Quando o resto é 0, a subtração devolve 11,
        que não cabe em uma posição e vira 0. Quando o resto é 1, a subtração
        devolve 10, que também não cabe — e a convenção é representá-lo pela
        letra <code>X</code>. A base <code>32773324</code> soma 166, cujo resto
        na divisão por 11 é 1, produzindo o RG <code>32.773.324-X</code>.
      </p>
      <p>
        Esse <code>X</code> é responsável por uma parte considerável dos
        problemas em produção. Ele quebra colunas numéricas, expressões
        regulares que só aceitam dígitos e conversões implícitas para inteiro. É
        também o motivo pelo qual o{" "}
        <a href="/gerador-de-rg">gerador de RG</a> produz números terminados em{" "}
        <code>X</code> de vez em quando: se o seu formulário não aguenta um
        deles, é melhor descobrir isso em teste.
      </p>

      <h2>Uma pessoa pode ter vários RGs</h2>
      <p>
        Como cada estado mantinha a própria base e não havia consulta unificada
        entre elas, quem morou em mais de uma unidade federativa podia tirar uma
        carteira de identidade em cada uma, com números distintos e igualmente
        legítimos. Não é situação de exceção: aparece com frequência em bases
        grandes, e a própria pessoa muitas vezes não sabe qual dos números está
        gravado onde.
      </p>
      <p>
        Para um sistema, isso produz duas falhas simétricas. Se o RG é usado
        como chave de identificação, a mesma pessoa entra duas vezes, com
        histórico dividido entre dois cadastros. Se o RG é usado para
        deduplicação, duas pessoas diferentes que carregam o mesmo número em
        estados distintos são fundidas em um registro só — um erro bem mais
        caro, porque mistura dados de titulares diferentes. A chave de
        identidade de pessoa física é o <a href="/gerador-de-cpf">CPF</a>; o RG
        é atributo descritivo.
      </p>

      <h2>Como modelar o campo RG em um sistema</h2>
      <p>
        A modelagem decorre de tudo o que foi dito acima. O número é texto, não
        número: zeros à esquerda são significativos e o verificador pode ser uma
        letra. Guardar em coluna inteira destrói informação de forma silenciosa
        e só aparece quando alguém tenta reimprimir o documento. Se o cadastro
        alimenta contratos ou documentos que reproduzem o RG como ele consta na
        carteira, guarde também a forma digitada pelo usuário, ao lado da
        normalizada — a pontuação original é a única pista de como aquele número
        aparece no papel.
      </p>
      <p>
        O campo também não vive sozinho. Sem órgão emissor e unidade federativa,
        o número não identifica nada, porque não se sabe de qual série ele veio.
        A data de expedição é o terceiro item: como o RG pode ser reemitido, ela
        é o que permite distinguir vias e entender por que duas cópias do mesmo
        documento divergem. O conjunto mínimo é:
      </p>
      <ul>
        <li>
          <strong>numero</strong> — texto, normalizado sem pontuação e com{" "}
          <code>X</code> em maiúscula;
        </li>
        <li>
          <strong>orgao_emissor</strong> — texto curto, aceitando siglas fora da
          lista de SSPs;
        </li>
        <li>
          <strong>uf_emissor</strong> — dois caracteres, sem valor padrão
          chutado;
        </li>
        <li>
          <strong>data_expedicao</strong> — data, opcional na maioria dos
          cadastros.
        </li>
      </ul>
      <p>
        Índice único sobre o número isolado está errado por construção. No
        máximo, unicidade sobre o par número e UF emissora — e ainda assim
        entendendo que essa restrição é uma heurística de qualidade de dados, e
        não a identidade da pessoa.
      </p>
      <p>
        A validação segue a mesma lógica: verificar o que é seguro verificar e
        tratar o dígito como informação auxiliar. A função abaixo aceita
        qualquer RG plausível e só confere o verificador quando a UF declarada é
        SP, devolvendo o resultado como aviso em vez de rejeição.
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Validação tolerante: o comprimento e o conjunto de caracteres bloqueiam; o dígito verificador apenas informa."
        code={`const PESOS = [2, 3, 4, 5, 6, 7, 8, 9];

/** Remove pontuação e padroniza o X em maiúscula. */
export function normalizarRg(entrada: string): string {
  return entrada.replace(/[^0-9xX]/g, "").toUpperCase();
}

/** Dígito verificador na convenção da SSP-SP (8 dígitos de base). */
export function dvPadraoSp(base: string): string {
  const soma = [...base].reduce(
    (acc, char, i) => acc + Number(char) * PESOS[i],
    0,
  );
  const dv = 11 - (soma % 11);
  if (dv === 10) return "X";
  if (dv === 11) return "0";
  return String(dv);
}

type Resultado =
  | { aceito: false; motivo: string }
  | { aceito: true; dvConfere: boolean | null };

export function conferirRg(numero: string, uf?: string): Resultado {
  const valor = normalizarRg(numero);

  if (valor.length < 5 || valor.length > 14) {
    return { aceito: false, motivo: "comprimento implausível" };
  }
  if (valor.slice(0, -1).includes("X")) {
    return { aceito: false, motivo: "X só é aceito na última posição" };
  }

  // Fora do padrão paulista não há regra conhecida: aceita sem conferir.
  if (uf !== "SP" || valor.length !== 9) {
    return { aceito: true, dvConfere: null };
  }

  return { aceito: true, dvConfere: dvPadraoSp(valor.slice(0, 8)) === valor[8] };
}`}
      />
      <p>
        O <code>dvConfere</code> nulo é a parte importante da assinatura. Ele
        obriga quem chama a função a decidir o que fazer com a ausência de
        verificação, em vez de deixar um booleano falso circular como se fosse
        reprovação.
      </p>

      <h2>A Carteira de Identidade Nacional: o CPF como número único</h2>
      <p>
        O Decreto nº 10.977/2022 instituiu a Carteira de Identidade Nacional, a
        CIN, com uma decisão de projeto que resolve a raiz do problema: o número
        do documento passa a ser o CPF. A Lei nº 14.534/2023 completou o
        movimento ao estabelecer o CPF como número suficiente e único de
        identificação do cidadão nas bases de dados de serviços públicos.
      </p>
      <p>
        A emissão continua sendo feita pelos mesmos institutos estaduais, mas
        sobre um modelo nacional. O efeito colateral é exatamente o que os
        sistemas precisavam: o identificador do documento de identidade deixa de
        ser uma série estadual isolada e passa a ser um número já nacional, já
        único e já verificável pelo{" "}
        <a href="/guias/modulo-11-digito-verificador">mesmo módulo 11</a> que
        todo backend brasileiro implementa. O caso da pessoa com dois RGs perde
        o sentido, porque não há dois CPFs.
      </p>
      <p>
        Nada disso apaga os números antigos. Carteiras emitidas há décadas
        continuam em circulação, contratos assinados as citam e bases legadas
        guardam o número como sempre guardaram. O ponto é outro: a migração que
        importa em um sistema não é trocar uma coluna por outra, é parar de
        tratar o RG como chave de pessoa e passar a tratá-lo como o que ele
        sempre foi, um número de documento. Essa mudança não depende de prazo
        nenhum e pode ser feita hoje.
      </p>

      <h2>O que muda para sistemas durante a transição</h2>
      <p>
        Enquanto os dois modelos convivem, um cadastro recebe três tipos de
        usuário: quem tem só a carteira antiga, quem já tem a CIN e quem tem as
        duas coisas em gavetas diferentes. Um campo RG obrigatório atende bem
        apenas o primeiro grupo.
      </p>
      <ul>
        <li>
          Se você já coleta CPF, o RG não precisa ser obrigatório. Na maioria
          dos cadastros ele é redundante desde antes da CIN.
        </li>
        <li>
          Prefira rotular o campo como documento de identidade, com um seletor
          de tipo, em vez de assumir que todo mundo vai digitar um RG.
        </li>
        <li>
          Não aperte a validação. Quanto mais restritivo o campo, mais gente
          fica de fora conforme os formatos em circulação mudam.
        </li>
        <li>
          Se houver alguma data de virada no seu processo, ela é configuração, e
          não constante compilada. O cronograma da transição foi ajustado ao
          longo do caminho, e o texto vigente do decreto é a única referência
          confiável para consultar — o link está nas fontes ao final.
        </li>
      </ul>
      <p>
        Vale explicitar o que este guia não afirma: nenhum prazo específico de
        obrigatoriedade. Datas de corte circulam bastante em conteúdo de
        terceiros e mudam com frequência; colocá-las em regra de negócio é como
        gravar uma alíquota no código.
      </p>

      <h2>Massa de teste para cadastros que pedem RG</h2>
      <p>
        Para exercitar o campo sem manipular a identidade de ninguém, o caminho
        é usar números fictícios com verificador correto no padrão SSP-SP mais
        um conjunto deliberado de casos-limite. Os valores abaixo foram
        conferidos com a regra descrita acima.
      </p>
      <DataTable
        caption="Casos-limite para o campo RG"
        headers={["Valor", "O que ele exercita"]}
        rows={[
          ["24.598.973-0", "caso normal, resto 0 convertido em dígito 0"],
          [
            "32.773.324-X",
            "verificador X: quebra coluna numérica e regex só de dígitos",
          ],
          [
            "19.283.746-1",
            "resto 10 sem tratamento especial; pega código que trata 10 como erro",
          ],
          [
            "27.431.865-9",
            "segundo número válido, para testar deduplicação e importação",
          ],
          [
            "1234567",
            "comprimento fora do padrão paulista: precisa ser aceito sem cálculo de DV",
          ],
          [
            "24598973",
            "mesmo RG sem máscara: o formulário deve normalizar, não recusar",
          ],
        ]}
      />
      <p>
        Para volume, o <a href="/gerador-de-rg">gerador de RG</a> produz lotes
        no padrão SSP-SP com ou sem máscara. Quando o teste envolve a ficha
        inteira e o RG precisa conviver com CPF, endereço e data de nascimento
        coerentes, o <a href="/gerador-de-pessoas">gerador de pessoas</a> monta o
        conjunto de uma vez. O que não entra em ambiente de teste, em nenhuma
        hipótese, é RG de gente de verdade — a{" "}
        <a href="/guias/lgpd-dados-de-teste">LGPD aplicada a dados de teste</a>{" "}
        trata justamente disso, e o número da carteira de identidade é dado
        pessoal como qualquer outro.
      </p>
    </ArticleLayout>
  );
}
