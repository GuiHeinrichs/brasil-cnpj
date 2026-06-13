import { generateAlphanumeric } from "./alphanumeric";
import { MAX_BATCH_SIZE } from "./constants";
import { mask } from "./format";
import { generateNumeric } from "./numeric";
import type { CnpjFormat, GenerateOptions } from "./types";

function clampCount(count: number): number {
  return Math.min(Math.max(Math.floor(count), 1), MAX_BATCH_SIZE);
}

function generateOne(format: CnpjFormat): string {
  return format === "numeric" ? generateNumeric() : generateAlphanumeric();
}

export function generateCnpj(options: GenerateOptions): string[] {
  const { format, count = 1, formatted = false } = options;
  const total = clampCount(count);

  const results = Array.from({ length: total }, () => generateOne(format));

  if (!formatted) {
    return results;
  }

  return results.map((cnpj) => mask(cnpj));
}
