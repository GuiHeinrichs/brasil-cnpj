import type { Metadata } from "next";

import {
  DocsWarning,
  FaqSection,
  GuideSection,
} from "@/components/doc-tool/reference";
import { SectionLabel } from "@/components/docs";
import { CodeBlock } from "@/components/guias/code-block";
import { JsonLd } from "@/components/json-ld";
import { NomeGeneratorPanel } from "@/components/nome/panels";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { NOME_FAQ } from "@/lib/faq";
import { MAX_BATCH_SIZE } from "@/lib/nome";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de Nomes brasileiros para massa de teste";
const PAGE_DESCRIPTION =
  "Gere nomes brasileiros fictícios por sexo e em lote para seeds, fixtures e protótipos — com a acentuação que expõe bugs de codificação, ordenação e collation.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-nomes",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-nomes",
    siteName: SITE_NAME,
    locale: "pt_BR",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const webApplicationJsonLd = toolJsonLd({
  name: "Gerador de Nomes",
  path: "/gerador-de-nomes",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de nomes brasileiros em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Filtro por sexo (masculino, feminino ou aleatório)",
    "Prenome com um ou dois sobrenomes",
  ],
});

/** Demonstração do problema de normalização Unicode, citada na seção técnica. */
const UNICODE_SNIPPET = `const nfc = "Jos\\u00E9";   // "é" em um único caractere (U+00E9)
const nfd = "Jose\\u0301";  // "e" + acento combinante (U+0301)

nfc === nfd;   // false — mas os dois aparecem como "José" na tela
nfc.length;    // 4
nfd.length;    // 5

// Normalize na borda do sistema, antes de comparar, gravar ou indexar
nfc === nfd.normalize("NFC");   // true

// Chave de busca sem diacrítico: decompõe e descarta os acentos
const chave = (s) =>
  s.normalize("NFD").replace(/\\p{Diacritic}/gu, "").toLowerCase();

chave("Conceição Guimarães");   // "conceicao guimaraes"`;

