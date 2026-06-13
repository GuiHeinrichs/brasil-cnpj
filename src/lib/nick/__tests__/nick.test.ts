import { describe, expect, it } from "vitest";

import { generateNick } from "../index";

describe("Nick", () => {
  it("gera a quantidade pedida", () => {
    expect(generateNick({ count: 10 })).toHaveLength(10);
  });

  it("estilo limpo usa apenas letras", () => {
    for (const nick of generateNick({ count: 20, style: "limpo" })) {
      expect(nick).toMatch(/^[A-Za-z]+$/);
    }
  });

  it("estilo underscore segue adjetivo_substantivo_NN", () => {
    for (const nick of generateNick({ count: 20, style: "underscore" })) {
      expect(nick).toMatch(/^[a-z]+_[a-z]+_\d{2}$/);
    }
  });

  it("estilo números termina em dígito", () => {
    for (const nick of generateNick({ count: 20, style: "numeros" })) {
      expect(nick).toMatch(/\d$/);
    }
  });

  it("limita o lote", () => {
    expect(generateNick({ count: 999 })).toHaveLength(100);
  });
});
