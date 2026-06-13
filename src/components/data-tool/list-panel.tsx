"use client";

import { CopyIcon, RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";

import type { GeneratorSelect } from "@/components/doc-tool/generator-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { cn } from "@/lib/utils";

type ListPanelProps = {
  /** Rótulo singular usado em botões e toasts ("Nome"). */
  label: string;
  /** Rótulo plural para o "Copiar tudo" ("Nomes"). */
  pluralLabel: string;
  resultsLabel: (count: number) => string;
  emptyDisplay: string;
  maxBatch: number;
  /** Exibe os resultados em fonte monoespaçada (nicks, códigos). */
  mono?: boolean;
  selects?: GeneratorSelect[];
  generate: (options: {
    count: number;
    selectValues: Record<string, string>;
  }) => string[];
};

export function ListPanel({
  label,
  pluralLabel,
  resultsLabel,
  emptyDisplay,
  maxBatch,
  mono = false,
  selects,
  generate,
}: ListPanelProps) {
  const [selectValues, setSelectValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (selects ?? []).map((select) => [select.id, select.options[0].value]),
    ),
  );
  const [count, setCount] = useState("1");
  const [results, setResults] = useState<string[]>([]);
  const [generation, setGeneration] = useState(0);

  function handleGenerate() {
    const parsedCount = Math.min(Math.max(parseInt(count, 10) || 1, 1), maxBatch);
    setCount(String(parsedCount));
    setResults(generate({ count: parsedCount, selectValues }));
    setGeneration((value) => value + 1);
  }

  useEffect(() => {
    // Gera após a hidratação: o valor é aleatório e não pode entrar no HTML estático.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults(generate({ count: 1, selectValues }));
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
            <span
              key={generation}
              className={cn(
                "animate-cnpj text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl",
                mono && "font-mono",
              )}
            >
              {latest}
            </span>
          ) : (
            <span
              aria-hidden
              className={cn(
                "text-2xl leading-tight text-muted-foreground/40 sm:text-3xl",
                mono && "font-mono",
              )}
            >
              {emptyDisplay}
            </span>
          )}
        </div>

        {latest && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(latest, label)}
          >
            <CopyIcon data-icon="inline-start" />
            Copiar
          </Button>
        )}
      </div>

      <form
        className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          handleGenerate();
        }}
      >
        {selects?.map((select) => {
          const items = Object.fromEntries(
            select.options.map((option) => [option.value, option.label]),
          );
          return (
            <div key={select.id} className="space-y-2">
              <Label htmlFor={select.id}>{select.label}</Label>
              <Select
                value={selectValues[select.id]}
                items={items}
                onValueChange={(value) =>
                  setSelectValues((previous) => ({
                    ...previous,
                    [select.id]: value ?? select.options[0].value,
                  }))
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
          );
        })}

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

        <Button type="submit" size="lg" className="w-full self-end sm:col-span-2">
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(results.join("\n"), pluralLabel)}
            >
              <CopyIcon data-icon="inline-start" />
              Copiar tudo
            </Button>
          </div>
          <ul className="max-h-72 divide-y overflow-y-auto border-t">
            {results.map((value, index) => (
              <li
                key={`${value}-${index}`}
                className="flex items-center justify-between gap-3 px-5 py-2 sm:px-6"
              >
                <span className={cn("text-sm break-all", mono && "font-mono")}>
                  {value}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Copiar ${value}`}
                  onClick={() => copyToClipboard(value, label)}
                >
                  <CopyIcon className="size-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
