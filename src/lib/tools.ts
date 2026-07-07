/** Categorias que agrupam as ferramentas no menu e no catálogo da home. */
export const TOOL_CATEGORIES = [
  {
    id: "documentos",
    label: "Documentos",
    hint: "Documentos com dígito verificador",
  },
  {
    id: "dados",
    label: "Pessoas & Empresas",
    hint: "Dados fictícios completos",
  },
  { id: "veiculos", label: "Veículos", hint: "RENAVAM e placas" },
  { id: "outros", label: "Outros", hint: "CEP por faixa oficial" },
] as const;

export type CategoryId = (typeof TOOL_CATEGORIES)[number]["id"];

/** Catálogo das ferramentas — alimenta menu, navegação, footer, sitemap e home. */
export const TOOLS = [
  {
    id: "cnpj",
    label: "CNPJ",
    name: "Gerador de CNPJ",
    href: "/",
    category: "documentos",
    blurb: "Numérico e alfanumérico (novo formato 2026), com validador e formatador.",
  },
  {
    id: "cpf",
    label: "CPF",
    name: "Gerador de CPF",
    href: "/gerador-de-cpf",
    category: "documentos",
    blurb: "Por região fiscal (estado), com validador e formatador.",
  },
  {
    id: "cnh",
    label: "CNH",
    name: "Gerador de CNH",
    href: "/gerador-de-cnh",
    category: "documentos",
    blurb: "Registro de 11 dígitos com os dois DVs válidos.",
  },
  {
    id: "titulo",
    label: "Título",
    name: "Gerador de Título de Eleitor",
    href: "/gerador-de-titulo-de-eleitor",
    category: "documentos",
    blurb: "Por UF, com a regra oficial do TSE (exceção SP/MG).",
  },
  {
    id: "pis",
    label: "PIS",
    name: "Gerador de PIS/PASEP",
    href: "/gerador-de-pis",
    category: "documentos",
    blurb: "Mesmo número do NIS/NIT, com validador e formatador.",
  },
  {
    id: "rg",
    label: "RG",
    name: "Gerador de RG",
    href: "/gerador-de-rg",
    category: "documentos",
    blurb: "Padrão SSP-SP com DV (módulo 11), validador e formatador.",
  },
  {
    id: "renavam",
    label: "RENAVAM",
    name: "Gerador de RENAVAM",
    href: "/gerador-de-renavam",
    category: "veiculos",
    blurb: "11 dígitos, com suporte aos antigos de 9.",
  },
  {
    id: "placa",
    label: "Placa",
    name: "Gerador de Placa de Veículos",
    href: "/gerador-de-placa",
    category: "veiculos",
    blurb: "Mercosul (ABC1D23) e antiga (ABC-1234), com validador.",
  },
  {
    id: "cep",
    label: "CEP",
    name: "Gerador de CEP",
    href: "/gerador-de-cep",
    category: "outros",
    blurb: "Por estado, dentro das faixas oficiais dos Correios.",
  },
  {
    id: "pessoas",
    label: "Pessoas",
    name: "Gerador de Pessoas",
    href: "/gerador-de-pessoas",
    category: "dados",
    blurb: "Ficha completa: nome, CPF, RG, endereço e contato coerentes por UF.",
  },
  {
    id: "empresas",
    label: "Empresas",
    name: "Gerador de Empresas",
    href: "/gerador-de-empresas",
    category: "dados",
    blurb: "Razão social, nome fantasia, CNPJ e endereço para testes.",
  },
  {
    id: "nomes",
    label: "Nomes",
    name: "Gerador de Nomes",
    href: "/gerador-de-nomes",
    category: "dados",
    blurb: "Nomes brasileiros por sexo, em lote.",
  },
  {
    id: "nicks",
    label: "Nicks",
    name: "Gerador de Nicks",
    href: "/gerador-de-nicks",
    category: "dados",
    blurb: "Apelidos e usernames com estilos (leet, números, underscore).",
  },
] as const;

export type ToolId = (typeof TOOLS)[number]["id"];
export type Tool = (typeof TOOLS)[number];

/** Ferramentas agrupadas por categoria, na ordem de TOOL_CATEGORIES. */
export function toolsByCategory(): {
  id: CategoryId;
  label: string;
  hint: string;
  tools: Tool[];
}[] {
  return TOOL_CATEGORIES.map((category) => ({
    ...category,
    tools: TOOLS.filter((tool) => tool.category === category.id),
  }));
}
