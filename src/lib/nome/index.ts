import { buildFullName, clampCount, pick } from "@/lib/dados";
import type { Gender } from "@/lib/dados";

export const MAX_BATCH_SIZE = 100;

export type NomeGender = Gender | "random";

export type GenerateNomeOptions = {
  count?: number;
  gender?: NomeGender;
};

export function generateNome(options: GenerateNomeOptions = {}): string[] {
  const { count = 1, gender = "random" } = options;
  const total = clampCount(count, MAX_BATCH_SIZE);

  return Array.from({ length: total }, () => {
    const resolved: Gender = gender === "random" ? pick(["M", "F"]) : gender;
    return buildFullName(resolved).full;
  });
}
