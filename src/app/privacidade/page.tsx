import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_TITLE = "Política de Privacidade";
const PAGE_DESCRIPTION = `Como o ${SITE_NAME} trata dados, cookies e publicidade (Google AdSense), em conformidade com a LGPD.`;
const LAST_UPDATED = "14 de junho de 2026";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/privacidade",
  },
  openGraph: {
    type: "website",
    url: "/privacidade",
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

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
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

export default function PoliticaDePrivacidade() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <SiteHeader
        badge="LGPD & cookies"
        heading="Política de Privacidade"
      />

      <p className="mt-4 font-mono text-xs text-muted-foreground">
        Última atualização: {LAST_UPDATED}
      </p>

      <div className="mt-10 space-y-10">
        <Section title="1. Quem somos">
          <p>
            O {SITE_NAME} ({" "}
            <ExternalLink href={SITE_URL}>{SITE_URL.replace("https://", "")}</ExternalLink>
            ) é uma ferramenta gratuita que gera documentos e dados brasileiros
            fictícios (CNPJ, CPF, pessoas, empresas, entre outros) para uso em
            testes de software. Esta política explica como tratamos dados ao usar
            o site.
          </p>
        </Section>

        <Section title="2. Que dados coletamos">
          <p>
            <strong className="font-medium text-foreground">
              Não exigimos cadastro e não coletamos dados pessoais que
              identifiquem você.
            </strong>{" "}
            Os documentos e fichas que você gera são{" "}
            <strong className="font-medium text-foreground">
              criados no seu próprio navegador
            </strong>
            , de forma aleatória e fictícia — não são enviados aos nossos
            servidores nem armazenados por nós. Ao fechar ou recarregar a página,
            os dados gerados desaparecem.
          </p>
          <p>
            Coletamos apenas informações técnicas padrão geradas automaticamente
            ao acessar qualquer site (como endereço IP e tipo de navegador),
            usadas por nossos provedores de hospedagem e publicidade para
            funcionamento e segurança.
          </p>
        </Section>

        <Section title="3. Cookies">
          <p>
            Cookies são pequenos arquivos guardados no seu dispositivo. O{" "}
            {SITE_NAME} usa apenas o necessário para lembrar preferências (como o
            tema claro/escuro) e para a exibição de anúncios descrita abaixo. Você
            pode bloquear ou apagar cookies nas configurações do seu navegador, o
            que pode afetar partes da experiência.
          </p>
        </Section>

        <Section title="4. Publicidade (Google AdSense)">
          <p>
            Exibimos anúncios por meio do{" "}
            <ExternalLink href="https://adsense.google.com">
              Google AdSense
            </ExternalLink>
            . Para isso:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              O Google, como fornecedor terceirizado, utiliza cookies para
              veicular anúncios com base em visitas anteriores a este e a outros
              sites.
            </li>
            <li>
              O uso de cookies de publicidade permite ao Google e a seus parceiros
              exibir anúncios mais relevantes para você.
            </li>
            <li>
              Você pode desativar a publicidade personalizada nas{" "}
              <ExternalLink href="https://www.google.com/settings/ads">
                Configurações de anúncios do Google
              </ExternalLink>{" "}
              ou gerenciar cookies de terceiros em{" "}
              <ExternalLink href="https://www.aboutads.info">
                aboutads.info
              </ExternalLink>
              .
            </li>
            <li>
              Saiba mais sobre como o Google usa dados na{" "}
              <ExternalLink href="https://policies.google.com/technologies/ads">
                política de publicidade do Google
              </ExternalLink>
              .
            </li>
          </ul>
          <p>
            Visitantes do Espaço Econômico Europeu, do Reino Unido e da Suíça
            recebem um aviso de consentimento antes da exibição de anúncios
            personalizados, conforme exigido pela legislação local.
          </p>
        </Section>

        <Section title="5. Compartilhamento de dados">
          <p>
            Não vendemos seus dados. As informações técnicas mencionadas são
            processadas por nossos fornecedores de infraestrutura e publicidade —
            principalmente a{" "}
            <ExternalLink href="https://vercel.com">Vercel</ExternalLink>{" "}
            (hospedagem) e o Google (anúncios) — apenas para operar o serviço.
          </p>
        </Section>

        <Section title="6. Seus direitos (LGPD)">
          <p>
            De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018),
            você pode solicitar acesso, correção, anonimização, portabilidade ou
            exclusão dos seus dados, além de revogar consentimentos. Como não
            mantemos cadastro de usuários, esses pedidos se limitam aos dados
            técnicos eventualmente tratados por nossos fornecedores.
          </p>
        </Section>

        <Section title="7. Alterações nesta política">
          <p>
            Podemos atualizar esta política periodicamente. A data da última
            revisão está indicada no topo desta página. O uso contínuo do site
            após mudanças implica concordância com a versão vigente.
          </p>
        </Section>

        <Section title="8. Contato">
          <p>
            Dúvidas sobre privacidade ou exercício de direitos podem ser enviadas
            para{" "}
            <Link
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              {CONTACT_EMAIL}
            </Link>
            .
          </p>
        </Section>
      </div>

      <SiteFooter />
    </div>
  );
}
