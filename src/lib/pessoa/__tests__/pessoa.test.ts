import { describe, expect, it } from "vitest";

import { strip as stripCep, ufOf } from "@/lib/cep";
import { validateCpf } from "@/lib/cpf";
import { UF_TO_REGION_DIGIT } from "@/lib/dados";
import { validateRg } from "@/lib/rg";

import { generatePessoa, pessoaToRecord } from "../index";

describe("Pessoa", () => {
  it("gera registros coerentes com a UF", () => {
    const pessoas = generatePessoa({ count: 15, uf: "SP" });
    expect(pessoas).toHaveLength(15);

    for (const pessoa of pessoas) {
      const cpf = validateCpf(pessoa.cpf);
      expect(cpf.valid).toBe(true);
      if (cpf.valid) {
        expect(cpf.normalized[8]).toBe(UF_TO_REGION_DIGIT.SP);
      }
      expect(validateRg(pessoa.rg).valid).toBe(true);
      expect(ufOf(stripCep(pessoa.cep))?.uf).toBe("SP");
      expect(pessoa.endereco.uf).toBe("SP");
      expect(pessoa.nome.split(" ").length).toBeGreaterThanOrEqual(2);
      expect(pessoa.email).toContain("@");
    }
  });

  it("converte para ficha com os campos esperados", () => {
    const record = pessoaToRecord(generatePessoa({ uf: "RJ" })[0]);
    expect(record.title).toBeTruthy();
    const labels = record.fields.map((field) => field.label);
    expect(labels).toContain("CPF");
    expect(labels).toContain("CEP");
    expect(labels).toContain("E-mail");
  });

  it("limita o lote a 25", () => {
    expect(generatePessoa({ count: 999 })).toHaveLength(25);
  });
});
