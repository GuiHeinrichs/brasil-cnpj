"use client";

import { RecordPanel } from "@/components/data-tool/record-panel";
import { UFS } from "@/lib/dados";
import { empresaToRecord, generateEmpresa, MAX_BATCH_SIZE } from "@/lib/empresa";

const UF_SELECT = {
  id: "uf",
  label: "Estado (UF)",
  options: [
    { value: "random", label: "Aleatório" },
    ...UFS.map((entry) => ({ value: entry.uf, label: `${entry.uf} — ${entry.name}` })),
  ],
};

export function EmpresaGeneratorPanel() {
  return (
    <RecordPanel
      label="Empresa"
      pluralLabel="Empresas"
      resultsLabel={(count) => `${count} empresas geradas`}
      maxBatch={MAX_BATCH_SIZE}
      selects={[UF_SELECT]}
      generate={({ count, selectValues }) =>
        generateEmpresa({
          count,
          uf: selectValues.uf === "random" ? undefined : selectValues.uf,
        }).map(empresaToRecord)
      }
    />
  );
}
