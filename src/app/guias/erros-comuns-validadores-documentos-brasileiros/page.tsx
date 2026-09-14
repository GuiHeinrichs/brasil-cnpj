import type { Metadata } from "next";
import Link from "next/link";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { WorkedDvTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("erros-comuns-validadores-documentos-brasileiros")!;

export const metadata: Metadata = guideMetadata(guide);

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Validador de documento é código que quase ninguém revisa: sai de um
        gist, passa nos dois ou três números testados à mão e vai para produção.
        O defeito aparece meses depois, disfarçado de outra coisa — um cliente
        que não conclui o cadastro, um relatório com um CPF que concentra
        centenas de pedidos, uma importação que rejeita metade das linhas sem
        dizer por quê. Abaixo, dez defeitos recorrentes com o número exato que
        reproduz cada um.
      </p>

      <h2>1. Aceitar sequências de dígitos repetidos</h2>
      <h3>Sintoma</h3>
      <p>
        <code>111.111.111-11</code> e <code>000.000.000-00</code> aparecem no
        banco, às vezes centenas de vezes, e viram um cliente fantasma que
        agrega pedidos de pessoas diferentes.
      </p>
      <h3>Causa</h3>
      <p>
        O módulo 11 não tem nenhuma objeção a repetição. Na base{" "}
        <code>111111111</code>, a soma ponderada dá 54, o resto é 10 e o dígito
        sai 1; a segunda passada soma 65, resto 10, dígito 1 outra vez. A conta
        fecha. E isso não é um acidente de um número só: <strong>as dez
        sequências repetidas de CPF passam no cálculo</strong>, de{" "}
        <code>00000000000</code> a <code>99999999999</code>.
      </p>
      <h3>Como reproduzir</h3>
      <p>
        Repita cada algarismo onze vezes em um laço e passe pela sua função. No
        CNPJ numérico o estrago é menor — só <code>00.000.000/0000-00</code>{" "}
        passa, porque todas as somas dão zero —, mas é justamente o valor que
        mais aparece em formulário abandonado.
      </p>
      <h3>Correção</h3>
      <p>
        Uma checagem explícita antes do cálculo:{" "}
        <code>/^(\d)\1{"{10}"}$/</code> para CPF e <code>\1{"{13}"}</code> para
        CNPJ. Para ter contraexemplos que passem pelo motivo certo, use o{" "}
        <a href="/gerador-de-cpf">gerador de CPF</a>, que nunca emite sequência
        trivial.
      </p>

      <h2>2. Errar o tratamento do resto 10 ou 11</h2>
      <h3>Sintoma</h3>
      <p>
        Uma fatia pequena e teimosa de documentos legítimos é recusada. A
        proporção costuma ficar perto de um em onze, o que dá a impressão de
        aleatoriedade.
      </p>
      <h3>Causa</h3>
      <p>
        Cada documento resolve o resto de um jeito e o código copiado resolve do
        jeito do documento anterior. CPF e CNPJ: resto menor que 2 vira dígito 0,
        caso contrário o dígito é <code>11 − resto</code>. RG no padrão SSP-SP:
        o dígito é sempre <code>11 − resto</code>, com 10 virando{" "}
        <code>X</code> e 11 virando 0. PIS: resto 10 produz o dígito 1. RENAVAM
        nem usa o resto direto — multiplica a soma por 10 antes do módulo.
      </p>
      <h3>Como reproduzir</h3>
      <p>
        O RG <code>24.598.973-0</code> é o caso limite: o resto é 0, então{" "}
        <code>11 − 0 = 11</code>, e 11 precisa virar 0. Quem esquece essa
        conversão grava o dígito 11 ou rejeita o documento.
      </p>
      <WorkedDvTable
        title="RG 24.598.973-0 — o resto zero"
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
        rule="11 − 0 = 11, e 11 vira 0 (no padrão SSP-SP, 10 viraria X)."
        result="0"
      />
      <h3>Correção</h3>
      <p>
        Isolar o tratamento do resto em uma função por documento, em vez de
        espalhar <code>if</code> dentro do laço, e montar o lote de teste com os
        geradores de <a href="/gerador-de-rg">RG</a>,{" "}
        <a href="/gerador-de-pis">PIS</a> e{" "}
        <a href="/gerador-de-renavam">RENAVAM</a>, que evitam as bases em que
        validadores conhecidos divergem. O passo a passo da conta está no guia do{" "}
        <a href="/guias/modulo-11-digito-verificador">módulo 11</a>; a CNH tem
        uma zona de divergência própria, descrita no{" "}
        <a href="/guias/cnh-numero-registro-digito-verificador">
          guia do número de registro da CNH
        </a>
        .
      </p>
      <CodeBlock
        language="TypeScript"
        caption="A soma ponderada é a mesma; o que muda entre documentos é só a última linha."
        code={`// CPF e CNPJ
const dvCpf = (resto: number) => (resto < 2 ? 0 : 11 - resto);

// RG (SSP-SP): 10 vira X, 11 vira 0
const dvRg = (resto: number) => {
  const d = 11 - resto;
  return d === 10 ? "X" : d === 11 ? "0" : String(d);
};

// PIS/PASEP: resto 10 devolve 1; resto 0 ou 1 devolvem 0
const dvPis = (resto: number) => (resto < 2 ? 0 : 11 - resto);

// RENAVAM: a soma é multiplicada por 10 antes do módulo
const dvRenavam = (soma: number) => {
  const d = (soma * 10) % 11;
  return d >= 10 ? 0 : d;
};`}
      />

      <h2>3. Não remover a máscara antes de validar</h2>
      <h3>Sintoma</h3>
      <p>
        O mesmo CPF é aceito no formulário do site e recusado pela API, ou o
        contrário. Importação de planilha rejeita tudo.
      </p>
      <h3>Causa</h3>
      <p>
        A função verifica o comprimento antes de normalizar. Com pontuação,{" "}
        <code>123.456.789-09</code> tem 14 caracteres, não 11. O inverso também
        acontece: validador que espera máscara e recebe{" "}
        <code>12345678909</code>.
      </p>
      <h3>Como reproduzir</h3>
      <p>
        Quatro formas do mesmo documento: <code>123.456.789-09</code>,{" "}
        <code>12345678909</code>, <code>123 456 789 09</code> e a string com
        espaço e quebra de linha no fim, que é o que chega de um copiar e colar
        de planilha. As quatro têm de dar o mesmo resultado.
      </p>
      <h3>Correção</h3>
      <p>
        Normalize na fronteira do sistema, valide depois, guarde normalizado e
        aplique a máscara só na exibição. Atenção a{" "}
        <code>replace(/\D/g, &quot;&quot;)</code>: essa regex serve para CPF, mas
        destrói CNPJ com letras — veja o erro 5. Os padrões prontos de cada
        documento estão no guia de{" "}
        <a href="/guias/regex-documentos-brasileiros">
          regex para documentos brasileiros
        </a>
        .
      </p>

      <h2>4. Gravar o documento em coluna numérica</h2>
      <h3>Sintoma</h3>
      <p>
        Registros com CPF de dez dígitos no banco. Cerca de um em cada dez
        cadastros quebra, sempre os de CPF que começa com zero.
      </p>
      <h3>Causa</h3>
      <p>
        <code>BIGINT</code> guarda um número, e número não tem zero à esquerda.
        O CPF <code>012.345.678-90</code>, normalizado para{" "}
        <code>01234567890</code>, volta do banco como <code>1234567890</code> e
        falha na validação seguinte por comprimento. O mesmo vale para{" "}
        <a href="/gerador-de-cep">CEP</a> que começa com zero, como toda a
        capital paulista, e para RENAVAM antigo.
      </p>
      <h3>Como reproduzir</h3>
      <p>
        Insira <code>01234567890</code> em uma coluna inteira, leia de volta e
        compare o comprimento. São dez caracteres.
      </p>
      <h3>Correção</h3>
      <p>
        Documento é identificador, não quantidade: nunca entra em soma, média ou
        comparação de ordem. Coluna de texto com comprimento fixo — e o CNPJ
        alfanumérico encerra a discussão, já que não cabe em campo numérico.
      </p>
      <CodeBlock
        language="SQL — PostgreSQL"
        caption="O CHECK só é possível porque a coluna é texto."
        code={`-- errado: perde o zero à esquerda
cpf BIGINT NOT NULL

-- certo: comprimento fixo, sem máscara
cpf   CHAR(11) NOT NULL CHECK (cpf ~ '^[0-9]{11}$'),
cnpj  CHAR(14) NOT NULL CHECK (cnpj ~ '^[0-9A-Z]{12}[0-9]{2}$')`}
      />

      <h2>5. Regex só numérica depois do CNPJ alfanumérico</h2>
      <h3>Sintoma</h3>
      <p>
        Desde julho de 2026, inscrições novas passam a chegar com letras e o
        sistema responde &ldquo;CNPJ inválido&rdquo; na entrada — ou, pior, aceita
        e grava lixo.
      </p>
      <h3>Causa</h3>
      <p>
        Duas linhas herdadas do formato antigo: <code>/^\d{"{14}"}$/</code> e{" "}
        <code>replace(/\D/g, &quot;&quot;)</code>. A primeira recusa; a segunda
        apaga as letras em silêncio e transforma{" "}
        <code>12.ABC.345/01DE-35</code> em <code>123450135</code>, nove
        caracteres que não são CNPJ nenhum.
      </p>
      <h3>Como reproduzir</h3>
      <p>
        Use o exemplo oficial do manual da Receita:{" "}
        <code>12.ABC.345/01DE-35</code>. Os doze primeiros caracteres são a base,
        os dois últimos continuam sendo algarismos — <strong>os dígitos
        verificadores nunca são letras</strong>.
      </p>
      <h3>Correção</h3>
      <p>
        Normalizar para maiúsculas, validar com{" "}
        <code>^[0-9A-Z]{"{12}"}\d{"{2}"}$</code> e converter cada caractere pelo
        código ASCII menos 48 antes de multiplicar pelos pesos, o que faz{" "}
        <code>A</code> valer 17. A regra completa, com a conta resolvida, está no
        guia do{" "}
        <a href="/guias/cnpj-alfanumerico-2026">CNPJ alfanumérico</a>; para gerar
        números dos dois formatos, o{" "}
        <Link href="/">gerador de CNPJ</Link> alterna entre eles.
      </p>

      <h2>6. Confundir documento válido com documento existente</h2>
      <h3>Sintoma</h3>
      <p>
        O cadastro aprova o CPF, mas a emissão de nota, a consulta de crédito ou
        a conciliação falham depois, com o cliente já dentro do sistema.
      </p>
      <h3>Causa</h3>
      <p>
        O dígito verificador prova coerência interna, nada mais. Ele diz que os
        dois últimos algarismos combinam com os nove anteriores. Não diz que
        existe inscrição, que ela está ativa nem que pertence a quem digitou.
      </p>
      <h3>Como reproduzir</h3>
      <p>
        Gere um número no <a href="/gerador-de-cpf">gerador de CPF</a> e rode seu
        validador: aprovado. Agora procure esse mesmo número em qualquer base que
        dependa de inscrição real. Ele não está lá — e é exatamente por isso que
        serve como dado de teste.
      </p>
      <h3>Correção</h3>
      <p>
        Tratar formato, dígito verificador e existência como três verificações
        distintas, cada uma com sua mensagem de erro. Só a terceira depende de
        consulta oficial, é lenta e pode falhar. O detalhamento está em{" "}
        <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
          CPF válido não é CPF existente
        </a>
        .
      </p>

      <h2>7. Rejeitar RG emitido em outro estado</h2>
      <h3>Sintoma</h3>
      <p>
        Usuários de fora de São Paulo travam no campo de RG. O suporte recebe
        prints de documentos legítimos marcados em vermelho.
      </p>
      <h3>Causa</h3>
      <p>
        O algoritmo de oito dígitos com pesos 2 a 9 é a convenção da SSP-SP, a
        mais difundida pelos validadores da internet — e nada além disso. Não há
        padrão nacional de RG: cada secretaria estadual define comprimento,
        formatação e regra de conferência, e há emissores sem dígito verificador.
        Um validador de RG &ldquo;genérico&rdquo; é, na prática, um validador de
        São Paulo.
      </p>
      <h3>Como reproduzir</h3>
      <p>
        Mesmo dentro de SP a restrição costuma estar errada:{" "}
        <code>/^\d{"{9}"}$/</code> rejeita o RG <code>12.345.671-X</code>, cuja
        soma é 177 e o resto 1, o que leva o dígito a 10 e, por convenção, à
        letra X. Gere lotes no <a href="/gerador-de-rg">gerador de RG</a> até
        aparecer um terminado em X e passe pelo seu validador.
      </p>
      <h3>Correção</h3>
      <p>
        RG como campo de texto, com limite de comprimento e órgão emissor ao
        lado; o cálculo do dígito só quando o emissor for SSP-SP. Onde o sistema
        precisa de identificador único de pessoa física, o campo certo é o CPF,
        que a Carteira de Identidade Nacional adotou como número único. As
        diferenças por estado estão em{" "}
        <a href="/guias/rg-por-estado-e-cin-carteira-identidade-nacional">
          RG por estado e a CIN
        </a>
        .
      </p>

      <h2>8. Não aceitar RENAVAM de nove dígitos</h2>
      <h3>Sintoma</h3>
      <p>
        A importação de uma frota antiga rejeita justamente os veículos mais
        velhos, e sempre os mesmos.
      </p>
      <h3>Causa</h3>
      <p>
        O RENAVAM passou a ser exibido com onze dígitos a partir de 2013.
        Documentos anteriores trazem nove, e é o mesmo número: os zeros à
        esquerda ficam implícitos no impresso. Um validador com{" "}
        <code>/^\d{"{11}"}$/</code> recusa metade do acervo histórico.
      </p>
      <h3>Como reproduzir</h3>
      <p>
        Pegue <code>123456789</code>, nove dígitos. Completado à esquerda, vira{" "}
        <code>00123456789</code>. A base <code>0012345678</code>, com os pesos 3,
        2, 9, 8, 7, 6, 5, 4, 3 e 2, soma 156; multiplicada por 10 dá 1560, e{" "}
        <code>1560 mod 11 = 9</code>, exatamente o último dígito. O número é
        válido nas duas formas.
      </p>
      <h3>Correção</h3>
      <p>
        Aceitar de 9 a 11 dígitos na entrada, completar com zeros à esquerda até
        onze e só então calcular. É uma linha:{" "}
        <code>valor.padStart(11, &quot;0&quot;)</code>. O{" "}
        <a href="/gerador-de-renavam">gerador de RENAVAM</a> emite no formato de
        onze, que é o que você deve gravar.
      </p>

      <h2>9. Ignorar a exceção de SP e MG no título de eleitor</h2>
      <h3>Sintoma</h3>
      <p>
        Títulos de eleitores paulistas e mineiros são recusados sem padrão
        aparente, enquanto os dos outros estados passam.
      </p>
      <h3>Causa</h3>
      <p>
        O título usa módulo 11 com resto 10 convertido em 0, como de praxe. Só
        que, nos títulos de São Paulo e Minas Gerais — códigos <code>01</code> e{" "}
        <code>02</code> nos dígitos 9 e 10 —, o resto 0 vira 1. Quem implementa a
        regra geral erra apenas nesses dois estados, e apenas nos sequenciais em
        que algum resto dá zero.
      </p>
      <h3>Como reproduzir</h3>
      <p>
        Sequencial <code>12345677</code> com o código de UF <code>01</code>. Os
        pesos 2 a 9 somam 231, que é múltiplo de 11, então o resto é 0. Com a
        exceção, o primeiro dígito é 1 e o segundo sai de{" "}
        <code>7×0 + 8×1 + 9×1 = 17</code>, resto 6. Sem a exceção, o primeiro é 0
        e o segundo vem de <code>8</code>, resto 8. Dois títulos distintos para a
        mesma base: <code>1234 5677 0116</code> e <code>1234 5677 0108</code>.
        Apenas o primeiro segue a regra do TSE.
      </p>
      <h3>Correção</h3>
      <p>
        Aplicar a conversão de resto 0 em 1 só quando os dígitos 9 e 10 forem{" "}
        <code>01</code> ou <code>02</code>, nos dois dígitos verificadores. O{" "}
        <a href="/gerador-de-titulo-de-eleitor">gerador de título</a> permite
        fixar a UF, o que facilita montar o lote de teste; a estrutura completa
        do número está no{" "}
        <a href="/guias/titulo-de-eleitor-estrutura-uf-zona-secao">
          guia do título de eleitor
        </a>
        .
      </p>

      <h2>10. Validar no cliente e confiar nisso no servidor</h2>
      <h3>Sintoma</h3>
      <p>
        Documentos inválidos que, segundo o time, &ldquo;não deveriam
        existir&rdquo; aparecem no banco. Costumam vir de integração
        servidor-a-servidor, de uma versão antiga do aplicativo ou de um script
        de carga.
      </p>
      <h3>Causa</h3>
      <p>
        A validação em JavaScript no navegador é conveniência de interface: evita
        uma ida ao servidor para avisar o usuário do erro de digitação. Qualquer
        cliente que fale HTTP ignora essa camada.
      </p>
      <h3>Como reproduzir</h3>
      <p>
        Um <code>curl</code> direto no endpoint de cadastro com{" "}
        <code>123.456.789-00</code> — formato certo, dígitos errados. Se o
        registro for gravado, a regra existia só no front.
      </p>
      <h3>Correção</h3>
      <p>
        A mesma função nas duas pontas, de preferência no mesmo pacote
        compartilhado, mais uma restrição no banco como última linha de defesa.
        As implementações estão em{" "}
        <a href="/guias/validar-cpf-cnpj-javascript-typescript">
          JavaScript e TypeScript
        </a>
        ,{" "}
        <a href="/guias/validar-cpf-cnpj-python-java-csharp">
          Python, Java e C#
        </a>{" "}
        e{" "}
        <a href="/guias/validar-cpf-cnpj-sql-postgres-mysql-sqlserver">
          SQL
        </a>
        .
      </p>

      <h2>Uma suíte mínima de testes</h2>
      <p>
        Nove dos dez defeitos acima morrem com uma tabela de casos. O que ela
        precisa cobrir, por documento: um número válido com máscara e o mesmo sem
        máscara; um número com zero à esquerda; um dígito verificador trocado; as
        sequências repetidas; o caso de resto limite do documento; e o
        comprimento fora da faixa. Fixe os valores no código em vez de gerar
        aleatoriamente dentro do teste — um teste que sorteia a própria entrada
        falha em dias diferentes e não diz por quê.
      </p>
      <CodeBlock
        language="TypeScript — Vitest"
        caption="Os mesmos casos servem para Jest, pytest ou JUnit: o que importa é a tabela."
        code={`const CASOS: [string, boolean, string][] = [
  ["123.456.789-09", true,  "válido com máscara"],
  ["12345678909",    true,  "válido sem máscara"],
  ["012.345.678-90", true,  "zero à esquerda"],
  ["123.456.789-00", false, "segundo dígito trocado"],
  ["111.111.111-11", false, "sequência repetida"],
  ["1234567890",     false, "curto demais"],
];

describe("validarCpf", () => {
  it.each(CASOS)("%s → %s (%s)", (entrada, esperado) => {
    expect(validarCpf(entrada)).toBe(esperado);
  });

  it("rejeita as dez sequências repetidas", () => {
    for (let d = 0; d <= 9; d++) {
      expect(validarCpf(String(d).repeat(11))).toBe(false);
    }
  });
});`}
      />
      <p>
        O décimo defeito — confiar na validação do cliente — não aparece em teste
        unitário, porque a função em si está correta. Ele só aparece num teste de
        integração que bate no endpoint sem passar pela tela. Vale escrever esse
        teste uma vez por rota que aceite documento.
      </p>
      <p>
        Para montar a massa de entrada, o{" "}
        <a href="/gerador-de-pessoas">gerador de pessoas</a> devolve fichas
        coerentes — CPF, RG, CEP e data de nascimento combinando entre si — e o{" "}
        <a href="/gerador-de-empresas">gerador de empresas</a> faz o mesmo do lado
        da pessoa jurídica. Os números passam no cálculo do dígito verificador e
        não correspondem a ninguém.
      </p>
    </ArticleLayout>
  );
}
