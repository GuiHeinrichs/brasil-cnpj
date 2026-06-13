import { describe, expect, it } from "vitest";

import {
  calculateCheckDigits,
  CNH_REGEX,
  generateCnh,
  isContestedBase,
  isValidCnh,
  validateCnh,
} from "../index";

/** Variante validation-br (pesos 2→10 e 3,4..11,2): usada para garantir que
 *  números gerados passam também na outra família de validadores. */
function validationBrDv(base9: string): string {
  const digits = [...base9].map(Number);

  let sum1 = 0;
  for (let i = 0; i < 9; i++) sum1 += digits[i] * (i + 2);
  let dv1 = 11 - (sum1 % 11);
  if (dv1 >= 10) dv1 = 0;

  const weights2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 2];
  const withDv1 = [...digits, dv1];
  let sum2 = 0;
  for (let i = 0; i < 10; i++) sum2 += withDv1[i] * weights2[i];
  let dv2 = 11 - (sum2 % 11);
  if (dv2 >= 10) dv2 = 0;

  return `${dv1}${dv2}`;
}

describe("CNH — cálculo do DV", () => {
  it("calcula DV 00 para base 123456789", () => {
    expect(calculateCheckDigits("123456789")).toBe("00");
  });

  it("calcula DV 10 para base 527988023", () => {
    expect(calculateCheckDigits("527988023")).toBe("10");
  });

  it("valida CNH conhecida", () => {
    expect(isValidCnh("12345678900")).toBe(true);
    const result = validateCnh("12345678900");
    expect(result.valid).toBe(true);
  });
});

describe("CNH — erros", () => {
  it("rejeita sequência com todos os dígitos iguais", () => {
    const result = validateCnh("11111111111");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe("Sequência inválida (todos os dígitos iguais).");
    }
  });

  it("rejeita dígitos verificadores incorretos", () => {
    expect(validateCnh("12345678999").valid).toBe(false);
  });

  it("rejeita comprimento incorreto", () => {
    expect(validateCnh("123").valid).toBe(false);
  });
});

describe("CNH — geração", () => {
  it("gera CNHs válidas nas duas famílias de validadores", () => {
    const results = generateCnh({ count: 50 });
    expect(results).toHaveLength(50);
    for (const cnh of results) {
      expect(cnh).toMatch(CNH_REGEX);
      expect(isValidCnh(cnh)).toBe(true);
      expect(isContestedBase(cnh.slice(0, 9))).toBe(false);
      expect(validationBrDv(cnh.slice(0, 9))).toBe(cnh.slice(9));
    }
  });

  it("limita a quantidade ao máximo do lote", () => {
    expect(generateCnh({ count: 999 })).toHaveLength(100);
  });
});
