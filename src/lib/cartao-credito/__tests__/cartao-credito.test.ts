import { describe, expect, it } from "vitest";

import {
  BRANDS,
  CARTAO_REGEX,
  detectBrand,
  generateCartao,
  isLuhnValid,
  luhnCheckDigit,
  mask,
  validateCartao,
} from "../index";

describe("Cartão — Luhn", () => {
  it("calcula o DV de Luhn", () => {
    // 7992739871 → DV 3 (exemplo clássico da Wikipédia)
    expect(luhnCheckDigit("7992739871")).toBe(3);
  });

  it("reconhece um número válido conhecido", () => {
    expect(isLuhnValid("4111111111111111")).toBe(true);
    expect(isLuhnValid("5555555555554444")).toBe(true);
  });

  it("rejeita um número com DV trocado", () => {
    expect(isLuhnValid("4111111111111112")).toBe(false);
  });
});

describe("Cartão — bandeiras", () => {
  it("detecta Visa e Mastercard", () => {
    expect(detectBrand("4111111111111111")?.id).toBe("visa");
    expect(detectBrand("5111111111111118")?.id).toBe("mastercard");
    expect(detectBrand("2221000000000009")?.id).toBe("mastercard");
  });

  it("detecta Hipercard e Elo pelos prefixos", () => {
    const hiper = generateCartao({ brandId: "hipercard" })[0];
    expect(detectBrand(hiper)?.id).toBe("hipercard");
    const elo = generateCartao({ brandId: "elo" })[0];
    expect(detectBrand(elo)?.id).toBe("elo");
  });
});

describe("Cartão — geração", () => {
  it("gera cartões válidos para cada bandeira", () => {
    for (const brand of BRANDS) {
      const cartoes = generateCartao({ count: 20, brandId: brand.id });
      expect(cartoes).toHaveLength(20);
      for (const cartao of cartoes) {
        expect(cartao).toMatch(CARTAO_REGEX);
        expect(isLuhnValid(cartao)).toBe(true);
        expect(detectBrand(cartao)?.id).toBe(brand.id);
      }
    }
  });

  it("formata em blocos de 4 e limita o lote", () => {
    expect(mask("4111111111111111")).toBe("4111 1111 1111 1111");
    expect(generateCartao({ count: 999 })).toHaveLength(100);
  });

  it("validateCartao retorna a bandeira", () => {
    const result = validateCartao("4111 1111 1111 1111");
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.brand?.id).toBe("visa");
      expect(result.formatted).toBe("4111 1111 1111 1111");
    }
  });
});
