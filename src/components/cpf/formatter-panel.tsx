"use client";

import { CircleAlertIcon } from "lucide-react";
import { useState } from "react";

import { CpfText } from "@/components/cpf/cpf-text";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CPF_LENGTH, mask, strip } from "@/lib/cpf";

export function FormatterPanel() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [lengthError, setLengthError] = useState(false);

  function handleMask() {
    const normalized = strip(input);
    if (normalized.length === CPF_LENGTH) {
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
        <Label htmlFor="formatter-input">CPF</Label>
        <Input
          id="formatter-input"
          placeholder="123.456.789-09 ou 12345678909"
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
        <p className="text-xs text-muted-foreground">
          Aplica ou remove a máscara XXX.XXX.XXX-XX.
        </p>
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
          <CpfText value={output} className="text-base break-all sm:text-lg" />
          <CopyButton
            variant="ghost"
            size="icon-sm"
            aria-label="Copiar resultado"
            value={output}
            toastLabel="CPF"
            iconClassName="size-3.5"
          />
        </div>
      )}

      {lengthError && (
        <p role="alert" className="flex items-start gap-2 text-sm text-destructive">
          <CircleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
          A máscara exige 11 dígitos sem pontuação — este valor tem{" "}
          {strip(input).length}.
        </p>
      )}
    </section>
  );
}
