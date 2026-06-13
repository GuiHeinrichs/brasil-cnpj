export { calculateCheckDigit, calculateCheckDigits, charToValue } from "./check-digit";
export {
  ALPHANUMERIC_CHARSET,
  ALPHANUMERIC_REGEX,
  CNPJ_BASE_LENGTH,
  CNPJ_LENGTH,
  MAX_BATCH_SIZE,
  NUMERIC_REGEX,
} from "./constants";
export { generateCnpj } from "./generate";
export { detectFormat, isValidStructure, mask, strip } from "./format";
export { generateAlphanumeric, isValidAlphanumeric } from "./alphanumeric";
export { generateNumeric, isTrivialSequence, isValidNumeric } from "./numeric";
export type {
  CnpjFormat,
  GenerateOptions,
  ValidationFailure,
  ValidationResult,
  ValidationSuccess,
} from "./types";
export { validateCnpj, validateCnpjBatch } from "./validate";
