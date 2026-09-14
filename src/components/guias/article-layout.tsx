import type { Metadata } from "next";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { AuthorBox } from "@/components/guias/author-box";
import { Prose } from "@/components/guias/prose";
import { SourcesSection } from "@/components/guias/sources-section";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { type Guide, otherGuides } from "@/lib/guias";
import { AUTHOR_ID, authorJsonLd } from "@/lib/schema";
import { AUTHOR, SITE_NAME, SITE_URL } from "@/lib/site";

/** Metadata (title/description/canonical/OG/Twitter) a partir de um guia. */
export function guideMetadata(guide: Guide): Metadata {
  const path = `/guias/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: path },
    authors: [{ name: AUTHOR.name, url: `${SITE_URL}${AUTHOR.path}` }],
    openGraph: {
      type: "article",
      url: path,
      siteName: SITE_NAME,
      locale: "pt_BR",
      title: guide.title,
      description: guide.description,
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      authors: [`${SITE_URL}${AUTHOR.path}`],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Shell de página de um guia: breadcrumb + cabeçalho com assinatura + JSON-LD
 * (TechArticle assinado por Person + BreadcrumbList), o corpo em `Prose`,
 * fontes oficiais, box do autor, ferramentas relacionadas e outros guias.
 */
export function ArticleLayout({
  guide,
  children,
}: {
  guide: Guide;
  children: React.ReactNode;
}) {
  const url = `${SITE_URL}/guias/${guide.slug}`;
  const wasRevised = guide.updated !== guide.published;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: guide.title,
    description: guide.description,
    inLanguage: "pt-BR",
    datePublished: guide.published,
    dateModified: guide.updated,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: authorJsonLd,
    creator: { "@id": AUTHOR_ID },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    citation: guide.sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.label,
      url: source.href,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guias",
        item: `${SITE_URL}/guias`,
      },
      { "@type": "ListItem", position: 3, name: guide.title, item: url },
    ],
  };

  const more = otherGuides(guide.slug);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <nav
        aria-label="Trilha de navegação"
        className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground"
      >
        <Link href="/" className="underline-offset-4 hover:text-foreground hover:underline">
          Início
        </Link>
        <ChevronRightIcon aria-hidden className="size-3" />
        <Link
          href="/guias"
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          Guias
        </Link>
      </nav>

      <header className="mt-5 flex flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted-foreground">
          <span aria-hidden className="size-1.5 rounded-full bg-gold" />
          {guide.tag}
        </span>
        <h1 className="text-balance text-2xl font-medium tracking-tight sm:text-3xl">
          {guide.title}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {guide.description}
        </p>
        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
          Por{" "}
          <Link
            href={AUTHOR.path}
            rel="author"
            className="text-foreground underline-offset-4 hover:underline"
          >
            {AUTHOR.name}
          </Link>{" "}
          · Publicado em{" "}
          <time dateTime={guide.published}>{formatDate(guide.published)}</time>
          {wasRevised && (
            <>
              {" "}
              · Revisado em{" "}
              <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
            </>
          )}{" "}
          · {guide.minutes} min de leitura
        </p>
      </header>

      <article className="mt-8">
        <Prose>{children}</Prose>
      </article>

      <SourcesSection sources={guide.sources} />

      <AuthorBox />

      {guide.related.length > 0 && (
        <div className="mt-12 space-y-3">
          <h2 className="font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Ferramentas e guias relacionados
          </h2>
          <ul className="flex flex-wrap gap-2">
            {guide.related.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex rounded-lg border bg-card px-3 py-1.5 text-sm transition-colors hover:border-ring/40"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {more.length > 0 && (
        <div className="mt-12 space-y-3">
          <h2 className="font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Continue lendo
          </h2>
          <div className="grid gap-3">
            {more.map((item) => (
              <Link
                key={item.slug}
                href={`/guias/${item.slug}`}
                className="group rounded-xl border bg-card p-4 transition-colors hover:border-ring/40"
              >
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {item.title}
                  <ArrowRightIcon
                    aria-hidden
                    className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  />
                </span>
                <span className="mt-1.5 block text-sm text-muted-foreground">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
