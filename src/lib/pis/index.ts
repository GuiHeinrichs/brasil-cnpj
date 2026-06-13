export const PIS_LENGTH = 11;
export const PIS_BASE_LENGTH = 10;
export const PIS_REGEX = /^\d{11}$/;
export const PIS_MASKED_REGEX = /^\d{3}\.\d{5}\.\d{2}-\d$/;
export const MAX_BATCH_SIZE = 100;

const WEIGHTS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const;

export type PisValidationResult =
  | { valid: true; normalized: string; formatted: string }
  | { valid: false; error: string };

export type GeneratePisOptions = {
  count?: number;
  formatted?: boolean;
};

export function strip(pis: string): string {
  return pis.replace(/[.\-\s]/g, "");
}

export function mask(pis: string): string {
  const normalized = strip(pis);
  if (normalized.length !== PIS_LENGTH) {
    return pis;
  }

  return `${normalized.slice(0, 3)}.${normalized.slice(3, 8)}.${normalized.slice(8, 10)}-${normalized.slice(10)}`;
}

/** Pesos 3,2,9,8,7,6,5,4,3,2; DV = 11 − resto; 10 ou 11 viram 0. */
export function calculateCheckDigit(base10: string): number {
  let sum = 0;
  for (let i = 0; i < PIS_BASE_LENGTH; i++) {
    sum += Number(base10[i]) * WEIGHTS[i];
  }

  const dv = 11 - (sum % 11);
  return dv >= 10 ? 0 : dv;
}

export function isTrivialSequence(pis: string): boolean {
  return /^(\d)\1{10}$/.test(pis);
}

export function isValidPis(pis: string): boolean {
  if (!PIS_REGEX.test(pis)) {
    return false;
  }

  if (isTrivialSequence(pis)) {
    return false;
  }

  const expectedDv = calculateCheckDigit(pis.slice(0, PIS_BASE_LENGTH));
  return Number(pis[PIS_BASE_LENGTH]) === expectedDv;
}

export function validatePis(input: string): PisValidationResult {
  const normalized = strip(input);

  if (normalized.length !== PIS_LENGTH) {
    return {
      valid: false,
      error: "PIS/PASEP deve ter 11 dígitos (sem máscara).",
    };
  }

  if (!PIS_REGEX.test(normalized)) {
    return {
      valid: false,
      error: "Caracteres inválidos. O PIS usa apenas dígitos 0-9.",
    };
  }

  if (isTrivialSequence(normalized)) {
    return {
      valid: false,
      error: "Sequência inválida (todos os dígitos iguais).",
    };
  }

  if (!isValidPis(normalized)) {
    return {
      valid: false,
      error: "Dígito verificador inválido.",
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
  for (let attempt = 0; attempt < 100; attempt++) {
    const base = randomDigits(PIS_BASE_LENGTH);
    const pis = `${base}${calculateCheckDigit(base)}`;
    if (!isTrivialSequence(pis)) {
      return pis;
    }
  }

  const base = randomDigits(PIS_BASE_LENGTH);
  return `${base}${calculateCheckDigit(base)}`;
}

export function generatePis(options: GeneratePisOptions = {}): string[] {
  const { count = 1, formatted = false } = options;
  const total = clampCount(count);

  const results = Array.from({ length: total }, () => generateOne());

  if (!formatted) {
    return results;
  }

  return results.map((pis) => mask(pis));
}
