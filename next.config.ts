import type { NextConfig } from "next";

const CANONICAL_HOST = "batecarimbo.com.br";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // O alias *.vercel.app serve o site inteiro; concentra tudo no domínio canônico.
      {
        source: "/:path*",
        has: [{ type: "host", value: "brasil-cnpj.vercel.app" }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${CANONICAL_HOST}` }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
      // Ferramenta removida em jul/2026 — evita 404 em links antigos.
      {
        source: "/gerador-de-cartao-de-credito",
        destination: "/gerador-de-empresas",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
