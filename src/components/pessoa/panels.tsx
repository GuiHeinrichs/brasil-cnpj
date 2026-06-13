"use client";

import { RecordPanel } from "@/components/data-tool/record-panel";
import { UFS } from "@/lib/dados";
import { generatePessoa, MAX_BATCH_SIZE, pessoaToRecord } from "@/lib/pessoa";
import type { PessoaSexo } from "@/lib/pessoa";

const UF_SELECT = {
  id: "uf",
  label: "Estado (UF)",
  options: [
    { value: "random", label: "Aleatório" },
    ...UFS.map((entry) => ({ value: entry.uf, label: `${entry.uf} — ${entry.name}` })),
  ],
};

const SEXO_SELECT = {
  id: "sexo",
  label: "Sexo",
  options: [
    { value: "random", label: "Aleatório" },
    { value: "M", label: "Masculino" },
    { value: "F", label: "Feminino" },
  ],
};

export function PessoaGeneratorPanel() {
  return (
    <RecordPanel
      label="Pessoa"
      pluralLabel="Pessoas"
      resultsLabel={(count) => `${count} pessoas geradas`}
      maxBatch={MAX_BATCH_SIZE}
      selects={[UF_SELECT, SEXO_SELECT]}
      generate={({ count, selectValues }) =>
        generatePessoa({
          count,
          uf: selectValues.uf === "random" ? undefined : selectValues.uf,
          sexo: selectValues.sexo as PessoaSexo,
        }).map(pessoaToRecord)
      }
    />
  );
}
