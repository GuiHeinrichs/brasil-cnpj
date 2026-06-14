import { describe, expect, it } from "vitest";

import type { GeneratedRecord } from "@/lib/dados";
import {
  recordsToJson,
  recordsToXml,
  recordToJson,
  recordToXml,
} from "@/lib/dados";

const RECORD: GeneratedRecord = {
  title: "João Silva",
  subtitle: "30 anos · São Paulo/SP",
  titleLabel: "Nome",
  fields: [
    { label: "CPF", value: "123.456.789-09", mono: true },
    { label: "Nome da mãe", value: "Maria Silva" },
    { label: "E-mail", value: "joao@exemplo.com" },
    { label: "Cidade/UF", value: "São Paulo/SP" },
  ],
};

describe("serialização de fichas", () => {
  it("gera JSON com o título e chaves camelCase, ignorando o subtítulo", () => {
    const parsed = JSON.parse(recordToJson(RECORD));
    expect(parsed).toEqual({
      nome: "João Silva",
      cpf: "123.456.789-09",
      nomeDaMae: "Maria Silva",
      email: "joao@exemplo.com",
      cidadeUf: "São Paulo/SP",
    });
  });

  it("gera XML com prólogo, raiz pelo rótulo e campos aninhados", () => {
    const xml = recordToXml(RECORD, "Pessoa");
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<pessoa>");
    expect(xml).toContain("<nome>João Silva</nome>");
    expect(xml).toContain("<cidadeUf>São Paulo/SP</cidadeUf>");
    expect(xml).toContain("</pessoa>");
  });

  it("escapa caracteres especiais de XML no valor", () => {
    const record: GeneratedRecord = {
      title: "Silva & Souza Comércio LTDA",
      titleLabel: "Razão social",
      fields: [{ label: "Observação", value: "a < b > c" }],
    };
    const xml = recordToXml(record, "Empresa");
    expect(xml).toContain(
      "<razaoSocial>Silva &amp; Souza Comércio LTDA</razaoSocial>",
    );
    expect(xml).toContain("<observacao>a &lt; b &gt; c</observacao>");
  });

  it("serializa lotes como array JSON e raiz plural no XML", () => {
    const list = [RECORD, RECORD];
    expect(JSON.parse(recordsToJson(list))).toHaveLength(2);

    const xml = recordsToXml(list, "Pessoa", "Pessoas");
    expect(xml).toContain("<pessoas>");
    expect(xml).toContain("</pessoas>");
    expect(xml.match(/<pessoa>/g)).toHaveLength(2);
  });
});
