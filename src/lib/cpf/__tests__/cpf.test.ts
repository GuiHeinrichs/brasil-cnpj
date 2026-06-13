import { describe, expect, it } from "vitest";

import {
  calculateCheckDigits,
  CPF_MASKED_REGEX,
  CPF_REGEX,
  fiscalRegionOf,
  generateCpf,
  isValidCpf,
  mask,
  strip,
  validateCpf,
} from "../index";

describe("CPF — exemplo clássico", () => {
  it("calcula DV 09 para base 123456789", () => {
    expect(calculateCheckDigits("123456789")).toBe("09");
  });

  it("valida exemplo formatado e detecta a região fiscal", () => {
    const result = validateCpf("123.456.789-09");
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.normalized).toBe("12345678909");
      expect(result.formatted).toBe("123.456.789-09");
      expect(result.region?.ordinal).toBe("9ª");
      expect(result.region?.states).toBe("PR, SC");
    }
  });

  it("valida exemplo sem máscara", () => {
    expect(isValidCpf("12345678909")).toBe(true);
  });
});

describe("CPF — erros", () => {
  it("rejeita sequência com todos os dígitos iguais", () => {
    const result = validateCpf("111.111.111-11");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe("Sequência inválida (todos os dígitos iguais).");
    }
  });

  it("rejeita dígitos verificadores incorretos", () => {
    const result = validateCpf("123.456.789-00");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe("Dígitos verificadores inválidos.");
    }
  });

  it("rejeita comprimento incorreto", () => {
    expect(validateCpf("123").valid).toBe(false);
  });

  it("rejeita caracteres não numéricos", () => {
    const result = validateCpf("12345678A09");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe("Caracteres inválidos. O CPF usa apenas dígitos 0-9.");
    }
  });
});

describe("CPF — geração", () => {
  it("gera CPFs válidos em lote", () => {
    const results = generateCpf({ count: 20 });
    expect(results).toHaveLength(20);
    for (const cpf of results) {
      expect(cpf).toMatch(CPF_REGEX);
      expect(isValidCpf(cpf)).toBe(true);
    }
  });

  it("gera com máscara", () => {
    const [cpf] = generateCpf({ formatted: true });
    expect(cpf).toMatch(CPF_MASKED_REGEX);
  });

  it("respeita a região fiscal escolhida", () => {
    const results = generateCpf({ count: 10, regionDigit: "8" });
    for (const cpf of results) {
      expect(cpf[8]).toBe("8");
      expect(fiscalRegionOf(cpf)?.states).toBe("SP");
      expect(isValidCpf(cpf)).toBe(true);
    }
  });

  it("limita a quantidade ao máximo do lote", () => {
    expect(generateCpf({ count: 999 })).toHaveLength(100);
  });
});

describe("CPF — máscara", () => {
  it("aplica e remove a máscara", () => {
    expect(mask("12345678909")).toBe("123.456.789-09");
    expect(strip("123.456.789-09")).toBe("12345678909");
  });

  it("não mascara comprimento inválido", () => {
    expect(mask("123")).toBe("123");
  });
});
