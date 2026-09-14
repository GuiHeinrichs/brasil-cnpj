import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToolsSection } from "@/components/tools-section";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description:
    "O endereço que você tentou abrir não existe no bateCarimbo. Veja a lista de ferramentas e guias disponíveis.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <SiteHeader
        badge="Erro 404"
        heading="Página não encontrada"
        lead="O endereço que você abriu não existe ou foi movido. Confira a URL ou use uma das ferramentas e guias abaixo."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/"
          className="inline-flex rounded-lg border bg-card px-3 py-1.5 text-sm transition-colors hover:border-ring/40"
        >
          Voltar ao início
        </Link>
        <Link
          href="/guias"
          className="inline-flex rounded-lg border bg-card px-3 py-1.5 text-sm transition-colors hover:border-ring/40"
        >
          Ver os guias
        </Link>
        <Link
          href="/contato"
          className="inline-flex rounded-lg border bg-card px-3 py-1.5 text-sm transition-colors hover:border-ring/40"
        >
          Avisar sobre um link quebrado
        </Link>
      </div>

      <div className="mt-14">
        <ToolsSection />
      </div>

      <SiteFooter ads={false} />
    </div>
  );
}
