import { isValidAlphanumeric } from "./alphanumeric";
import { detectFormat, mask, strip } from "./format";
import { isValidNumeric } from "./numeric";
import type { ValidationResult } from "./types";

export function validateCnpj(input: string): ValidationResult {
  const normalized = strip(input);

  if (normalized.length !== 14) {
    return {
      valid: false,
      error: "CNPJ deve ter 14 caracteres (sem máscara).",
    };
  }

  const format = detectFormat(normalized);

  if (!format) {
    const hasInvalidChars = /[^0-9A-Z]/.test(normalized);
    if (hasInvalidChars) {
      return {
        valid: false,
        error: "Caracteres inválidos. Use 0-9, A-Z (maiúsculas) nos 12 primeiros e dígitos nos 2 últimos.",
      };
    }

    if (/[A-Z]/.test(normalized.slice(12))) {
      return {
        valid: false,
        error: "Os dois últimos caracteres (dígitos verificadores) devem ser numéricos.",
      };
    }

    return {
      valid: false,
      error: "Formato de CNPJ não reconhecido.",
    };
  }

  const isValid =
    format === "numeric"
      ? isValidNumeric(normalized)
      : isValidAlphanumeric(normalized);

  if (!isValid) {
    if (format === "numeric" && /^(\d)\1{13}$/.test(normalized)) {
      return {
        valid: false,
        error: "Sequência inválida (todos os dígitos iguais).",
      };
    }

    return {
      valid: false,
      error: "Dígitos verificadores inválidos.",
    };
  }

  return {
    valid: true,
    format,
    normalized,
    formatted: mask(normalized),
  };
}

export function validateCnpjBatch(input: string): ValidationResult[] {
  const items = input
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return items.map((item) => validateCnpj(item));
}
