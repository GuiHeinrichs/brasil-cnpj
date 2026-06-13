"use client";

import { GeneratorPanel } from "@/components/doc-tool/generator-panel";
import { splitDocList } from "@/components/doc-tool/split";
import { ValidatorPanel } from "@/components/doc-tool/validator-panel";
import type { DocValidationView } from "@/components/doc-tool/validator-panel";
import { RENAVAM_SEGMENTS } from "@/components/renavam/segments";
import {
  generateRenavam,
  MAX_BATCH_SIZE,
  RENAVAM_LENGTH,
  validateRenavam,
} from "@/lib/renavam";

export function RenavamGeneratorPanel() {
  return (
    <GeneratorPanel
      label="RENAVAM"
      pluralLabel="RENAVAMs"
      resultsLabel={(count) => `${count} RENAVAMs gerados`}
      emptyDisplay="•••••••••••"
      maxBatch={MAX_BATCH_SIZE}
      segments={RENAVAM_SEGMENTS}
      length={RENAVAM_LENGTH}
      generate={({ count }) => generateRenavam({ count })}
      maskToggle={false}
    />
  );
}

export function RenavamValidatorPanel() {
  return (
    <ValidatorPanel
      label="RENAVAMs para validar"
      placeholder={"12345678900\n345678905"}
      segments={RENAVAM_SEGMENTS}
      length={RENAVAM_LENGTH}
      validate={(input) =>
        splitDocList(input).map((value): DocValidationView => {
          const result = validateRenavam(value);
          if (result.valid) {
            return { value, valid: true, formatted: result.normalized };
          }
          return { value, valid: false, error: result.error };
        })
      }
    />
  );
}
