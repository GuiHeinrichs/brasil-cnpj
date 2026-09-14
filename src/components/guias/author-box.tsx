import Link from "next/link";

import { AUTHOR } from "@/lib/site";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

/** Box do autor exibido ao final de cada guia (sinal de E-E-A-T). */
export function AuthorBox() {
  return (
    <aside className="mt-12 flex gap-4 rounded-2xl border bg-card p-5">
      <span
        aria-hidden
        className="flex size-11 shrink-0 items-center justify-center rounded-full border bg-muted font-mono text-sm font-medium text-muted-foreground"
      >
        {initials(AUTHOR.name)}
      </span>
      <div className="space-y-1.5">
        <p className="text-sm font-semibold">
          <Link
            href={AUTHOR.path}
            className="underline-offset-4 hover:underline"
          >
            {AUTHOR.name}
          </Link>
        </p>
        <p className="font-mono text-[11px] text-muted-foreground">
          {AUTHOR.role} · {AUTHOR.location}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {AUTHOR.bio}
        </p>
      </div>
    </aside>
  );
}
