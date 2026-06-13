import { SITE_NAME, SITE_URL } from "@/lib/site";

/** JSON-LD de WebApplication para uma página de ferramenta. */
export function toolJsonLd(options: {
  name: string;
  path: string;
  description: string;
  featureList: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${options.name} — ${SITE_NAME}`,
    url: `${SITE_URL}${options.path}`,
    description: options.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
    featureList: options.featureList,
  };
}

/** JSON-LD de FAQPage — o texto deve ser idêntico ao conteúdo visível. */
export function faqJsonLd(
  items: readonly { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
