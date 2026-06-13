import { CEP_UFS } from "@/lib/cep";

import {
  CITIES_BY_UF,
  DDD_BY_UF,
  EMAIL_DOMAINS,
  FIRST_NAMES_F,
  FIRST_NAMES_M,
  NEIGHBORHOODS,
  STREET_NAMES,
  STREET_TYPES,
  SURNAMES,
} from "./data";
import { maybe, pick, pickSome, randomInt, slugify } from "./random";

export type { GeneratedRecord, RecordField } from "./types";
export { recordToText } from "./types";
export * from "./random";
export * from "./data";

export type Gender = "M" | "F";

export type Address = {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
};

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** Lista de UFs (sigla + nome) reaproveitada das faixas de CEP. */
export const UFS = CEP_UFS.map((entry) => ({ uf: entry.uf, name: entry.name }));

export function randomUf(): string {
  return pick(UFS).uf;
}

export function ufName(uf: string): string {
  return UFS.find((entry) => entry.uf === uf)?.name ?? uf;
}

export function firstNameFor(gender: Gender): string {
  return pick(gender === "M" ? FIRST_NAMES_M : FIRST_NAMES_F);
}

export function randomSurnames(count: number): string[] {
  return pickSome(SURNAMES, count);
}

export function buildFullName(gender: Gender): {
  first: string;
  surnames: string[];
  full: string;
} {
  const first = firstNameFor(gender);
  const surnames = randomSurnames(maybe(0.7) ? 2 : 1);
  return { first, surnames, full: [first, ...surnames].join(" ") };
}

export function buildEmail(first: string, surnames: string[]): string {
  const last = surnames[surnames.length - 1] ?? "";
  const separator = pick([".", "_", ""]);
  const suffix = maybe(0.6) ? String(randomInt(1, 999)) : "";
  const local = `${slugify(first)}${separator}${slugify(last)}${suffix}`;
  return `${local}@${pick(EMAIL_DOMAINS)}`;
}

export function buildMobilePhone(uf: string): string {
  const ddd = pick(DDD_BY_UF[uf] ?? [11]);
  const part1 = String(randomInt(0, 9999)).padStart(4, "0");
  const part2 = String(randomInt(0, 9999)).padStart(4, "0");
  return `(${pad2(ddd)}) 9${part1}-${part2}`;
}

export function buildLandlinePhone(uf: string): string {
  const ddd = pick(DDD_BY_UF[uf] ?? [11]);
  const prefix = randomInt(2, 5);
  const part1 = String(randomInt(0, 999)).padStart(3, "0");
  const part2 = String(randomInt(0, 9999)).padStart(4, "0");
  return `(${pad2(ddd)}) ${prefix}${part1}-${part2}`;
}

function computeAge(birth: Date, today: Date): number {
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

export function buildBirthDate(
  minAge: number,
  maxAge: number,
): { date: string; age: number } {
  const today = new Date();
  const targetAge = randomInt(minAge, maxAge);
  const year = today.getFullYear() - targetAge;
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  const birth = new Date(year, month - 1, day);
  return {
    date: `${pad2(day)}/${pad2(month)}/${year}`,
    age: computeAge(birth, today),
  };
}

export function buildPastDate(minYear: number, maxYear: number): string {
  const year = randomInt(minYear, maxYear);
  return `${pad2(randomInt(1, 28))}/${pad2(randomInt(1, 12))}/${year}`;
}

export function buildAddress(uf: string): Address {
  const cidades = CITIES_BY_UF[uf] ?? ["Centro"];
  return {
    logradouro: `${pick(STREET_TYPES)} ${pick(STREET_NAMES)}`,
    numero: String(randomInt(1, 4999)),
    bairro: pick(NEIGHBORHOODS),
    cidade: pick(cidades),
    uf,
  };
}
