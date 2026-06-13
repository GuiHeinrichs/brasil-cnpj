export const RENAVAM_LENGTH = 11;
export const RENAVAM_BASE_LENGTH = 10;
export const RENAVAM_REGEX = /^\d{11}$/;
export const MAX_BATCH_SIZE = 100;

const WEIGHTS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const;

export type RenavamValidationResult =
  | { valid: true; normalized: string }
  | { valid: false; error: string };

export type GenerateRenavamOptions = {
  count?: number;
};

export function strip(renavam: string): string {
  return renavam.replace(/[.\-\s]/g, "");
}

/**
 * Completa com zeros à esquerda até 11 dígitos: RENAVAMs anteriores a 2013
 * tinham 9 dígitos e continuam válidos no formato atual com zeros à frente.
 */
export function pad(renavam: string): string {
  const normalized = strip(renavam);
  if (!/^\d{9,11}$/.test(normalized)) {
    return normalized;
  }
  return normalized.padStart(RENAVAM_LENGTH, "0");
}

/** Pesos 3,2,9,8,7,6,5,4,3,2; DV = (soma × 10) mod 11; 10 vira 0. */
export function calculateCheckDigit(base10: string): number {
  let sum = 0;
  for (let i = 0; i < RENAVAM_BASE_LENGTH; i++) {
    sum += Number(base10[i]) * WEIGHTS[i];
  }

  const dv = (sum * 10) % 11;
  return dv >= 10 ? 0 : dv;
}

export function isTrivialSequence(renavam: string): boolean {
  return /^(\d)\1{10}$/.test(renavam);
}

export function isValidRenavam(renavam: string): boolean {
  if (!RENAVAM_REGEX.test(renavam)) {
    return false;
  }

  if (isTrivialSequence(renavam)) {
    return false;
  }

  const expectedDv = calculateCheckDigit(renavam.slice(0, RENAVAM_BASE_LENGTH));
  return Number(renavam[RENAVAM_BASE_LENGTH]) === expectedDv;
}

export function validateRenavam(input: string): RenavamValidationResult {
  const normalized = pad(input);

  if (normalized.length !== RENAVAM_LENGTH || !RENAVAM_REGEX.test(normalized)) {
    return {
      valid: false,
      error: "RENAVAM deve ter de 9 a 11 dígitos (zeros à esquerda são completados).",
    };
  }

  if (isTrivialSequence(normalized)) {
    return {
      valid: false,
      error: "Sequência inválida (todos os dígitos iguais).",
    };
  }

  if (!isValidRenavam(normalized)) {
    return {
      valid: false,
      error: "Dígito verificador inválido.",
    };
  }

  return { valid: true, normalized };
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
    const base = randomDigits(RENAVAM_BASE_LENGTH);
    const renavam = `${base}${calculateCheckDigit(base)}`;
    if (!isTrivialSequence(renavam)) {
      return renavam;
    }
  }

  const base = randomDigits(RENAVAM_BASE_LENGTH);
  return `${base}${calculateCheckDigit(base)}`;
}

export function generateRenavam(options: GenerateRenavamOptions = {}): string[] {
  const { count = 1 } = options;
  const total = clampCount(count);
  return Array.from({ length: total }, () => generateOne());
}
