import Link from "next/link";

import { AdSlot } from "@/components/ad-slot";
import { TOOLS } from "@/lib/tools";

export function SiteFooter() {
  return (
    <>
      <AdSlot variant="leaderboard" slot="content-bottom" className="mt-14" />
      <footer className="mt-10 space-y-2 border-t pt-6 pb-2 text-center font-mono text-[11px] text-muted-foreground">
      <nav
        aria-label="Ferramentas do bateCarimbo"
        className="flex flex-wrap justify-center gap-x-2 gap-y-1"
      >
        {TOOLS.map((tool, index) => (
          <span key={tool.id} className="flex items-center gap-x-2">
            {index > 0 && <span aria-hidden>·</span>}
            <Link
              href={tool.href}
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              {tool.name}
            </Link>
          </span>
        ))}
      </nav>
        <p>
          MIT License · Ferramenta para testes — não use em produção fiscal ·{" "}
          <Link
            href="/sobre"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            Sobre
          </Link>{" "}
          ·{" "}
          <Link
            href="/termos"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            Termos
          </Link>{" "}
          ·{" "}
          <Link
            href="/privacidade"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            Privacidade
          </Link>
        </p>
      </footer>
    </>
  );
}
