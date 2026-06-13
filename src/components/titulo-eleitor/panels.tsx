"use client";

import { GeneratorPanel } from "@/components/doc-tool/generator-panel";
import { splitDocList } from "@/components/doc-tool/split";
import { ValidatorPanel } from "@/components/doc-tool/validator-panel";
import type { DocValidationView } from "@/components/doc-tool/validator-panel";
import { TITULO_SEGMENTS } from "@/components/titulo-eleitor/segments";
import {
  generateTitulo,
  MAX_BATCH_SIZE,
  TITULO_LENGTH,
  TITULO_UFS,
  validateTitulo,
} from "@/lib/titulo-eleitor";

const UF_SELECT = {
  id: "uf",
  label: "UF (dígitos 9–10)",
  options: [
    { value: "random", label: "Aleatória" },
    ...TITULO_UFS.map((entry) => ({
      value: entry.code,
      label: `${entry.code} — ${entry.uf}`,
    })),
  ],
};

export function TituloGeneratorPanel() {
  return (
    <GeneratorPanel
      label="Título"
      pluralLabel="Títulos"
      resultsLabel={(count) => `${count} títulos gerados`}
      emptyDisplay="•••• •••• ••••"
      maxBatch={MAX_BATCH_SIZE}
      segments={TITULO_SEGMENTS}
      length={TITULO_LENGTH}
      generate={({ count, formatted, selectValue }) =>
        generateTitulo({
          count,
          formatted,
          ufCode: selectValue === "random" ? undefined : selectValue,
        })
      }
      select={UF_SELECT}
      maskToggle={{ on: "Com espaços", off: "Sem espaços" }}
    />
  );
}

export function TituloValidatorPanel() {
  return (
    <ValidatorPanel
      label="Títulos para validar"
      placeholder={"1234 5678 2097\n123456782096"}
      segments={TITULO_SEGMENTS}
      length={TITULO_LENGTH}
      validate={(input) =>
        splitDocList(input).map((value): DocValidationView => {
          const result = validateTitulo(value);
          if (result.valid) {
            return {
              value,
              valid: true,
              formatted: result.formatted,
              badge: result.uf ? `UF ${result.uf.code} · ${result.uf.uf}` : undefined,
            };
          }
          return { value, valid: false, error: result.error };
        })
      }
    />
  );
}
