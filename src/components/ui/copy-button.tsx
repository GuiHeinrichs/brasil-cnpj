"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { cn } from "@/lib/utils";

/** Tempo que o ícone permanece como "copiado" antes de voltar ao normal. */
const COPIED_RESET_MS = 2000;

type CopyButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick" | "children"
> & {
  /** Texto enviado para a área de transferência. */
  value: string;
  /** Rótulo usado no toast ("CNPJ"). */
  toastLabel: string;
  /** Texto ao lado do ícone; ausente = botão somente ícone. */
  children?: React.ReactNode;
  /** Texto exibido após copiar quando há `children` (padrão: "Copiado"). */
  copiedChildren?: React.ReactNode;
  /** Classe aplicada ao ícone (ex.: "size-3.5" em botões avulsos). */
  iconClassName?: string;
};

/**
 * Botão de cópia que troca o ícone de "copiar" por um check de sucesso
 * por alguns segundos após copiar, além de disparar o toast de confirmação.
 */
export function CopyButton({
  value,
  toastLabel,
  children,
  copiedChildren = "Copiado",
  iconClassName,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  async function handleCopy() {
    const copiedOk = await copyToClipboard(value, toastLabel);
    if (!copiedOk) return;

    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
  }

  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <Button type="button" onClick={handleCopy} {...props}>
      <Icon
        className={cn(
          iconClassName,
          copied && "text-emerald-600 dark:text-emerald-500",
        )}
        data-icon={children ? "inline-start" : undefined}
      />
      {children ? (copied ? copiedChildren : children) : null}
    </Button>
  );
}
