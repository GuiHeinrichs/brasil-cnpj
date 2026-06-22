import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";

import { AdSlot } from "@/components/ad-slot";
import { JsonLd } from "@/components/json-ld";
import { SiteTopBar } from "@/components/site-top-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ADSENSE_CLIENT } from "@/lib/ads";
import { siteJsonLd } from "@/lib/schema";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "gerador de CNPJ",
    "gerar CNPJ",
    "gerar CNPJ em massa",
    "CNPJ válido",
    "CNPJ alfanumérico",
    "validador de CNPJ",
    "formatador de CNPJ",
    "gerador de dados para testes",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "pt_BR",
    title: "Gerador de CNPJ válido — numérico e alfanumérico",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Gerador de CNPJ válido — numérico e alfanumérico",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Meta-tag de verificação do AdSense (um dos métodos aceitos ao cadastrar o site).
  other: ADSENSE_CLIENT
    ? { "google-adsense-account": ADSENSE_CLIENT }
    : {},
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#121621" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={siteJsonLd} />
        <ThemeProvider>
          <SiteTopBar />
          <div className="mx-auto flex w-full max-w-7xl flex-1 justify-center gap-8 xl:px-6">
            <main className="flex w-full min-w-0 max-w-2xl flex-col">
              {children}
            </main>
            <aside className="hidden shrink-0 xl:block">
              <div className="sticky top-20 py-10">
                <AdSlot variant="skyscraper" slot="rail-right" />
              </div>
            </aside>
          </div>
          <Toaster richColors closeButton />
        </ThemeProvider>
        {ADSENSE_CLIENT && (
          // beforeInteractive: o Next injeta o script dentro do <head>, exatamente
          // como o AdSense pede no método "Snippet de código do AdSense".
          <Script
            id="adsbygoogle-init"
            strategy="beforeInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        )}
      </body>
    </html>
  );
}
