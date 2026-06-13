export const PLACA_LENGTH = 7;
/** Padrão antigo: ABC-1234 (3 letras + 4 dígitos). */
export const PLACA_ANTIGA_REGEX = /^[A-Z]{3}\d{4}$/;
/** Padrão Mercosul: ABC1D23 (letra na 5ª posição). */
export const PLACA_MERCOSUL_REGEX = /^[A-Z]{3}\d[A-Z]\d{2}$/;
export const MAX_BATCH_SIZE = 100;

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
/** Conversão do 5º caractere ao migrar antiga → Mercosul (0=A … 9=J). */
const DIGIT_TO_LETTER = "ABCDEFGHIJ";

export type PlacaFormat = "mercosul" | "antiga";

export type PlacaValidationResult =
  | { valid: true; normalized: string; formatted: string; format: PlacaFormat }
  | { valid: false; error: string };

export type GeneratePlacaOptions = {
  count?: number;
  /** Formato desejado; aleatório quando omitido. */
  format?: PlacaFormat | "random";
};

export function strip(placa: string): string {
  return placa.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

export function formatOf(placa: string): PlacaFormat | null {
  const normalized = strip(placa);
  if (PLACA_MERCOSUL_REGEX.test(normalized)) return "mercosul";
  if (PLACA_ANTIGA_REGEX.test(normalized)) return "antiga";
  return null;
}

/** Exibição usual: hífen no padrão antigo, sem separador no Mercosul. */
export function display(placa: string): string {
  const normalized = strip(placa);
  if (PLACA_ANTIGA_REGEX.test(normalized)) {
    return `${normalized.slice(0, 3)}-${normalized.slice(3)}`;
  }
  return normalized;
}

/** Converte uma placa antiga para o padrão Mercosul equivalente. */
export function toMercosul(placa: string): string | null {
  const normalized = strip(placa);
  if (!PLACA_ANTIGA_REGEX.test(normalized)) {
    return PLACA_MERCOSUL_REGEX.test(normalized) ? normalized : null;
  }
  const fifth = DIGIT_TO_LETTER[Number(normalized[4])];
  return `${normalized.slice(0, 4)}${fifth}${normalized.slice(5)}`;
}

export function validatePlaca(input: string): PlacaValidationResult {
  const normalized = strip(input);

  if (normalized.length !== PLACA_LENGTH) {
    return {
      valid: false,
      error: "A placa deve ter 7 caracteres.",
    };
  }

  const format = formatOf(normalized);
  if (format === null) {
    return {
      valid: false,
      error: "Formato inválido. Use ABC1D23 (Mercosul) ou ABC-1234 (antiga).",
    };
  }

  return {
    valid: true,
    normalized,
    formatted: display(normalized),
    format,
  };
}

function randomLetter(): string {
  return LETTERS[Math.floor(Math.random() * LETTERS.length)];
}

function randomDigit(): string {
  return Math.floor(Math.random() * 10).toString();
}

function clampCount(count: number): number {
  return Math.min(Math.max(Math.floor(count), 1), MAX_BATCH_SIZE);
}

function generateOne(format: PlacaFormat): string {
  const letters = `${randomLetter()}${randomLetter()}${randomLetter()}`;
  if (format === "mercosul") {
    return `${letters}${randomDigit()}${randomLetter()}${randomDigit()}${randomDigit()}`;
  }
  return `${letters}${randomDigit()}${randomDigit()}${randomDigit()}${randomDigit()}`;
}

export function generatePlaca(options: GeneratePlacaOptions = {}): string[] {
  const { count = 1, format = "random" } = options;
  const total = clampCount(count);

  return Array.from({ length: total }, () => {
    const chosen: PlacaFormat =
      format === "random"
        ? Math.random() < 0.5
          ? "mercosul"
          : "antiga"
        : format;
    return display(generateOne(chosen));
  });
}
