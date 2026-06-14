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
  /** Rótulo do título ao exportar (ex.: "Nome", "Razão social"). Default: "Título". */
  titleLabel?: string;
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

/**
 * Converte o rótulo de um campo numa chave camelCase válida para JSON/XML:
 * remove acentos, separa por espaço/barra e descarta pontuação.
 * "Nome da mãe" → "nomeDaMae", "E-mail" → "email", "Cidade/UF" → "cidadeUf".
 */
function toKey(label: string): string {
  const words = label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[\s/]+/)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
    .filter(Boolean);

  return words
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word[0].toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Mapa chave→valor da ficha (título + campos), base de JSON e XML. */
function toEntries(record: GeneratedRecord): Record<string, string> {
  const entries: Record<string, string> = {
    [toKey(record.titleLabel ?? "Título")]: record.title,
  };
  for (const field of record.fields) {
    entries[toKey(field.label)] = field.value;
  }
  return entries;
}

export function recordToJson(record: GeneratedRecord): string {
  return JSON.stringify(toEntries(record), null, 2);
}

export function recordsToJson(records: GeneratedRecord[]): string {
  return JSON.stringify(records.map(toEntries), null, 2);
}

function xmlElement(record: GeneratedRecord, tag: string, depth: number): string {
  const pad = "  ".repeat(depth);
  const childPad = "  ".repeat(depth + 1);
  const inner = Object.entries(toEntries(record))
    .map(([key, value]) => `${childPad}<${key}>${escapeXml(value)}</${key}>`)
    .join("\n");
  return `${pad}<${tag}>\n${inner}\n${pad}</${tag}>`;
}

const XML_PROLOG = '<?xml version="1.0" encoding="UTF-8"?>';

export function recordToXml(record: GeneratedRecord, label: string): string {
  return `${XML_PROLOG}\n${xmlElement(record, toKey(label), 0)}`;
}

export function recordsToXml(
  records: GeneratedRecord[],
  label: string,
  pluralLabel: string,
): string {
  const itemTag = toKey(label);
  const items = records
    .map((record) => xmlElement(record, itemTag, 1))
    .join("\n");
  return `${XML_PROLOG}\n<${toKey(pluralLabel)}>\n${items}\n</${toKey(pluralLabel)}>`;
}
