"use client";

import { CEP_SEGMENTS } from "@/components/cep/segments";
import { FormatterPanel } from "@/components/doc-tool/formatter-panel";
import { GeneratorPanel } from "@/components/doc-tool/generator-panel";
import { splitDocList } from "@/components/doc-tool/split";
import { ValidatorPanel } from "@/components/doc-tool/validator-panel";
import type { DocValidationView } from "@/components/doc-tool/validator-panel";
import {
  CEP_LENGTH,
  CEP_UFS,
  generateCep,
  mask,
  MAX_BATCH_SIZE,
  strip,
  ufOf,
} from "@/lib/cep";

const UF_SELECT = {
  id: "uf",
  label: "Estado (UF)",
  options: [
    { value: "random", label: "Aleatório" },
    ...CEP_UFS.map((entry) => ({
      value: entry.uf,
      label: `${entry.uf} — ${entry.name}`,
    })),
  ],
};

export function CepGeneratorPanel() {
  return (
    <GeneratorPanel
      label="CEP"
      pluralLabel="CEPs"
      resultsLabel={(count) => `${count} CEPs gerados`}
      emptyDisplay="•••••-•••"
      maxBatch={MAX_BATCH_SIZE}
      segments={CEP_SEGMENTS}
      length={CEP_LENGTH}
      generate={({ count, formatted, selectValue }) =>
        generateCep({
          count,
          formatted,
          uf: selectValue === "random" ? undefined : selectValue,
        })
      }
      select={UF_SELECT}
      maskToggle={{ on: "Com hífen", off: "Sem hífen" }}
    />
  );
}

export function CepLocatorPanel() {
  return (
    <ValidatorPanel
      label="CEPs para localizar"
      placeholder={"01310-100\n90010-150"}
      segments={CEP_SEGMENTS}
      length={CEP_LENGTH}
      validate={(input) =>
        splitDocList(input).map((value): DocValidationView => {
          const normalized = strip(value);
          if (normalized.length !== CEP_LENGTH) {
            return { value, valid: false, error: "CEP deve ter 8 dígitos." };
          }
          const uf = ufOf(normalized);
          if (!uf) {
            return {
              value,
              valid: false,
              error: "Fora das faixas de CEP dos Correios.",
            };
          }
          return {
            value,
            valid: true,
            formatted: mask(normalized),
            badge: `${uf.uf} · ${uf.name}`,
          };
        })
      }
    />
  );
}

export function CepFormatterPanel() {
  return (
    <FormatterPanel
      label="CEP"
      placeholder="01310-100 ou 01310100"
      helper="Aplica ou remove a máscara 00000-000."
      segments={CEP_SEGMENTS}
      length={CEP_LENGTH}
      mask={mask}
      strip={strip}
    />
  );
}
