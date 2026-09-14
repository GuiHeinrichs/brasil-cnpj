"use client";

import { CPF_SEGMENTS, CpfText } from "@/components/cpf/cpf-text";
import {
  AlgorithmSection,
  DocsWarning,
  FaqSection,
  GuideSection,
  OfficialLinksSection,
} from "@/components/doc-tool/reference";
import { CopyableCode, SectionLabel } from "@/components/docs";
import { CodeBlock } from "@/components/guias/code-block";
import { CPF_MASKED_REGEX, CPF_REGEX, FISCAL_REGIONS } from "@/lib/cpf";
import { CPF_FAQ } from "@/lib/faq";
import { cn } from "@/lib/utils";

const REFERENCES = [
  {
    label: "Cadastro CPF — Receita Federal",
    href: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/cpf",
  },
  {
    label: "Consulta de situação cadastral do CPF — Receita Federal",
    href: "https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp",
  },
  {
    label: "Lei 14.534/2023 — CPF como número único de identificação",
    href: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/L14534.htm",
  },
];

const SEGMENT_DETAILS = [
  {
    ...CPF_SEGMENTS[0],
    description: "Número-base da inscrição: oito dígitos, sempre numéricos.",
  },
  {
    ...CPF_SEGMENTS[1],
    description: "Identifica a região fiscal que emitiu o CPF — tabela abaixo.",
  },
  {
    ...CPF_SEGMENTS[2],
    description: "Dígitos verificadores: módulo 11 sobre os dígitos anteriores.",
  },
];

const VALIDATOR_CODE = `const CPF_REPETIDO = /^(\\d)\\1{10}$/;

/** Módulo 11 do CPF: pesos decrescentes a partir de (tamanho da base + 1). */
function digitoVerificador(base: string): number {
  const primeiroPeso = base.length + 1; // 10 no 1º DV, 11 no 2º
  const soma = [...base].reduce(
    (total, char, i) => total + Number(char) * (primeiroPeso - i),
    0,
  );
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function cpfValido(entrada: string): boolean {
  const digitos = entrada.replace(/\\D/g, "");
  if (digitos.length !== 11) return false;
  if (CPF_REPETIDO.test(digitos)) return false;

  const base = digitos.slice(0, 9);
  const primeiro = digitoVerificador(base);
  const segundo = digitoVerificador(\`\${base}\${primeiro}\`);

  return digitos.slice(9) === \`\${primeiro}\${segundo}\`;
}

cpfValido("123.456.789-09"); // true
cpfValido("111.111.111-11"); // false — sequência repetida`;

