import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AUTHOR, CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_TITLE = "Política de Privacidade";
const PAGE_DESCRIPTION = `Como o ${SITE_NAME} trata dados, cookies e publicidade (Google AdSense), em conformidade com a LGPD.`;
const LAST_UPDATED = "14 de setembro de 2026";

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
        <Section title="1. Quem somos e quem é o controlador">
          <p>
            O {SITE_NAME} ({" "}
            <ExternalLink href={SITE_URL}>{SITE_URL.replace("https://", "")}</ExternalLink>
            ) é uma ferramenta gratuita que gera documentos e dados brasileiros
            fictícios (CNPJ, CPF, pessoas, empresas, entre outros) para uso em
            testes de software. Esta política explica como tratamos dados ao usar
            o site.
          </p>
          <p>
            O controlador dos dados, nos termos da Lei Geral de Proteção de
            Dados, é{" "}
            <strong className="font-medium text-foreground">
              {AUTHOR.name}
            </strong>
            , pessoa física responsável pelo site ({AUTHOR.location}). Por se
            tratar de um projeto individual, as atribuições de encarregado pelo
            tratamento de dados pessoais são exercidas pelo próprio controlador,
            que atende pelo e-mail{" "}
            <Link
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              {CONTACT_EMAIL}
            </Link>
            .
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

        <Section title="3. Bases legais e retenção">
          <p>
            Cada tipo de dado tem uma base legal distinta:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="font-medium text-foreground">
                Registros técnicos de acesso
              </strong>{" "}
              (endereço IP, identificação do navegador, página solicitada,
              horário) são tratados com base no{" "}
              <strong className="font-medium text-foreground">
                legítimo interesse
              </strong>
              , para manter o site no ar, conter abuso e acompanhar estatísticas
              agregadas de audiência. Esses registros são gerados e mantidos
              pelos provedores de infraestrutura descritos adiante; não montamos
              uma base própria de visitantes.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Cookies de publicidade
              </strong>{" "}
              e a eventual personalização de anúncios dependem do seu{" "}
              <strong className="font-medium text-foreground">
                consentimento
              </strong>
              , que pode ser recusado ou revogado a qualquer momento nas
              configurações do navegador e nas preferências de anúncios do
              Google.
            </li>
          </ul>
          <p>
            Não tratamos dados pessoais sensíveis (origem racial ou étnica,
            convicção religiosa, opinião política, saúde, vida sexual, dado
            genético ou biométrico) nem dados de crianças e adolescentes: o site
            não tem cadastro, formulário de perfil ou área logada. Os dados
            técnicos são conservados apenas pelo tempo necessário às finalidades
            acima, segundo as políticas de retenção dos provedores citados na
            seção 6, e depois descartados ou anonimizados por eles.
          </p>
        </Section>

        <Section title="4. Cookies e armazenamento local">
          <p>
            O {SITE_NAME} não grava cookies próprios. O que o site guarda no seu
            dispositivo fica no{" "}
            <strong className="font-medium text-foreground">
              armazenamento local do navegador
            </strong>{" "}
            (<code className="font-mono text-xs">localStorage</code>), em duas
            chaves: a preferência de tema (claro, escuro ou o padrão do sistema)
            e o registro de que você já fechou o aviso de cookies, para que ele
            não reapareça a cada visita. Nenhuma das duas é enviada a servidor —
            elas existem só para a interface não esquecer o que você escolheu.
          </p>
          <p>
            Cookies de terceiros, esses sim, são criados pelo Google AdSense no
            momento em que os anúncios carregam, conforme a seção seguinte.
            Apagar os dados do site no navegador remove tanto as duas chaves
            quanto os cookies de anúncio: o tema volta ao padrão e o aviso de
            cookies reaparece.
          </p>
        </Section>

        <Section title="5. Publicidade (Google AdSense)">
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
            O site é voltado ao público brasileiro e não opera uma plataforma
            própria de gerenciamento de consentimento para outras jurisdições.
            Para visitantes do Espaço Econômico Europeu, do Reino Unido e da
            Suíça, isso significa que anúncios personalizados podem não ser
            exibidos — o Google restringe a veiculação nessas regiões quando não
            há consentimento coletado no padrão exigido pela legislação local.
          </p>
        </Section>

        <Section title="6. Compartilhamento de dados">
          <p>
            Não vendemos seus dados. As informações técnicas mencionadas são
            processadas por nossos fornecedores de infraestrutura e publicidade —
            principalmente a{" "}
            <ExternalLink href="https://vercel.com">Vercel</ExternalLink>{" "}
            (hospedagem) e o Google (anúncios) — apenas para operar o serviço.
          </p>
        </Section>

        <Section title="7. Transferência internacional">
          <p>
            Os provedores de hospedagem e de publicidade operam infraestrutura
            distribuída em vários países. Os registros técnicos de acesso e os
            dados usados para veicular anúncios podem, portanto, ser processados
            e armazenados fora do Brasil, inclusive nos Estados Unidos.
          </p>
          <p>
            Essas transferências se apoiam nas hipóteses e garantias que a Lei
            Geral de Proteção de Dados prevê para transferência internacional,
            entre elas os compromissos contratuais firmados com esses
            fornecedores. Os termos aplicáveis constam da{" "}
            <ExternalLink href="https://policies.google.com/technologies/ads">
              política de publicidade do Google
            </ExternalLink>{" "}
            e da documentação da{" "}
            <ExternalLink href="https://vercel.com">Vercel</ExternalLink>.
          </p>
        </Section>

        <Section title="8. Seus direitos como titular (LGPD)">
          <p>
            A{" "}
            <ExternalLink href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm">
              Lei Geral de Proteção de Dados
            </ExternalLink>{" "}
            assegura a você, a qualquer momento e sem custo:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="font-medium text-foreground">
                Confirmação e acesso
              </strong>{" "}
              — saber se há tratamento de dados seus e obter cópia deles.
            </li>
            <li>
              <strong className="font-medium text-foreground">Correção</strong>{" "}
              — pedir a atualização de dados incompletos, inexatos ou
              desatualizados.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Anonimização, bloqueio ou eliminação
              </strong>{" "}
              — de dados desnecessários, excessivos ou tratados em desacordo com
              a lei.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Portabilidade
              </strong>{" "}
              — transferência a outro fornecedor, observados os segredos
              comercial e industrial.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Informação sobre compartilhamento
              </strong>{" "}
              — saber com quais entidades públicas e privadas os dados foram
              compartilhados.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Revogação do consentimento
              </strong>{" "}
              — retirar a autorização dada aos cookies de publicidade, sem afetar
              a licitude do tratamento anterior.
            </li>
            <li>
              <strong className="font-medium text-foreground">Oposição</strong>{" "}
              — contestar tratamento feito com base em hipótese que dispense o
              consentimento, como o legítimo interesse descrito na seção 3.
            </li>
          </ul>
          <p>
            Como não mantemos cadastro de usuários, na prática esses pedidos
            recaem sobre os registros técnicos tratados pelos fornecedores
            listados na seção 6 — quando o dado estiver sob controle deles,
            encaminhamos o pedido e informamos o canal correspondente. Se a
            resposta não resolver, você pode peticionar à{" "}
            <ExternalLink href="https://www.gov.br/anpd/pt-br">
              Autoridade Nacional de Proteção de Dados (ANPD)
            </ExternalLink>
            .
          </p>
        </Section>

        <Section title="9. Alterações nesta política">
          <p>
            Podemos atualizar esta política periodicamente. A data da última
            revisão está indicada no topo desta página. O uso contínuo do site
            após mudanças implica concordância com a versão vigente.
          </p>
        </Section>

        <Section title="10. Contato">
          <p>
            Dúvidas sobre privacidade ou exercício de direitos podem ser enviadas
            para{" "}
            <Link
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              {CONTACT_EMAIL}
            </Link>
            . Para identificar o pedido, descreva qual direito da seção 8 você
            quer exercer. Os demais canais estão reunidos na página de{" "}
            <Link
              href="/contato"
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              contato
            </Link>
            .
          </p>
        </Section>
      </div>

      <SiteFooter />
    </div>
  );
}
