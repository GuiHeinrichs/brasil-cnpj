import type { Metadata } from "next";

import {
  DocsWarning,
  FaqSection,
  GuideSection,
} from "@/components/doc-tool/reference";
import { SectionLabel } from "@/components/docs";
import { CodeBlock } from "@/components/guias/code-block";
import { JsonLd } from "@/components/json-ld";
import { NickGeneratorPanel } from "@/components/nick/panels";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { NICK_FAQ } from "@/lib/faq";
import { MAX_BATCH_SIZE } from "@/lib/nick";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de Nicks e usernames para testes de software";
const PAGE_DESCRIPTION =
  "Gere nicks e usernames fictícios em lote — limpo, com números, leet ou com underscore — para popular cadastros de homologação e exercitar as regras de validação do campo de username.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-nicks",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-nicks",
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
  name: "Gerador de Nicks",
  path: "/gerador-de-nicks",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de usernames em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Estilos limpo, com números, leet e underscore",
    "Cópia individual ou em lote",
  ],
});

/** Validação de username escrita do jeito que a seção de casos-limite defende. */
const USERNAME_VALIDATION_TS = `const PADRAO = /^[a-z][a-z0-9_]{2,29}$/;

// Rotas do app + contas de sistema. Mantenha perto do roteador.
const RESERVADOS = new Set([
  "admin", "root", "api", "www", "login", "conta",
  "suporte", "sobre", "ajuda", "null", "undefined",
]);

/** Forma canônica: é ela que vai para o índice único e para a comparação. */
export function normalizarUsername(entrada: string): string {
  return entrada.normalize("NFKC").trim().toLowerCase();
}

export function validarUsername(entrada: string): string | null {
  const valor = normalizarUsername(entrada);

  if (!PADRAO.test(valor)) {
    return "Use de 3 a 30 caracteres — letras, números e underscore, começando por letra.";
  }
  if (valor.includes("__") || valor.endsWith("_")) {
    return "Underscore não pode ser repetido nem encerrar o nome.";
  }
  if (RESERVADOS.has(valor)) {
    return "Este nome é reservado pelo sistema.";
  }
  return null; // null = aprovado; a unicidade ainda é decidida pelo banco
}`;

const STYLES = [
  {
    name: "Limpo",
    example: "DarkWolf",
    description:
      "Adjetivo e substantivo concatenados com iniciais maiúsculas, entre 6 e 14 caracteres, só letras ASCII. É o caminho feliz de praticamente qualquer regra de username.",
  },
  {
    name: "Com números",
    example: "DarkWolf42",
    description:
      "O nick limpo com um a quatro algarismos ao final. Serve para regras que exigem ao menos um dígito e para as que limitam quantos algarismos são aceitos.",
  },
  {
    name: "Leet",
    example: "D4rkW0lf",
    description:
      "Parte das letras a, e, i, o, s e t vira 4, 3, 1, 0, 5 e 7. Produz dígitos no meio da string, onde validações posicionais mal escritas costumam falhar.",
  },
  {
    name: "Underscore",
    example: "dark_wolf_07",
    description:
      "Tudo em minúsculas, dois underscores e dois algarismos finais. É o formato de slug técnico, o mesmo que APIs e sistemas internos costumam aceitar.",
  },
];

