"use client";

import { FormatterPanel } from "@/components/doc-tool/formatter-panel";
import { GeneratorPanel } from "@/components/doc-tool/generator-panel";
import { splitDocList } from "@/components/doc-tool/split";
import { ValidatorPanel } from "@/components/doc-tool/validator-panel";
import type { DocValidationView } from "@/components/doc-tool/validator-panel";
import { RG_SEGMENTS } from "@/components/rg/segments";
import {
  generateRg,
  mask,
  MAX_BATCH_SIZE,
  RG_LENGTH,
  strip,
  validateRg,
} from "@/lib/rg";

export function RgGeneratorPanel() {
  return (
    <GeneratorPanel
      label="RG"
      pluralLabel="RGs"
      resultsLabel={(count) => `${count} RGs gerados`}
      emptyDisplay="••.•••.•••-•"
      maxBatch={MAX_BATCH_SIZE}
      segments={RG_SEGMENTS}
      length={RG_LENGTH}
      generate={({ count, formatted }) => generateRg({ count, formatted })}
    />
  );
}

export function RgValidatorPanel() {
  return (
    <ValidatorPanel
      label="RGs para validar"
      placeholder={"12.345.678-9\n39.485.012-3"}
      segments={RG_SEGMENTS}
      length={RG_LENGTH}
      validate={(input) =>
        splitDocList(input).map((value): DocValidationView => {
          const result = validateRg(value);
          if (result.valid) {
            return { value, valid: true, formatted: result.formatted };
          }
          return { value, valid: false, error: result.error };
        })
      }
    />
  );
}

export function RgFormatterPanel() {
  return (
    <FormatterPanel
      label="RG"
      placeholder="12.345.678-9 ou 123456789"
      helper="Aplica ou remove a máscara 00.000.000-0. O DV pode ser X."
      segments={RG_SEGMENTS}
      length={RG_LENGTH}
      mask={mask}
      strip={strip}
    />
  );
}
