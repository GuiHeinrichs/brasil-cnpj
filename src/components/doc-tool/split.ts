/** Separa uma lista de documentos por linha, vírgula ou ponto e vírgula. */
export function splitDocList(input: string): string[] {
  return input
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}