export default function GeradorDeNicks() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(NICK_FAQ)} />

      <SiteHeader
        active="nicks"
        badge="Identificador público · massa de teste"
        heading="Gerador de Nicks e usernames"
        lead={
          <>
            Combina adjetivo e substantivo em quatro estilos — limpo, com
            números, leet e com underscore — e devolve até {MAX_BATCH_SIZE} de
            uma vez, para popular cadastros de homologação e exercitar a
            validação do campo de nick.
          </>
        }
      />

      <div className="mt-8">
        <NickGeneratorPanel />
      </div>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Os usernames saem de combinações aleatórias de duas listas de
            palavras. A ferramenta não consulta plataforma nenhuma e não tem como
            saber se o nome está livre em algum lugar.
          </DocsWarning>

          <GuideSection title="Username é identificador, não nome de pessoa">
            <p>
              O campo de username cumpre um papel que o nome civil não cumpre:
              precisa ser único dentro do sistema, aparecer em URL, caber em um
              índice e sobreviver a comparação caractere a caractere. As
              restrições que o cercam são de identificador, não de antropônimo —
              e é isso que um teste precisa exercitar. Uma lista de nomes de
              pessoa não substitui: nomes repetem, têm acento, espaço e
              apóstrofo, e nenhum sistema os usa como chave de login.
            </p>
            <p>
              Ao contrário de CPF, CNH ou RG, um username não carrega{" "}
              <a href="/guias/modulo-11-digito-verificador">
                dígito verificador
              </a>{" "}
              nem estrutura interna: não existe conta que diga se ele é
              consistente. A única verificação possível é contra o banco de
              dados, o que empurra todo o peso para as regras de formato e para a
              restrição de unicidade.
            </p>

            <h3>O que este gerador devolve</h3>
            <p>
              Cada item combina um adjetivo e um substantivo de listas fixas em
              inglês: de 6 a 18 caracteres, apenas ASCII, sempre começando por
              letra. É massa de caminho feliz — boa para encher uma tabela até o
              limite de {MAX_BATCH_SIZE} por lote, ver a interface com nomes
              curtos e longos e confirmar que o índice único aguenta inserções em
              série. Os valores hostis (acento, emoji, espaço no fim,{" "}
              <code>admin</code>, string vazia) não saem daqui: eles vão na
              última seção e precisam ser escritos à mão.
            </p>
          </GuideSection>

          <div className="space-y-4">
            <SectionLabel>Os quatro estilos e o que cada um testa</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {STYLES.map((style) => (
                <div key={style.name} className="rounded-xl border bg-card p-4">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-semibold">{style.name}</h3>
                    <code className="font-mono text-[11px] text-muted-foreground">
                      {style.example}
                    </code>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {style.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              A opção <strong className="font-medium text-foreground">Aleatório</strong>{" "}
              mistura os quatro, que é o que se quer ao popular um banco: o lote
              sai com caixas, comprimentos e conjuntos de caracteres diferentes,
              em vez de cem variações do mesmo formato.
            </p>
          </div>

          <GuideSection title="Regras de username, plataforma por plataforma">
            <p>
              Não há padrão comum entre serviços: cada regra responde a uma
              decisão tomada antes, como o tamanho da coluna, o formato das
              rotas ou o nome virar parte de um endereço de e-mail. Quem integra
              dois sistemas acaba preso ao conjunto mais restrito dos dois.
            </p>

            <h3>Tamanho</h3>
            <p>
              Mínimos costumam ficar entre 2 e 5 caracteres, máximos entre 15 e
              30. Escolhido o intervalo, os testes que importam são quatro:
              mínimo menos um, mínimo, máximo e máximo mais um. Um detalhe
              silencioso mora na contagem — <code>&quot;a&quot;.length</code> em
              JavaScript conta unidades UTF-16, então um emoji fora do plano
              básico conta 2 e um nome que o usuário vê como curto pode estourar
              o limite. Se o campo aceita qualquer coisa além de ASCII, conte
              pontos de código, e lembre que a coluna do banco pode estar contando
              bytes.
            </p>

            <h3>Conjunto de caracteres e posição</h3>
            <p>
              O núcleo aceito quase em todo lugar é letra, dígito e underscore;
              ponto e hífen aparecem em parte dos serviços. Mais importante que a
              lista são as regras de posição, que quase sempre existem e quase
              sempre são esquecidas no regex: não começar por dígito (colide com
              rotas que já usam identificadores numéricos), não começar por
              underscore (por convenção o prefixo marca conta interna, e ele
              ordena antes de tudo em listagens), não terminar com ponto e não
              repetir separadores. O padrão <code>{"^[a-z][a-z0-9_]{2,29}$"}</code>{" "}
              cobre o início, mas não impede <code>dark__wolf</code> nem{" "}
              <code>dark_</code> — essas duas precisam de checagem separada.
            </p>

            <h3>Nomes reservados</h3>
            <p>
              Toda aplicação que serve perfis em <code>/:username</code> tem um
              conjunto de nomes que não pode entregar: <code>admin</code>,{" "}
              <code>root</code>, <code>api</code>, <code>www</code>,{" "}
              <code>login</code>, <code>suporte</code>, <code>null</code>,{" "}
              <code>undefined</code> e, principalmente, cada rota de primeiro
              nível do próprio app. Um usuário registrado como{" "}
              <code>configuracoes</code> pode tornar <code>/configuracoes</code>{" "}
              ambíguo ou inalcançável. Duas precauções resolvem a maior parte: a
              lista mora junto da definição das rotas, não em um arquivo
              esquecido, e a comparação acontece depois da normalização — senão{" "}
              <code>Admin</code> e <code>ADMIN</code> passam direto.
            </p>

            <h3>Unicode e homóglifos</h3>
            <p>
              Aceitar acento e alfabetos não latinos é razoável, mas obriga a
              normalizar antes de comparar. A forma <code>NFKC</code> resolve a
              camada mais óbvia: ligaduras viram letras separadas, dígitos de
              largura total viram dígitos comuns, variantes de compatibilidade
              colapsam. O que ela não faz é tratar{" "}
              <strong>homóglifos</strong> — caracteres distintos que o navegador
              desenha igual, como o <code>а</code> cirílico e o <code>a</code>{" "}
              latino. São dois pontos de código diferentes: passam por qualquer
              índice único e produzem dois perfis visualmente idênticos, que é o
              mecanismo clássico de personificação. Impedir isso exige guardar,
              além do nome, um esqueleto derivado de uma tabela de confusáveis e
              comparar o esqueleto no cadastro. Restringir a entrada a ASCII
              resolve na marra, e é o que a maioria dos serviços faz.
            </p>
          </GuideSection>

          <GuideSection title="Casos-limite que o cadastro precisa tratar">
            <ul>
              <li>
                <strong>Espaço que não parece espaço.</strong> Copiar e colar
                traz espaço no fim, espaço não separável e caracteres de largura
                zero. Corte antes de validar, e confirme que o corte alcança mais
                que <code>U+0020</code>.
              </li>
              <li>
                <strong>Unicidade sem distinção de caixa.</strong> Índice único
                sobre a coluna crua deixa <code>Dark_Wolf</code> e{" "}
                <code>dark_wolf</code> conviverem. Grave a forma normalizada em
                uma coluna própria e indexe essa — ou use um tipo/collation que
                ignore caixa — mantendo o valor digitado apenas para exibição.
              </li>
              <li>
                <strong>Corrida entre checar e gravar.</strong> O endpoint que
                responde{" "}
                <em>disponível</em> enquanto o usuário digita é conveniência de
                interface. Dois cadastros simultâneos passam pela checagem e
                chegam juntos ao <code>insert</code>: a unicidade tem de vir da
                restrição no banco, com a violação tratada e devolvida como erro
                de campo.
              </li>
              <li>
                <strong>Troca de nome.</strong> Se o username antigo volta ao
                pool no mesmo instante, links, menções e caches passam a apontar
                para outra pessoa. Decida entre reservar por um período, manter
                histórico com redirecionamento ou bloquear a liberação — e
                escreva o teste para a decisão tomada.
              </li>
              <li>
                <strong>Campo de login que aceita username ou e-mail.</strong> A
                regra costuma ser a presença de <code>@</code>, o que só funciona
                enquanto o username não puder contê-lo. Se a regra de formato
                mudar depois, o login quebra em silêncio.
              </li>
              <li>
                <strong>Exibição.</strong> Dezoito caracteres já bastam para
                estourar um card estreito ou uma coluna de tabela. Trunque na
                interface com o valor completo acessível, em vez de cortar no
                banco.
              </li>
              <li>
                <strong>Saída para HTML, URL e log.</strong> Username é entrada
                de usuário e termina em caminho, cabeçalho e linha de log.
                Escape na renderização, codifique no endereço e nunca concatene
                direto em consulta.
              </li>
            </ul>
            <CodeBlock
              language="TypeScript"
              caption="Normalizar primeiro, validar depois, e deixar a unicidade com o banco."
              code={USERNAME_VALIDATION_TS}
            />
            <p>
              Para montar o restante da massa — fichas completas, e-mails e
              documentos coerentes ao lado dos usernames — veja o{" "}
              <a href="/gerador-de-pessoas">gerador de pessoas</a> e o guia sobre{" "}
              <a href="/guias/massa-de-dados-de-teste-fixtures-seeds-faker">
                fixtures, seeds e factories
              </a>
              . Os padrões de validação dos demais campos estão em{" "}
              <a href="/guias/regex-documentos-brasileiros">
                regex para documentos brasileiros
              </a>
              , e o que fazer com dados pessoais fora de produção está em{" "}
              <a href="/guias/lgpd-dados-de-teste">LGPD e dados de teste</a>.
            </p>
          </GuideSection>

          <FaqSection items={NICK_FAQ} />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
