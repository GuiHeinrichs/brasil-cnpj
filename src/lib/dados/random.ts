/** Utilitários de sorteio compartilhados pelos geradores de dados. */

export function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Sorteia `n` itens distintos (ou todos, se `n` exceder a lista). */
export function pickSome<T>(items: readonly T[], n: number): T[] {
  const pool = [...items];
  const total = Math.min(n, pool.length);
  const chosen: T[] = [];
  for (let i = 0; i < total; i++) {
    const index = Math.floor(Math.random() * pool.length);
    chosen.push(pool.splice(index, 1)[0]);
  }
  return chosen;
}

export function maybe(probability: number): boolean {
  return Math.random() < probability;
}

export function clampCount(count: number, max: number): number {
  return Math.min(Math.max(Math.floor(count), 1), max);
}

/** Remove acentos e deixa em minúsculas — base para e-mails e slugs. */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
