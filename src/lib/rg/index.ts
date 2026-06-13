export const RG_LENGTH = 9;
export const RG_BASE_LENGTH = 8;
/** Normalizado (maiúsculo): 8 dígitos + DV 0–9 ou X. */
export const RG_REGEX = /^\d{8}[0-9X]$/;
export const RG_MASKED_REGEX = /^\d{2}\.\d{3}\.\d{3}-[0-9X]$/;
export const MAX_BATCH_SIZE = 100;

/** Pesos da base (8 dígitos), da esquerda para a direita. */
const WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9] as const;

export type RgValidationResult =
  | { valid: true; normalized: string; formatted: string }
  | { valid: false; error: string };

export type GenerateRgOptions = {
  count?: number;
  formatted?: boolean;
};

export function strip(rg: string): string {
  return rg.replace(/[.\-\s]/g, "").toUpperCase();
}

export function mask(rg: string): string {
  const normalized = strip(rg);
  if (normalized.length !== RG_LENGTH) {
    return rg;
  }
  return `${normalized.slice(0, 2)}.${normalized.slice(2, 5)}.${normalized.slice(5, 8)}-${normalized.slice(8)}`;
}

/**
 * Convenção da SSP-SP, a mais usada pelos validadores online: pesos 2–9 sobre
 * os 8 dígitos; DV = 11 − (soma mod 11); resultado 10 vira X e 11 vira 0.
 */
export function calculateCheckDigit(base8: string): string {
  let sum = 0;
  for (let i = 0; i < RG_BASE_LENGTH; i++) {
    sum += Number(base8[i]) * WEIGHTS[i];
  }

  const dv = 11 - (sum % 11);
  if (dv === 10) return "X";
  if (dv === 11) return "0";
  return String(dv);
}

export function isValidRg(rg: string): boolean {
  const normalized = strip(rg);
  if (!RG_REGEX.test(normalized)) {
    return false;
  }
  return calculateCheckDigit(normalized.slice(0, RG_BASE_LENGTH)) === normalized.slice(8);
}

export function validateRg(input: string): RgValidationResult {
  const normalized = strip(input);

  if (normalized.length !== RG_LENGTH) {
    return {
      valid: false,
      error: "RG deve ter 9 caracteres (8 dígitos + DV).",
    };
  }

  if (!RG_REGEX.test(normalized)) {
    return {
      valid: false,
      error: "Formato inválido. Use 8 dígitos e o DV (0-9 ou X).",
    };
  }

  if (!isValidRg(normalized)) {
    return {
      valid: false,
      error: "Dígito verificador inválido (padrão SSP-SP).",
    };
  }

  return {
    valid: true,
    normalized,
    formatted: mask(normalized),
  };
}

function randomDigits(length: number): string {
  let digits = "";
  for (let i = 0; i < length; i++) {
    digits += Math.floor(Math.random() * 10).toString();
  }
  return digits;
}

function clampCount(count: number): number {
  return Math.min(Math.max(Math.floor(count), 1), MAX_BATCH_SIZE);
}

function generateOne(): string {
  const base = randomDigits(RG_BASE_LENGTH);
  return `${base}${calculateCheckDigit(base)}`;
}

export function generateRg(options: GenerateRgOptions = {}): string[] {
  const { count = 1, formatted = false } = options;
  const total = clampCount(count);

  const results = Array.from({ length: total }, () => generateOne());

  if (!formatted) {
    return results;
  }

  return results.map((rg) => mask(rg));
}
