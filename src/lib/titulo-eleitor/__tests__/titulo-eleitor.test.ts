import { describe, expect, it } from "vitest";

import {
  calculateCheckDigits,
  format,
  generateTitulo,
  isContestedBase,
  isValidTitulo,
  strip,
  TITULO_REGEX,
  validateTitulo,
} from "../index";

describe("Título de Eleitor — cálculo do DV", () => {
  it("calcula DV 91 para sequencial 12345678 em SP (01)", () => {
    expect(calculateCheckDigits("12345678", "01")).toBe("91");
  });

  it("calcula DV 97 para sequencial 12345678 no DF (20)", () => {
    expect(calculateCheckDigits("12345678", "20")).toBe("97");
  });

  it("aplica a exceção SP/MG: resto 0 vira 1", () => {
    // Sequencial 11111111: soma 44, resto 0 → DV1 = 1 em SP.
    expect(calculateCheckDigits("11111111", "01")).toBe("16");
    expect(isValidTitulo("111111110116")).toBe(true);
  });

  it("valida título conhecido com detecção de UF", () => {
    const result = validateTitulo("1234 5678 2097");
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.normalized).toBe("123456782097");
      expect(result.formatted).toBe("1234 5678 2097");
      expect(result.uf?.uf).toBe("DF");
    }
  });
});

describe("Título de Eleitor — erros", () => {
  it("rejeita código de UF inválido", () => {
    const result = validateTitulo("123456789997");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe("Código de UF inválido nos dígitos 9–10 (use 01 a 28).");
    }
  });

  it("rejeita dígitos verificadores incorretos", () => {
    expect(validateTitulo("123456782096").valid).toBe(false);
  });

  it("rejeita comprimento incorreto", () => {
    expect(validateTitulo("123").valid).toBe(false);
  });
});

describe("Título de Eleitor — geração", () => {
  it("gera títulos válidos em lote", () => {
    const results = generateTitulo({ count: 30 });
    expect(results).toHaveLength(30);
    for (const titulo of results) {
      expect(titulo).toMatch(TITULO_REGEX);
      expect(isValidTitulo(titulo)).toBe(true);
    }
  });

  it("respeita a UF escolhida e evita casos ambíguos em SP", () => {
    const results = generateTitulo({ count: 30, ufCode: "01" });
    for (const titulo of results) {
      expect(titulo.slice(8, 10)).toBe("01");
      expect(isValidTitulo(titulo)).toBe(true);
      expect(isContestedBase(titulo.slice(0, 8), "01")).toBe(false);
    }
  });

  it("gera com espaços", () => {
    const [titulo] = generateTitulo({ formatted: true });
    expect(titulo).toMatch(/^\d{4} \d{4} \d{4}$/);
  });
});

describe("Título de Eleitor — formatação", () => {
  it("agrupa em blocos de 4 e remove espaços", () => {
    expect(format("123456782097")).toBe("1234 5678 2097");
    expect(strip("1234 5678 2097")).toBe("123456782097");
  });
});
