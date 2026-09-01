import { cn } from "@/lib/utils";

/**
 * Wrapper de tipografia para os artigos dos guias. Estiliza os elementos
 * filhos (h2/h3/p/ul/ol/li/code/a/strong) por tag, para que o corpo de cada
 * guia possa ser escrito como JSX quase puro. As margens são por tipo de
 * elemento (não usa space-y) para evitar conflito com os espaçamentos dos
 * títulos.
 */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-[15px] leading-relaxed text-muted-foreground",
        "[&_p]:my-4",
        "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-foreground",
        "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5",
        "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5",
        "[&_strong]:font-medium [&_strong]:text-foreground",
        "[&_code]:rounded [&_code]:bg-muted/60 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-foreground",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80",
        className,
      )}
    >
      {children}
    </div>
  );
}
