export const CNPJ_LENGTH = 14;
export const CNPJ_BASE_LENGTH = 12;

export const NUMERIC_REGEX = /^\d{14}$/;
export const ALPHANUMERIC_REGEX = /^[0-9A-Z]{12}\d{2}$/;

export const ALPHANUMERIC_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const CHECK_DIGIT_WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9] as const;

export const MAX_BATCH_SIZE = 100;
