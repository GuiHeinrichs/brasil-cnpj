"use client";

import { FormatterPanel } from "@/components/doc-tool/formatter-panel";
import { GeneratorPanel } from "@/components/doc-tool/generator-panel";
import { splitDocList } from "@/components/doc-tool/split";
import { ValidatorPanel } from "@/components/doc-tool/validator-panel";
import type { DocValidationView } from "@/components/doc-tool/validator-panel";
import { PIS_SEGMENTS } from "@/components/pis/segments";
import {
  generatePis,
  mask,
  MAX_BATCH_SIZE,
  PIS_LENGTH,
  strip,
  validatePis,
} from "@/lib/pis";

export function PisGeneratorPanel() {
  return (
    <GeneratorPanel
      label="PIS"
      pluralLabel="PIS"
      resultsLabel={(count) => `${count} números gerados`}
      emptyDisplay="•••.•••••.••-•"
      maxBatch={MAX_BATCH_SIZE}
      segments={PIS_SEGMENTS}
      length={PIS_LENGTH}
      generate={({ count, formatted }) => generatePis({ count, formatted })}
    />
  );
}

export function PisValidatorPanel() {
  return (
    <ValidatorPanel
      label="Números para validar"
      placeholder={"120.16619.18-1\n111.11111.11-1"}
      segments={PIS_SEGMENTS}
      length={PIS_LENGTH}
      validate={(input) =>
        splitDocList(input).map((value): DocValidationView => {
          const result = validatePis(value);
          if (result.valid) {
            return { value, valid: true, formatted: result.formatted };
          }
          return { value, valid: false, error: result.error };
        })
      }
    />
  );
}

export function PisFormatterPanel() {
  return (
    <FormatterPanel
      label="PIS/PASEP"
      placeholder="120.16619.18-1 ou 12016619181"
      helper="Aplica ou remove a máscara 999.99999.99-9."
      segments={PIS_SEGMENTS}
      length={PIS_LENGTH}
      mask={mask}
      strip={strip}
    />
  );
}
