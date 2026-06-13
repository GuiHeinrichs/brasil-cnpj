import type { FiscalRegion } from "./fiscal-region";

export type GenerateCpfOptions = {
  count?: number;
  formatted?: boolean;
  /** 9º dígito (região fiscal). Aleatório quando omitido. */
  regionDigit?: string;
};

export type CpfValidationSuccess = {
  valid: true;
  normalized: string;
  formatted: string;
  region: FiscalRegion | null;
};

export type CpfValidationFailure = {
  valid: false;
  error: string;
};

export type CpfValidationResult = CpfValidationSuccess | CpfValidationFailure;
