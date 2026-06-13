import { calculateCheckDigits } from "./check-digit";
import { ALPHANUMERIC_CHARSET, ALPHANUMERIC_REGEX, CNPJ_BASE_LENGTH } from "./constants";

export function isValidAlphanumeric(cnpj: string): boolean {
  if (!ALPHANUMERIC_REGEX.test(cnpj)) {
    return false;
  }

  const base = cnpj.slice(0, CNPJ_BASE_LENGTH);
  const expectedDv = calculateCheckDigits(base, "alphanumeric");
  return cnpj.slice(CNPJ_BASE_LENGTH) === expectedDv;
}

export function randomAlphanumericBase(): string {
  let base = "";
  for (let i = 0; i < CNPJ_BASE_LENGTH; i++) {
    const index = Math.floor(Math.random() * ALPHANUMERIC_CHARSET.length);
    base += ALPHANUMERIC_CHARSET[index];
  }
  return base;
}

export function generateAlphanumeric(): string {
  const base = randomAlphanumericBase();
  const dv = calculateCheckDigits(base, "alphanumeric");
  return `${base}${dv}`;
}
