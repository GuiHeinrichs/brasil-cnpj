export type CnpjFormat = "numeric" | "alphanumeric";

export type GenerateOptions = {
  format: CnpjFormat;
  count?: number;
  formatted?: boolean;
};

export type ValidationSuccess = {
  valid: true;
  format: CnpjFormat;
  normalized: string;
  formatted: string;
};

export type ValidationFailure = {
  valid: false;
  error: string;
};

export type ValidationResult = ValidationSuccess | ValidationFailure;
