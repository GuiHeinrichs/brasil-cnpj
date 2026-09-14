import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_FAQ } from "@/lib/faq";
import {
  AUTHOR,
  CONTACT_EMAIL,
  GITHUB_ISSUES_URL,
  GITHUB_REPO_URL,
  SITE_NAME,
} from "@/lib/site";
import { faqJsonLd } from "@/lib/structured-data";
import { TOOLS, type Tool } from "@/lib/tools";

const PAGE_TITLE = `Sobre o ${SITE_NAME}`;
const PAGE_DESCRIPTION = `Quem mantém o ${SITE_NAME}, como os algoritmos e os guias são produzidos, o que cada ferramenta gera e como falar com a gente.`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/sobre",
  },
  openGraph: {
    type: "website",
    url: "/sobre",
    siteName: SITE_NAME,
    locale: "pt_BR",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="text-lg font-medium tracking-tight">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground underline underline-offset-4 hover:text-foreground/80"
    >
      {children}
    </a>
  );
}

function InternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-foreground underline underline-offset-4 hover:text-foreground/80"
    >
      {children}
    </Link>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

const docTools = TOOLS.filter((t) => t.category === "documentos");
const dataTools = TOOLS.filter((t) => t.category === "dados");
const vehicleTools = TOOLS.filter((t) => t.category === "veiculos");
const otherTools = TOOLS.filter((t) => t.category === "outros");

