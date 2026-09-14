"use client";

import { CNPJ_SEGMENTS, CnpjText } from "@/components/cnpj/cnpj-text";
import {
  AlgorithmSection,
  DocsWarning,
  FaqSection,
  GuideSection,
  OfficialLinksSection,
} from "@/components/doc-tool/reference";
import { CopyableCode, SectionLabel } from "@/components/docs";
import { CodeBlock } from "@/components/guias/code-block";
import { Badge } from "@/components/ui/badge";
import { ALPHANUMERIC_REGEX, MAX_BATCH_SIZE, NUMERIC_REGEX } from "@/lib/cnpj";
import { CNPJ_FAQ } from "@/lib/faq";
import { cn } from "@/lib/utils";

const REFERENCES = [
  {
    label: "FAQ Receita Federal — CNPJ alfanumérico",
    href: "https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/cnpj/cnpj-alfanumerico.pdf",
  },
  {
    label: "Manual Serpro — cálculo do DV do CNPJ",
    href: "https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf",
  },
  {
    label: "Cadastro Nacional da Pessoa Jurídica — Receita Federal",
    href: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/cnpj",
  },
];

const SEGMENT_DETAILS = [
  {
    ...CNPJ_SEGMENTS[0],
    description:
      "Identifica a empresa. Todos os estabelecimentos dela repetem estas oito posições.",
  },
  {
    ...CNPJ_SEGMENTS[1],
    description:
      "Número do estabelecimento: 0001 é a matriz, 0002 em diante são as filiais.",
  },
  {
    ...CNPJ_SEGMENTS[2],
    description:
      "Módulo 11 sobre as doze posições anteriores. Numéricos nos dois formatos.",
  },
];

const FORMATS = [
  {
    name: "Numérico",
    tag: "legado",
    items: [
      "14 dígitos de 0 a 9 em todas as posições.",
      "Formato de todas as inscrições anteriores; segue válido e não precisa ser convertido.",
    ],
  },
  {
    name: "Alfanumérico",
    tag: "em vigor",
    items: [
      "Raiz e ordem aceitam 0–9 e A–Z; os dois DVs continuam numéricos.",
      "Vale para novas inscrições desde julho de 2026.",
    ],
    badge: "SERPRO",
  },
];

/** Conta do 1º DV da base K7R2M9T40001 (valores = ASCII − 48). */
const FIRST_DV_STEPS = [
  { char: "K", weight: 5, value: 27 },
  { char: "7", weight: 4, value: 7 },
  { char: "R", weight: 3, value: 34 },
  { char: "2", weight: 2, value: 2 },
  { char: "M", weight: 9, value: 29 },
  { char: "9", weight: 8, value: 9 },
  { char: "T", weight: 7, value: 36 },
  { char: "4", weight: 6, value: 4 },
  { char: "0", weight: 5, value: 0 },
  { char: "0", weight: 4, value: 0 },
  { char: "0", weight: 3, value: 0 },
  { char: "1", weight: 2, value: 1 },
];

/** Conta do 2º DV: mesma base com o 1º DV anexado e os pesos deslocados. */
const SECOND_DV_STEPS = [
  { char: "K", weight: 6, value: 27 },
  { char: "7", weight: 5, value: 7 },
  { char: "R", weight: 4, value: 34 },
  { char: "2", weight: 3, value: 2 },
  { char: "M", weight: 2, value: 29 },
  { char: "9", weight: 9, value: 9 },
  { char: "T", weight: 8, value: 36 },
  { char: "4", weight: 7, value: 4 },
  { char: "0", weight: 6, value: 0 },
  { char: "0", weight: 5, value: 0 },
  { char: "0", weight: 4, value: 0 },
  { char: "1", weight: 3, value: 1 },
  { char: "0", weight: 2, value: 0 },
];

const VALIDATION_CODE = `const WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9];

// Valor de cada caractere: código ASCII menos 48.
// "0" vira 0, "9" vira 9, "A" vira 17 e "Z" vira 42.
const valueOf = (char: string) => char.charCodeAt(0) - 48;

function checkDigit(base: string): number {
  let sum = 0;
  for (let i = base.length - 1; i >= 0; i--) {
    sum += valueOf(base[i]) * WEIGHTS[(base.length - 1 - i) % 8];
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCnpj(input: string): boolean {
  const cnpj = input.replace(/[.\\-/]/g, "").toUpperCase();
  if (!/^[0-9A-Z]{12}\\d{2}$/.test(cnpj)) return false;

  const base = cnpj.slice(0, 12);
  const first = checkDigit(base);
  const second = checkDigit(\`\${base}\${first}\`);
  return cnpj.slice(12) === \`\${first}\${second}\`;
}`;

