import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable, WorkedDvTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("pis-pasep-nis-nit-diferencas")!;

export const metadata: Metadata = guideMetadata(guide);

const WEIGHTS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const BASE = "1201661918";

const DV_STEPS = BASE.split("").map((char, index) => ({
  char,
  weight: WEIGHTS[index],
}));

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Numa base de RH modelada às pressas é comum encontrar quatro colunas na
        tabela de funcionários: <code>pis</code>, <code>pasep</code>,{" "}
        <code>nis</code> e <code>nit</code>. Três ficam nulas na maioria das
        linhas, a quarta guarda um número de onze dígitos e, alguns meses
        depois, alguém descobre que o mesmo trabalhador tem o número preenchido
        em duas delas — com valores diferentes, porque um veio do RH e o outro
        do financeiro. O conserto não é uma rotina de deduplicação: é entender
        que as quatro colunas sempre foram a mesma.
      </p>

      <h2>Um número, quatro nomes</h2>
      <p>
        PIS, PASEP, NIS e NIT designam o mesmo identificador de onze dígitos que
        acompanha uma pessoa nos cadastros sociais brasileiros. A diferença está
        em quem fala, não no que é dito. Os onze dígitos se dividem em dez de
        base e um dígito verificador, e a regra que calcula esse dígito é
        idêntica nos quatro casos — um validador não precisa saber qual sigla o
        sistema de origem usou.
      </p>
      <p>
        Vale registrar o que o número <em>não</em> traz. Diferentemente do CPF,
        cujo nono dígito identifica a{" "}
        <a href="/guias/regiao-fiscal-cpf">região fiscal de emissão</a>, a
        estrutura pública do PIS é apenas base mais verificador: não há campo
        documentado de estado, de data ou de órgão emissor para ser lido dentro
        dos dez primeiros dígitos. Qualquer regra de negócio que tente inferir
        procedência a partir deles está apostando em coincidência.
      </p>

      <h2>Quem atribui cada um e por quê</h2>
      <p>
        A divisão vem de dois programas criados em 1970 com públicos distintos.
        A Lei Complementar 7/1970 instituiu o Programa de Integração Social, o
        PIS, voltado aos empregados da iniciativa privada e operado pela Caixa.
        A Lei Complementar 8/1970 criou o Programa de Formação do Patrimônio do
        Servidor Público, o PASEP, com a mesma lógica para o serviço público e
        com o Banco do Brasil como operador. Duas leis, dois operadores, duas
        siglas — e, para o cidadão, um único número.
      </p>
      <p>
        As outras duas siglas apareceram depois, quando o identificador passou a
        servir de chave em cadastros que nada têm a ver com aqueles fundos
        originais. A Previdência chama o número de NIT, Número de Identificação
        do Trabalhador, e é por essa via que ele costuma nascer para quem nunca
        teve vínculo celetista e se inscreve por conta própria. Nos programas
        sociais e no Cadastro Único, o mesmo número é o NIS, Número de
        Identificação Social.
      </p>
      <DataTable
        caption="As quatro siglas do mesmo identificador"
        headers={["Sigla", "Nome por extenso", "Quem usa"]}
        rows={[
          [
            "PIS",
            "Programa de Integração Social",
            "Caixa; trabalhadores da iniciativa privada",
          ],
          [
            "PASEP",
            "Programa de Formação do Patrimônio do Servidor Público",
            "Banco do Brasil; servidores públicos",
          ],
          [
            "NIS",
            "Número de Identificação Social",
            "Cadastro Único e programas sociais",
          ],
          [
            "NIT",
            "Número de Identificação do Trabalhador",
            "INSS, CNIS e guias de contribuição",
          ],
        ]}
      />

      <h2>Onde cada sigla aparece na prática</h2>
      <p>
        Para quem escreve código, o problema real é que o rótulo muda de tela em
        tela e o desenvolvedor de cada integração acredita estar diante de um
        campo novo. No eSocial e nos leiautes de folha, o campo do trabalhador
        costuma vir rotulado como NIS. No extrato do abono salarial e nos canais
        da Caixa, o mesmo dado aparece como PIS. No Meu INSS e nas guias de
        contribuição previdenciária, como NIT. Em benefícios sociais e no
        Cadastro Único, como NIS outra vez.
      </p>
      <p>
        A consequência prática é sempre a mesma: quando a folha importa do RH e
        o RH importa do cadastro social, cada camada grava em uma coluna
        diferente e ninguém reconcilia. A modelagem correta é uma única coluna,
        com o nome que fizer sentido no seu domínio, e a tradução da sigla
        deixada para a camada de apresentação — a tela que conversa com o eSocial
        exibe &ldquo;NIS&rdquo;, a que conversa com o INSS exibe
        &ldquo;NIT&rdquo;, e as duas leem a mesma coluna.
      </p>

      <h2>Estrutura do número e cálculo do dígito verificador</h2>
      <p>
        Os dez dígitos da base recebem, da esquerda para a direita, os pesos 3,
        2, 9, 8, 7, 6, 5, 4, 3 e 2. A sequência incomoda quem espera uma série
        decrescente limpa como a do CPF, mas tem estrutura: as posições 3 a 10
        recebem a descida de 9 até 2, e as duas primeiras recebem 3 e 2, como se
        a série tivesse dado a volta e continuado. Somados os produtos,
        aplica-se o{" "}
        <a href="/guias/modulo-11-digito-verificador">módulo 11</a>: o dígito é
        11 menos o resto da divisão por 11.
      </p>
      <WorkedDvTable
        title="Dígito verificador da base 1201661918"
        steps={DV_STEPS}
        sum={153}
        remainder={10}
        rule="11 − 10 = 1. O resultado tem um só algarismo, então é o próprio dígito."
        result="1"
      />
      <p>
        Escolhi essa base porque ela cai no resto 10, o maior resto possível e o
        que mais confunde implementações. Repare no que acontece nas pontas: com
        resto 10, a subtração devolve 1, um dígito perfeitamente normal; com
        resto 1, devolve 10; com resto 0, devolve 11. Só nesses dois últimos
        casos o resultado não cabe em um algarismo, e a regra manda usar 0.
      </p>
      <p>
        O bug clássico é reduzir isso a uma linha esperta. <code>dv % 10</code>{" "}
        parece resolver, porque 10 realmente vira 0 — mas 11 % 10 dá 1, e todo
        número cuja soma é múltipla de 11 passa a receber o dígito errado.{" "}
        <code>if (dv === 10) dv = 0</code> sozinho comete o engano simétrico:
        trata o resto 1 e ignora o resto 0. A condição correta cobre os dois de
        uma vez — qualquer resultado maior ou igual a 10 vira 0.
      </p>

      <h2>A máscara 999.99999.99-9 e como armazenar</h2>
      <p>
        A máscara agrupa os dígitos em 3, 5, 2 e 1 — o número{" "}
        <code>12016619181</code> é exibido como <code>120.16619.18-1</code>.
        Quem reaproveita a máscara do CPF, de grupos 3-3-3-2, produz uma string
        do tamanho certo e com os separadores nos lugares errados, e o erro
        sobrevive a qualquer teste que só conte caracteres. Se você mantém uma
        biblioteca de padrões, as expressões úteis são{" "}
        <code>^\d&#123;11&#125;$</code> para o número cru e{" "}
        <code>^\d&#123;3&#125;\.\d&#123;5&#125;\.\d&#123;2&#125;-\d$</code> para
        o formatado; o{" "}
        <a href="/guias/regex-documentos-brasileiros">
          guia de regex de documentos
        </a>{" "}
        traz o conjunto completo.
      </p>
      <p>
        No banco, a coluna precisa ser textual de largura fixa —{" "}
        <code>char(11)</code> ou <code>varchar(11)</code> — e nunca numérica.
        Zeros à esquerda são comuns no PIS e um tipo inteiro os descarta sem
        avisar; o número volta com dez caracteres e, quando alguém o completa de
        volta, raramente o completa pela esquerda. Como cada dígito tem um peso
        atrelado à sua posição, o deslocamento de uma casa muda toda a soma
        ponderada e o mesmo número passa a ser reprovado no dígito verificador.
        Normalize na entrada, guarde apenas os onze dígitos, formate na saída.
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Validação e formatação mínimas. A comparação >= 10 cobre de uma vez os restos 0 e 1."
        code={`const PESOS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

/** Remove máscara, espaços e o que vier colado de planilha. */
export function normalizarPis(entrada: string): string {
  return entrada.replace(/\\D/g, "");
}

export function digitoPis(base: string): number {
  const soma = PESOS.reduce((acc, peso, i) => acc + Number(base[i]) * peso, 0);
  const dv = 11 - (soma % 11);
  return dv >= 10 ? 0 : dv;
}

export function pisValido(entrada: string): boolean {
  const pis = normalizarPis(entrada);
  if (pis.length !== 11) return false;
  if (/^(\\d)\\1{10}$/.test(pis)) return false;
  return digitoPis(pis.slice(0, 10)) === Number(pis[10]);
}

export function formatarPis(entrada: string): string {
  const d = normalizarPis(entrada).padStart(11, "0");
  return d.slice(0, 3) + "." + d.slice(3, 8) + "." + d.slice(8, 10) + "-" + d.slice(10);
}`}
      />

      <h2>Válido contra cadastrado: o que só o CNIS responde</h2>
      <p>
        O dígito verificador resolve um problema estreito: detectar erro de
        digitação. Trocar um algarismo ou inverter dois quase sempre quebra a
        conta, e é por isso que o teste vale a pena no formulário. Ele não diz
        nada sobre existir um trabalhador por trás do número, sobre haver
        vínculos registrados ou sobre o cadastro estar ativo.
      </p>
      <p>
        Quem responde isso é o CNIS, o cadastro da Previdência onde ficam os
        vínculos e as contribuições, consultável pelo Meu INSS; para o lado do
        abono, os canais da Caixa. Nenhuma biblioteca faz essa verificação
        offline, e um serviço que prometa &ldquo;validar se o PIS existe&rdquo;
        sem consultar a base oficial está apenas recalculando o dígito. A
        distinção é a mesma que separa{" "}
        <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
          um CPF bem formado de um CPF regular
        </a>
        , e vale repetir no code review sempre que aparecer um método chamado{" "}
        <code>verificarPis</code> sem chamada de rede dentro.
      </p>
      <p>
        Há um corolário desconfortável para quem gera dados: um número aleatório
        com dígito válido pode, por coincidência, coincidir com o de uma pessoa
        real. Ele não deixa de ser fictício — o gerador não consultou cadastro
        nenhum —, mas isso reforça a regra de não usar massa sintética fora de
        ambiente de teste e de não cruzá-la com dados reais. O guia sobre{" "}
        <a href="/guias/lgpd-dados-de-teste">LGPD e dados de teste</a> detalha o
        raciocínio.
      </p>

      <h2>Erros comuns em sistemas de RH e folha</h2>
      <ul>
        <li>
          <strong>Colunas separadas para as quatro siglas.</strong> Uma só
          coluna, com mapeamento de rótulo na interface.
        </li>
        <li>
          <strong>Tipo numérico na coluna.</strong> Zeros à esquerda somem e o
          número reprova no dígito verificador ao ser reconstruído.
        </li>
        <li>
          <strong>Confundir com CPF por causa do tamanho.</strong> Os dois têm
          onze dígitos, então um campo que só verifica comprimento aceita um CPF
          no lugar do PIS sem reclamar. Valide pelo algoritmo, não pelo{" "}
          <code>length</code>.
        </li>
        <li>
          <strong>Sequências repetidas.</strong> Entre os onze números de dígito
          único, apenas <code>00000000000</code> passa no cálculo: a soma dá 0, o
          resto é 0, o dígito devolve 11 e vira 0. Se o validador não recusar
          repetições explicitamente, essa entrada atravessa a folha inteira.
        </li>
        <li>
          <strong>Validar antes de normalizar.</strong> Valores vindos de
          planilha chegam com pontos, hífens, espaços e, às vezes, apóstrofo
          inicial. Limpar primeiro evita falso negativo.
        </li>
        <li>
          <strong>Tratamento incompleto do resto.</strong> Restos 0 e 1 precisam
          resultar em dígito 0; qualquer condição que cubra só um dos dois falha
          em parte da base.
        </li>
      </ul>
      <p>
        O padrão por trás de quase todos esses itens é o mesmo catalogado no guia
        de{" "}
        <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
          erros comuns em validadores brasileiros
        </a>
        : validar cedo demais, normalizar tarde demais e confiar no tamanho da
        string.
      </p>

      <h2>Massa de teste para integrações de eSocial e folha</h2>
      <p>
        Integração de folha não se testa com um número bonito. Se a suíte usa um
        único PIS válido, ela cobre o caminho feliz e nada mais — e é justamente
        nas bordas que a rotina de importação quebra em produção, no primeiro
        funcionário cadastrado com zero à esquerda. Fixe um conjunto pequeno de
        valores conhecidos, com o resultado esperado anotado ao lado, e use
        números aleatórios só quando o teste for sobre volume.
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Fixtures determinísticas: cada valor exercita um ramo diferente do validador."
        code={`export const PIS_FIXTURES = {
  // base 1201661918, soma 153, resto 10 → DV 1
  valido: "12016619181",
  // zero à esquerda: quebra colunas numéricas e reimportações
  zeroAEsquerda: "01201661916",
  // soma 11, resto 0 → 11 - 0 = 11 → DV 0
  restoZero: "10000000040",
  // soma 12, resto 1 → 11 - 1 = 10 → DV 0
  restoUm: "10000000130",
  // mesmo número com máscara: o parser precisa normalizar antes
  comMascara: "120.16619.18-1",
  // DV trocado: deve reprovar
  dvErrado: "12016619182",
  // passa no cálculo, mas tem de ser recusado por regra
  sequenciaRepetida: "00000000000",
} as const;`}
      />
      <p>
        Os dois casos de resto merecem lugar fixo na suíte porque são os únicos
        em que a fórmula não devolve um algarismo direto, e são exatamente os que
        um refatorador distraído quebra ao &ldquo;simplificar&rdquo; a condição.
        Para volume — carga de arquivo, teste de importação em lote, medição de
        tempo de processamento —, o{" "}
        <a href="/gerador-de-pis">gerador de PIS/PASEP</a> produz lotes com o
        dígito já calculado, com ou sem máscara. Quando o cenário precisa de uma
        ficha completa, com nome, CPF e endereço coerentes em torno do mesmo
        registro, o <a href="/gerador-de-pessoas">gerador de pessoas</a> monta o
        conjunto de uma vez.
      </p>
      <p>
        Uma última recomendação de higiene: mantenha as fixtures em um módulo
        versionado, não espalhadas em cada arquivo de teste. Quando alguém
        precisar entender por que <code>10000000130</code> está ali, o
        comentário ao lado do valor responde em uma linha — e o próximo
        desenvolvedor não apaga o caso achando que é ruído. O guia sobre{" "}
        <a href="/guias/massa-de-dados-de-teste-fixtures-seeds-faker">
          massa de dados de teste
        </a>{" "}
        trata das estratégias de seed e de reprodutibilidade.
      </p>
    </ArticleLayout>
  );
}
