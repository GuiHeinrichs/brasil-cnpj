import { generateCep } from "@/lib/cep";
import { generateCnpj } from "@/lib/cnpj";
import {
  buildAddress,
  buildLandlinePhone,
  buildPastDate,
  clampCount,
  COMPANY_LEGAL_TYPES,
  COMPANY_SECTORS,
  FANTASY_PREFIXES,
  FANTASY_SUFFIXES,
  maybe,
  pick,
  randomUf,
  slugify,
  SURNAMES,
} from "@/lib/dados";
import type { Address, GeneratedRecord } from "@/lib/dados";

export const MAX_BATCH_SIZE = 25;

export type Empresa = {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  naturezaJuridica: string;
  dataAbertura: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: Address;
};

export type GenerateEmpresaOptions = {
  count?: number;
  uf?: string;
};

function buildRazaoSocial(sector: string, suffix: string): string {
  const surname = pick(SURNAMES);
  if (maybe(0.3)) {
    return `${surname} & ${pick(SURNAMES)} ${sector} ${suffix}`;
  }
  return `${surname} ${sector} ${suffix}`;
}

function buildNomeFantasia(): string {
  const prefix = pick(FANTASY_PREFIXES);
  const suffix = pick(FANTASY_SUFFIXES);
  return maybe(0.5) ? `${prefix} ${suffix}` : `${prefix}${suffix}`;
}

function generateOne(uf: string | undefined): Empresa {
  const resolvedUf = uf ?? randomUf();
  const sector = pick(COMPANY_SECTORS);
  const legal = pick(COMPANY_LEGAL_TYPES);
  const nomeFantasia = buildNomeFantasia();
  const currentYear = new Date().getFullYear();

  return {
    razaoSocial: buildRazaoSocial(sector, legal.suffix),
    nomeFantasia,
    cnpj: generateCnpj({ format: "numeric", count: 1, formatted: true })[0],
    naturezaJuridica: legal.nature,
    dataAbertura: buildPastDate(1990, currentYear - 1),
    email: `contato@${slugify(nomeFantasia)}.com.br`,
    telefone: buildLandlinePhone(resolvedUf),
    cep: generateCep({ count: 1, formatted: true, uf: resolvedUf })[0],
    endereco: buildAddress(resolvedUf),
  };
}

export function generateEmpresa(options: GenerateEmpresaOptions = {}): Empresa[] {
  const { count = 1, uf } = options;
  const total = clampCount(count, MAX_BATCH_SIZE);
  return Array.from({ length: total }, () => generateOne(uf));
}

export function empresaToRecord(empresa: Empresa): GeneratedRecord {
  const { endereco } = empresa;
  return {
    title: empresa.razaoSocial,
    subtitle: `${empresa.nomeFantasia} · ${endereco.cidade}/${endereco.uf}`,
    fields: [
      { label: "Nome fantasia", value: empresa.nomeFantasia },
      { label: "CNPJ", value: empresa.cnpj, mono: true },
      { label: "Natureza jurídica", value: empresa.naturezaJuridica },
      { label: "Abertura", value: empresa.dataAbertura },
      { label: "E-mail", value: empresa.email, mono: true },
      { label: "Telefone", value: empresa.telefone, mono: true },
      { label: "CEP", value: empresa.cep, mono: true },
      {
        label: "Endereço",
        value: `${endereco.logradouro}, ${endereco.numero} — ${endereco.bairro}`,
      },
      { label: "Cidade/UF", value: `${endereco.cidade}/${endereco.uf}` },
    ],
  };
}
