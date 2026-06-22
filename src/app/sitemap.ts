import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = TOOLS.map((tool) => ({
    url: tool.href === "/" ? SITE_URL : `${SITE_URL}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: tool.href === "/" ? 1 : 0.9,
  }));

  return [
    ...tools,
    {
      url: `${SITE_URL}/privacidade`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];
}
