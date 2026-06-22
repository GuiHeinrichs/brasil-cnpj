"use client";

import { RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CpfText, SegmentLegend } from "@/components/cpf/cpf-text";
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
import { FISCAL_REGIONS, generateCpf, MAX_BATCH_SIZE } from "@/lib/cpf";
import { cn } from "@/lib/utils";

const REGION_LABELS: Record<string, string> = {
  random: "Aleatória",
  ...Object.fromEntries(
    FISCAL_REGIONS.map((region) => [
      region.digit,
      `${region.ordinal} RF — ${region.states}`,
    ]),
  ),
};

export function GeneratorPanel() {
  const [regionDigit, setRegionDigit] = useState("random");
  const [count, setCount] = useState("1");
  const [formatted, setFormatted] = useState(true);
  const [results, setResults] = useState<string[]>([]);
  const [generation, setGeneration] = useState(0);

  function handleGenerate() {
    const parsedCount = Math.min(
      Math.max(parseInt(count, 10) || 1, 1),
      MAX_BATCH_SIZE,
    );

    setCount(String(parsedCount));
    setResults(
      generateCpf({
        count: parsedCount,
        formatted,
        regionDigit: regionDigit === "random" ? undefined : regionDigit,
      }),
    );
    setGeneration((value) => value + 1);

    toast.success("Gerado com sucesso", {
      description: parsedCount > 1 ? `${parsedCount} CPFs gerados` : undefined,
    });
  }

  useEffect(() => {
    // Gera após a hidratação: o valor é aleatório e não pode entrar no HTML estático.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults(generateCpf({ count: 1, formatted: true }));
    setGeneration(1);
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
            <CpfText
              key={generation}
              value={latest}
              animate
              className="text-[1.6rem] leading-none font-medium tracking-tight break-all sm:text-4xl"
            />
          ) : (
            <span
              aria-hidden
              className="font-mono text-[1.6rem] leading-none text-muted-foreground/40 sm:text-4xl"
            >
              •••.•••.•••-••
            </span>
          )}
        </div>

        <SegmentLegend />

        {latest && (
          <CopyButton variant="outline" size="sm" value={latest} toastLabel="CPF">
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
        <div className="space-y-2">
          <Label htmlFor="region">Região fiscal (9º dígito)</Label>
          <Select
            value={regionDigit}
            items={REGION_LABELS}
            onValueChange={(value) => setRegionDigit(value ?? "random")}
          >
            <SelectTrigger id="region" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">{REGION_LABELS.random}</SelectItem>
              {FISCAL_REGIONS.map((region) => (
                <SelectItem key={region.digit} value={region.digit}>
                  {REGION_LABELS[region.digit]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="count">Quantidade (1–{MAX_BATCH_SIZE})</Label>
          <Input
            id="count"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_BATCH_SIZE}
            value={count}
            onChange={(event) => setCount(event.target.value)}
          />
        </div>

        <div
          role="group"
          aria-label="Máscara"
          className="grid grid-cols-2 gap-0.5 rounded-lg bg-muted p-0.5"
        >
          {[
            { label: "Com máscara", value: true },
            { label: "Sem máscara", value: false },
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

        <Button type="submit" size="lg" className="w-full self-end">
          <RefreshCwIcon data-icon="inline-start" />
          Gerar
        </Button>
      </form>

      {results.length > 1 && (
        <div className="border-t">
          <div className="flex items-center justify-between px-5 py-3 sm:px-6">
            <p className="text-sm text-muted-foreground">
              {results.length} CPFs gerados
            </p>
            <CopyButton
              variant="ghost"
              size="sm"
              value={results.join("\n")}
              toastLabel="CPFs"
            >
              Copiar tudo
            </CopyButton>
          </div>
          <ul className="max-h-72 divide-y overflow-y-auto border-t">
            {results.map((cpf, index) => (
              <li
                key={`${cpf}-${index}`}
                className="flex items-center justify-between gap-3 px-5 py-2 sm:px-6"
              >
                <CpfText value={cpf} className="text-sm break-all" />
                <CopyButton
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Copiar ${cpf}`}
                  value={cpf}
                  toastLabel="CPF"
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
