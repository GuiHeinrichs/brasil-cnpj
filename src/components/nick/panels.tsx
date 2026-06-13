"use client";

import { ListPanel } from "@/components/data-tool/list-panel";
import { generateNick, MAX_BATCH_SIZE } from "@/lib/nick";
import type { NickStyle } from "@/lib/nick";

const STYLE_SELECT = {
  id: "style",
  label: "Estilo",
  options: [
    { value: "random", label: "Aleatório" },
    { value: "limpo", label: "Limpo (DarkWolf)" },
    { value: "numeros", label: "Com números (DarkWolf42)" },
    { value: "leet", label: "Leet (D4rkW0lf)" },
    { value: "underscore", label: "Underscore (dark_wolf_07)" },
  ],
};

export function NickGeneratorPanel() {
  return (
    <ListPanel
      label="Nick"
      pluralLabel="Nicks"
      resultsLabel={(count) => `${count} nicks gerados`}
      emptyDisplay="DarkWolf42"
      maxBatch={MAX_BATCH_SIZE}
      mono
      selects={[STYLE_SELECT]}
      generate={({ count, selectValues }) =>
        generateNick({ count, style: selectValues.style as NickStyle })
      }
    />
  );
}
