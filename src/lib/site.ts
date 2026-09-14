/**
 * Identidade pública do site, usada em metadata, sitemap, robots e JSON-LD.
 */
export const SITE_URL = "https://batecarimbo.com.br";

export const SITE_NAME = "bateCarimbo";

/**
 * E-mail de contato público, usado em /contato, /sobre, nos termos, na política
 * de privacidade (canal de LGPD) e no contactPoint do schema.org. É uma caixa
 * que recebe de fato — o domínio do site não tem registro MX, então um endereço
 * @batecarimbo.com.br cairia no vazio.
 */
export const CONTACT_EMAIL = "guiheinrichs.dev@gmail.com";

export const GITHUB_REPO_URL = "https://github.com/GuiHeinrichs/brasil-cnpj";
export const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;

/**
 * Pessoa responsável pelo site e autora dos guias. Exibida em /sobre#autor,
 * na assinatura dos artigos, no rodapé e no JSON-LD (Person/Organization).
 * Ajuste aqui para propagar para todo o site.
 */
export const AUTHOR = {
  name: "João Guilherme Heinrichs",
  /** Título curto exibido na assinatura dos guias. */
  role: "Desenvolvedor full stack · criador do bateCarimbo",
  /** Bio curta (2–3 frases) para o box de autor e /sobre. */
  bio: "Desenvolvedor full stack que trabalha com sistemas voltados ao mercado brasileiro — cadastros, integrações fiscais e validação de documentos. Criou o bateCarimbo em 2026 para resolver um problema recorrente do dia a dia: gerar massa de dados de teste válida sem recorrer a documentos de pessoas reais.",
  location: "Porto Alegre, RS — Brasil",
  /** Página interna com a apresentação completa (âncora em /sobre). */
  path: "/sobre#autor",
  github: "https://github.com/GuiHeinrichs",
  /** Perfis públicos usados em `sameAs` do JSON-LD. */
  sameAs: ["https://github.com/GuiHeinrichs"],
} as const;

/** Mês/ano em que o site foi ao ar — usado no © do rodapé e no JSON-LD. */
export const SITE_FOUNDING_DATE = "2026-06";

export const SITE_TITLE =
  "Gerador de CNPJ válido para testes — numérico e alfanumérico | bateCarimbo";

export const SITE_DESCRIPTION =
  "Gere CNPJs fictícios com dígitos verificadores válidos para testes de software, grátis e em lote. Suporta o formato numérico e o alfanumérico (em vigor desde julho de 2026). Valide e formate na mesma ferramenta.";