export function DocsSection() {
  return (
    <section aria-label="Referência" className="space-y-10">
      <DocsWarning>
        Os CPFs desta ferramenta são fictícios e destinados exclusivamente a
        testes de software. Têm formato e dígitos verificadores corretos, mas não
        pertencem a ninguém e não constam no cadastro da Receita Federal.
      </DocsWarning>

      <GuideSection title="O CPF, dígito a dígito">
        <p>
          O Cadastro de Pessoas Físicas identifica o contribuinte perante a
          Receita Federal e, desde a{" "}
          <a
            href="https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/L14534.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lei 14.534/2023
          </a>
          , é o número suficiente e único de identificação do cidadão nas bases
          de dados de serviços públicos. Isso explica por que ele virou a chave
          de praticamente todo cadastro brasileiro — e o campo que mais aparece
          em formulário de homologação.
        </p>

        <h3>Número-base, região fiscal e verificadores</h3>
        <p>
          São onze algarismos, sem letras e sem variação de tamanho. Os oito
          primeiros formam a sequência de controle da inscrição, o nono
          identifica a <strong>região fiscal</strong> que a emitiu e os dois
          últimos são os <strong>dígitos verificadores</strong>. A máscara{" "}
          <code>000.000.000-00</code> é apresentação: o que se guarda e se compara
          são os onze dígitos crus.
        </p>
        <p>
          O nono dígito aponta onde o CPF foi emitido, não onde a pessoa nasceu
          ou mora. Quem tirou o documento em São Paulo e se mudou para Recife
          segue com o dígito 8. A tabela das dez regiões está adiante nesta
          página; a leitura completa, com os casos em que esse dígito engana,
          fica no guia{" "}
          <a href="/guias/regiao-fiscal-cpf">região fiscal do CPF</a>.
        </p>

        <h3>O que os dois verificadores conseguem pegar</h3>
        <p>
          O primeiro dígito sai de um módulo 11 com pesos de 10 a 2 aplicados ao
          número-base. Nenhum desses pesos é múltiplo de 11, e daí vem a utilidade
          prática: trocar um algarismo por outro, ou inverter dois algarismos
          diferentes de posição, muda a soma por uma quantidade que nunca é
          múltiplo de 11 — o resto se altera e a conta deixa de fechar. O segundo
          verificador refaz o cálculo sobre dez dígitos, com pesos de 11 a 2,
          incluindo o primeiro DV, de modo que um erro de digitação no próprio
          verificador também aparece. A mecânica está detalhada em{" "}
          <a href="/guias/modulo-11-digito-verificador">
            como o módulo 11 calcula o dígito verificador
          </a>
          .
        </p>

        <h3>As dez sequências que passam na conta</h3>
        <p>
          <code>000.000.000-00</code>, <code>111.111.111-11</code> e as outras
          oito repetições satisfazem o algoritmo. A razão é aritmética: com todos
          os algarismos iguais a <em>d</em>, a soma do primeiro verificador é
          sempre 54 × <em>d</em>, e a regra do módulo 11 devolve exatamente{" "}
          <em>d</em> como dígito — a conta fecha sozinha, para os dez casos.
          Como são justamente os números que alguém digita para furar um
          formulário, a convenção é recusá-los, e o validador precisa testá-los
          antes de calcular qualquer coisa. Este gerador nunca os emite.
        </p>

        <h3>Válido não quer dizer existente</h3>
        <p>
          O cálculo confirma que o número é bem formado. Ele não diz se existe
          inscrição correspondente na Receita, nem qual é a situação cadastral
          dela (regular, suspensa, cancelada, titular falecido). Só a consulta
          oficial responde isso, e nenhum número gerado aqui consta lá. A
          diferença entre os três níveis — formato, dígito verificador e
          existência — está em{" "}
          <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
            CPF válido não é CPF existente
          </a>
          .
        </p>
      </GuideSection>

      <div className="space-y-5">
        <SectionLabel>Anatomia do CPF</SectionLabel>
        <p className="text-center">
          <CpfText
            value="123.456.789-09"
            className="text-xl font-medium tracking-tight sm:text-2xl"
          />
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {SEGMENT_DETAILS.map((segment) => (
            <div key={segment.label} className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn("size-2 rounded-full", segment.dotClassName)}
                />
                <h3 className="text-sm font-semibold">{segment.label}</h3>
                <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                  {segment.positions}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {segment.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <SectionLabel>Regiões fiscais</SectionLabel>
        <p className="text-sm text-muted-foreground">
          Selecione uma região no Gerador para fixar o 9º dígito e produzir CPFs
          de um estado específico. Estados da mesma região compartilham o dígito
          — Paraná e Santa Catarina são ambos 9.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {FISCAL_REGIONS.map((region) => (
            <div
              key={region.digit}
              className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2"
            >
              <span className="font-mono text-lg font-medium text-primary">
                {region.digit}
              </span>
              <div className="flex flex-1 items-baseline justify-between gap-2">
                <span className="text-sm">{region.states}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {region.ordinal} RF
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AlgorithmSection
        intro={
          <>
            Base <code className="font-mono text-foreground">123456789</code> →
            DV <code className="font-mono text-foreground">09</code> → CPF
            formatado{" "}
            <code className="font-mono text-foreground">123.456.789-09</code>
          </>
        }
        steps={[
          "Multiplicar os 9 dígitos da base pelos pesos 10 a 2, da esquerda para a direita.",
          "Somar os produtos e dividir por 11: resto menor que 2 dá dígito 0, senão o dígito é 11 − resto.",
          "Repetir a conta sobre os 10 dígitos (base + 1º DV) com os pesos 11 a 2.",
        ]}
        worked={[
          {
            title: "Primeiro dígito verificador",
            steps: [
              { char: "1", weight: 10 },
              { char: "2", weight: 9 },
              { char: "3", weight: 8 },
              { char: "4", weight: 7 },
              { char: "5", weight: 6 },
              { char: "6", weight: 5 },
              { char: "7", weight: 4 },
              { char: "8", weight: 3 },
              { char: "9", weight: 2 },
            ],
            sum: 210,
            remainder: 1,
            rule: "Resto menor que 2, então o dígito é 0.",
            result: "0",
          },
          {
            title: "Segundo dígito verificador (base + 1º DV)",
            steps: [
              { char: "1", weight: 11 },
              { char: "2", weight: 10 },
              { char: "3", weight: 9 },
              { char: "4", weight: 8 },
              { char: "5", weight: 7 },
              { char: "6", weight: 6 },
              { char: "7", weight: 5 },
              { char: "8", weight: 4 },
              { char: "9", weight: 3 },
              { char: "0", weight: 2 },
            ],
            sum: 255,
            remainder: 2,
            rule: "Resto maior ou igual a 2, então o dígito é 11 − 2.",
            result: "9",
          },
        ]}
      />

      <div className="space-y-3">
        <SectionLabel>Regex</SectionLabel>
        <CopyableCode value={CPF_REGEX.source} label="Regex sem máscara" />
        <CopyableCode value={CPF_MASKED_REGEX.source} label="Regex com máscara" />
        <p className="text-sm text-muted-foreground">
          As duas expressões conferem apenas o formato. Elas aceitam{" "}
          <code className="font-mono text-foreground">111.111.111-11</code> e
          qualquer combinação de dígitos verificadores errados — o cálculo do
          módulo 11 continua sendo necessário.
        </p>
      </div>

      <div className="space-y-3">
        <SectionLabel>Validação em TypeScript</SectionLabel>
        <CodeBlock
          language="TypeScript"
          code={VALIDATOR_CODE}
          caption="Mesma função em Python, Java, C#, SQL e outras linguagens nos guias de código."
        />
        <p className="text-sm text-muted-foreground">
          Versões comentadas, com testes e as armadilhas de cada linguagem, estão
          em{" "}
          <a
            href="/guias/validar-cpf-cnpj-javascript-typescript"
            className="text-primary underline underline-offset-4"
          >
            validar CPF e CNPJ em JavaScript e TypeScript
          </a>
          , em{" "}
          <a
            href="/guias/validar-cpf-cnpj-python-java-csharp"
            className="text-primary underline underline-offset-4"
          >
            validar CPF e CNPJ em Python, Java e C#
          </a>{" "}
          e em{" "}
          <a
            href="/guias/validar-cpf-cnpj-sql-postgres-mysql-sqlserver"
            className="text-primary underline underline-offset-4"
          >
            validar CPF e CNPJ em SQL
          </a>
          .
        </p>
      </div>

      <GuideSection title="Quando usar este gerador (e quando não)">
        <p>
          Os números daqui servem para toda situação em que o sistema exige um
          CPF bem formado e ninguém precisa que ele exista:
        </p>
        <ul>
          <li>
            preencher cadastros, checkouts e emissão de nota em desenvolvimento e
            homologação, sem envolver o CPF de um colega de equipe;
          </li>
          <li>
            montar seeds e fixtures com centenas de registros distintos, em vez
            de repetir o mesmo número em toda a base de teste — o método está em{" "}
            <a href="/guias/massa-de-dados-de-teste-fixtures-seeds-faker">
              massa de dados de teste
            </a>
            ;
          </li>
          <li>
            exercitar máscara, limite de campo, colagem com e sem pontuação e o
            que o formulário faz quando chegam 10 ou 12 dígitos;
          </li>
          <li>
            produzir capturas de tela, documentação e demonstrações sem expor
            dados de ninguém;
          </li>
          <li>
            conferir se um validador recém-escrito aceita o que deve aceitar e
            recusa as sequências repetidas.
          </li>
        </ul>
        <p>E não servem para:</p>
        <ul>
          <li>
            operações em produção — consultar situação cadastral, emitir nota
            fiscal, abrir conta: o número não existe na Receita, então ou a
            operação falha ou o uso configura fraude;
          </li>
          <li>
            contornar a validação de cadastro de um serviço real ou se apresentar
            como outra pessoa;
          </li>
          <li>
            &ldquo;anonimizar&rdquo; uma base real trocando só a coluna de CPF:
            nome, endereço, telefone e histórico continuam identificando o
            titular. O que a LGPD pede de quem leva dados para ambiente de teste
            está em{" "}
            <a href="/guias/lgpd-dados-de-teste">LGPD e dados de teste</a>;
          </li>
          <li>
            testar a integração com a consulta da Receita: aí o caminho é um stub
            que devolva cada situação cadastral possível, inclusive as de erro.
          </li>
        </ul>
      </GuideSection>

      <GuideSection title="Erros comuns ao validar CPF">
        <p>
          Os defeitos abaixo aparecem com frequência em revisão de código e quase
          todos sobrevivem a uma bateria de testes de caminho feliz.
        </p>
        <ul>
          <li>
            <strong>Guardar o CPF como número.</strong> Uma coluna inteira, ou um{" "}
            <code>Number</code> em JavaScript, engole o zero à esquerda:{" "}
            <code>012.345.678-90</code> volta com dez dígitos e é rejeitado por
            qualquer validador. Campo de texto de tamanho fixo resolve.
          </li>
          <li>
            <strong>Validar sem normalizar antes.</strong> Um{" "}
            <code>/^\d{"{11}"}$/</code> aplicado direto na string com pontos
            recusa um CPF correto. Remova tudo que não é dígito antes de
            qualquer verificação e grave sempre no mesmo formato, ou a base
            termina com o mesmo CPF duas vezes, um registro com máscara e outro
            sem.
          </li>
          <li>
            <strong>Ignorar as sequências repetidas.</strong> Elas passam no
            módulo 11, como explicado acima, e por isso precisam de um teste
            próprio — colocado antes do cálculo, não depois.
          </li>
          <li>
            <strong>
              Tratar mal o resto na variante <code>11 − resto</code>.
            </strong>{" "}
            Quem escreve o dígito como <code>11 − resto</code> precisa zerar dois
            resultados: o 10 e o 11. Tratar apenas o 10 deixa escapar um
            &quot;dígito 11&quot;, que jamais bate com o caractere gravado — e o
            efeito visível é recusar CPFs válidos cujo verificador é 0.
          </li>
          <li>
            <strong>Importar planilha sem repor os zeros.</strong> A planilha
            trata a coluna como número e devolve dez caracteres para todo CPF
            iniciado em 0. Completar com zeros à esquerda até onze, antes de
            validar, evita descartar registros bons.
          </li>
          <li>
            <strong>Usar o nono dígito como regra de negócio.</strong> Rotear
            atendimento, calcular frete ou definir alíquota a partir da região
            fiscal produz erro sistemático em quem emitiu o documento num estado
            e mora em outro.
          </li>
          <li>
            <strong>Confundir validação com consulta.</strong> Dígitos corretos
            não garantem inscrição ativa. Quando a regra de negócio depende
            disso, a verificação tem de ir até a Receita.
          </li>
        </ul>
        <p>
          O apanhado maior, com sintoma, causa e teste de reprodução para cada
          caso, está em{" "}
          <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
            dez erros comuns em validadores de documentos brasileiros
          </a>
          .
        </p>
      </GuideSection>

      <FaqSection items={CPF_FAQ} />

      <OfficialLinksSection references={REFERENCES} />
    </section>
  );
}
