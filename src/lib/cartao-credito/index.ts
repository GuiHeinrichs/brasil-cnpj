export const CARTAO_LENGTH = 16;
export const CARTAO_REGEX = /^\d{16}$/;
export const CARTAO_MASKED_REGEX = /^\d{4} \d{4} \d{4} \d{4}$/;
export const MAX_BATCH_SIZE = 100;

/**
 * Bandeiras suportadas. Todas usam 16 dígitos e passam no algoritmo de Luhn.
 * `prefixes` lista BINs/IINs reais usados para detecção e geração; para gerar,
 * sorteia-se um prefixo e completam-se os dígitos restantes antes do DV.
 */
export type Brand = {
  id: string;
  label: string;
  /** Prefixos (BIN) que identificam a bandeira, em ordem de especificidade. */
  prefixes: string[];
  /** Regex de detecção — mais preciso que os prefixos para faixas amplas. */
  pattern: RegExp;
};

export const BRANDS: Brand[] = [
  {
    id: "visa",
    label: "Visa",
    prefixes: ["4"],
    pattern: /^4\d{15}$/,
  },
  {
    id: "mastercard",
    label: "Mastercard",
    prefixes: ["51", "52", "53", "54", "55", "2221", "2720"],
    pattern: /^(5[1-5]\d{14}|2(22[1-9]|2[3-9]\d|[3-6]\d{2}|7[01]\d|720)\d{12})$/,
  },
  {
    id: "elo",
    label: "Elo",
    prefixes: [
      "401178",
      "401179",
      "438935",
      "457631",
      "457632",
      "504175",
      "627780",
      "636297",
      "636368",
      "651652",
      "650485",
      "650538",
      "650700",
      "650901",
    ],
    pattern:
      /^(401178|401179|438935|457631|457632|504175|627780|636297|636368|651652|650485|650538|650700|650901)\d{10}$/,
  },
  {
    id: "hipercard",
    label: "Hipercard",
    prefixes: ["606282"],
    pattern: /^606282\d{10}$/,
  },
];

export type CartaoValidationResult =
  | { valid: true; normalized: string; formatted: string; brand: Brand | null }
  | { valid: false; error: string };

export type GenerateCartaoOptions = {
  count?: number;
  formatted?: boolean;
  /** Id da bandeira; aleatória quando omitido. */
  brandId?: string;
};

export function strip(value: string): string {
  return value.replace(/\D/g, "");
}

/** Agrupa em blocos de 4 (1234 5678 9012 3456). */
export function mask(value: string): string {
  const normalized = strip(value);
  if (normalized.length !== CARTAO_LENGTH) {
    return value;
  }
  return normalized.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/**
 * Bandeiras ordenadas pelo BIN mais longo primeiro: Elo e Hipercard usam
 * prefixos de 6 dígitos que caem dentro das faixas amplas de Visa (4) e
 * Mastercard, então precisam ser testados antes para vencer o empate.
 */
const DETECTION_ORDER = [...BRANDS].sort(
  (a, b) =>
    Math.max(...b.prefixes.map((p) => p.length)) -
    Math.max(...a.prefixes.map((p) => p.length)),
);

export function detectBrand(value: string): Brand | null {
  const normalized = strip(value);
  return DETECTION_ORDER.find((brand) => brand.pattern.test(normalized)) ?? null;
}

/** DV de Luhn para um número sem o dígito verificador. */
export function luhnCheckDigit(partial: string): number {
  let sum = 0;
  let double = true;
  for (let i = partial.length - 1; i >= 0; i--) {
    let digit = Number(partial[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return (10 - (sum % 10)) % 10;
}

export function isLuhnValid(value: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = Number(value[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return value.length > 0 && sum % 10 === 0;
}

export function validateCartao(input: string): CartaoValidationResult {
  const normalized = strip(input);

  if (normalized.length !== CARTAO_LENGTH) {
    return {
      valid: false,
      error: "O cartão deve ter 16 dígitos.",
    };
  }

  if (!isLuhnValid(normalized)) {
    return {
      valid: false,
      error: "Dígito verificador inválido (algoritmo de Luhn).",
    };
  }

  return {
    valid: true,
    normalized,
    formatted: mask(normalized),
    brand: detectBrand(normalized),
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

function generateOne(brandId?: string): string {
  const brand =
    BRANDS.find((entry) => entry.id === brandId) ??
    BRANDS[Math.floor(Math.random() * BRANDS.length)];

  const prefix = brand.prefixes[Math.floor(Math.random() * brand.prefixes.length)];
  const body = prefix + randomDigits(CARTAO_LENGTH - 1 - prefix.length);
  return `${body}${luhnCheckDigit(body)}`;
}

export function generateCartao(options: GenerateCartaoOptions = {}): string[] {
  const { count = 1, formatted = false, brandId } = options;
  const total = clampCount(count);

  const results = Array.from({ length: total }, () => generateOne(brandId));

  if (!formatted) {
    return results;
  }

  return results.map((value) => mask(value));
}
