"use client";

import { CheckCircle2Icon, ShieldCheckIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";

import { DocText } from "@/components/doc-tool/doc-text";
import type { DocSegment } from "@/components/doc-tool/doc-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type DocValidationView = { value: string } & (
  | { valid: true; formatted: string; badge?: string }
  | { valid: false; error: string }
);

type ValidatorPanelProps = {
  /** Rótulo do campo ("CNHs para validar"). */
  label: string;
  placeholder: string;
  segments: DocSegment[];
  length: number;
  separators?: string;
  validate: (input: string) => DocValidationView[];
};

export function ValidatorPanel({
  label,
  placeholder,
  segments,
  length,
  separators,
  validate,
}: ValidatorPanelProps) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<DocValidationView[] | null>(null);

  function handleValidate() {
    setResults(validate(input));
  }

  const validCount = results?.filter((result) => result.valid).length ?? 0;
  const invalidCount = (results?.length ?? 0) - validCount;

  return (
    <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-xs sm:p-6">
      <div className="space-y-2">
        <Label htmlFor="validator-input">{label}</Label>
        <Textarea
          id="validator-input"
          placeholder={placeholder}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              handleValidate();
            }
          }}
          rows={5}
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Separe múltiplos números por linha, vírgula ou ponto e vírgula.{" "}
          <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">
            Ctrl
          </kbd>
          +
          <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">
            Enter
          </kbd>{" "}
          valida.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" size="lg" onClick={handleValidate}>
          <ShieldCheckIcon data-icon="inline-start" />
          Validar
        </Button>

        {results !== null && results.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-live="polite">
            {validCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                <CheckCircle2Icon className="size-3.5" />
                {validCount} {validCount === 1 ? "válido" : "válidos"}
              </span>
            )}
            {invalidCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                <XCircleIcon className="size-3.5" />
                {invalidCount} {invalidCount === 1 ? "inválido" : "inválidos"}
              </span>
            )}
          </div>
        )}
      </div>

      {results !== null &&
        (results.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Informe ao menos um número para validar.
          </p>
        ) : (
          <ul className="space-y-2">
            {results.map((result, index) => (
              <li
                key={`${result.value}-${index}`}
                className="flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-2.5">
                  {result.valid ? (
                    <CheckCircle2Icon
                      aria-hidden
                      className="size-4 shrink-0 text-success"
                    />
                  ) : (
                    <XCircleIcon
                      aria-hidden
                      className="size-4 shrink-0 text-destructive"
                    />
                  )}
                  {result.valid ? (
                    <DocText
                      value={result.formatted}
                      segments={segments}
                      length={length}
                      separators={separators}
                      className="text-sm break-all"
                    />
                  ) : (
                    <code className="font-mono text-sm break-all text-muted-foreground">
                      {result.value}
                    </code>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 pl-6 sm:pl-0">
                  {result.valid ? (
                    result.badge && <Badge variant="secondary">{result.badge}</Badge>
                  ) : (
                    <span className="text-sm text-destructive">{result.error}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
