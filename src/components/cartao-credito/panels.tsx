"use client";

import { CARTAO_SEGMENTS } from "@/components/cartao-credito/segments";
import { FormatterPanel } from "@/components/doc-tool/formatter-panel";
import { GeneratorPanel } from "@/components/doc-tool/generator-panel";
import { splitDocList } from "@/components/doc-tool/split";
import { ValidatorPanel } from "@/components/doc-tool/validator-panel";
import type { DocValidationView } from "@/components/doc-tool/validator-panel";
import {
  BRANDS,
  CARTAO_LENGTH,
  generateCartao,
  mask,
  MAX_BATCH_SIZE,
  strip,
  validateCartao,
} from "@/lib/cartao-credito";

const BRAND_SELECT = {
  id: "brand",
  label: "Bandeira",
  options: [
    { value: "random", label: "Aleatória" },
    ...BRANDS.map((brand) => ({ value: brand.id, label: brand.label })),
  ],
};

export function CartaoGeneratorPanel() {
  return (
    <GeneratorPanel
      label="Cartão"
      pluralLabel="Cartões"
      resultsLabel={(count) => `${count} cartões gerados`}
      emptyDisplay="•••• •••• •••• ••••"
      maxBatch={MAX_BATCH_SIZE}
      segments={CARTAO_SEGMENTS}
      length={CARTAO_LENGTH}
      generate={({ count, formatted, selectValue }) =>
        generateCartao({
          count,
          formatted,
          brandId: selectValue === "random" ? undefined : selectValue,
        })
      }
      select={BRAND_SELECT}
      maskToggle={{ on: "Com espaços", off: "Sem espaços" }}
    />
  );
}

export function CartaoValidatorPanel() {
  return (
    <ValidatorPanel
      label="Cartões para validar"
      placeholder={"4111 1111 1111 1111\n5555 5555 5555 4444"}
      segments={CARTAO_SEGMENTS}
      length={CARTAO_LENGTH}
      validate={(input) =>
        splitDocList(input).map((value): DocValidationView => {
          const result = validateCartao(value);
          if (result.valid) {
            return {
              value,
              valid: true,
              formatted: result.formatted,
              badge: result.brand?.label ?? "Bandeira não identificada",
            };
          }
          return { value, valid: false, error: result.error };
        })
      }
    />
  );
}

export function CartaoFormatterPanel() {
  return (
    <FormatterPanel
      label="Cartão"
      placeholder="4111111111111111 ou 4111 1111 1111 1111"
      helper="Aplica ou remove o agrupamento em blocos de 4 dígitos."
      segments={CARTAO_SEGMENTS}
      length={CARTAO_LENGTH}
      mask={mask}
      strip={strip}
    />
  );
}
