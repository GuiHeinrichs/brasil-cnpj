import { calculateCheckDigits } from "./check-digit";
import { CNPJ_BASE_LENGTH, NUMERIC_REGEX } from "./constants";

export function isTrivialSequence(cnpj: string): boolean {
  return /^(\d)\1{13}$/.test(cnpj);
}

export function isValidNumeric(cnpj: string): boolean {
  if (!NUMERIC_REGEX.test(cnpj)) {
    return false;
  }

  if (isTrivialSequence(cnpj)) {
    return false;
  }

  const base = cnpj.slice(0, CNPJ_BASE_LENGTH);
  const expectedDv = calculateCheckDigits(base, "numeric");
  return cnpj.slice(CNPJ_BASE_LENGTH) === expectedDv;
}

export function randomNumericBase(): string {
  let base = "";
  for (let i = 0; i < CNPJ_BASE_LENGTH; i++) {
    base += Math.floor(Math.random() * 10).toString();
  }
  return base;
}

export function generateNumeric(): string {
  for (let attempt = 0; attempt < 100; attempt++) {
    const base = randomNumericBase();
    const dv = calculateCheckDigits(base, "numeric");
    const cnpj = `${base}${dv}`;
    if (!isTrivialSequence(cnpj)) {
      return cnpj;
    }
  }

  const base = randomNumericBase();
  const dv = calculateCheckDigits(base, "numeric");
  return `${base}${dv}`;
}