function ToolList({ tools }: { tools: Tool[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {tools.map((tool) => (
        <li key={tool.id}>
          <InternalLink href={tool.href}>{tool.name}</InternalLink>
          {" — "}
          {tool.blurb}
        </li>
      ))}
    </ul>
  );
}

export default function Sobre() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={faqJsonLd(SITE_FAQ)} />

      <SiteHeader badge="Projeto & contato" heading={`Sobre o ${SITE_NAME}`} />

      <div className="mt-10 space-y-10">
        <Section title="O que é o bateCarimbo">
          <p>
            O <strong className="font-medium text-foreground">{SITE_NAME}</strong> é
            uma suíte gratuita de geradores de documentos e dados brasileiros
            fictícios para uso em testes de software. Com ele, desenvolvedores e
            equipes de QA conseguem criar números de CNPJ, CPF, CNH, RG, Título de
            Eleitor, PIS/PASEP e RENAVAM com os dígitos verificadores corretos,
            além de placas veiculares e CEPs no formato e na faixa certos — esses
            dois não têm dígito verificador, então o que há para conferir neles é
            o padrão. Nenhum corresponde a registro real.
          </p>
          <p>
            A ferramenta também gera fichas completas de pessoas e empresas
            fictícias, com dados coerentes por estado: CPF com o 9º dígito da
            região fiscal correta, CEP dentro da faixa oficial, cidade e DDD
            compatíveis com a UF escolhida.
          </p>
        </Section>

        <Section title="Por que o bateCarimbo existe">
          <p>
            Quem desenvolve sistemas brasileiros frequentemente precisa popular
            bancos de dados de teste, preencher formulários em ambiente de
            homologação ou validar máscaras e regras de dígito verificador. Usar
            documentos reais para isso é um risco de privacidade e, em muitos
            contextos, viola a LGPD. Inventar números arbitrários não funciona
            porque os sistemas rejeitam documentos com dígitos verificadores
            incorretos.
          </p>
          <p>
            O {SITE_NAME} resolve esse problema: gera números que passam em
            validadores sem pertencer a nenhuma pessoa ou empresa real. O
            resultado sai instantaneamente, sem cadastro e sem limite de uso.
          </p>
        </Section>

        <Section title="Para quem é">
          <p>
            A ferramenta foi criada para profissionais de tecnologia que trabalham
            com sistemas brasileiros:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="font-medium text-foreground">
                Desenvolvedores de software
              </strong>{" "}
              que precisam de dados fictícios para seeds, fixtures e ambientes de
              desenvolvimento.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Engenheiros de QA e testadores
              </strong>{" "}
              que precisam preencher formulários em pipelines de testes
              automatizados ou testes manuais de homologação.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Designers e UX researchers
              </strong>{" "}
              que precisam de dados realistas para protótipos e mockups, sem
              expor informações de pessoas reais.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Estudantes e instrutores
              </strong>{" "}
              que ensinam ou aprendem sobre sistemas que lidam com documentos
              brasileiros.
            </li>
          </ul>
        </Section>

        <Section title="Como funciona">
          <p>
            Todo o processamento acontece no seu navegador, em JavaScript. Os
            documentos e dados que você gera, valida ou cola nas ferramentas{" "}
            <strong className="font-medium text-foreground">
              não são enviados a nenhum servidor
            </strong>{" "}
            e não ficam salvos depois que a página é fechada. Não há cadastro,
            login nem histórico de uso.
          </p>
          <p>
            As páginas são estáticas e servidas por CDN, então carregam rápido e
            continuam funcionando em conexões instáveis — mas não há service
            worker instalado, ou seja, uma aba nova não abre sem rede. O que é
            local é o cálculo, não a distribuição do site.
          </p>
          <p>
            Cada gerador implementa a regra do documento que ele produz:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="font-medium text-foreground">
                Módulo 11 do CPF e do CNPJ
              </strong>
              , incluindo o formato alfanumérico em vigor desde julho de 2026, em
              que cada caractere entra na conta pelo código ASCII menos 48.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Módulo 11 com pesos próprios
              </strong>{" "}
              para RG no padrão SSP-SP, CNH, PIS/PASEP e Título de Eleitor — cada
              um com sua ordem de pesos e seu tratamento de resto 10.
            </li>
            <li>
              <strong className="font-medium text-foreground">RENAVAM</strong>,
              que multiplica a soma ponderada por 10 antes de tirar o resto.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Tabelas de referência
              </strong>{" "}
              sem dígito verificador: regiões fiscais do CPF, códigos de UF do
              título de eleitor, faixas de CEP por estado e a conversão de placa
              antiga para o padrão Mercosul.
            </li>
          </ul>
          <p>
            O detalhamento de cada conta, com tabela de dígito × peso resolvida,
            fica nas páginas das ferramentas e nos{" "}
            <InternalLink href="/guias">guias</InternalLink>.
          </p>
        </Section>

        <Section id="autor" title="Quem mantém o bateCarimbo">
          <div className="flex gap-4 rounded-2xl border bg-card p-5">
            <span
              aria-hidden
              className="flex size-11 shrink-0 items-center justify-center rounded-full border bg-muted font-mono text-sm font-medium text-muted-foreground"
            >
              {initials(AUTHOR.name)}
            </span>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-foreground">
                {AUTHOR.name}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {AUTHOR.role} · {AUTHOR.location}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {AUTHOR.bio}
              </p>
            </div>
          </div>
          <p>
            É um projeto individual: a implementação dos algoritmos, o critério
            editorial, a escolha das fontes e as respostas ao e-mail de contato
            são meus. Os textos das ferramentas e dos guias são redigidos com
            apoio de ferramentas de geração de texto e revisados por mim antes
            de publicar — as contas, os exemplos e cada afirmação sobre norma
            são conferidos contra a fonte oficial e contra o próprio código. O
            repositório está em{" "}
            <ExternalLink href={AUTHOR.github}>
              github.com/GuiHeinrichs
            </ExternalLink>
            , onde o histórico de commits mostra cada alteração descrita aqui.
          </p>
        </Section>

        <Section id="editorial" title="Como o conteúdo é produzido">
          <p>
            Os algoritmos não são deduzidos de código encontrado por aí: cada um
            vem da especificação publicada pelo órgão responsável — o manual de
            cálculo do DV do CNPJ, da Receita Federal e do SERPRO, é o exemplo
            mais direto. Quando duas implementações populares divergem, como no
            resto 10 da CNH ou na exceção de São Paulo e Minas Gerais no título
            de eleitor, a divergência é descrita no texto em vez de escondida, e
            o gerador evita emitir os números ambíguos.
          </p>
          <p>
            Todo guia termina com a seção Fontes e referências listando os
            documentos consultados, com link direto. Afirmação sobre norma, prazo
            ou tabela oficial que não tenha fonte citada não entra no texto; nos
            casos em que a informação circula sem respaldo público, o guia diz
            que a regra varia e explica por quê.
          </p>
          <p>
            Cada artigo exibe a data de publicação e a da última revisão. Elas
            são diferentes quando o texto foi corrigido ou atualizado depois de
            publicado — a data de revisão só muda quando o conteúdo muda, não a
            cada deploy.
          </p>
          <p>
            Os textos são redigidos com apoio de ferramentas de geração de texto
            e passam por revisão humana antes de ir ao ar. Isso não dispensa
            verificação: toda conta publicada é refeita, todo exemplo numérico é
            validado contra a implementação que roda no site e toda afirmação
            sobre norma precisa de fonte com link. Quando um dado não pôde ser
            confirmado em fonte oficial, o texto diz que a regra varia em vez de
            arriscar um número. Se ainda assim escapar um erro, ele é corrigido e
            a data de revisão do artigo acompanha.
          </p>
          <p>
            Encontrou um erro de conta, um link quebrado ou uma explicação
            desatualizada? Mande para{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            ou abra uma{" "}
            <ExternalLink href={GITHUB_ISSUES_URL}>
              issue no GitHub
            </ExternalLink>
            , de preferência com o endereço da página e o trecho. A correção
            entra na próxima revisão e a data de atualização do artigo acompanha.
          </p>
        </Section>

        <Section title="Ferramentas disponíveis">
          <div className="space-y-4">
            <div>
              <p className="mb-2 font-medium text-foreground">Documentos</p>
              <ToolList tools={docTools} />
            </div>
            <div>
              <p className="mb-2 font-medium text-foreground">
                Pessoas &amp; Empresas
              </p>
              <ToolList tools={dataTools} />
            </div>
            <div>
              <p className="mb-2 font-medium text-foreground">Veículos</p>
              <ToolList tools={vehicleTools} />
            </div>
            <div>
              <p className="mb-2 font-medium text-foreground">Outros</p>
              <ToolList tools={otherTools} />
            </div>
          </div>
        </Section>

        <Section title="Código aberto">
          <p>
            O {SITE_NAME} é um projeto de código aberto licenciado sob a{" "}
            <strong className="font-medium text-foreground">Licença MIT</strong>.
            Você pode inspecionar o código, reportar problemas, sugerir melhorias
            ou contribuir diretamente no repositório do GitHub:
          </p>
          <p>
            <ExternalLink href={GITHUB_REPO_URL}>
              github.com/GuiHeinrichs/brasil-cnpj
            </ExternalLink>
          </p>
          <p>
            A licença MIT permite uso, cópia, modificação e distribuição livres —
            inclusive para projetos comerciais — desde que o aviso de direitos
            autorais seja mantido.
          </p>
        </Section>

        <section id="faq" className="scroll-mt-24 space-y-4">
          <h2 className="text-lg font-medium tracking-tight">
            Perguntas frequentes
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            O que vale para todas as ferramentas. Dúvidas específicas de cada
            documento ficam na página do gerador correspondente.
          </p>
          <div className="grid gap-3">
            {SITE_FAQ.map((item) => (
              <div key={item.question} className="rounded-xl border bg-card p-4">
                <h3 className="text-sm font-semibold">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Section title="Aviso de uso">
          <p>
            Os documentos e dados gerados pelo {SITE_NAME} são{" "}
            <strong className="font-medium text-foreground">
              estritamente fictícios
            </strong>{" "}
            e destinados apenas a ambientes de teste e desenvolvimento de
            software. Não devem ser utilizados em sistemas em produção, para
            preenchimento de formulários fiscais, para identificação perante
            órgãos públicos ou para qualquer finalidade que exija documentos
            reais. O uso indevido é de responsabilidade exclusiva do usuário.
          </p>
          <p>
            O {SITE_NAME} é um projeto independente, sem qualquer vínculo,
            convênio, patrocínio ou autorização da Receita Federal, do SERPRO, do
            SENATRAN, do TSE, dos Correios, do INSS, da Caixa Econômica Federal
            ou de qualquer outro órgão público. As especificações dos documentos
            são públicas e estão citadas nos guias; a implementação e os textos
            deste site não são oficiais nem representam posição desses órgãos.
          </p>
          <p>
            Esta página não consulta nem conecta a ferramenta a nenhum cadastro
            governamental. Nada do que é gerado aqui existe em base oficial
            alguma.
          </p>
        </Section>

        <Section title="Contato">
          <p>
            Dúvidas, sugestões, relatos de erro e pedidos relacionados à LGPD têm
            uma página só deles, com os canais e o que incluir em cada caso:{" "}
            <InternalLink href="/contato">falar com o {SITE_NAME}</InternalLink>.
          </p>
          <p>
            Se preferir ir direto, escreva para{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            ou abra uma{" "}
            <ExternalLink href={GITHUB_ISSUES_URL}>
              issue no GitHub
            </ExternalLink>
            .
          </p>
          <p>
            O tratamento de dados no site, os cookies usados e os seus direitos
            estão descritos na{" "}
            <InternalLink href="/privacidade">
              Política de Privacidade
            </InternalLink>
            .
          </p>
        </Section>
      </div>

      <SiteFooter />
    </div>
  );
}
