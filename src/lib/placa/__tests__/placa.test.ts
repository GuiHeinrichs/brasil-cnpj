import { describe, expect, it } from "vitest";

import {
  display,
  formatOf,
  generatePlaca,
  PLACA_ANTIGA_REGEX,
  PLACA_MERCOSUL_REGEX,
  strip,
  toMercosul,
  validatePlaca,
} from "../index";

describe("Placa — formato", () => {
  it("detecta Mercosul e antiga", () => {
    expect(formatOf("ABC1D23")).toBe("mercosul");
    expect(formatOf("ABC-1234")).toBe("antiga");
    expect(formatOf("AB12345")).toBeNull();
  });

  it("normaliza e exibe com hífen apenas no padrão antigo", () => {
    expect(strip("abc-1234")).toBe("ABC1234");
    expect(display("ABC1234")).toBe("ABC-1234");
    expect(display("ABC1D23")).toBe("ABC1D23");
  });

  it("converte antiga para Mercosul (0=A … 9=J)", () => {
    expect(toMercosul("ABC-1234")).toBe("ABC1C34");
    expect(toMercosul("ABC1C34")).toBe("ABC1C34");
  });
});

describe("Placa — geração", () => {
  it("gera placas Mercosul válidas", () => {
    const placas = generatePlaca({ count: 30, format: "mercosul" });
    for (const placa of placas) {
      expect(strip(placa)).toMatch(PLACA_MERCOSUL_REGEX);
      expect(validatePlaca(placa).valid).toBe(true);
    }
  });

  it("gera placas antigas válidas com hífen", () => {
    const placas = generatePlaca({ count: 30, format: "antiga" });
    for (const placa of placas) {
      expect(placa).toMatch(/^[A-Z]{3}-\d{4}$/);
      expect(strip(placa)).toMatch(PLACA_ANTIGA_REGEX);
      const result = validatePlaca(placa);
      expect(result.valid).toBe(true);
      if (result.valid) expect(result.format).toBe("antiga");
    }
  });

  it("limita o lote", () => {
    expect(generatePlaca({ count: 999 })).toHaveLength(100);
  });
});
