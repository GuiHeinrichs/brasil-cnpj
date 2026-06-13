import { describe, expect, it } from "vitest";

import {
  calculateCheckDigit,
  generatePis,
  isValidPis,
  mask,
  PIS_MASKED_REGEX,
  PIS_REGEX,
  strip,
  validatePis,
} from "../index";

describe("PIS/PASEP — cálculo do DV", () => {
  it("calcula DV 0 para base 1234567890", () => {
    expect(calculateCheckDigit("1234567890")).toBe(0);
  });

  it("calcula DV 1 para base 1201661918", () => {
    expect(calculateCheckDigit("1201661918")).toBe(1);
  });

  it("valida PIS conhecido com máscara", () => {
    const result = validatePis("120.16619.18-1");
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.normalized).toBe("12016619181");
      expect(result.formatted).toBe("120.16619.18-1");
    }
  });
});

describe("PIS/PASEP — erros", () => {
  it("rejeita sequência com todos os dígitos iguais", () => {
    expect(validatePis("11111111111").valid).toBe(false);
  });

  it("rejeita dígito verificador incorreto", () => {
    expect(validatePis("12345678905").valid).toBe(false);
  });

  it("rejeita comprimento incorreto", () => {
    expect(validatePis("123").valid).toBe(false);
  });
});

describe("PIS/PASEP — geração", () => {
  it("gera números válidos em lote", () => {
    const results = generatePis({ count: 30 });
    expect(results).toHaveLength(30);
    for (const pis of results) {
      expect(pis).toMatch(PIS_REGEX);
      expect(isValidPis(pis)).toBe(true);
    }
  });

  it("gera com máscara", () => {
    const [pis] = generatePis({ formatted: true });
    expect(pis).toMatch(PIS_MASKED_REGEX);
  });
});

describe("PIS/PASEP — máscara", () => {
  it("aplica e remove a máscara", () => {
    expect(mask("12345678900")).toBe("123.45678.90-0");
    expect(strip("123.45678.90-0")).toBe("12345678900");
  });
});
