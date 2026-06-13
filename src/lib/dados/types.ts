export type RecordField = {
  label: string;
  value: string;
  /** Exibe o valor em fonte monoespaçada (documentos, números). */
  mono?: boolean;
};

/** Registro genérico exibido como "ficha" pelos geradores de pessoa/empresa. */
export type GeneratedRecord = {
  title: string;
  subtitle?: string;
  fields: RecordField[];
};

/** Serializa uma ficha para a área de transferência. */
export function recordToText(record: GeneratedRecord): string {
  const head = record.subtitle
    ? `${record.title} — ${record.subtitle}`
    : record.title;
  const body = record.fields.map((field) => `${field.label}: ${field.value}`);
  return [head, ...body].join("\n");
}
