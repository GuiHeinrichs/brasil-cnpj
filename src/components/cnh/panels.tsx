"use client";

import { CNH_SEGMENTS } from "@/components/cnh/segments";
import { GeneratorPanel } from "@/components/doc-tool/generator-panel";
import { splitDocList } from "@/components/doc-tool/split";
import { ValidatorPanel } from "@/components/doc-tool/validator-panel";
import type { DocValidationView } from "@/components/doc-tool/validator-panel";
import { CNH_LENGTH, generateCnh, MAX_BATCH_SIZE, validateCnh } from "@/lib/cnh";

export function CnhGeneratorPanel() {
  return (
    <GeneratorPanel
      label="CNH"
      pluralLabel="CNHs"
      resultsLabel={(count) => `${count} CNHs geradas`}
      emptyDisplay="•••••••••••"
      maxBatch={MAX_BATCH_SIZE}
      segments={CNH_SEGMENTS}
      length={CNH_LENGTH}
      generate={({ count }) => generateCnh({ count })}
      maskToggle={false}
    />
  );
}

export function CnhValidatorPanel() {
  return (
    <ValidatorPanel
      label="CNHs para validar"
      placeholder={"12345678900\n11111111111"}
      segments={CNH_SEGMENTS}
      length={CNH_LENGTH}
      validate={(input) =>
        splitDocList(input).map((value): DocValidationView => {
          const result = validateCnh(value);
          if (result.valid) {
            return { value, valid: true, formatted: result.normalized };
          }
          return { value, valid: false, error: result.error };
        })
      }
    />
  );
}
