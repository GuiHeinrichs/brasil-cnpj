import type { MetadataRoute } from "next";

import { GUIDES } from "@/lib/guias";
import { SITE_URL } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

/**
 * Datas reais da última alteração relevante de cada grupo de páginas. São
 * constantes (e não `new Date()`) para que o `lastmod` não mude a cada build —
 * um lastmod que muda sozinho é ignorado pelo Google.
 */
const TOOLS_UPDATED = "2026-09-14";
const PAGES_UPDATED: Record<string, string> = {
  "/guias": "2026-09-14",
  "/sobre": "2026-09-14",
  "/contato": "2026-09-14",
  "/termos": "2026-09-14",
  "/privacidade": "2026-09-14",
};

function iso(date: string): Date {
  return new Date(`${date}T12:00:00Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = TOOLS.map((tool) => ({
    url: tool.href === "/" ? SITE_URL : `${SITE_URL}${tool.href}`,
    lastModified: iso(TOOLS_UPDATED),
    changeFrequency: "monthly" as const,
    priority: tool.href === "/" ? 1 : 0.9,
  }));

  const guides = GUIDES.map((guide) => ({
    url: `${SITE_URL}/guias/${guide.slug}`,
    lastModified: iso(guide.updated),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...tools,
    {
      url: `${SITE_URL}/guias`,
      lastModified: iso(PAGES_UPDATED["/guias"]),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...guides,
    {
      url: `${SITE_URL}/sobre`,
      lastModified: iso(PAGES_UPDATED["/sobre"]),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contato`,
      lastModified: iso(PAGES_UPDATED["/contato"]),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/termos`,
      lastModified: iso(PAGES_UPDATED["/termos"]),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/privacidade`,
      lastModified: iso(PAGES_UPDATED["/privacidade"]),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];
}
