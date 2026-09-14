import Link from "next/link";

import { AdSlot } from "@/components/ad-slot";
import { AUTHOR, SITE_FOUNDING_DATE, SITE_NAME } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

const INSTITUTIONAL_LINKS = [
  { href: "/guias", label: "Guias" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
  { href: "/termos", label: "Termos de Uso" },
  { href: "/privacidade", label: "Privacidade" },
];

const FOUNDING_YEAR = SITE_FOUNDING_DATE.slice(0, 4);

export function SiteFooter({
  /** Desative em páginas sem conteúdo editorial (404, erro) para não exibir anúncio. */
  ads = true,
}: {
  ads?: boolean;
}) {
  return (
    <>
      {ads && (
        <AdSlot variant="leaderboard" slot="content-bottom" className="mt-14" />
      )}
      <footer className="mt-10 space-y-4 border-t pt-6 pb-2 text-center text-xs text-muted-foreground">
        <nav
          aria-label="Páginas institucionais"
          className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 font-medium"
        >
          {INSTITUTIONAL_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <nav
          aria-label="Ferramentas do bateCarimbo"
          className="flex flex-wrap justify-center gap-x-2 gap-y-1 font-mono text-[11px]"
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

        <div className="space-y-1 font-mono text-[11px] leading-relaxed">
          <p>
            © {FOUNDING_YEAR} {SITE_NAME} · Mantido por{" "}
            <Link
              href={AUTHOR.path}
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              {AUTHOR.name}
            </Link>
            , {AUTHOR.location} · Código aberto sob licença MIT
          </p>
          <p>
            Todos os dados gerados são fictícios e destinados a testes de
            software. Projeto independente, sem vínculo com Receita Federal,
            SERPRO, SENATRAN, TSE, Correios ou qualquer órgão público.
          </p>
        </div>
      </footer>
    </>
  );
}
