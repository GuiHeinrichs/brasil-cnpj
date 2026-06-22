/**
 * Schemas JSON-LD reutilizáveis (schema.org).
 * - `siteJsonLd`: entidade da marca (Organization + WebSite), renderizada em
 *   todas as páginas pelo layout — ajuda o Google a entender o site como marca.
 * - `breadcrumbJsonLd`: trilha Início › ferramenta, emitida pelas páginas
 *   internas via SiteHeader para habilitar o breadcrumb no resultado de busca.
 */
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Tool } from "@/lib/tools";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
      sameAs: ["https://github.com/GuiHeinrichs/brasil-cnpj"],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "pt-BR",
      publisher: { "@id": ORG_ID },
    },
  ],
};

/** Trilha Início › <ferramenta> para uma página interna. */
export function breadcrumbJsonLd(tool: Pick<Tool, "name" | "href">) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.name,
        item: `${SITE_URL}${tool.href}`,
      },
    ],
  };
}