export function DocsSection() {
  return (
    <section aria-label="Referência" className="space-y-10">
      <DocsWarning>
        Os CNPJs gerados nesta ferramenta são fictícios e servem apenas para
        testes de software. Eles passam em qualquer validador de dígito
        verificador, mas nunca foram inscritos na Receita Federal e não
        representam empresas reais.
      </DocsWarning>

      <GuideSection title="O que o CNPJ identifica">
        <p>
          O Cadastro Nacional da Pessoa Jurídica identifica{" "}
          <strong>estabelecimentos</strong>, e não empresas. A diferença parece
          sutil e é a origem de boa parte dos erros de modelagem: uma rede com
          quarenta lojas tem quarenta CNPJs distintos, todos pertencentes à mesma
          pessoa jurídica. São catorze posições, divididas em raiz (oito), ordem
          do estabelecimento (quatro) e dois dígitos verificadores.
        </p>

        <h3>Raiz, ordem e o que 0001 significa na prática</h3>
        <p>
          A raiz é o que amarra os estabelecimentos entre si: matriz e filiais
          compartilham os oito primeiros caracteres e diferem na ordem. A ordem{" "}
          <code>0001</code> marca o primeiro estabelecimento inscrito — aquele
          que os sistemas chamam de matriz. Ela não indica tamanho, faturamento
          nem qual endereço o cliente reconhece como sede: é só ordem de
          inscrição.
        </p>
        <ul>
          <li>
            A chave natural de um cadastro de empresas é o CNPJ completo, com as
            catorze posições. Usar a raiz como chave única faz a segunda filial
            colidir com a primeira.
          </li>
          <li>
            Agrupar estabelecimentos do mesmo grupo é recortar os oito primeiros
            caracteres. Isso continua funcionando com letras; o que deixa de
            funcionar é converter o número para inteiro antes de comparar.
          </li>
          <li>
            Dados que costumam ser por raiz (quadro societário, natureza
            jurídica) e por estabelecimento (endereço, inscrição estadual,
            situação cadastral, CNAE secundário) merecem tabelas separadas desde
            o começo.
          </li>
        </ul>
        <p>
          Para testar esse modelo, não basta uma lista de CNPJs aleatórios: eles
          vêm com raízes independentes e nenhum deles é filial de ninguém. Gere
          um CNPJ, guarde os oito primeiros caracteres e recalcule os dois
          dígitos com as ordens <code>0001</code>, <code>0002</code> e{" "}
          <code>0003</code> — o Validador desta página confirma cada resultado.
          Se o que você precisa é de uma ficha completa, com razão social e
          endereço, o{" "}
          <a href="/gerador-de-empresas">gerador de empresas</a> monta o conjunto
          inteiro.
        </p>
      </GuideSection>

      <div className="space-y-5">
        <SectionLabel>Anatomia do CNPJ</SectionLabel>
        <p className="text-center">
          <CnpjText
            value="12.ABC.345/01DE-35"
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

      <GuideSection title="O formato alfanumérico, em vigor desde julho de 2026">
        <p>
          Desde julho de 2026 as novas inscrições podem trazer letras de A a Z
          nas doze primeiras posições — a raiz e a ordem. Os dois dígitos
          verificadores continuam sempre numéricos, o que preserva a máscara{" "}
          <code>00.000.000/0000-00</code> e o tamanho dos campos. O motivo da
          mudança é aritmético: as combinações puramente numéricas da raiz estão
          se esgotando, e admitir trinta e seis símbolos por posição multiplica o
          espaço disponível sem alargar o número.
        </p>
        <p>
          O cálculo do dígito não foi reinventado. Cada caractere passa a entrar
          na conta pelo seu <strong>código ASCII menos 48</strong>: o caractere{" "}
          <code>0</code> vale 0, o <code>9</code> vale 9, o <code>A</code> vale
          17 e o <code>Z</code> vale 42. Para um CNPJ só de dígitos essa
          conversão devolve o próprio algarismo, então a mesma rotina atende aos
          dois formatos — não é preciso manter dois validadores. Os pesos e o
          módulo 11 seguem idênticos aos de antes.
        </p>
        <p>
          Um detalhe que passa despercebido em revisão de código: a conversão é
          sensível a maiúsculas. A letra <code>a</code> minúscula tem código 97 e
          produziria valor 49, não 17. Normalizar a entrada para maiúsculas antes
          de calcular ou comparar deixou de ser cosmético e virou requisito.
        </p>
        <p>
          O <a href="/guias/cnpj-alfanumerico-2026">guia do CNPJ alfanumérico</a>{" "}
          detalha o impacto em banco de dados e integrações, e o{" "}
          <a href="/guias/modulo-11-digito-verificador">
            guia de módulo 11
          </a>{" "}
          explica o algoritmo do dígito verificador na forma geral, válido também
          para CPF, PIS e RENAVAM.
        </p>
      </GuideSection>

      <div className="space-y-4">
        <SectionLabel>Formatos</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {FORMATS.map((format) => (
            <div key={format.name} className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{format.name}</h3>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {format.tag}
                </span>
                {format.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {format.badge}
                  </Badge>
                )}
              </div>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {format.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <SectionLabel>Regex (sem máscara)</SectionLabel>
        <CopyableCode value={NUMERIC_REGEX.source} label="Regex numérico" />
        <CopyableCode
          value={ALPHANUMERIC_REGEX.source}
          label="Regex alfanumérico"
        />
        <p className="text-sm text-muted-foreground">
          O segundo padrão aceita os dois formatos: doze posições em{" "}
          <code className="font-mono text-foreground">[0-9A-Z]</code> e dois
          dígitos de verificação. É ele que deve substituir o{" "}
          <code className="font-mono text-foreground">\d{"{14}"}</code> espalhado
          pelos validadores antigos.
        </p>
      </div>

      <AlgorithmSection
        intro={
          <>
            Raiz <code className="font-mono text-foreground">K7R2M9T4</code> com
            a ordem <code className="font-mono text-foreground">0001</code>. Base{" "}
            <code className="font-mono text-foreground">K7R2M9T40001</code> → DV{" "}
            <code className="font-mono text-foreground">06</code> → CNPJ
            formatado{" "}
            <code className="font-mono text-foreground">K7.R2M.9T4/0001-06</code>
          </>
        }
        steps={[
          "Converter cada caractere para o seu valor: código ASCII menos 48 (0 vale 0, A vale 17).",
          "Aplicar os pesos 2 a 9 da direita para a esquerda, reiniciando a cada oito posições.",
          "Somar os produtos e tirar o resto da divisão por 11. Resto menor que 2 gera dígito 0; caso contrário, o dígito é 11 menos o resto.",
          "Repetir a conta sobre a base acrescida do primeiro dígito para obter o segundo.",
        ]}
        worked={[
          {
            title: "Primeiro dígito verificador",
            steps: FIRST_DV_STEPS,
            sum: 880,
            remainder: 0,
            rule: "Resto menor que 2, então o dígito é 0 — não se faz 11 − 0.",
            result: "0",
            showValueColumn: true,
          },
          {
            title: "Segundo dígito verificador (base + primeiro DV)",
            steps: SECOND_DV_STEPS,
            sum: 797,
            remainder: 5,
            rule: "Resto maior ou igual a 2, então o dígito é 11 − 5.",
            result: "6",
            showValueColumn: true,
          },
        ]}
        note={
          <>
            Esta base cai nos dois ramos da regra do resto: o primeiro dígito vem
            de um resto 0 e sai 0, o segundo vem de um resto 5 e sai 11 − 5. Um
            validador que escreve{" "}
            <code className="font-mono text-foreground">11 − resto</code> sem
            testar o resto devolveria 11 no lugar do primeiro dígito. O exemplo
            oficial do Serpro, base{" "}
            <code className="font-mono text-foreground">12ABC34501DE</code> com
            DV <code className="font-mono text-foreground">35</code>, está
            resolvido linha a linha no{" "}
            <a
              href="/guias/cnpj-alfanumerico-2026"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              guia do CNPJ alfanumérico
            </a>
            .
          </>
        }
      />

      <CodeBlock
        language="TypeScript"
        caption="Uma rotina só para os dois formatos, porque ASCII − 48 devolve o próprio algarismo quando o caractere é um dígito. Falta ainda barrar 00.000.000/0000-00 — a única sequência de algarismos repetidos que fecha a conta do módulo 11 e que, por convenção, é recusada. Para os demais algarismos não há o que barrar: os pesos das doze posições somam 58, e o dígito que sai de 58d nunca é o próprio d."
        code={VALIDATION_CODE}
      />

      <GuideSection title="Erros comuns ao validar CNPJ">
        <ul>
          <li>
            <strong>Guardar o CNPJ em coluna numérica.</strong> Um{" "}
            <code>BIGINT</code> come os zeros à esquerda e, depois do formato
            alfanumérico, simplesmente recusa o valor. A coluna precisa ser texto
            de catorze posições, e a migração precisa ser testada com um CNPJ com
            letras antes de subir.
          </li>
          <li>
            <strong>
              Regex e máscaras que só aceitam dígitos.
            </strong>{" "}
            Padrões como <code>\d{"{14}"}</code> e máscaras de formulário
            presas a <code>0</code> rejeitam CNPJs válidos. O mesmo vale para
            campos de entrada que filtram tudo o que não é algarismo enquanto o
            usuário digita.
          </li>
          <li>
            <strong>Converter para inteiro antes de calcular o dígito.</strong>{" "}
            Validadores escritos com <code>parseInt</code> ou divisões sucessivas
            por 10 funcionam com o formato numérico e quebram com letras. A conta
            tem de percorrer os caracteres.
          </li>
          <li>
            <strong>Ordenação e faixas passam a ser alfabéticas.</strong> Em
            coluna de texto, <code>ORDER BY</code> coloca <code>1</code> antes de{" "}
            <code>A</code> e um <code>BETWEEN</code> deixa de recortar o
            intervalo que você imagina. Relatórios e paginações por cursor que
            dependiam da ordem numérica precisam ser revistos.
          </li>
          <li>
            <strong>Confundir válido com inscrito.</strong> O dígito verificador
            atesta apenas que o número é bem formado. Existência, situação
            cadastral e atividade só a consulta oficial da Receita responde —
            nenhum número gerado aqui aparece lá.
          </li>
        </ul>
        <p>
          Os mesmos tropeços aparecem em CPF, RG e CNH; o guia de{" "}
          <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
            erros comuns em validadores
          </a>{" "}
          traz o sintoma e o teste de reprodução de cada um, e o guia de{" "}
          <a href="/guias/regex-documentos-brasileiros">
            expressões regulares para documentos brasileiros
          </a>{" "}
          reúne os padrões já corrigidos.
        </p>
      </GuideSection>

      <GuideSection title="Quando usar este gerador (e quando não)">
        <p>
          Ele resolve um problema específico: produzir números bem formados, em
          volume, sem tocar em documento de empresa real. Os usos em que isso se
          encaixa:
        </p>
        <ul>
          <li>
            Popular seeds, fixtures e planilhas de homologação — até{" "}
            {MAX_BATCH_SIZE} por rodada, com ou sem máscara.
          </li>
          <li>
            Exercitar formulários, máscaras de entrada e mensagens de erro, tanto
            no caminho feliz quanto alterando um caractere para ver o validador
            recusar.
          </li>
          <li>
            Testar a adequação ao formato alfanumérico: migração de coluna,
            regex, ordenação e telas que exibem o número.
          </li>
          <li>
            Capturas de tela, documentação de API e demonstrações, no lugar do
            CNPJ de um cliente.
          </li>
        </ul>
        <p>E os casos em que ele não serve:</p>
        <ul>
          <li>
            Qualquer operação que consulte a Receita Federal — emissão de nota
            fiscal, abertura de conta, cadastro em serviço que faz verificação
            cadastral. O número passa no cálculo e falha na consulta, porque
            nunca foi inscrito.
          </li>
          <li>
            Descobrir o CNPJ de uma empresa existente. O gerador sorteia
            caracteres; ele não consulta base nenhuma.
          </li>
          <li>
            Preencher cadastro real para contornar uma validação. Isso está fora
            dos{" "}
            <a href="/termos#uso-permitido">termos de uso</a> e, dependendo do
            contexto, configura fraude.
          </li>
        </ul>
        <p>
          Trocar documento real por fictício em ambiente de teste também reduz
          exposição sob a LGPD, tema do guia sobre{" "}
          <a href="/guias/lgpd-dados-de-teste">dados de teste e LGPD</a>.
        </p>
      </GuideSection>

      <FaqSection items={CNPJ_FAQ} />

      <OfficialLinksSection references={REFERENCES} />
    </section>
  );
}
