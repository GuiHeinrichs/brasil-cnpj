import { toast } from "sonner";

export async function copyToClipboard(text: string, label = "Texto"): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência`);
    return true;
  } catch {
    toast.error("Não foi possível copiar para a área de transferência");
    return false;
  }
}
