import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

const PAGE_TITLE = `Sobre o ${SITE_NAME}`;
const PAGE_DESCRIPTION = `O ${SITE_NAME} é uma ferramenta gratuita e de código aberto para gerar documentos e dados brasileiros fictícios em testes de software.`;

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
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
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

const docTools = TOOLS.filter((t) => t.category === "documentos");
const dataTools = TOOLS.filter((t) => t.category === "dados");
const vehicleTools = TOOLS.filter((t) => t.category === "veiculos");
const otherTools = TOOLS.filter((t) => t.category === "outros");

export default function Sobre() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <SiteHeader badge="Projeto & contato" heading={`Sobre o ${SITE_NAME}`} />

      <div className="mt-10 space-y-10">
        <Section title="O que é o bateCarimbo">
          <p>
            O <strong className="font-medium text-foreground">{SITE_NAME}</strong> é
            uma suíte gratuita de geradores de documentos e dados brasileiros
            fictícios para uso em testes de software. Com ele, desenvolvedores e
            equipes de QA conseguem criar números de CNPJ, CPF, CNH, RG, Título de
            Eleitor, PIS/PASEP, RENAVAM, placas veiculares, cartões de crédito e
            CEPs — todos matematicamente válidos, mas sem correspondência com
            registros reais.
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
            validadores sem pertencer a nenhuma pessoa ou empresa real. O resultado
            sai instantaneamente, sem cadastro, sem servidor e sem limite de uso.
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
            Todo o processamento acontece diretamente no navegador. Os documentos e
            dados que você gera{" "}
            <strong className="font-medium text-foreground">
              nunca são enviados a nenhum servidor
            </strong>
            . Ao fechar ou recarregar a página, tudo desaparece — nada é
            armazenado por nós.
          </p>
          <p>
            Não é necessário criar conta, fazer login nem fornecer qualquer dado
            pessoal. A ferramenta funciona completamente offline uma vez
            carregada.
          </p>
          <p>
            Os algoritmos seguem as especificações oficiais de cada documento:
            módulo 11 do CPF e CNPJ (incluindo o novo formato alfanumérico do
            SERPRO), algoritmo de Luhn para cartões, tabela de regiões fiscais do
            CPF, faixas de CEP dos Correios, regras do TSE para Título de Eleitor,
            entre outros.
          </p>
        </Section>

        <Section title="Ferramentas disponíveis">
          <div className="space-y-4">
            <div>
              <p className="mb-2 font-medium text-foreground">Documentos</p>
              <ul className="list-disc space-y-1.5 pl-5">
                {docTools.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={tool.href}
                      className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                    >
                      {tool.name}
                    </Link>
                    {" — "}
                    {tool.blurb}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium text-foreground">Pessoas & Empresas</p>
              <ul className="list-disc space-y-1.5 pl-5">
                {dataTools.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={tool.href}
                      className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                    >
                      {tool.name}
                    </Link>
                    {" — "}
                    {tool.blurb}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium text-foreground">Veículos</p>
              <ul className="list-disc space-y-1.5 pl-5">
                {vehicleTools.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={tool.href}
                      className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                    >
                      {tool.name}
                    </Link>
                    {" — "}
                    {tool.blurb}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium text-foreground">Outros</p>
              <ul className="list-disc space-y-1.5 pl-5">
                {otherTools.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={tool.href}
                      className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                    >
                      {tool.name}
                    </Link>
                    {" — "}
                    {tool.blurb}
                  </li>
                ))}
              </ul>
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
            <ExternalLink href="https://github.com/GuiHeinrichs/brasil-cnpj">
              github.com/GuiHeinrichs/brasil-cnpj
            </ExternalLink>
          </p>
          <p>
            A licença MIT permite uso, cópia, modificação e distribuição livres —
            inclusive para projetos comerciais — desde que o aviso de direitos
            autorais seja mantido.
          </p>
        </Section>

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
        </Section>

        <Section title="Contato">
          <p>
            Dúvidas, sugestões ou relatos de erro podem ser enviados para{" "}
            <Link
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              {CONTACT_EMAIL}
            </Link>
            {" "}ou abertos como{" "}
            <ExternalLink href="https://github.com/GuiHeinrichs/brasil-cnpj/issues">
              issue no GitHub
            </ExternalLink>
            .
          </p>
          <p>
            Para questões relacionadas à privacidade e à LGPD, consulte a nossa{" "}
            <Link
              href="/privacidade"
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </Section>
      </div>

      <SiteFooter />
    </div>
  );
}
