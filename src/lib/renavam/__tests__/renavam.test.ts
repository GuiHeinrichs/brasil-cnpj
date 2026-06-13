import { describe, expect, it } from "vitest";

import {
  calculateCheckDigit,
  generateRenavam,
  isValidRenavam,
  pad,
  RENAVAM_REGEX,
  validateRenavam,
} from "../index";

describe("RENAVAM — cálculo do DV", () => {
  it("calcula DV 0 para base 1234567890", () => {
    expect(calculateCheckDigit("1234567890")).toBe(0);
  });

  it("calcula DV 0 para base 6395059071", () => {
    expect(calculateCheckDigit("6395059071")).toBe(0);
  });

  it("valida RENAVAM conhecido", () => {
    expect(isValidRenavam("12345678900")).toBe(true);
  });
});

describe("RENAVAM — zeros à esquerda", () => {
  it("completa RENAVAM antigo de 9 dígitos", () => {
    expect(pad("345678900")).toBe("00345678900");
  });

  it("valida RENAVAM de 9 dígitos quando o DV confere", () => {
    // 0034567890 → DV correspondente calculado sobre a base completada.
    const dv = calculateCheckDigit("0034567890");
    const result = validateRenavam(`34567890${dv}`);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.normalized).toBe(`0034567890${dv}`);
    }
  });
});

describe("RENAVAM — erros", () => {
  it("rejeita sequência com todos os dígitos iguais", () => {
    expect(validateRenavam("11111111111").valid).toBe(false);
  });

  it("rejeita dígito verificador incorreto", () => {
    expect(validateRenavam("12345678905").valid).toBe(false);
  });

  it("rejeita comprimento incorreto", () => {
    expect(validateRenavam("123").valid).toBe(false);
  });
});

describe("RENAVAM — geração", () => {
  it("gera números válidos em lote", () => {
    const results = generateRenavam({ count: 30 });
    expect(results).toHaveLength(30);
    for (const renavam of results) {
      expect(renavam).toMatch(RENAVAM_REGEX);
      expect(isValidRenavam(renavam)).toBe(true);
    }
  });

  it("limita a quantidade ao máximo do lote", () => {
    expect(generateRenavam({ count: 999 })).toHaveLength(100);
  });
});
