"use client";

import { ListPanel } from "@/components/data-tool/list-panel";
import { generateNome, MAX_BATCH_SIZE } from "@/lib/nome";
import type { NomeGender } from "@/lib/nome";

const GENDER_SELECT = {
  id: "gender",
  label: "Sexo",
  options: [
    { value: "random", label: "Aleatório" },
    { value: "M", label: "Masculino" },
    { value: "F", label: "Feminino" },
  ],
};

export function NomeGeneratorPanel() {
  return (
    <ListPanel
      label="Nome"
      pluralLabel="Nomes"
      resultsLabel={(count) => `${count} nomes gerados`}
      emptyDisplay="Nome Sobrenome"
      maxBatch={MAX_BATCH_SIZE}
      selects={[GENDER_SELECT]}
      generate={({ count, selectValues }) =>
        generateNome({ count, gender: selectValues.gender as NomeGender })
      }
    />
  );
}
