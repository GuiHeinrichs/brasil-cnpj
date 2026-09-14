/**
 * Registro dos guias editoriais (/guias). Cada entrada alimenta o índice, o
 * sitemap, o JSON-LD de artigo e os links relacionados. O corpo (texto longo)
 * fica na page.tsx de cada guia; aqui ficam apenas os metadados canônicos, para
 * que título, descrição, datas e fontes não se dupliquem entre a página e o
 * índice.
 *
 * Regra editorial: toda afirmação normativa feita no corpo (norma, prazo,
 * decreto, tabela oficial) precisa estar amparada por uma entrada em `sources`.
 */

/** Fonte oficial citada ao final do artigo. */
export type GuideSource = {
  label: string;
  href: string;
  /** Complemento curto explicando o que a fonte sustenta. */
  note?: string;
};

export type Guide = {
  slug: string;
  /** Título usado no <title>, no H1 e no card do índice. */
  title: string;
  /** Descrição usada na meta tag e como resumo no card do índice. */
  description: string;
  /** Rótulo curto de categoria (ex.: "Algoritmos", "Código", "Documentos"). */
  tag: string;
  /** Data de publicação original (ISO, AAAA-MM-DD). */
  published: string;
  /** Data da última revisão (ISO, AAAA-MM-DD). Igual a `published` se nunca editado. */
  updated: string;
  /** Tempo de leitura estimado em minutos. */
  minutes: number;
  /** Ferramentas e guias relacionados, exibidos no rodapé do artigo. */
  related: { href: string; label: string }[];
  /** Fontes oficiais exibidas na seção "Fontes e referências". */
  sources: GuideSource[];
};

/** Fontes reutilizadas por vários guias — evita divergência de rótulo/URL. */
const SOURCE = {
  manualDvCnpj: {
    label: "Manual de cálculo do DV do CNPJ — Receita Federal / SERPRO",
    href: "https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf",
    note: "documento técnico com a regra do dígito verificador, inclusive para o formato alfanumérico",
  },
  faqCnpjAlfanumerico: {
    label: "Perguntas e respostas — CNPJ alfanumérico (Receita Federal)",
    href: "https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/cnpj/cnpj-alfanumerico.pdf",
    note: "documento oficial sobre o formato, a convivência com o numérico e o cálculo do DV",
  },
  cadastroCnpj: {
    label: "Cadastro Nacional da Pessoa Jurídica — Receita Federal",
    href: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/cnpj",
    note: "página oficial do cadastro, com as regras de inscrição e situação cadastral",
  },
  cadastroCpf: {
    label: "Cadastro de Pessoas Físicas — Receita Federal",
    href: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/cpf",
    note: "orientações oficiais sobre inscrição, regularização e situação do CPF",
  },
  consultaCpf: {
    label: "Consulta à situação cadastral do CPF — Receita Federal",
    href: "https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp",
    note: "serviço público que informa a situação de um CPF real",
  },
  lgpd: {
    label: "Lei nº 13.709/2018 (Lei Geral de Proteção de Dados)",
    href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    note: "texto integral no Planalto",
  },
  anpd: {
    label: "Autoridade Nacional de Proteção de Dados (ANPD)",
    href: "https://www.gov.br/anpd/pt-br",
    note: "orientações e guias oficiais sobre aplicação da LGPD",
  },
  decretoCin: {
    label: "Decreto nº 10.977/2022 — Carteira de Identidade Nacional",
    href: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/decreto/D10977.htm",
    note: "institui a CIN com o CPF como número único e define os prazos de transição",
  },
  leiCpfUnico: {
    label: "Lei nº 14.534/2023 — CPF como número único de identificação",
    href: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/L14534.htm",
  },
  lcPis: {
    label: "Lei Complementar nº 7/1970 — cria o PIS",
    href: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp07.htm",
  },
  lcPasep: {
    label: "Lei Complementar nº 8/1970 — cria o PASEP",
    href: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp08.htm",
  },
  inss: {
    label: "Instituto Nacional do Seguro Social (INSS)",
    href: "https://www.gov.br/inss/pt-br",
    note: "consulta ao CNIS e ao NIT pelo Meu INSS",
  },
  cep: {
    label: "Tudo sobre CEP — Correios",
    href: "https://www.correios.com.br/enviar/precisa-de-ajuda/tudo-sobre-cep",
    note: "estrutura do CEP e faixas de endereçamento",
  },
  transito: {
    label: "Trânsito — Ministério dos Transportes",
    href: "https://www.gov.br/transportes/pt-br/assuntos/transito",
    note: "área oficial com as resoluções do CONTRAN e as normas de emplacamento",
  },
  senatran: {
    label: "Portal de Serviços do SENATRAN",
    href: "https://portalservicos.senatran.serpro.gov.br/",
    note: "consulta oficial de CNH, pontuação e veículos",
  },
  poupatempo: {
    label: "Poupatempo — RG e CIN em São Paulo",
    href: "https://www.poupatempo.sp.gov.br/",
    note: "órgão emissor do RG no padrão SSP-SP usado por esta ferramenta",
  },
  tse: {
    label: "Tribunal Superior Eleitoral",
    href: "https://www.tse.jus.br/",
    note: "serviços do eleitor, título e local de votação",
  },
  leiEireli: {
    label: "Lei nº 14.195/2021 — transformação das EIRELI em sociedades limitadas unipessoais",
    href: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14195.htm",
  },
} satisfies Record<string, GuideSource>;

