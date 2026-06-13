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
import type { GeneratedRecord } from "@/lib/dados";
import { recordToText } from "@/lib/dados";
import { cn } from "@/lib/utils";

type RecordPanelProps = {
  /** Rótulo singular para botões/toasts ("Pessoa"). */
  label: string;
  pluralLabel: string;
  resultsLabel: (count: number) => string;
  maxBatch: number;
  selects?: GeneratorSelect[];
  generate: (options: {
    count: number;
    selectValues: Record<string, string>;
  }) => GeneratedRecord[];
};

function RecordCard({
  record,
  label,
}: {
  record: GeneratedRecord;
  label: string;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-xs">
      <header className="flex items-start justify-between gap-3 border-b border-dashed px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h3 className="font-semibold tracking-tight text-balance">
            {record.title}
          </h3>
          {record.subtitle && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {record.subtitle}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0"
          onClick={() => copyToClipboard(recordToText(record), label)}
        >
          <CopyIcon data-icon="inline-start" />
          Copiar ficha
        </Button>
      </header>

      <dl className="divide-y">
        {record.fields.map((field) => (
          <div
            key={field.label}
            className="flex items-center justify-between gap-3 px-5 py-2.5 sm:px-6"
          >
            <dt className="shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {field.label}
            </dt>
            <dd className="flex min-w-0 items-center gap-1.5">
              <span
                className={cn(
                  "truncate text-right text-sm",
                  field.mono && "font-mono",
                )}
              >
                {field.value}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Copiar ${field.label}`}
                onClick={() => copyToClipboard(field.value, field.label)}
              >
                <CopyIcon className="size-3.5" />
              </Button>
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function RecordPanel({
  label,
  pluralLabel,
  resultsLabel,
  maxBatch,
  selects,
  generate,
}: RecordPanelProps) {
  const [selectValues, setSelectValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (selects ?? []).map((select) => [select.id, select.options[0].value]),
    ),
  );
  const [count, setCount] = useState("1");
  const [records, setRecords] = useState<GeneratedRecord[]>([]);

  function handleGenerate() {
    const parsedCount = Math.min(Math.max(parseInt(count, 10) || 1, 1), maxBatch);
    setCount(String(parsedCount));
    setRecords(generate({ count: parsedCount, selectValues }));
  }

  useEffect(() => {
    // Gera após a hidratação: o valor é aleatório e não pode entrar no HTML estático.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecords(generate({ count: 1, selectValues }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <form
        className="grid gap-4 rounded-2xl border bg-card p-5 shadow-xs sm:grid-cols-2 sm:p-6"
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

      {records.length > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-muted-foreground">
            {resultsLabel(records.length)}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              copyToClipboard(
                records.map(recordToText).join("\n\n"),
                pluralLabel,
              )
            }
          >
            <CopyIcon data-icon="inline-start" />
            Copiar tudo
          </Button>
        </div>
      )}

      {records.map((record, index) => (
        <RecordCard key={index} record={record} label={label} />
      ))}
    </div>
  );
}
