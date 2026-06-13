import { describe, expect, it } from "vitest";

import { strip as stripCep, ufOf } from "@/lib/cep";
import { validateCnpj } from "@/lib/cnpj";

import { empresaToRecord, generateEmpresa } from "../index";

describe("Empresa", () => {
  it("gera empresas com CNPJ válido e CEP da UF", () => {
    const empresas = generateEmpresa({ count: 15, uf: "PR" });
    expect(empresas).toHaveLength(15);

    for (const empresa of empresas) {
      expect(validateCnpj(empresa.cnpj).valid).toBe(true);
      expect(ufOf(stripCep(empresa.cep))?.uf).toBe("PR");
      expect(empresa.razaoSocial).toMatch(/(LTDA|ME|EIRELI|S\.A\.|EPP)$/);
      expect(empresa.email).toContain("@");
    }
  });

  it("converte para ficha com os campos esperados", () => {
    const record = empresaToRecord(generateEmpresa()[0]);
    const labels = record.fields.map((field) => field.label);
    expect(labels).toContain("CNPJ");
    expect(labels).toContain("Natureza jurídica");
  });

  it("limita o lote a 25", () => {
    expect(generateEmpresa({ count: 999 })).toHaveLength(25);
  });
});
