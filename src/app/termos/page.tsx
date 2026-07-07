import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_TITLE = "Termos de Uso";
const PAGE_DESCRIPTION = `Termos e condições de uso do ${SITE_NAME}: finalidade exclusiva para testes de software, responsabilidades e limitações.`;
const LAST_UPDATED = "24 de junho de 2026";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/termos",
  },
  openGraph: {
    type: "website",
    url: "/termos",
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

export default function Termos() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <SiteHeader badge="Termos & condições" heading="Termos de Uso" />

      <p className="mt-4 font-mono text-xs text-muted-foreground">
        Última atualização: {LAST_UPDATED}
      </p>

      <div className="mt-10 space-y-10">
        <Section title="1. Aceitação dos termos">
          <p>
            Ao acessar ou utilizar o{" "}
            <strong className="font-medium text-foreground">{SITE_NAME}</strong>{" "}
            (disponível em{" "}
            <a
              href={SITE_URL}
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              {SITE_URL.replace("https://", "")}
            </a>
            ), você concorda com estes Termos de Uso. Se não concordar com
            qualquer disposição, não utilize a ferramenta.
          </p>
        </Section>

        <Section title="2. Descrição do serviço">
          <p>
            O {SITE_NAME} é uma ferramenta gratuita que gera documentos e dados
            brasileiros fictícios — incluindo CNPJ, CPF, CNH, RG, Título de
            Eleitor, PIS/PASEP, RENAVAM, placa veicular, CEP e fichas completas
            de pessoas e empresas —{" "}
            <strong className="font-medium text-foreground">
              exclusivamente para uso em testes de software
            </strong>
            .
          </p>
          <p>
            Todo o processamento ocorre no navegador do usuário. Nenhum dado
            gerado é enviado a servidores ou armazenado por nós.
          </p>
        </Section>

        <Section title="3. Finalidade permitida">
          <p>
            O uso do {SITE_NAME} é permitido para:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Testes de software, validação de formulários e pipelines de
              integração contínua em ambientes de desenvolvimento ou
              homologação.
            </li>
            <li>
              Populamento de bancos de dados de teste (seeds, fixtures e
              fábricas de dados).
            </li>
            <li>
              Criação de protótipos, mockups e demonstrações que necessitem de
              dados fictícios realistas.
            </li>
            <li>
              Fins educacionais: aprendizado de algoritmos de validação de
              documentos brasileiros.
            </li>
          </ul>
        </Section>

        <Section title="4. Usos proibidos">
          <p>
            É{" "}
            <strong className="font-medium text-foreground">
              expressamente proibido
            </strong>{" "}
            utilizar os dados gerados pelo {SITE_NAME} para:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Fraude, falsificação de documentos, estelionato ou qualquer
              atividade ilícita.
            </li>
            <li>
              Identificação perante órgãos públicos, instituições financeiras
              ou qualquer entidade que exija documentos reais.
            </li>
            <li>
              Cadastros em sistemas de produção, plataformas comerciais ou
              serviços que tratem dados como reais.
            </li>
            <li>
              Evasão fiscal, sonegação ou qualquer infração tributária.
            </li>
            <li>
              Geração massiva automatizada com objetivo de prejudicar terceiros
              ou sistemas.
            </li>
          </ul>
          <p>
            O descumprimento pode configurar crimes previstos no Código Penal
            (falsidade ideológica, estelionato) e em legislações específicas. O
            uso indevido é de inteira responsabilidade do usuário.
          </p>
        </Section>

        <Section title="5. Ausência de garantias">
          <p>
            O {SITE_NAME} é fornecido{" "}
            <strong className="font-medium text-foreground">"no estado em que se encontra"</strong>{" "}
            (as-is), sem garantias expressas ou implícitas de qualquer natureza,
            incluindo adequação a uma finalidade específica, precisão ou
            disponibilidade contínua.
          </p>
          <p>
            Os documentos gerados seguem os algoritmos oficiais publicados pelos
            órgãos competentes (Receita Federal, SERPRO, DENATRAN, TSE, etc.),
            mas a conformidade com futuras alterações normativas não é
            garantida.
          </p>
        </Section>

        <Section title="6. Limitação de responsabilidade">
          <p>
            Os mantenedores do {SITE_NAME} não se responsabilizam por danos
            diretos, indiretos, incidentais ou consequenciais decorrentes do uso
            ou da impossibilidade de uso da ferramenta, incluindo, sem
            limitação, danos decorrentes do uso indevido dos dados gerados.
          </p>
        </Section>

        <Section title="7. Propriedade intelectual e código aberto">
          <p>
            O código-fonte do {SITE_NAME} é disponibilizado sob a{" "}
            <strong className="font-medium text-foreground">Licença MIT</strong>
            , que permite uso, cópia, modificação e distribuição, inclusive para
            fins comerciais, desde que o aviso de copyright original seja
            mantido. O repositório está disponível em{" "}
            <a
              href="https://github.com/GuiHeinrichs/brasil-cnpj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              github.com/GuiHeinrichs/brasil-cnpj
            </a>
            .
          </p>
        </Section>

        <Section title="8. Privacidade e cookies">
          <p>
            O tratamento de dados pessoais e o uso de cookies são descritos na{" "}
            <Link
              href="/privacidade"
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              Política de Privacidade
            </Link>
            , que faz parte integrante destes Termos.
          </p>
        </Section>

        <Section title="9. Alterações nos termos">
          <p>
            Estes Termos podem ser atualizados a qualquer momento. A data da
            última revisão é indicada no topo desta página. O uso continuado
            após alterações implica aceite das novas condições.
          </p>
        </Section>

        <Section title="10. Lei aplicável">
          <p>
            Estes Termos são regidos pela legislação brasileira. Eventuais
            disputas serão submetidas ao foro da comarca de Porto Alegre — RS,
            com renúncia a qualquer outro, por mais privilegiado que seja.
          </p>
        </Section>

        <Section title="11. Contato">
          <p>
            Dúvidas sobre estes Termos podem ser enviadas para{" "}
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
