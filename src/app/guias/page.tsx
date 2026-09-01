import type { Metadata } from "next";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GUIDES } from "@/lib/guias";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_TITLE = "Guias — documentos e dados brasileiros explicados";
const PAGE_DESCRIPTION =
  "Artigos sobre os documentos brasileiros e sua validação: o algoritmo de módulo 11, o CNPJ alfanumérico de 2026, região fiscal do CPF, LGPD em dados de teste e mais.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/guias" },
  openGraph: {
    type: "website",
    url: "/guias",
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

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: `${SITE_URL}/guias`,
  inLanguage: "pt-BR",
  hasPart: GUIDES.map((guide) => ({
    "@type": "TechArticle",
    headline: guide.title,
    url: `${SITE_URL}/guias/${guide.slug}`,
  })),
};

export default function GuiasIndex() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={collectionJsonLd} />

      <SiteHeader
        badge="Guias & referência"
        heading="Guias sobre documentos e dados brasileiros"
      />

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        Explicações práticas sobre como os documentos brasileiros são numerados e
        validados, o que muda com as novas regras e como trabalhar com dados de
        teste sem usar informação de pessoas reais. Escrito para quem desenvolve,
        testa e mantém sistemas brasileiros.
      </p>

      <div className="mt-10 grid gap-4">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guias/${guide.slug}`}
            className="group rounded-2xl border bg-card p-5 transition-colors hover:border-ring/40"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground">
                {guide.tag}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {guide.minutes} min
              </span>
            </div>
            <h2 className="mt-3 flex items-start gap-2 text-base font-semibold tracking-tight">
              {guide.title}
              <ArrowRightIcon
                aria-hidden
                className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {guide.description}
            </p>
          </Link>
        ))}
      </div>

      <SiteFooter />
    </div>
  );
}