/** Data em que os doze guias técnicos novos foram publicados. */
const BATCH_2 = "2026-09-14";

export const GUIDES: Guide[] = [
  {
    slug: "modulo-11-digito-verificador",
    title:
      "Módulo 11: como funciona o dígito verificador de CPF, CNPJ e outros documentos",
    description:
      "Entenda de forma prática o algoritmo de módulo 11 que valida CPF, CNPJ, PIS, RG, título de eleitor e RENAVAM — com pesos, exemplos resolvidos passo a passo e os casos-limite que enganam validadores.",
    tag: "Algoritmos",
    published: "2026-08-31",
    updated: "2026-09-14",
    minutes: 12,
    related: [
      { href: "/gerador-de-cpf", label: "Gerador de CPF" },
      { href: "/", label: "Gerador de CNPJ" },
      { href: "/gerador-de-pis", label: "Gerador de PIS/PASEP" },
      {
        href: "/guias/erros-comuns-validadores-documentos-brasileiros",
        label: "Erros comuns em validadores",
      },
    ],
    sources: [SOURCE.manualDvCnpj, SOURCE.cadastroCpf, SOURCE.cep],
  },
  {
    slug: "cnpj-alfanumerico-2026",
    title: "CNPJ alfanumérico: o guia completo do formato em vigor desde julho de 2026",
    description:
      "O CNPJ alfanumérico já está valendo para novas inscrições. Veja o que mudou na prática, como fica o cálculo do dígito verificador com letras, o exemplo oficial resolvido e o checklist de adequação para sistemas legados.",
    tag: "Regras",
    published: "2026-08-31",
    updated: "2026-09-14",
    minutes: 11,
    related: [
      { href: "/", label: "Gerador de CNPJ" },
      { href: "/gerador-de-empresas", label: "Gerador de Empresas" },
      {
        href: "/guias/modulo-11-digito-verificador",
        label: "Módulo 11 explicado",
      },
      {
        href: "/guias/validar-cpf-cnpj-javascript-typescript",
        label: "Validar CNPJ em JavaScript",
      },
    ],
    sources: [
      SOURCE.faqCnpjAlfanumerico,
      SOURCE.manualDvCnpj,
      SOURCE.cadastroCnpj,
    ],
  },
  {
    slug: "lgpd-dados-de-teste",
    title:
      "LGPD e dados de teste: por que não usar CPF e dados reais em desenvolvimento",
    description:
      "Usar documentos reais em ambientes de teste é um risco de privacidade e pode violar a LGPD. Entenda o que a lei diz sobre dado pessoal, anonimização e pseudonimização, e como massa fictícia resolve isso sem quebrar validações.",
    tag: "Boas práticas",
    published: "2026-08-31",
    updated: "2026-09-14",
    minutes: 10,
    related: [
      { href: "/gerador-de-pessoas", label: "Gerador de Pessoas" },
      { href: "/gerador-de-empresas", label: "Gerador de Empresas" },
      {
        href: "/guias/massa-de-dados-de-teste-fixtures-seeds-faker",
        label: "Como montar massa de dados de teste",
      },
      { href: "/privacidade", label: "Política de Privacidade" },
    ],
    sources: [SOURCE.lgpd, SOURCE.anpd],
  },
  {
    slug: "regiao-fiscal-cpf",
    title: "Região fiscal do CPF: o que o 9º dígito revela sobre o estado",
    description:
      "O nono dígito do CPF indica a região fiscal em que o documento foi emitido. Veja a tabela das dez regiões fiscais da Receita Federal, como ler o dígito em código e por que ele não prova o estado de nascimento nem o domicílio da pessoa.",
    tag: "Documentos",
    published: "2026-08-31",
    updated: "2026-09-14",
    minutes: 9,
    related: [
      { href: "/gerador-de-cpf", label: "Gerador de CPF" },
      { href: "/gerador-de-pessoas", label: "Gerador de Pessoas" },
      {
        href: "/guias/modulo-11-digito-verificador",
        label: "Módulo 11 explicado",
      },
      {
        href: "/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral",
        label: "Válido não é existente",
      },
    ],
    sources: [SOURCE.cadastroCpf, SOURCE.leiCpfUnico],
  },
  {
    slug: "placa-mercosul-vs-antiga",
    title: "Placa Mercosul e placa antiga: diferenças, conversão e o que mudou",
    description:
      "Do padrão ABC-1234 ao Mercosul ABC1D23: entenda por que a placa mudou, como as duas convivem, as cores e categorias do novo padrão, quando um veículo precisa migrar e a regra exata de conversão de número para letra.",
    tag: "Veículos",
    published: "2026-08-31",
    updated: "2026-09-14",
    minutes: 9,
    related: [
      { href: "/gerador-de-placa", label: "Gerador de Placa" },
      { href: "/gerador-de-renavam", label: "Gerador de RENAVAM" },
      {
        href: "/guias/regex-documentos-brasileiros",
        label: "Regex de documentos brasileiros",
      },
    ],
    sources: [SOURCE.transito, SOURCE.senatran],
  },

  // ---------------------------------------------------------------------------
  // Guias técnicos publicados em 14/09/2026.
  // ---------------------------------------------------------------------------

  {
    slug: "validar-cpf-cnpj-javascript-typescript",
    title:
      "Como validar CPF e CNPJ em JavaScript e TypeScript (incluindo o CNPJ alfanumérico)",
    description:
      "Implementação comentada de validadores de CPF e CNPJ em JavaScript e TypeScript: normalização da entrada, cálculo dos dígitos verificadores, suporte ao CNPJ alfanumérico, testes unitários e as pegadinhas que quebram validadores em produção.",
    tag: "Código",
    published: BATCH_2,
    updated: BATCH_2,
    minutes: 13,
    related: [
      { href: "/gerador-de-cpf", label: "Gerador de CPF" },
      { href: "/", label: "Gerador de CNPJ" },
      {
        href: "/guias/modulo-11-digito-verificador",
        label: "Módulo 11 explicado",
      },
      {
        href: "/guias/cnpj-alfanumerico-2026",
        label: "CNPJ alfanumérico",
      },
    ],
    sources: [SOURCE.manualDvCnpj, SOURCE.faqCnpjAlfanumerico, SOURCE.cadastroCpf],
  },
  {
    slug: "validar-cpf-cnpj-python-java-csharp",
    title:
      "Validação de CPF e CNPJ em Python, Java e C#: implementações comentadas e testes",
    description:
      "A mesma regra de módulo 11 em três linguagens: função pura, integração com Pydantic, Bean Validation e FluentValidation, tabela de casos de teste compartilhada e onde validar em cada camada da aplicação.",
    tag: "Código",
    published: BATCH_2,
    updated: BATCH_2,
    minutes: 13,
    related: [
      { href: "/gerador-de-cpf", label: "Gerador de CPF" },
      { href: "/", label: "Gerador de CNPJ" },
      {
        href: "/guias/validar-cpf-cnpj-javascript-typescript",
        label: "Validar em JavaScript",
      },
      {
        href: "/guias/modulo-11-digito-verificador",
        label: "Módulo 11 explicado",
      },
    ],
    sources: [SOURCE.manualDvCnpj, SOURCE.faqCnpjAlfanumerico],
  },
  {
    slug: "validar-cpf-cnpj-sql-postgres-mysql-sqlserver",
    title:
      "Validar CPF e CNPJ no banco de dados: funções em PostgreSQL, MySQL e SQL Server",
    description:
      "Funções SQL para validar CPF e CNPJ, restrições CHECK, o tipo de coluna correto (nunca numérico), uma consulta de auditoria para achar documentos inválidos já gravados e como preparar o schema para o CNPJ alfanumérico.",
    tag: "Código",
    published: BATCH_2,
    updated: BATCH_2,
    minutes: 11,
    related: [
      { href: "/", label: "Gerador de CNPJ" },
      { href: "/gerador-de-cpf", label: "Gerador de CPF" },
      {
        href: "/guias/cnpj-alfanumerico-2026",
        label: "CNPJ alfanumérico",
      },
      {
        href: "/guias/erros-comuns-validadores-documentos-brasileiros",
        label: "Erros comuns em validadores",
      },
    ],
    sources: [SOURCE.manualDvCnpj, SOURCE.faqCnpjAlfanumerico],
  },
  {
    slug: "regex-documentos-brasileiros",
    title:
      "Regex para documentos brasileiros: CPF, CNPJ, CEP, placa, telefone, PIS e título",
    description:
      "Tabela de expressões regulares para os principais documentos e dados brasileiros, com e sem máscara, grupos nomeados para extrair raiz e dígitos, versão unificada da placa Mercosul e antiga, e o que regex nunca consegue validar.",
    tag: "Código",
    published: BATCH_2,
    updated: BATCH_2,
    minutes: 10,
    related: [
      { href: "/", label: "Gerador de CNPJ" },
      { href: "/gerador-de-placa", label: "Gerador de Placa" },
      { href: "/gerador-de-cep", label: "Gerador de CEP" },
      {
        href: "/guias/validar-cpf-cnpj-javascript-typescript",
        label: "Validar em JavaScript",
      },
    ],
    sources: [SOURCE.manualDvCnpj, SOURCE.cep, SOURCE.transito],
  },
  {
    slug: "cnh-numero-registro-digito-verificador",
    title:
      "Número da CNH: registro, espelho, RENACH e como o dígito verificador é calculado",
    description:
      "Os três números impressos na CNH e o que cada um identifica, o que muda na renovação e na CNH digital, o cálculo completo dos dois dígitos verificadores com exemplo resolvido e por que validadores divergem no caso do resto 10.",
    tag: "Documentos",
    published: BATCH_2,
    updated: BATCH_2,
    minutes: 11,
    related: [
      { href: "/gerador-de-cnh", label: "Gerador de CNH" },
      {
        href: "/guias/modulo-11-digito-verificador",
        label: "Módulo 11 explicado",
      },
      { href: "/gerador-de-renavam", label: "Gerador de RENAVAM" },
    ],
    sources: [SOURCE.senatran, SOURCE.transito],
  },
  {
    slug: "rg-por-estado-e-cin-carteira-identidade-nacional",
    title:
      "RG por estado e a nova CIN: por que não existe padrão nacional de RG e o que muda",
    description:
      "Cada estado emite o RG com numeração e dígito verificador próprios. Entenda as variações, como modelar o campo em sistemas sem validar o DV genericamente, o que é a Carteira de Identidade Nacional e os prazos da transição.",
    tag: "Identidade",
    published: BATCH_2,
    updated: BATCH_2,
    minutes: 12,
    related: [
      { href: "/gerador-de-rg", label: "Gerador de RG" },
      { href: "/gerador-de-cpf", label: "Gerador de CPF" },
      { href: "/gerador-de-pessoas", label: "Gerador de Pessoas" },
    ],
    sources: [SOURCE.decretoCin, SOURCE.leiCpfUnico, SOURCE.poupatempo],
  },
  {
    slug: "pis-pasep-nis-nit-diferencas",
    title:
      "PIS, PASEP, NIS e NIT: diferenças, quem emite cada um e como validar o número",
    description:
      "São o mesmo número de onze dígitos com quatro nomes. Veja quem atribui cada um, onde cada sigla aparece na prática (eSocial, abono, CNIS, GPS), o cálculo do dígito verificador resolvido e por que válido não significa cadastrado.",
    tag: "Trabalho",
    published: BATCH_2,
    updated: BATCH_2,
    minutes: 10,
    related: [
      { href: "/gerador-de-pis", label: "Gerador de PIS/PASEP" },
      {
        href: "/guias/modulo-11-digito-verificador",
        label: "Módulo 11 explicado",
      },
      {
        href: "/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral",
        label: "Válido não é existente",
      },
    ],
    sources: [SOURCE.lcPis, SOURCE.lcPasep, SOURCE.inss],
  },
  {
    slug: "titulo-de-eleitor-estrutura-uf-zona-secao",
    title:
      "Título de eleitor: estrutura do número, código da UF, zona e seção — e a exceção de SP e MG",
    description:
      "Os doze dígitos do título explicados: sequencial, código da unidade federativa e os dois dígitos verificadores. Tabela completa dos códigos por estado, cálculo resolvido e a exceção do TSE que faz São Paulo e Minas Gerais divergirem.",
    tag: "Eleitoral",
    published: BATCH_2,
    updated: BATCH_2,
    minutes: 10,
    related: [
      {
        href: "/gerador-de-titulo-de-eleitor",
        label: "Gerador de Título de Eleitor",
      },
      {
        href: "/guias/modulo-11-digito-verificador",
        label: "Módulo 11 explicado",
      },
      {
        href: "/guias/erros-comuns-validadores-documentos-brasileiros",
        label: "Erros comuns em validadores",
      },
    ],
    sources: [SOURCE.tse],
  },
  {
    slug: "cep-estrutura-digitos-faixas-por-estado",
    title:
      "Como o CEP é estruturado: o significado de cada dígito e as faixas por estado",
    description:
      "Região, sub-região, setor, subsetor, divisor e sufixo explicados com exemplos reais decompostos, a tabela completa de faixas por unidade federativa, CEP geral contra CEP de logradouro e como validar sem depender de uma API.",
    tag: "Endereçamento",
    published: BATCH_2,
    updated: BATCH_2,
    minutes: 11,
    related: [
      { href: "/gerador-de-cep", label: "Gerador de CEP" },
      { href: "/gerador-de-pessoas", label: "Gerador de Pessoas" },
      { href: "/gerador-de-empresas", label: "Gerador de Empresas" },
    ],
    sources: [SOURCE.cep],
  },
  {
    slug: "massa-de-dados-de-teste-fixtures-seeds-faker",
    title:
      "Como montar massa de dados de teste brasileira: fixtures, seeds, factories e Faker",
    description:
      "Estratégia por camada de teste, Faker em JavaScript, Python e Java, factories, seeds reproduzíveis, coerência entre UF, CPF, CEP e DDD, e os casos-limite que toda massa de dados brasileira precisa cobrir.",
    tag: "Dados de teste",
    published: BATCH_2,
    updated: BATCH_2,
    minutes: 13,
    related: [
      { href: "/gerador-de-pessoas", label: "Gerador de Pessoas" },
      { href: "/gerador-de-empresas", label: "Gerador de Empresas" },
      { href: "/guias/lgpd-dados-de-teste", label: "LGPD e dados de teste" },
      { href: "/gerador-de-nomes", label: "Gerador de Nomes" },
    ],
    sources: [SOURCE.lgpd, SOURCE.anpd],
  },
  {
    slug: "cpf-valido-nao-e-cpf-existente-situacao-cadastral",
    title:
      "CPF válido não é CPF existente: dígito verificador, situação cadastral e o que a consulta confirma",
    description:
      "Os três níveis de verificação de um documento — formato, dígito verificador e existência no cadastro —, as situações cadastrais do CPF e do CNPJ, quando um sistema precisa consultar a Receita e como testar essa integração sem dados reais.",
    tag: "Fiscal",
    published: BATCH_2,
    updated: BATCH_2,
    minutes: 10,
    related: [
      { href: "/gerador-de-cpf", label: "Gerador de CPF" },
      { href: "/", label: "Gerador de CNPJ" },
      { href: "/guias/lgpd-dados-de-teste", label: "LGPD e dados de teste" },
    ],
    sources: [SOURCE.consultaCpf, SOURCE.cadastroCpf, SOURCE.cadastroCnpj],
  },
  {
    slug: "erros-comuns-validadores-documentos-brasileiros",
    title:
      "Dez erros comuns em validadores de documentos brasileiros (e como testá-los)",
    description:
      "Aceitar dígitos repetidos, errar o tratamento do resto 10, gravar o documento como número, usar regex só numérica depois do CNPJ alfanumérico, rejeitar RG de outro estado: cada erro com sintoma, causa, teste de reprodução e correção.",
    tag: "Erros comuns",
    published: BATCH_2,
    updated: BATCH_2,
    minutes: 11,
    related: [
      { href: "/gerador-de-cpf", label: "Gerador de CPF" },
      { href: "/gerador-de-cnh", label: "Gerador de CNH" },
      { href: "/gerador-de-rg", label: "Gerador de RG" },
      {
        href: "/guias/modulo-11-digito-verificador",
        label: "Módulo 11 explicado",
      },
    ],
    sources: [SOURCE.manualDvCnpj, SOURCE.faqCnpjAlfanumerico, SOURCE.decretoCin],
  },
  {
    slug: "cpf-cnpj-inscricao-estadual-mei-diferencas",
    title:
      "CPF, CNPJ, inscrição estadual e MEI: o que cada número identifica",
    description:
      "Pessoa física e jurídica, matriz e filial na ordem do CNPJ, por que a inscrição estadual tem um formato por estado, o que é inscrição municipal e por que o MEI tem um CNPJ comum — com o impacto disso na modelagem de sistemas.",
    tag: "Fiscal",
    published: BATCH_2,
    updated: BATCH_2,
    minutes: 10,
    related: [
      { href: "/", label: "Gerador de CNPJ" },
      { href: "/gerador-de-empresas", label: "Gerador de Empresas" },
      {
        href: "/guias/cnpj-alfanumerico-2026",
        label: "CNPJ alfanumérico",
      },
    ],
    sources: [SOURCE.cadastroCnpj, SOURCE.cadastroCpf, SOURCE.leiEireli],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

/** Guias diferentes do atual, para a seção "continue lendo". */
/**
 * Sequência de leitura curada por guia. Sem isso, o bloco "Continue lendo"
 * completava a lista com os primeiros itens do array e oito artigos acabavam
 * recomendando exatamente os mesmos três — o oposto de curadoria.
 */
const READ_NEXT: Record<string, string[]> = {
  "modulo-11-digito-verificador": [
    "validar-cpf-cnpj-javascript-typescript",
    "erros-comuns-validadores-documentos-brasileiros",
    "cnpj-alfanumerico-2026",
  ],
  "cnpj-alfanumerico-2026": [
    "validar-cpf-cnpj-sql-postgres-mysql-sqlserver",
    "cpf-cnpj-inscricao-estadual-mei-diferencas",
    "modulo-11-digito-verificador",
  ],
  "lgpd-dados-de-teste": [
    "massa-de-dados-de-teste-fixtures-seeds-faker",
    "cpf-valido-nao-e-cpf-existente-situacao-cadastral",
    "rg-por-estado-e-cin-carteira-identidade-nacional",
  ],
  "regiao-fiscal-cpf": [
    "cpf-valido-nao-e-cpf-existente-situacao-cadastral",
    "modulo-11-digito-verificador",
    "cep-estrutura-digitos-faixas-por-estado",
  ],
  "placa-mercosul-vs-antiga": [
    "cnh-numero-registro-digito-verificador",
    "regex-documentos-brasileiros",
    "erros-comuns-validadores-documentos-brasileiros",
  ],
  "validar-cpf-cnpj-javascript-typescript": [
    "validar-cpf-cnpj-python-java-csharp",
    "regex-documentos-brasileiros",
    "erros-comuns-validadores-documentos-brasileiros",
  ],
  "validar-cpf-cnpj-python-java-csharp": [
    "validar-cpf-cnpj-sql-postgres-mysql-sqlserver",
    "validar-cpf-cnpj-javascript-typescript",
    "massa-de-dados-de-teste-fixtures-seeds-faker",
  ],
  "validar-cpf-cnpj-sql-postgres-mysql-sqlserver": [
    "cnpj-alfanumerico-2026",
    "validar-cpf-cnpj-python-java-csharp",
    "erros-comuns-validadores-documentos-brasileiros",
  ],
  "regex-documentos-brasileiros": [
    "validar-cpf-cnpj-javascript-typescript",
    "cep-estrutura-digitos-faixas-por-estado",
    "placa-mercosul-vs-antiga",
  ],
  "cnh-numero-registro-digito-verificador": [
    "erros-comuns-validadores-documentos-brasileiros",
    "placa-mercosul-vs-antiga",
    "modulo-11-digito-verificador",
  ],
  "rg-por-estado-e-cin-carteira-identidade-nacional": [
    "regiao-fiscal-cpf",
    "cpf-valido-nao-e-cpf-existente-situacao-cadastral",
    "massa-de-dados-de-teste-fixtures-seeds-faker",
  ],
  "pis-pasep-nis-nit-diferencas": [
    "modulo-11-digito-verificador",
    "cpf-valido-nao-e-cpf-existente-situacao-cadastral",
    "erros-comuns-validadores-documentos-brasileiros",
  ],
  "titulo-de-eleitor-estrutura-uf-zona-secao": [
    "erros-comuns-validadores-documentos-brasileiros",
    "modulo-11-digito-verificador",
    "regiao-fiscal-cpf",
  ],
  "cep-estrutura-digitos-faixas-por-estado": [
    "massa-de-dados-de-teste-fixtures-seeds-faker",
    "regex-documentos-brasileiros",
    "regiao-fiscal-cpf",
  ],
  "massa-de-dados-de-teste-fixtures-seeds-faker": [
    "lgpd-dados-de-teste",
    "cep-estrutura-digitos-faixas-por-estado",
    "validar-cpf-cnpj-python-java-csharp",
  ],
  "cpf-valido-nao-e-cpf-existente-situacao-cadastral": [
    "cpf-cnpj-inscricao-estadual-mei-diferencas",
    "lgpd-dados-de-teste",
    "regiao-fiscal-cpf",
  ],
  "erros-comuns-validadores-documentos-brasileiros": [
    "validar-cpf-cnpj-javascript-typescript",
    "modulo-11-digito-verificador",
    "cnh-numero-registro-digito-verificador",
  ],
  "cpf-cnpj-inscricao-estadual-mei-diferencas": [
    "cnpj-alfanumerico-2026",
    "cpf-valido-nao-e-cpf-existente-situacao-cadastral",
    "massa-de-dados-de-teste-fixtures-seeds-faker",
  ],
};

/** Guias sugeridos ao final do artigo atual, na ordem curada. */
export function otherGuides(slug: string, limit = 3): Guide[] {
  const curated = (READ_NEXT[slug] ?? [])
    .map((next) => getGuide(next))
    .filter((guide): guide is Guide => Boolean(guide) && guide!.slug !== slug);

  if (curated.length >= limit) return curated.slice(0, limit);

  // Sem curadoria suficiente, completa com guias da mesma categoria.
  const current = getGuide(slug);
  const rest = GUIDES.filter(
    (guide) => guide.slug !== slug && !curated.includes(guide),
  );
  const sameTag = current
    ? rest.filter((guide) => guide.tag === current.tag)
    : [];
  const others = rest.filter((guide) => !sameTag.includes(guide));
  return [...curated, ...sameTag, ...others].slice(0, limit);
}

/** Guias agrupados por categoria, na ordem em que as tags aparecem. */
export function guidesByTag(): { tag: string; guides: Guide[] }[] {
  const tags: string[] = [];
  for (const guide of GUIDES) {
    if (!tags.includes(guide.tag)) tags.push(guide.tag);
  }
  return tags.map((tag) => ({
    tag,
    guides: GUIDES.filter((guide) => guide.tag === tag),
  }));
}
