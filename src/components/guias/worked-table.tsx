/**
 * Tabelas de apoio dos guias e das seções de referência.
 *
 * - `WorkedDvTable`: mostra a conta do dígito verificador linha a linha
 *   (caractere × peso = produto) e o rodapé com soma, resto e regra aplicada.
 *   É o que transforma "o DV usa módulo 11" em algo verificável pelo leitor.
 * - `DataTable`: tabela simples de referência (cabeçalho + linhas).
 */

export type WorkedDvStep = {
  /** Caractere da base, na ordem em que aparece no documento. */
  char: string;
  /** Peso aplicado a esse caractere. */
  weight: number;
  /** Valor numérico do caractere (igual ao dígito, ou ASCII−48 no CNPJ alfanumérico). */
  value?: number;
};

export function WorkedDvTable({
  title,
  steps,
  sum,
  remainder,
  rule,
  result,
  showValueColumn = false,
}: {
  /** Ex.: "Primeiro dígito verificador". */
  title: string;
  steps: WorkedDvStep[];
  sum: number;
  remainder: number;
  /** Regra aplicada ao resto, em uma frase. */
  rule: string;
  /** Dígito obtido. */
  result: string;
  /** Exibe a coluna "valor" (útil quando valor ≠ caractere, como no CNPJ com letras). */
  showValueColumn?: boolean;
}) {
  return (
    <figure className="my-5 overflow-hidden rounded-xl border">
      <figcaption className="border-b bg-muted/40 px-4 py-2 text-sm font-medium text-foreground">
        {title}
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/20 text-left">
              <th scope="col" className="px-3 py-2 font-medium">
                Caractere
              </th>
              {showValueColumn && (
                <th scope="col" className="px-3 py-2 font-medium">
                  Valor
                </th>
              )}
              <th scope="col" className="px-3 py-2 font-medium">
                Peso
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Produto
              </th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step, index) => {
              const value = step.value ?? Number(step.char);
              return (
                <tr key={`${step.char}-${index}`} className="border-b last:border-0">
                  <td className="px-3 py-1.5 font-mono text-primary">{step.char}</td>
                  {showValueColumn && (
                    <td className="px-3 py-1.5 font-mono text-muted-foreground">
                      {value}
                    </td>
                  )}
                  <td className="px-3 py-1.5 font-mono text-muted-foreground">
                    {step.weight}
                  </td>
                  <td className="px-3 py-1.5 font-mono text-muted-foreground">
                    {value * step.weight}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t bg-muted/30">
              <td
                colSpan={showValueColumn ? 3 : 2}
                className="px-3 py-2 text-right font-medium"
              >
                Soma
              </td>
              <td className="px-3 py-2 font-mono font-medium text-foreground">
                {sum}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="space-y-0.5 border-t bg-muted/10 px-4 py-2.5 text-sm text-muted-foreground">
        <p>
          <span className="font-mono text-foreground">{sum}</span> ÷ 11 → resto{" "}
          <span className="font-mono text-foreground">{remainder}</span>
        </p>
        <p>{rule}</p>
        <p className="font-medium text-foreground">
          Dígito verificador ={" "}
          <span className="font-mono text-primary">{result}</span>
        </p>
      </div>
    </figure>
  );
}

export function DataTable({
  caption,
  headers,
  rows,
}: {
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <figure className="my-5 overflow-hidden rounded-xl border">
      {caption && (
        <figcaption className="border-b bg-muted/40 px-4 py-2 text-sm font-medium text-foreground">
          {caption}
        </figcaption>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/20 text-left">
              {headers.map((header) => (
                <th key={header} scope="col" className="px-3 py-2 font-medium whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b last:border-0">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={
                      cellIndex === 0
                        ? "px-3 py-1.5 font-mono whitespace-nowrap text-primary"
                        : "px-3 py-1.5 text-muted-foreground"
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