export default function GeradorDeNomes() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(NOME_FAQ)} />

      <SiteHeader
        active="nomes"
        badge="Nomes brasileiros · por sexo"
        heading="Gerador de Nomes brasileiros"
        lead="Sorteia um prenome masculino ou feminino com um ou dois sobrenomes comuns no Brasil, em lote e com a acentuação de verdade — a massa que faz aparecer problema de codificação, ordenação e truncamento antes da produção."
      />

      <div className="mt-8">
        <NomeGeneratorPanel />
      </div>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Os nomes são combinações aleatórias de prenomes e sobrenomes comuns,
            destinadas a testes de software. Qualquer coincidência com pessoas
            reais é casual.
          </DocsWarning>

          <GuideSection title="Por que testar com nomes brasileiros de verdade">
            <p>
              Um cadastro preenchido com{" "}
              <code>Teste Teste</code> passa em tudo. São onze caracteres ASCII,
              nenhum acento, nenhuma ambiguidade de ordenação e exatamente o
              mesmo número de bytes e de caracteres. Nada ali
              pressiona o caminho que o texto percorre entre o formulário, o
              driver do banco, a coluna, o índice, o relatório em PDF e o arquivo
              de integração. A primeira vez que esse caminho vê{" "}
              <code>Vinícius Guimarães Araújo</code> costuma ser em produção.
            </p>
            <p>
              O que esta ferramenta produz é deliberadamente simples: um prenome
              sorteado de uma lista separada por sexo, mais um ou dois sobrenomes
              tirados de uma lista comum aos dois — a maior parte dos nomes sai
              com dois, o restante com um. Não há partículas em minúsculas (
              <code>de</code>, <code>da</code>, <code>dos</code>) nem prenomes
              compostos, e a cedilha não aparece nas listas. Se o seu caso de
              teste depende desses formatos, gere o lote e edite algumas linhas à
              mão: o valor da massa está em ter variedade de acentuação e de
              comprimento sem precisar inventá-la linha a linha.
            </p>

            <h3>Acento ocupa mais bytes do que caracteres</h3>
            <p>
              <code>Conceição</code> tem nove caracteres e onze bytes em UTF-8,
              porque <code>ç</code> e <code>ã</code> ocupam dois bytes cada. Todo
              limite contado em bytes — campo de largura fixa em arquivo de
              integração, coluna declarada com semântica de byte, chave com teto
              em bytes — corta no meio de um caractere de dois bytes e entrega
              uma sequência inválida adiante. O sintoma raramente aparece onde o
              corte aconteceu: vira um losango com interrogação na tela, ou uma
              exceção de decodificação três camadas depois. A correção é truncar
              por caractere e reservar folga no limite, não contar tudo como se
              fosse ASCII.
            </p>
            <p>
              O primo desse problema é o texto lido com a codificação errada.
              Bytes UTF-8 interpretados como latin-1 transformam{" "}
              <code>João</code> em <code>JoÃ£o</code>, e a gravação seguinte
              consolida o estrago no banco. Os pontos clássicos são a exportação
              de CSV e o charset da conexão do driver divergindo do charset da
              coluna — nenhum dos dois se manifesta sem acento na massa.
            </p>

            <h3>Ordenação alfabética não é ordem de bytes</h3>
            <p>
              Em JavaScript, <code>
                {"[\"Ávila\", \"Alves\", \"Zuza\"].sort()"}
              </code>{" "}
              devolve Ávila em último lugar. O <code>sort</code> padrão compara
              unidades UTF-16, e <code>Á</code> (U+00C1) vem depois de{" "}
              <code>Z</code> (U+005A). Para listagem exibida a usuário o
              comparador precisa ser{" "}
              <code>{"new Intl.Collator(\"pt-BR\").compare"}</code>, que trata a
              vogal acentuada como a mesma letra base. No banco a decisão é da
              collation da coluna: uma collation binária ou <code>C</code> ordena
              pelo byte e produz exatamente o mesmo defeito no{" "}
              <code>ORDER BY</code>. Uma amostra só com nomes sem acento nunca
              revela isso, porque nela as duas ordens coincidem.
            </p>

            <h3>Normalização Unicode: dois nomes idênticos que não são iguais</h3>
            <p>
              O mesmo nome pode chegar em duas formas Unicode diferentes. Na
              forma composta (NFC), o <code>é</code> é um caractere só; na
              decomposta (NFD), é a letra <code>e</code> seguida de um acento
              combinante. As duas renderizam igual na tela e são diferentes para
              qualquer comparação de string, para o <code>length</code> e para o
              índice único.
            </p>
            <CodeBlock
              language="JavaScript"
              caption="Normalizar uma vez, na entrada, evita registros duplicados que parecem idênticos na tela."
              code={UNICODE_SNIPPET}
            />
            <p>
              A regra prática é normalizar na borda — ao receber, uma vez — e
              guardar sempre na mesma forma, de preferência NFC. Para busca
              tolerante a acento, mantenha uma coluna ou índice funcional com a
              chave sem diacríticos em vez de aplicar a transformação a cada
              consulta: assim o índice continua sendo usado.
            </p>

            <h3>Collation do banco erra nos dois sentidos</h3>
            <p>
              As armadilhas são simétricas e igualmente comuns. Uma collation
              insensível a acento trata <code>José</code> e <code>Jose</code>{" "}
              como o mesmo valor: o índice único recusa um cadastro legítimo e o{" "}
              <code>{"where nome = 'Jose'"}</code> traz o registro acentuado sem
              que ninguém tenha pedido. Uma collation sensível a acento faz o
              inverso: a busca por <code>Jose</code> não encontra{" "}
              <code>José</code>, e o atendente conclui que o cliente sumiu da
              base. O mesmo vale para a cedilha na comparação sem distinção de
              caixa, em que <code>ç</code> e <code>c</code> podem ou não colapsar
              no mesmo caractere.
            </p>
            <p>
              Nenhum dos dois comportamentos é defeito do banco: são
              consequência de uma escolha de collation que normalmente ninguém
              fez de propósito. Gerar um lote de nomes acentuados e rodar
              inserção, busca e ordenação em cima dele expõe qual das duas se
              aplica ao seu ambiente. O restante da
              estratégia de massa de teste, incluindo seeds determinísticos e
              fixtures versionados, está em{" "}
              <a href="/guias/massa-de-dados-de-teste-fixtures-seeds-faker">
                massa de dados de teste: fixtures, seeds e faker
              </a>
              .
            </p>
          </GuideSection>

          <GuideSection title="Quando usar (e quando não)">
            <p>
              Um gerador de nomes resolve um problema estreito: produzir texto
              humano plausível, em português, em quantidade. Vale usar quando é
              isso que falta.
            </p>
            <ul>
              <li>
                <strong>Seeds e fixtures</strong> de ambientes de
                desenvolvimento, no lugar de sequências como{" "}
                <code>usuario1</code> e <code>usuario2</code>, que escondem
                problemas de largura de coluna e de ordenação.
              </li>
              <li>
                <strong>Telas, relatórios e capturas de documentação</strong>,
                em que uma lista de nomes verossímeis mostra o layout real —
                inclusive o que acontece com um nome de quarenta caracteres numa
                célula estreita.
              </li>
              <li>
                <strong>Testes de busca e de ordenação</strong>, exatamente pelas
                razões da seção anterior.
              </li>
              <li>
                <strong>Demonstrações para clientes</strong>, para não exibir a
                base de produção em tela compartilhada.
              </li>
            </ul>
            <p>Não é a ferramenta certa nestes casos:</p>
            <ul>
              <li>
                <strong>Como identificador.</strong> Nome não é chave. Dois
                registros com o mesmo nome são normais, e a combinação aleatória
                aqui repete com frequência maior do que a intuição sugere. Para
                identificar pessoa física, o campo é o{" "}
                <a href="/gerador-de-cpf">CPF</a>.
              </li>
              <li>
                <strong>Quando você precisa controlar as colisões.</strong>{" "}
                Testar deduplicação ou merge de cadastros exige pares construídos
                de propósito — com e sem acento, com e sem sobrenome do meio —,
                não sorteio.
              </li>
              <li>
                <strong>Como substituto de anonimização.</strong> Trocar nomes
                reais por nomes sorteados em uma cópia de produção não torna a
                base anônima: o restante das colunas continua reidentificando as
                pessoas. O que a LGPD pede e o que isso implica para ambientes de
                teste está em{" "}
                <a href="/guias/lgpd-dados-de-teste">LGPD e dados de teste</a>.
              </li>
            </ul>
          </GuideSection>

          <div className="space-y-3">
            <SectionLabel>Ficha completa em vez de nome solto</SectionLabel>
            <p className="text-sm text-muted-foreground">
              Um nome isolado basta para exercitar codificação e layout, mas não
              para testar um cadastro inteiro. Quando forem necessários CPF, RG,
              data de nascimento, endereço e telefone coerentes entre si e com a
              UF, use o{" "}
              <a
                href="/gerador-de-pessoas"
                className="text-foreground underline underline-offset-4 hover:text-foreground/80"
              >
                Gerador de Pessoas
              </a>
              , que parte do mesmo banco de nomes e monta a ficha completa. Os
              dígitos verificadores desses documentos saem do mesmo cálculo
              descrito no guia de{" "}
              <a
                href="/guias/modulo-11-digito-verificador"
                className="text-foreground underline underline-offset-4 hover:text-foreground/80"
              >
                módulo 11
              </a>
              .
            </p>
          </div>

          <FaqSection items={NOME_FAQ} />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
