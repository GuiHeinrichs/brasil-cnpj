export const CEP_LENGTH = 8;
export const CEP_REGEX = /^\d{8}$/;
export const CEP_MASKED_REGEX = /^\d{5}-\d{3}$/;
export const MAX_BATCH_SIZE = 100;

/**
 * Faixas oficiais de CEP por UF (Correios), como intervalos numéricos de 8
 * dígitos. Alguns estados têm mais de uma faixa (DF, GO e AM). Usadas para
 * gerar CEPs com a região correta e para localizar a UF de um CEP.
 */
export type CepUf = {
  uf: string;
  name: string;
  ranges: [number, number][];
};

export const CEP_UFS: CepUf[] = [
  { uf: "AC", name: "Acre", ranges: [[69900000, 69999999]] },
  { uf: "AL", name: "Alagoas", ranges: [[57000000, 57999999]] },
  { uf: "AM", name: "Amazonas", ranges: [[69000000, 69299999], [69400000, 69899999]] },
  { uf: "AP", name: "Amapá", ranges: [[68900000, 68999999]] },
  { uf: "BA", name: "Bahia", ranges: [[40000000, 48999999]] },
  { uf: "CE", name: "Ceará", ranges: [[60000000, 63999999]] },
  { uf: "DF", name: "Distrito Federal", ranges: [[70000000, 72799999], [73000000, 73699999]] },
  { uf: "ES", name: "Espírito Santo", ranges: [[29000000, 29999999]] },
  { uf: "GO", name: "Goiás", ranges: [[72800000, 72999999], [73700000, 76799999]] },
  { uf: "MA", name: "Maranhão", ranges: [[65000000, 65999999]] },
  { uf: "MG", name: "Minas Gerais", ranges: [[30000000, 39999999]] },
  { uf: "MS", name: "Mato Grosso do Sul", ranges: [[79000000, 79999999]] },
  { uf: "MT", name: "Mato Grosso", ranges: [[78000000, 78899999]] },
  { uf: "PA", name: "Pará", ranges: [[66000000, 68899999]] },
  { uf: "PB", name: "Paraíba", ranges: [[58000000, 58999999]] },
  { uf: "PE", name: "Pernambuco", ranges: [[50000000, 56999999]] },
  { uf: "PI", name: "Piauí", ranges: [[64000000, 64999999]] },
  { uf: "PR", name: "Paraná", ranges: [[80000000, 87999999]] },
  { uf: "RJ", name: "Rio de Janeiro", ranges: [[20000000, 28999999]] },
  { uf: "RN", name: "Rio Grande do Norte", ranges: [[59000000, 59999999]] },
  { uf: "RO", name: "Rondônia", ranges: [[76800000, 76999999]] },
  { uf: "RR", name: "Roraima", ranges: [[69300000, 69399999]] },
  { uf: "RS", name: "Rio Grande do Sul", ranges: [[90000000, 99999999]] },
  { uf: "SC", name: "Santa Catarina", ranges: [[88000000, 89999999]] },
  { uf: "SE", name: "Sergipe", ranges: [[49000000, 49999999]] },
  { uf: "SP", name: "São Paulo", ranges: [[1000000, 19999999]] },
  { uf: "TO", name: "Tocantins", ranges: [[77000000, 77999999]] },
];

export type CepLookupResult =
  | { valid: true; normalized: string; formatted: string; uf: CepUf | null }
  | { valid: false; error: string };

export type GenerateCepOptions = {
  count?: number;
  formatted?: boolean;
  /** Sigla da UF; aleatória quando omitida. */
  uf?: string;
};

export function strip(cep: string): string {
  return cep.replace(/\D/g, "");
}

export function mask(cep: string): string {
  const normalized = strip(cep);
  if (normalized.length !== CEP_LENGTH) {
    return cep;
  }
  return `${normalized.slice(0, 5)}-${normalized.slice(5)}`;
}

export function ufOf(cep: string): CepUf | null {
  const normalized = strip(cep);
  if (normalized.length !== CEP_LENGTH) {
    return null;
  }
  const value = Number(normalized);
  return (
    CEP_UFS.find((entry) =>
      entry.ranges.some(([start, end]) => value >= start && value <= end),
    ) ?? null
  );
}

export function lookupCep(input: string): CepLookupResult {
  const normalized = strip(input);

  if (normalized.length !== CEP_LENGTH) {
    return {
      valid: false,
      error: "CEP deve ter 8 dígitos.",
    };
  }

  return {
    valid: true,
    normalized,
    formatted: mask(normalized),
    uf: ufOf(normalized),
  };
}

function clampCount(count: number): number {
  return Math.min(Math.max(Math.floor(count), 1), MAX_BATCH_SIZE);
}

function randomInRange(start: number, end: number): number {
  return start + Math.floor(Math.random() * (end - start + 1));
}

function generateOne(uf?: string): string {
  const entry =
    CEP_UFS.find((item) => item.uf === uf) ??
    CEP_UFS[Math.floor(Math.random() * CEP_UFS.length)];

  // Sorteia a faixa proporcionalmente ao seu tamanho.
  const sizes = entry.ranges.map(([start, end]) => end - start + 1);
  const total = sizes.reduce((acc, size) => acc + size, 0);
  let target = Math.floor(Math.random() * total);
  let chosen = entry.ranges[0];
  for (let i = 0; i < entry.ranges.length; i++) {
    if (target < sizes[i]) {
      chosen = entry.ranges[i];
      break;
    }
    target -= sizes[i];
  }

  return String(randomInRange(chosen[0], chosen[1])).padStart(CEP_LENGTH, "0");
}

export function generateCep(options: GenerateCepOptions = {}): string[] {
  const { count = 1, formatted = false, uf } = options;
  const total = clampCount(count);

  const results = Array.from({ length: total }, () => generateOne(uf));

  if (!formatted) {
    return results;
  }

  return results.map((cep) => mask(cep));
}
