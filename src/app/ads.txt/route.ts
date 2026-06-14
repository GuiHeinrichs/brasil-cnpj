import { ADSENSE_CLIENT } from "@/lib/ads";

/**
 * ads.txt do AdSense (https://support.google.com/adsense/answer/12171612).
 * Gera a linha automaticamente a partir do publisher configurado; enquanto não
 * houver ADSENSE_CLIENT responde 404 para não publicar um arquivo vazio/inválido.
 */
export function GET() {
  if (!ADSENSE_CLIENT) {
    return new Response("Not found", { status: 404 });
  }

  // No ads.txt o publisher aparece como "pub-XXXX" (sem o prefixo "ca-").
  const publisherId = ADSENSE_CLIENT.replace(/^ca-/, "");
  const body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
