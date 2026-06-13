import { describe, expect, it } from "vitest";

import {
  CEP_REGEX,
  CEP_UFS,
  generateCep,
  lookupCep,
  mask,
  strip,
  ufOf,
} from "../index";

describe("CEP — máscara", () => {
  it("aplica e remove a máscara 00000-000", () => {
    expect(mask("01310100")).toBe("01310-100");
    expect(strip("01310-100")).toBe("01310100");
  });
});

describe("CEP — localização da UF", () => {
  it("identifica a UF pela faixa", () => {
    expect(ufOf("01310100")?.uf).toBe("SP");
    expect(ufOf("20040002")?.uf).toBe("RJ");
    expect(ufOf("90010150")?.uf).toBe("RS");
    expect(ufOf("70040900")?.uf).toBe("DF");
  });

  it("retorna null para CEP fora de qualquer faixa", () => {
    // Mantém a forma, mas nenhum estado começa em 00xxxxxx.
    expect(ufOf("00000000")).toBeNull();
  });
});

describe("CEP — geração", () => {
  it("gera CEPs de 8 dígitos dentro da faixa da UF", () => {
    for (const entry of CEP_UFS) {
      const ceps = generateCep({ count: 10, uf: entry.uf });
      for (const cep of ceps) {
        expect(cep).toMatch(CEP_REGEX);
        expect(ufOf(cep)?.uf).toBe(entry.uf);
      }
    }
  });

  it("formata e limita o lote", () => {
    const ceps = generateCep({ count: 999, uf: "SP", formatted: true });
    expect(ceps).toHaveLength(100);
    for (const cep of ceps) {
      expect(cep).toMatch(/^\d{5}-\d{3}$/);
    }
  });

  it("lookupCep devolve a UF do CEP", () => {
    const result = lookupCep("01310-100");
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.uf?.uf).toBe("SP");
      expect(result.formatted).toBe("01310-100");
    }
  });
});
