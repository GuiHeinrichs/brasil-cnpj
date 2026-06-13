/**
 * O 9º dígito do CPF identifica a Região Fiscal (RF) da Receita Federal
 * responsável pela inscrição. O dígito 0 corresponde à 10ª RF.
 */
export const FISCAL_REGIONS = [
  { digit: "1", ordinal: "1ª", states: "DF, GO, MS, MT, TO" },
  { digit: "2", ordinal: "2ª", states: "AC, AM, AP, PA, RO, RR" },
  { digit: "3", ordinal: "3ª", states: "CE, MA, PI" },
  { digit: "4", ordinal: "4ª", states: "AL, PB, PE, RN" },
  { digit: "5", ordinal: "5ª", states: "BA, SE" },
  { digit: "6", ordinal: "6ª", states: "MG" },
  { digit: "7", ordinal: "7ª", states: "ES, RJ" },
  { digit: "8", ordinal: "8ª", states: "SP" },
  { digit: "9", ordinal: "9ª", states: "PR, SC" },
  { digit: "0", ordinal: "10ª", states: "RS" },
] as const;

export type FiscalRegion = (typeof FISCAL_REGIONS)[number];

export function fiscalRegionOf(normalized: string): FiscalRegion | null {
  const digit = normalized[8];
  return FISCAL_REGIONS.find((region) => region.digit === digit) ?? null;
}
