"use client";

import { GeneratorPanel } from "@/components/doc-tool/generator-panel";
import { splitDocList } from "@/components/doc-tool/split";
import { ValidatorPanel } from "@/components/doc-tool/validator-panel";
import type { DocValidationView } from "@/components/doc-tool/validator-panel";
import { PLACA_SEGMENTS } from "@/components/placa/segments";
import {
  generatePlaca,
  MAX_BATCH_SIZE,
  PLACA_LENGTH,
  validatePlaca,
} from "@/lib/placa";

const FORMAT_SELECT = {
  id: "format",
  label: "Formato",
  options: [
    { value: "random", label: "Aleatório" },
    { value: "mercosul", label: "Mercosul (ABC1D23)" },
    { value: "antiga", label: "Antiga (ABC-1234)" },
  ],
};

export function PlacaGeneratorPanel() {
  return (
    <GeneratorPanel
      label="Placa"
      pluralLabel="Placas"
      resultsLabel={(count) => `${count} placas geradas`}
      emptyDisplay="•••-••••"
      maxBatch={MAX_BATCH_SIZE}
      segments={PLACA_SEGMENTS}
      length={PLACA_LENGTH}
      generate={({ count, selectValue }) =>
        generatePlaca({
          count,
          format: (selectValue ?? "random") as "random" | "mercosul" | "antiga",
        })
      }
      select={FORMAT_SELECT}
      maskToggle={false}
    />
  );
}

export function PlacaValidatorPanel() {
  return (
    <ValidatorPanel
      label="Placas para validar"
      placeholder={"ABC1D23\nABC-1234"}
      segments={PLACA_SEGMENTS}
      length={PLACA_LENGTH}
      validate={(input) =>
        splitDocList(input).map((value): DocValidationView => {
          const result = validatePlaca(value);
          if (result.valid) {
            return {
              value,
              valid: true,
              formatted: result.formatted,
              badge: result.format === "mercosul" ? "Mercosul" : "Antiga",
            };
          }
          return { value, valid: false, error: result.error };
        })
      }
    />
  );
}
