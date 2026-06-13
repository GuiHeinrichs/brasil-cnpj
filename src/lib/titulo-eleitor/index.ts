export const TITULO_LENGTH = 12;
export const TITULO_SEQ_LENGTH = 8;
export const TITULO_REGEX = /^\d{12}$/;
export const MAX_BATCH_SIZE = 100;

/** Códigos de UF do TSE (dígitos 9–10), ordenados por código. */
export const TITULO_UFS = [
  { code: "01", uf: "SP" },
  { code: "02", uf: "MG" },
  { code: "03", uf: "RJ" },
  { code: "04", uf: "RS" },
  { code: "05", uf: "BA" },
  { code: "06", uf: "PR" },
  { code: "07", uf: "CE" },
  { code: "08", uf: "PE" },
  { code: "09", uf: "SC" },
  { code: "10", uf: "GO" },
  { code: "11", uf: "MA" },
  { code: "12", uf: "PB" },
  { code: "13", uf: "PA" },
  { code: "14", uf: "ES" },
  { code: "15", uf: "PI" },
  { code: "16", uf: "RN" },
  { code: "17", uf: "AL" },
  { code: "18", uf: "MT" },
  { code: "19", uf: "MS" },
  { code: "20", uf: "DF" },
  { code: "21", uf: "SE" },
  { code: "22", uf: "AM" },
  { code: "23", uf: "RO" },
  { code: "24", uf: "AC" },
  { code: "25", uf: "AP" },
  { code: "26", uf: "RR" },
  { code: "27", uf: "TO" },
  { code: "28", uf: "ZZ (Exterior)" },
] as const;

export type TituloUf = (typeof TITULO_UFS)[number];

export type TituloValidationResult =
  | { valid: true; normalized: string; formatted: string; uf: TituloUf | null }
  | { valid: false; error: string };

export type GenerateTituloOptions = {
  count?: number;
  formatted?: boolean;
  /** Código de UF (dígitos 9–10). Aleatório quando omitido. */
  ufCode?: string;
};

const SP_MG = new Set(["01", "02"]);

export function tituloUfOf(normalized: string): TituloUf | null {
  const code = normalized.slice(8, 10);
  return TITULO_UFS.find((entry) => entry.code === code) ?? null;
}

export function strip(titulo: string): string {
  return titulo.replace(/[.\-\s]/g, "");
}

/** Agrupa em blocos de 4 (1234 5678 2097) — forma usual de exibição. */
export function format(titulo: string): string {
  const normalized = strip(titulo);
  if (normalized.length !== TITULO_LENGTH) {
    return titulo;
  }

  return `${normalized.slice(0, 4)} ${normalized.slice(4, 8)} ${normalized.slice(8, 12)}`;
}

function applyRest(rest: number, ufCode: string, withException: boolean): number {
  if (rest === 10) {
    return 0;
  }
  if (withException && rest === 0 && SP_MG.has(ufCode)) {
    return 1;
  }
  return rest;
}

function checkDigits(seq8: string, ufCode: string, withException: boolean): string {
  let sum1 = 0;
  for (let i = 0; i < TITULO_SEQ_LENGTH; i++) {
    sum1 += Number(seq8[i]) * (i + 2);
  }
  const dv1 = applyRest(sum1 % 11, ufCode, withException);

  const sum2 = Number(ufCode[0]) * 7 + Number(ufCode[1]) * 8 + dv1 * 9;
  const dv2 = applyRest(sum2 % 11, ufCode, withException);

  return `${dv1}${dv2}`;
}

/**
 * Pesos 2→9 sobre o sequencial; depois 7, 8 e 9 sobre UF + 1º DV.
 * Resto 10 vira 0; em títulos de SP e MG, resto 0 vira 1 (regra do TSE).
 */
export function calculateCheckDigits(seq8: string, ufCode: string): string {
  return checkDigits(seq8, ufCode, true);
}

/**
 * Sequenciais de SP/MG em que algum resto é 0: validadores com e sem a
 * exceção do TSE discordam — a geração os evita.
 */
export function isContestedBase(seq8: string, ufCode: string): boolean {
  if (!SP_MG.has(ufCode)) {
    return false;
  }
  return checkDigits(seq8, ufCode, true) !== checkDigits(seq8, ufCode, false);
}

export function isValidTitulo(titulo: string): boolean {
  if (!TITULO_REGEX.test(titulo)) {
    return false;
  }

  const ufCode = titulo.slice(8, 10);
  if (tituloUfOf(titulo) === null) {
    return false;
  }

  const expectedDv = calculateCheckDigits(titulo.slice(0, TITULO_SEQ_LENGTH), ufCode);
  return titulo.slice(10) === expectedDv;
}

export function validateTitulo(input: string): TituloValidationResult {
  const normalized = strip(input);

  if (normalized.length !== TITULO_LENGTH) {
    return {
      valid: false,
      error: "Título deve ter 12 dígitos (sem espaços).",
    };
  }

  if (!TITULO_REGEX.test(normalized)) {
    return {
      valid: false,
      error: "Caracteres inválidos. O título usa apenas dígitos 0-9.",
    };
  }

  if (tituloUfOf(normalized) === null) {
    return {
      valid: false,
      error: "Código de UF inválido nos dígitos 9–10 (use 01 a 28).",
    };
  }

  if (!isValidTitulo(normalized)) {
    return {
      valid: false,
      error: "Dígitos verificadores inválidos.",
    };
  }

  return {
    valid: true,
    normalized,
    formatted: format(normalized),
    uf: tituloUfOf(normalized),
  };
}

function randomDigits(length: number): string {
  let digits = "";
  for (let i = 0; i < length; i++) {
    digits += Math.floor(Math.random() * 10).toString();
  }
  return digits;
}

function clampCount(count: number): number {
  return Math.min(Math.max(Math.floor(count), 1), MAX_BATCH_SIZE);
}

function randomUfCode(): string {
  return TITULO_UFS[Math.floor(Math.random() * TITULO_UFS.length)].code;
}

function generateOne(ufCode?: string): string {
  const uf = ufCode ?? randomUfCode();

  for (let attempt = 0; attempt < 100; attempt++) {
    const seq = randomDigits(TITULO_SEQ_LENGTH);
    if (isContestedBase(seq, uf)) {
      continue;
    }
    return `${seq}${uf}${calculateCheckDigits(seq, uf)}`;
  }

  const seq = randomDigits(TITULO_SEQ_LENGTH);
  return `${seq}${uf}${calculateCheckDigits(seq, uf)}`;
}

export function generateTitulo(options: GenerateTituloOptions = {}): string[] {
  const { count = 1, formatted = false, ufCode } = options;
  const total = clampCount(count);

  const results = Array.from({ length: total }, () => generateOne(ufCode));

  if (!formatted) {
    return results;
  }

  return results.map((titulo) => format(titulo));
}
