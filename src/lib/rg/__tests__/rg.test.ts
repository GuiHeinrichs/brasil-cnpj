import { describe, expect, it } from "vitest";

import {
  calculateCheckDigit,
  generateRg,
  isValidRg,
  mask,
  RG_REGEX,
  strip,
  validateRg,
} from "../index";

describe("RG — cálculo do DV", () => {
  it("calcula o DV pela convenção SSP-SP", () => {
    // 24.598.973 → soma 2·2+4·3+5·4+9·5+8·6+9·7+7·8+3·9 = 275; 275%11=0; 11-0=11 → 0
    expect(calculateCheckDigit("24598973")).toBe("0");
  });

  it("produz X quando 11 − resto é 10", () => {
    // 60000000 → soma 6·2 = 12; 12%11=1; 11-1=10 → 'X'
    expect(calculateCheckDigit("60000000")).toBe("X");
  });

  it("é internamente consistente com o validador", () => {
    const base = "39485012";
    expect(isValidRg(`${base}${calculateCheckDigit(base)}`)).toBe(true);
  });
});

describe("RG — máscara", () => {
  it("aplica e remove a máscara, preservando X", () => {
    expect(mask("12345678X")).toBe("12.345.678-X");
    expect(strip("12.345.678-X")).toBe("12345678X");
    expect(strip("12.345.678-x")).toBe("12345678X");
  });
});

describe("RG — geração e validação", () => {
  it("gera RGs válidos no formato esperado", () => {
    const results = generateRg({ count: 50 });
    expect(results).toHaveLength(50);
    for (const rg of results) {
      expect(rg).toMatch(RG_REGEX);
      expect(isValidRg(rg)).toBe(true);
    }
  });

  it("aceita entrada com máscara e rejeita DV errado", () => {
    const rg = generateRg({ count: 1, formatted: true })[0];
    expect(validateRg(rg).valid).toBe(true);
    expect(validateRg("12.345.678-9").valid).toBe(
      isValidRg("123456789"),
    );
    expect(validateRg("123").valid).toBe(false);
  });

  it("limita a quantidade ao máximo do lote", () => {
    expect(generateRg({ count: 999 })).toHaveLength(100);
  });
});
