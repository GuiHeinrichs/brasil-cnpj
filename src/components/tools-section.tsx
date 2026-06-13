import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { SectionLabel } from "@/components/docs";
import { toolsByCategory } from "@/lib/tools";
import type { ToolId } from "@/lib/tools";

/** Catálogo completo agrupado por categoria — hub de navegação (SEO). */
export function ToolsSection({ exclude }: { exclude?: ToolId }) {
  const groups = toolsByCategory()
    .map((group) => ({
      ...group,
      tools: group.tools.filter((tool) => tool.id !== exclude),
    }))
    .filter((group) => group.tools.length > 0);

  return (
    <div className="space-y-8">
      <SectionLabel>Todas as ferramentas</SectionLabel>
      {groups.map((group) => (
        <div key={group.id} className="space-y-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h3 className="text-sm font-semibold">{group.label}</h3>
            <span className="text-xs text-muted-foreground">{group.hint}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group rounded-xl border bg-card p-4 transition-colors hover:border-ring/40"
              >
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {tool.name}
                  <ArrowRightIcon
                    aria-hidden
                    className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  />
                </span>
                <span className="mt-1.5 block text-sm text-muted-foreground">
                  {tool.blurb}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
