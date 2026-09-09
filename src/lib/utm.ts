/**
 * utm.ts — Captura e persistência de parâmetros de rastreamento (client-side only)
 *
 * Parâmetros capturados: utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid
 * Storage: sessionStorage (persiste durante a sessão, limpa ao fechar a aba)
 * Chave: "utm_params"
 *
 * NOTA: Este módulo não toca em lead-proxy.ts nem no payload server-side.
 * A integração com o SmartLeads será feita em etapa futura.
 */

export const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

export type UtmKey = (typeof UTM_PARAMS)[number];
export type UtmData = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = "utm_params";

/**
 * Lê os parâmetros UTM/fbclid da URL atual e os persiste no sessionStorage.
 * Só sobrescreve valores que estejam presentes na URL — preserva os existentes.
 * Seguro para chamadas múltiplas (idempotente).
 */
export function captureUtmParams(): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const existing = readUtmParams();
  const updated: UtmData = { ...existing };
  let changed = false;

  for (const key of UTM_PARAMS) {
    const value = url.searchParams.get(key);
    if (value && value.trim()) {
      updated[key] = value.trim();
      changed = true;
    }
  }

  if (changed) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // sessionStorage indisponível (modo privado restrito, etc.) — falha silenciosa
    }
  }
}

/**
 * Retorna os parâmetros UTM/fbclid armazenados no sessionStorage.
 * Retorna objeto vazio se não houver nada armazenado.
 */
export function readUtmParams(): UtmData {
  if (typeof window === "undefined") return {};

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UtmData;
  } catch {
    return {};
  }
}

/**
 * Remove os parâmetros UTM do sessionStorage.
 * Chamar após submit bem-sucedido, se desejado.
 */
export function clearUtmParams(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // falha silenciosa
  }
}
