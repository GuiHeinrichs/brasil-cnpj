export const CNH_LENGTH = 11;
export const CNH_BASE_LENGTH = 9;
export const CNH_REGEX = /^\d{11}$/;
export const MAX_BATCH_SIZE = 100;

export type CnhValidationResult =
  | { valid: true; normalized: string }
  | { valid: false; error: string };

export type GenerateCnhOptions = {
  count?: number;
};

export function strip(cnh: string): string {
  return cnh.replace(/[.\-\s]/g, "");
}

function firstRest(base9: string): number {
  let sum = 0;
  for (let i = 0; i < CNH_BASE_LENGTH; i++) {
    sum += Number(base9[i]) * (9 - i);
  }
  return sum % 11;
}

/**
 * Regra clássica do DETRAN: pesos 9→1 para o 1º DV e 1→9 para o 2º, ambos
 * módulo 11 (resto 10 vira 0). Quando o resto do 1º DV é 10, o 2º sofre
 * desconto de 2 ("dsc") — zona em que validadores conhecidos divergem entre
 * si; combinações que resultariam em DV negativo não têm DV válido (null).
 */
export function calculateCheckDigits(base9: string): string | null {
  const rest1 = firstRest(base9);
  const dv1 = rest1 >= 10 ? 0 : rest1;
  const dsc = rest1 >= 10 ? 2 : 0;

  let sum2 = 0;
  for (let i = 0; i < CNH_BASE_LENGTH; i++) {
    sum2 += Number(base9[i]) * (i + 1);
  }
  const rest2 = sum2 % 11;
  const dv2 = rest2 >= 10 ? 0 : rest2 - dsc;
  if (dv2 < 0) {
    return null;
  }

  return `${dv1}${dv2}`;
}

/** Bases com resto 10 no 1º DV: validadores divergem — a geração as evita. */
export function isContestedBase(base9: string): boolean {
  return firstRest(base9) === 10;
}

export function isTrivialSequence(cnh: string): boolean {
  return /^(\d)\1{10}$/.test(cnh);
}

export function isValidCnh(cnh: string): boolean {
  if (!CNH_REGEX.test(cnh)) {
    return false;
  }

  if (isTrivialSequence(cnh)) {
    return false;
  }

  const expectedDv = calculateCheckDigits(cnh.slice(0, CNH_BASE_LENGTH));
  return expectedDv !== null && cnh.slice(CNH_BASE_LENGTH) === expectedDv;
}

export function validateCnh(input: string): CnhValidationResult {
  const normalized = strip(input);

  if (normalized.length !== CNH_LENGTH) {
    return {
      valid: false,
      error: "CNH deve ter 11 dígitos.",
    };
  }

  if (!CNH_REGEX.test(normalized)) {
    return {
      valid: false,
      error: "Caracteres inválidos. A CNH usa apenas dígitos 0-9.",
    };
  }

  if (isTrivialSequence(normalized)) {
    return {
      valid: false,
      error: "Sequência inválida (todos os dígitos iguais).",
    };
  }

  if (!isValidCnh(normalized)) {
    return {
      valid: false,
      error: "Dígitos verificadores inválidos.",
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
    const base = randomDigits(CNH_BASE_LENGTH);
    if (isContestedBase(base)) {
      continue;
    }
    const dv = calculateCheckDigits(base);
    if (dv === null) {
      continue;
    }
    const cnh = `${base}${dv}`;
    if (!isTrivialSequence(cnh)) {
      return cnh;
    }
  }

  // Fallback improvável: aceita qualquer base com DV calculável.
  const base = randomDigits(CNH_BASE_LENGTH);
  const dv = calculateCheckDigits(base) ?? "00";
  return `${base}${dv}`;
}

export function generateCnh(options: GenerateCnhOptions = {}): string[] {
  const { count = 1 } = options;
  const total = clampCount(count);
  return Array.from({ length: total }, () => generateOne());
}
