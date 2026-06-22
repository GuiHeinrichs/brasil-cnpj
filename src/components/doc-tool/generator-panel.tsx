"use client";

import { RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DocSegmentLegend, DocText } from "@/components/doc-tool/doc-text";
import type { DocSegment } from "@/components/doc-tool/doc-text";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type GeneratorSelect = {
  id: string;
  label: string;
  /** A primeira opção é o padrão (normalmente "Aleatória"). */
  options: { value: string; label: string }[];
};

type GeneratorPanelProps = {
  /** Rótulo singular usado em botões e toasts ("CNH"). */
  label: string;
  /** Rótulo plural para o toast do "Copiar tudo" ("CNHs"). */
  pluralLabel: string;
  /** Texto da contagem do lote ("5 CNHs geradas"). */
  resultsLabel: (count: number) => string;
  emptyDisplay: string;
  maxBatch: number;
  segments: DocSegment[];
  length: number;
  separators?: string;
  generate: (options: {
    count: number;
    formatted: boolean;
    selectValue?: string;
  }) => string[];
  select?: GeneratorSelect;
  /** Rótulos do alternador de máscara; false oculta (documentos sem máscara). */
  maskToggle?: { on: string; off: string } | false;
};

export function GeneratorPanel({
  label,
  pluralLabel,
  resultsLabel,
  emptyDisplay,
  maxBatch,
  segments,
  length,
  separators,
  generate,
  select,
  maskToggle = { on: "Com máscara", off: "Sem máscara" },
}: GeneratorPanelProps) {
  const [selectValue, setSelectValue] = useState(select?.options[0]?.value ?? "");
  const [count, setCount] = useState("1");
  const [formatted, setFormatted] = useState(maskToggle !== false);
  const [results, setResults] = useState<string[]>([]);
  const [generation, setGeneration] = useState(0);

  const selectItems = select
    ? Object.fromEntries(select.options.map((option) => [option.value, option.label]))
    : undefined;

  function handleGenerate() {
    const parsedCount = Math.min(Math.max(parseInt(count, 10) || 1, 1), maxBatch);

    setCount(String(parsedCount));
    setResults(
      generate({
        count: parsedCount,
        formatted,
        selectValue: select ? selectValue : undefined,
      }),
    );
    setGeneration((value) => value + 1);

    toast.success("Gerado com sucesso", {
      description: parsedCount > 1 ? resultsLabel(parsedCount) : undefined,
    });
  }

  useEffect(() => {
    // Gera após a hidratação: o valor é aleatório e não pode entrar no HTML estático.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults(generate({ count: 1, formatted: maskToggle !== false }));
    setGeneration(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const latest = results[0];

  return (
    <section className="rounded-2xl border bg-card shadow-xs">
      <div className="flex flex-col items-center gap-5 border-b border-dashed px-5 py-10 text-center sm:px-8">
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-10 items-center justify-center"
        >
          {latest ? (
            <DocText
              key={generation}
              value={latest}
              segments={segments}
              length={length}
              separators={separators}
              animate
              className="text-[1.6rem] leading-none font-medium tracking-tight break-all sm:text-4xl"
            />
          ) : (
            <span
              aria-hidden
              className="font-mono text-[1.6rem] leading-none text-muted-foreground/40 sm:text-4xl"
            >
              {emptyDisplay}
            </span>
          )}
        </div>

        <DocSegmentLegend segments={segments} />

        {latest && (
          <CopyButton variant="outline" size="sm" value={latest} toastLabel={label}>
            Copiar
          </CopyButton>
        )}
      </div>

      <form
        className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          handleGenerate();
        }}
      >
        {select && selectItems && (
          <div className="space-y-2">
            <Label htmlFor={select.id}>{select.label}</Label>
            <Select
              value={selectValue}
              items={selectItems}
              onValueChange={(value) =>
                setSelectValue(value ?? select.options[0].value)
              }
            >
              <SelectTrigger id={select.id} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {select.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="count">Quantidade (1–{maxBatch})</Label>
          <Input
            id="count"
            type="number"
            inputMode="numeric"
            min={1}
            max={maxBatch}
            value={count}
            onChange={(event) => setCount(event.target.value)}
          />
        </div>

        {maskToggle !== false && (
          <div
            role="group"
            aria-label="Máscara"
            className="grid grid-cols-2 gap-0.5 rounded-lg bg-muted p-0.5"
          >
            {[
              { label: maskToggle.on, value: true },
              { label: maskToggle.off, value: false },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                aria-pressed={formatted === option.value}
                onClick={() => setFormatted(option.value)}
                className={cn(
                  "h-8 cursor-pointer rounded-[calc(var(--radius-lg)-2px)] text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  formatted === option.value
                    ? "bg-background text-foreground shadow-sm dark:bg-input/60"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full self-end">
          <RefreshCwIcon data-icon="inline-start" />
          Gerar
        </Button>
      </form>

      {results.length > 1 && (
        <div className="border-t">
          <div className="flex items-center justify-between px-5 py-3 sm:px-6">
            <p className="text-sm text-muted-foreground">
              {resultsLabel(results.length)}
            </p>
            <CopyButton
              variant="ghost"
              size="sm"
              value={results.join("\n")}
              toastLabel={pluralLabel}
            >
              Copiar tudo
            </CopyButton>
          </div>
          <ul className="max-h-72 divide-y overflow-y-auto border-t">
            {results.map((value, index) => (
              <li
                key={`${value}-${index}`}
                className="flex items-center justify-between gap-3 px-5 py-2 sm:px-6"
              >
                <DocText
                  value={value}
                  segments={segments}
                  length={length}
                  separators={separators}
                  className="text-sm break-all"
                />
                <CopyButton
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Copiar ${value}`}
                  value={value}
                  toastLabel={label}
                  iconClassName="size-3.5"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
