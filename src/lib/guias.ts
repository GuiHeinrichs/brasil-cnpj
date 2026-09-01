/**
 * Registro dos guias editoriais (/guias). Cada entrada alimenta o índice, o
 * sitemap, o JSON-LD de artigo e os links relacionados. O corpo (texto longo)
 * fica na page.tsx de cada guia; aqui ficam apenas os metadados canônicos, para
 * que título, descrição e data não se dupliquem entre a página e o índice.
 */
export type Guide = {
  slug: string;
  /** Título usado no <title>, no H1 e no card do índice. */
  title: string;
  /** Descrição usada na meta tag e como resumo no card do índice. */
  description: string;
  /** Rótulo curto de categoria (ex.: "Algoritmos", "Regras", "Boas práticas"). */
  tag: string;
  /** Data da última atualização (ISO, AAAA-MM-DD). */
  updated: string;
  /** Tempo de leitura estimado em minutos. */
  minutes: number;
  /** Ferramentas e guias relacionados, exibidos no rodapé do artigo. */
  related: { href: string; label: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "modulo-11-digito-verificador",
    title:
      "Módulo 11: como funciona o dígito verificador de CPF, CNPJ e outros documentos",
    description:
      "Entenda de forma prática o algoritmo de módulo 11 que valida CPF, CNPJ, PIS, RG, título de eleitor e RENAVAM — com pesos, exemplos resolvidos passo a passo e os casos-limite que enganam validadores.",
    tag: "Algoritmos",
    updated: "2026-08-31",
    minutes: 9,
    related: [
      { href: "/gerador-de-cpf", label: "Gerador de CPF" },
      { href: "/", label: "Gerador de CNPJ" },
      { href: "/gerador-de-pis", label: "Gerador de PIS/PASEP" },
    ],
  },
  {
    slug: "cnpj-alfanumerico-2026",
    title: "CNPJ alfanumérico: o guia completo do novo formato a partir de 2026",
    description:
      "O que muda com o CNPJ alfanumérico do SERPRO, por que a mudança aconteceu, como fica o cálculo do dígito verificador com letras e o que os sistemas precisam adaptar antes de julho de 2026.",
    tag: "Regras",
    updated: "2026-08-31",
    minutes: 8,
    related: [
      { href: "/", label: "Gerador de CNPJ" },
      { href: "/gerador-de-empresas", label: "Gerador de Empresas" },
      {
        href: "/guias/modulo-11-digito-verificador",
        label: "Módulo 11 explicado",
      },
    ],
  },
  {
    slug: "lgpd-dados-de-teste",
    title:
      "LGPD e dados de teste: por que não usar CPF e dados reais em desenvolvimento",
    description:
      "Usar documentos reais em ambientes de teste é um risco de privacidade e pode violar a LGPD. Entenda o problema, o que diz a lei sobre dados pessoais e como massa de dados fictícia resolve isso sem quebrar validações.",
    tag: "Boas práticas",
    updated: "2026-08-31",
    minutes: 7,
    related: [
      { href: "/gerador-de-pessoas", label: "Gerador de Pessoas" },
      { href: "/gerador-de-empresas", label: "Gerador de Empresas" },
      { href: "/privacidade", label: "Política de Privacidade" },
    ],
  },
  {
    slug: "regiao-fiscal-cpf",
    title: "Região fiscal do CPF: o que o 9º dígito revela sobre o estado",
    description:
      "O nono dígito do CPF indica a região fiscal em que o documento foi emitido. Veja a tabela das dez regiões fiscais da Receita Federal, como o dígito é interpretado e por que ele nem sempre corresponde ao estado onde a pessoa nasceu.",
    tag: "Documentos",
    updated: "2026-08-31",
    minutes: 6,
    related: [
      { href: "/gerador-de-cpf", label: "Gerador de CPF" },
      { href: "/gerador-de-pessoas", label: "Gerador de Pessoas" },
      {
        href: "/guias/modulo-11-digito-verificador",
        label: "Módulo 11 explicado",
      },
    ],
  },
  {
    slug: "placa-mercosul-vs-antiga",
    title: "Placa Mercosul e placa antiga: diferenças, conversão e o que mudou",
    description:
      "Do padrão ABC-1234 ao Mercosul ABC1D23: entenda por que a placa mudou, como as duas convivem, quando um veículo precisa migrar e a regra exata de conversão de número para letra.",
    tag: "Veículos",
    updated: "2026-08-31",
    minutes: 6,
    related: [
      { href: "/gerador-de-placa", label: "Gerador de Placa" },
      { href: "/gerador-de-renavam", label: "Gerador de RENAVAM" },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

/** Guias diferentes do atual, para a seção "continue lendo". */
export function otherGuides(slug: string, limit = 3): Guide[] {
  return GUIDES.filter((guide) => guide.slug !== slug).slice(0, limit);
}
