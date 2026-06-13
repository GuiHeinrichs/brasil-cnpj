import { CPF_LENGTH, CPF_REGEX } from "./constants";

export function strip(cpf: string): string {
  return cpf.replace(/[.\-]/g, "");
}

export function mask(cpf: string): string {
  const normalized = strip(cpf);
  if (normalized.length !== CPF_LENGTH) {
    return cpf;
  }

  return `${normalized.slice(0, 3)}.${normalized.slice(3, 6)}.${normalized.slice(6, 9)}-${normalized.slice(9, 11)}`;
}

export function isValidStructure(normalized: string): boolean {
  return CPF_REGEX.test(normalized);
}
