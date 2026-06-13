import { ALPHANUMERIC_REGEX, CNPJ_LENGTH, NUMERIC_REGEX } from "./constants";
import type { CnpjFormat } from "./types";

export function strip(cnpj: string): string {
  return cnpj.replace(/[.\-/]/g, "").toUpperCase();
}

export function mask(cnpj: string): string {
  const normalized = strip(cnpj);
  if (normalized.length !== CNPJ_LENGTH) {
    return cnpj;
  }

  return `${normalized.slice(0, 2)}.${normalized.slice(2, 5)}.${normalized.slice(5, 8)}/${normalized.slice(8, 12)}-${normalized.slice(12, 14)}`;
}

export function detectFormat(normalized: string): CnpjFormat | null {
  if (normalized.length !== CNPJ_LENGTH) {
    return null;
  }

  if (NUMERIC_REGEX.test(normalized)) {
    return "numeric";
  }

  if (ALPHANUMERIC_REGEX.test(normalized)) {
    return "alphanumeric";
  }

  return null;
}

export function isValidStructure(normalized: string): boolean {
  return detectFormat(normalized) !== null;
}
