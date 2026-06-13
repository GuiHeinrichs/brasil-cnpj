import { calculateCheckDigits } from "./check-digit";
import { CPF_BASE_LENGTH, MAX_BATCH_SIZE } from "./constants";
import { mask } from "./format";
import type { GenerateCpfOptions } from "./types";
import { isTrivialSequence } from "./validate";

function clampCount(count: number): number {
  return Math.min(Math.max(Math.floor(count), 1), MAX_BATCH_SIZE);
}

function randomDigits(length: number): string {
  let digits = "";
  for (let i = 0; i < length; i++) {
    digits += Math.floor(Math.random() * 10).toString();
  }
  return digits;
}

function generateOne(regionDigit?: string): string {
  for (let attempt = 0; attempt < 100; attempt++) {
    const base =
      randomDigits(CPF_BASE_LENGTH - 1) + (regionDigit ?? randomDigits(1));
    const cpf = `${base}${calculateCheckDigits(base)}`;
    if (!isTrivialSequence(cpf)) {
      return cpf;
    }
  }

  const base =
    randomDigits(CPF_BASE_LENGTH - 1) + (regionDigit ?? randomDigits(1));
  return `${base}${calculateCheckDigits(base)}`;
}

export function generateCpf(options: GenerateCpfOptions = {}): string[] {
  const { count = 1, formatted = false, regionDigit } = options;
  const total = clampCount(count);

  const results = Array.from({ length: total }, () => generateOne(regionDigit));

  if (!formatted) {
    return results;
  }

  return results.map((cpf) => mask(cpf));
}
