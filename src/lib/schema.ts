/**
 * Schemas JSON-LD reutilizáveis (schema.org).
 * - `siteJsonLd`: entidade da marca (Organization + WebSite + Person do
 *   mantenedor), renderizada em todas as páginas pelo layout.
 * - `breadcrumbJsonLd`: trilha Início › ferramenta, emitida pelas páginas
 *   internas via SiteHeader para habilitar o breadcrumb no resultado de busca.
 * - `authorJsonLd`: referência à Person do autor, para artigos.
 */
import {
  AUTHOR,
  CONTACT_EMAIL,
  SITE_FOUNDING_DATE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import type { Tool } from "@/lib/tools";

const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const AUTHOR_ID = `${SITE_URL}/#autor`;

/** Person do mantenedor/autor — referenciada por Organization e TechArticle. */
export const authorJsonLd = {
  "@type": "Person",
  "@id": AUTHOR_ID,
  name: AUTHOR.name,
  jobTitle: "Desenvolvedor de software",
  description: AUTHOR.bio,
  url: `${SITE_URL}${AUTHOR.path}`,
  sameAs: [...AUTHOR.sameAs],
  worksFor: { "@id": ORG_ID },
};

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Geradores e validadores de documentos e dados brasileiros fictícios para testes de software, com guias técnicos sobre CPF, CNPJ, CNH, RG, PIS, RENAVAM, placas e CEP.",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
      email: CONTACT_EMAIL,
      foundingDate: SITE_FOUNDING_DATE,
      founder: { "@id": AUTHOR_ID },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: CONTACT_EMAIL,
          url: `${SITE_URL}/contato`,
          availableLanguage: "pt-BR",
        },
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Porto Alegre",
        addressRegion: "RS",
        addressCountry: "BR",
      },
      sameAs: ["https://github.com/GuiHeinrichs/brasil-cnpj"],
    },
    authorJsonLd,
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
