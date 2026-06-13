"use client";

import { CircleAlertIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

import { DocText } from "@/components/doc-tool/doc-text";
import type { DocSegment } from "@/components/doc-tool/doc-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { copyToClipboard } from "@/lib/copy-to-clipboard";

type FormatterPanelProps = {
  /** Rótulo do campo e dos toasts ("PIS/PASEP"). */
  label: string;
  placeholder: string;
  /** Descrição da máscara ("Aplica ou remove a máscara 999.99999.99-9."). */
  helper: string;
  segments: DocSegment[];
  length: number;
  separators?: string;
  mask: (value: string) => string;
  strip: (value: string) => string;
};

export function FormatterPanel({
  label,
  placeholder,
  helper,
  segments,
  length,
  separators,
  mask,
  strip,
}: FormatterPanelProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [lengthError, setLengthError] = useState(false);

  function handleMask() {
    const normalized = strip(input);
    if (normalized.length === length) {
      setOutput(mask(normalized));
      setLengthError(false);
    } else {
      setOutput("");
      setLengthError(true);
    }
  }

  function handleUnmask() {
    setOutput(strip(input));
    setLengthError(false);
  }

  return (
    <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-xs sm:p-6">
      <div className="space-y-2">
        <Label htmlFor="formatter-input">{label}</Label>
        <Input
          id="formatter-input"
          placeholder={placeholder}
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setOutput("");
            setLengthError(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleMask();
            }
          }}
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">{helper}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="lg" onClick={handleMask}>
          Aplicar máscara
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={handleUnmask}>
          Remover máscara
        </Button>
      </div>

      {output && (
        <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/40 px-4 py-3">
          <DocText
            value={output}
            segments={segments}
            length={length}
            separators={separators}
            className="text-base break-all sm:text-lg"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Copiar resultado"
            onClick={() => copyToClipboard(output, label)}
          >
            <CopyIcon className="size-3.5" />
          </Button>
        </div>
      )}

      {lengthError && (
        <p role="alert" className="flex items-start gap-2 text-sm text-destructive">
          <CircleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
          A máscara exige {length} dígitos sem pontuação — este valor tem{" "}
          {strip(input).length}.
        </p>
      )}
    </section>
  );
}
