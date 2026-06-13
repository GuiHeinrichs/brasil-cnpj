import { describe, expect, it } from "vitest";

import {
  calculateCheckDigits,
  detectFormat,
  generateCnpj,
  isValidAlphanumeric,
  mask,
  strip,
  validateCnpj,
} from "../index";

describe("CNPJ alfanumérico — exemplo Serpro", () => {
  const serproExample = "12.ABC.345/01DE-35";
  const serproBase = "12ABC34501DE";

  it("calcula DV 35 para base 12ABC34501DE", () => {
    expect(calculateCheckDigits(serproBase, "alphanumeric")).toBe("35");
  });

  it("valida exemplo oficial formatado", () => {
    const result = validateCnpj(serproExample);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.format).toBe("alphanumeric");
      expect(result.normalized).toBe("12ABC34501DE35");
      expect(result.formatted).toBe(serproExample);
    }
  });

  it("valida exemplo sem máscara", () => {
    expect(isValidAlphanumeric("12ABC34501DE35")).toBe(true);
  });
});

describe("CNPJ numérico", () => {
  const validNumeric = "11222333000181";

  it("valida CNPJ numérico conhecido", () => {
    const result = validateCnpj(validNumeric);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.format).toBe("numeric");
    }
  });

  it("rejeita sequência trivial", () => {
    const result = validateCnpj("11111111111111");
    expect(result.valid).toBe(false);
  });

  it("rejeita DV incorreto", () => {
    const result = validateCnpj("11222333000180");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toContain("verificadores");
    }
  });
});

describe("CNPJ alfanumérico — casos inválidos", () => {
  it("rejeita letras nos dígitos verificadores", () => {
    const result = validateCnpj("12ABC34501DE3A");
    expect(result.valid).toBe(false);
  });

  it("rejeita DV incorreto", () => {
    expect(isValidAlphanumeric("12ABC34501DE00")).toBe(false);
  });
});

describe("formatação", () => {
  it("remove máscara", () => {
    expect(strip("12.ABC.345/01DE-35")).toBe("12ABC34501DE35");
  });

  it("aplica máscara", () => {
    expect(mask("11222333000181")).toBe("11.222.333/0001-81");
    expect(mask("12ABC34501DE35")).toBe("12.ABC.345/01DE-35");
  });

  it("detecta formato", () => {
    expect(detectFormat("11222333000181")).toBe("numeric");
    expect(detectFormat("12ABC34501DE35")).toBe("alphanumeric");
  });
});

describe("geração", () => {
  it("gera CNPJ numérico válido", () => {
    const [cnpj] = generateCnpj({ format: "numeric", count: 1 });
    expect(validateCnpj(cnpj).valid).toBe(true);
  });

  it("gera CNPJ alfanumérico válido", () => {
    const [cnpj] = generateCnpj({ format: "alphanumeric", count: 1 });
    expect(validateCnpj(cnpj).valid).toBe(true);
  });

  it("gera lote respeitando limite", () => {
    const batch = generateCnpj({ format: "numeric", count: 5 });
    expect(batch).toHaveLength(5);
    batch.forEach((cnpj) => {
      expect(validateCnpj(cnpj).valid).toBe(true);
    });
  });

  it("gera com máscara quando solicitado", () => {
    const [cnpj] = generateCnpj({
      format: "numeric",
      count: 1,
      formatted: true,
    });
    expect(cnpj).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
  });
});
