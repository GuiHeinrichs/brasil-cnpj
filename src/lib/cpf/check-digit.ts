/**
 * Mesma regra de módulo 11 do CNPJ, mas os pesos não ciclam:
 * 10 a 2 para o 1º DV (base de 9 dígitos) e 11 a 2 para o 2º (base de 10).
 */
export function calculateCheckDigit(base: string): number {
  let sum = 0;
  const length = base.length;

  for (let i = 0; i < length; i++) {
    const weight = length + 1 - i;
    sum += Number(base[i]) * weight;
  }

  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function calculateCheckDigits(base9: string): string {
  const first = calculateCheckDigit(base9);
  const second = calculateCheckDigit(`${base9}${first}`);
  return `${first}${second}`;
}
