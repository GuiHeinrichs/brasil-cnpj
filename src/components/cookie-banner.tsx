"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "cookie_consent";
const CHANGE_EVENT = "cookie-consent-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function readConsent(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    // localStorage indisponível (modo privado/bloqueio): não insiste no aviso.
    return true;
  }
}

/** No servidor (e durante a hidratação) o banner fica oculto; o cliente decide depois. */
function readServerConsent(): boolean {
  return true;
}

export function CookieBanner() {
  const consented = useSyncExternalStore(
    subscribe,
    readConsent,
    readServerConsent,
  );

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Sem armazenamento, o aviso volta na próxima visita — comportamento aceitável.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  if (consented) return null;

  return (
    <>
      {/* Reserva a altura do aviso no fim do fluxo: como ele é fixo, sem isso
          cobriria o rodapé (e o bloco de anúncio, quando houver). */}
      <div aria-hidden className="h-28 sm:h-20" />
      <div
        role="dialog"
        aria-label="Aviso de cookies"
        className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm sm:px-6"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Este site guarda preferências no seu navegador e usa cookies do
            Google AdSense para exibir anúncios. Detalhes na{" "}
            <Link
              href="/privacidade"
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              Política de Privacidade
            </Link>
            . Você pode desativar anúncios personalizados nas{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              configurações de anúncios do Google
            </a>
            .
          </p>
          <button
            onClick={accept}
            className="shrink-0 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Entendido
          </button>
        </div>
      </div>
    </>
  );
}
