import { describe, expect, it } from "vitest";

import { FIRST_NAMES_F, FIRST_NAMES_M } from "@/lib/dados";

import { generateNome } from "../index";

describe("Nome", () => {
  it("gera a quantidade pedida", () => {
    expect(generateNome({ count: 10 })).toHaveLength(10);
  });

  it("respeita o sexo escolhido", () => {
    for (const nome of generateNome({ count: 20, gender: "M" })) {
      expect(FIRST_NAMES_M).toContain(nome.split(" ")[0]);
    }
    for (const nome of generateNome({ count: 20, gender: "F" })) {
      expect(FIRST_NAMES_F).toContain(nome.split(" ")[0]);
    }
  });

  it("tem nome e ao menos um sobrenome", () => {
    for (const nome of generateNome({ count: 20 })) {
      expect(nome.split(" ").length).toBeGreaterThanOrEqual(2);
    }
  });

  it("limita o lote", () => {
    expect(generateNome({ count: 999 })).toHaveLength(100);
  });
});
