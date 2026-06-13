import { calculateCheckDigits } from "./check-digit";
import { CPF_BASE_LENGTH, CPF_LENGTH, CPF_REGEX } from "./constants";
import { fiscalRegionOf } from "./fiscal-region";
import { mask, strip } from "./format";
import type { CpfValidationResult } from "./types";

export function isTrivialSequence(cpf: string): boolean {
  return /^(\d)\1{10}$/.test(cpf);
}

export function isValidCpf(cpf: string): boolean {
  if (!CPF_REGEX.test(cpf)) {
    return false;
  }

  if (isTrivialSequence(cpf)) {
    return false;
  }

  const base = cpf.slice(0, CPF_BASE_LENGTH);
  const expectedDv = calculateCheckDigits(base);
  return cpf.slice(CPF_BASE_LENGTH) === expectedDv;
}

export function validateCpf(input: string): CpfValidationResult {
  const normalized = strip(input);

  if (normalized.length !== CPF_LENGTH) {
    return {
      valid: false,
      error: "CPF deve ter 11 dígitos (sem máscara).",
    };
  }

  if (!CPF_REGEX.test(normalized)) {
    return {
      valid: false,
      error: "Caracteres inválidos. O CPF usa apenas dígitos 0-9.",
    };
  }

  if (isTrivialSequence(normalized)) {
    return {
      valid: false,
      error: "Sequência inválida (todos os dígitos iguais).",
    };
  }

  if (!isValidCpf(normalized)) {
    return {
      valid: false,
      error: "Dígitos verificadores inválidos.",
    };
  }

  return {
    valid: true,
    normalized,
    formatted: mask(normalized),
    region: fiscalRegionOf(normalized),
  };
}

export function validateCpfBatch(input: string): CpfValidationResult[] {
  const items = input
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return items.map((item) => validateCpf(item));
}
