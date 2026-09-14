import type { Metadata } from "next";
import { BugIcon, CodeXmlIcon, MailIcon, ShieldIcon } from "lucide-react";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  AUTHOR,
  CONTACT_EMAIL,
  GITHUB_ISSUES_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

const PAGE_TITLE = "Contato";
const PAGE_DESCRIPTION = `Fale com quem mantém o ${SITE_NAME}: dúvidas sobre as ferramentas, erro em um gerador, pedidos de LGPD, sugestões de conteúdo e parcerias.`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/contato" },
  openGraph: {
    type: "website",
    url: "/contato",
    siteName: SITE_NAME,
    locale: "pt_BR",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contato — ${SITE_NAME}`,
  description: PAGE_DESCRIPTION,
  url: `${SITE_URL}/contato`,
  inLanguage: "pt-BR",
};

const CHANNELS = [
  {
    icon: MailIcon,
    title: "Dúvidas, sugestões e correções de conteúdo",
    body: (
      <>
        Escreva para{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-foreground underline underline-offset-4 hover:text-foreground/80"
        >
          {CONTACT_EMAIL}
        </a>
        . Respondo em até cinco dias úteis. Se encontrou um erro em algum guia ou
        numa explicação de algoritmo, mande o endereço da página e o trecho — a
        correção entra na próxima revisão e a data de atualização do artigo muda.
      </>
    ),
  },
  {
    icon: BugIcon,
    title: "Erro em um gerador ou validador",
    body: (
      <>
        Prefira abrir uma issue em{" "}
        <a
          href={GITHUB_ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-4 hover:text-foreground/80"
        >
          github.com/GuiHeinrichs/brasil-cnpj/issues
        </a>
        . Informe qual ferramenta, o número gerado, o que você esperava e em que
        validador ele foi recusado. Com esses três dados dá para reproduzir o
        caso e escrever um teste antes da correção.
      </>
    ),
  },
  {
    icon: ShieldIcon,
    title: "Privacidade e LGPD",
    body: (
      <>
        Use o mesmo e-mail com o assunto{" "}
        <code className="font-mono text-foreground">[LGPD]</code>. Os direitos
        que você pode exercer, as bases legais e o que efetivamente é tratado
        estão descritos na{" "}
        <Link
          href="/privacidade"
          className="text-foreground underline underline-offset-4 hover:text-foreground/80"
        >
          Política de Privacidade
        </Link>
        .
      </>
    ),
  },
  {
    icon: CodeXmlIcon,
    title: "Contribuir com o código",
    body: (
      <>
        O {SITE_NAME} é software livre sob licença MIT. Pull requests com novos
        documentos, correções de algoritmo ou testes são bem-vindos no{" "}
        <a
          href={GITHUB_ISSUES_URL.replace("/issues", "")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-4 hover:text-foreground/80"
        >
          repositório do projeto
        </a>
        .
      </>
    ),
  },
];

export default function Contato() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={contactJsonLd} />

      <SiteHeader
        badge="Fale comigo"
        heading="Contato"
        lead={
          <>
            O {SITE_NAME} é mantido por uma pessoa só —{" "}
            <Link
              href={AUTHOR.path}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {AUTHOR.name}
            </Link>
            , de {AUTHOR.location}. Toda mensagem é lida e respondida por mim.
          </>
        }
      />

      <div className="mt-10 grid gap-4">
        {CHANNELS.map((channel) => (
          <section
            key={channel.title}
            className="rounded-2xl border bg-card p-5"
          >
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <channel.icon aria-hidden className="size-4 text-primary" />
              {channel.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {channel.body}
            </p>
          </section>
        ))}
      </div>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-medium tracking-tight">
          O que este site não faz
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Para deixar claro antes que você escreva: o {SITE_NAME} não consulta
            bases oficiais, não informa o titular de um CPF ou CNPJ, não emite
            nem regulariza documentos e não tem atendimento telefônico ou
            cadastro de usuários. Não peço e não quero receber documentos
            reais — se precisar mandar um exemplo, use um número gerado pelo
            próprio site.
          </p>
          <p>
            Consultas a documentos reais devem ser feitas nos canais oficiais:
            Receita Federal (CPF e CNPJ), SENATRAN e DETRAN (CNH e veículos),
            TSE (título de eleitor), INSS e Caixa (PIS/NIS) e Correios (CEP).
            Os endereços estão na seção de links oficiais de cada ferramenta.
          </p>
        </div>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-medium tracking-tight">
          Como escrever uma mensagem que eu consiga responder
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            A maior parte das mensagens que chegam sobre um gerador se resolve
            com três informações. Diga qual ferramenta você usou, cole o número
            que ela produziu e conte onde ele foi recusado — o nome do sistema,
            a mensagem de erro exata ou o validador que você testou. Com isso dá
            para reproduzir o caso, escrever um teste que falha e só então
            corrigir, que é a ordem que evita consertar a coisa errada.
          </p>
          <p>
            Divergência entre validadores é a causa mais comum. Alguns
            documentos têm um caso de borda no cálculo do dígito, normalmente
            quando o resto da divisão dá 10, e implementações diferentes
            resolvem esse caso de formas diferentes. Os geradores daqui evitam
            produzir números nessa faixa ambígua justamente para que passem em
            qualquer implementação. Se um número foi recusado, saber qual
            validador o recusou costuma explicar o motivo em poucos minutos.
          </p>
          <p>
            Sugestões de ferramenta nova ou de guia também são bem-vindas. O que
            mais ajuda é descrever o problema que você estava tentando resolver
            quando sentiu falta daquilo, e não apenas o nome do documento — a
            forma da solução quase sempre muda conforme o uso real.
          </p>
        </div>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-medium tracking-tight">
          Privacidade das mensagens
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            As mensagens ficam na caixa de e-mail e são usadas apenas para
            responder você. Não há lista de divulgação, o endereço não é
            compartilhado com ninguém e nada do que você escrever vai parar no
            site. Se citar um trecho de código ou um caso de erro num guia
            público, eu aviso antes.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
