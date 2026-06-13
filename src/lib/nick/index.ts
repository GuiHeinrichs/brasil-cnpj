import {
  clampCount,
  maybe,
  NICK_ADJECTIVES,
  NICK_NOUNS,
  pick,
  randomInt,
} from "@/lib/dados";

export const MAX_BATCH_SIZE = 100;

export type NickStyle = "limpo" | "numeros" | "leet" | "underscore" | "random";

export type GenerateNickOptions = {
  count?: number;
  style?: NickStyle;
};

const STYLES: Exclude<NickStyle, "random">[] = [
  "limpo",
  "numeros",
  "leet",
  "underscore",
];

const LEET: Record<string, string> = {
  a: "4",
  e: "3",
  i: "1",
  o: "0",
  s: "5",
  t: "7",
};

function leetify(value: string): string {
  return [...value]
    .map((char) => (maybe(0.7) ? (LEET[char.toLowerCase()] ?? char) : char))
    .join("");
}

function buildOne(style: Exclude<NickStyle, "random">): string {
  const adjective = pick(NICK_ADJECTIVES);
  const noun = pick(NICK_NOUNS);

  switch (style) {
    case "limpo":
      return `${adjective}${noun}`;
    case "numeros":
      return `${adjective}${noun}${randomInt(1, 9999)}`;
    case "leet":
      return leetify(`${adjective}${noun}`);
    case "underscore":
      return `${adjective.toLowerCase()}_${noun.toLowerCase()}_${String(
        randomInt(0, 99),
      ).padStart(2, "0")}`;
  }
}

export function generateNick(options: GenerateNickOptions = {}): string[] {
  const { count = 1, style = "random" } = options;
  const total = clampCount(count, MAX_BATCH_SIZE);

  return Array.from({ length: total }, () =>
    buildOne(style === "random" ? pick(STYLES) : style),
  );
}
