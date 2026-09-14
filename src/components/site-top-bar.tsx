import Link from "next/link";

import { GeneratorsMenu } from "@/components/generators-menu";
import { StampLogo } from "@/components/stamp-logo";
import { ThemeToggle } from "@/components/theme-toggle";

/** Barra superior global: marca + menu de geradores + guias + tema. */
export function SiteTopBar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-xl font-semibold tracking-tight"
        >
          <StampLogo className="size-5 text-primary" />
          bateCarimbo<span className="-ml-1 text-primary">.</span>
        </Link>

        <nav aria-label="Navegação principal" className="flex items-center gap-2 sm:gap-3">
          <GeneratorsMenu />
          <Link
            href="/guias"
            className="font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Guias
          </Link>
          <Link
            href="/sobre"
            className="hidden font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:block"
          >
            Sobre
          </Link>
          <Link
            href="/contato"
            className="hidden font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline md:block"
          >
            Contato
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
