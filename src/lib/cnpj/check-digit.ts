import { CHECK_DIGIT_WEIGHTS } from "./constants";
import type { CnpjFormat } from "./types";

export function charToValue(char: string, format: CnpjFormat): number {
  if (format === "alphanumeric") {
    return char.charCodeAt(0) - 48;
  }
  return Number(char);
}

export function calculateCheckDigit(base: string, format: CnpjFormat): number {
  let sum = 0;
  const length = base.length;

  for (let i = length - 1; i >= 0; i--) {
    const positionFromRight = length - 1 - i;
    const weight = CHECK_DIGIT_WEIGHTS[positionFromRight % 8];
    sum += charToValue(base[i], format) * weight;
  }

  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function calculateCheckDigits(base12: string, format: CnpjFormat): string {
  const first = calculateCheckDigit(base12, format);
  const second = calculateCheckDigit(`${base12}${first}`, format);
  return `${first}${second}`;
}
