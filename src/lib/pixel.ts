/**
 * pixel.ts — Meta Pixel (Facebook Pixel)
 *
 * REGRAS:
 * - Nunca enviar PII (nome, telefone, e-mail, CPF, etc.)
 * - Se VITE_META_PIXEL_ID não estiver configurado, todas as funções são no-op.
 * - O evento Lead só é disparado após resposta de sucesso do SmartLeads.
 * - Não disparar Lead no clique, na abertura do form, em erro ou na visita
 *   direta à página /obrigada.
 *
 * ORDEM GARANTIDA:
 *   validação → submitLead → sucesso SmartLeads → fireLeadEvent() → navegação
 */

// ── Tipagem mínima do fbq global ─────────────────────────────────────────────

type FbqFn = (
  type: "init" | "track" | "trackCustom",
  eventOrId: string,
  params?: Record<string, unknown>,
) => void;

type FbqBootstrap = FbqFn & {
  push: FbqBootstrap;
  loaded: boolean;
  version: string;
  queue: unknown[][];
};

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: unknown;
  }
}

// ── Pixel ID via variável de ambiente ────────────────────────────────────────

const PIXEL_ID = import.meta.env["VITE_META_PIXEL_ID"] as string | undefined;

/** true somente se o ID estiver configurado e não for string vazia */
const isEnabled = (): boolean => typeof PIXEL_ID === "string" && PIXEL_ID.trim().length > 0;

// ── Injeção do script base ────────────────────────────────────────────────────

/**
 * initPixel — injeta o snippet do Meta Pixel e dispara PageView + ViewContent.
 * Deve ser chamado uma vez, no useEffect da landing (client-side only).
 * É idempotente: não injeta o script duas vezes.
 */
export function initPixel(): void {
  if (typeof window === "undefined") return;
  if (!isEnabled()) return;
  if (window.fbq) return; // já inicializado

  // Snippet oficial Meta Pixel adaptado para TypeScript
  // Ref: https://developers.facebook.com/docs/meta-pixel/get-started

  const n = function (...args: unknown[]) {
    n.queue.push(args);
  } as FbqBootstrap;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  window.fbq = n;
  window._fbq = n;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const first = document.getElementsByTagName("script")[0];
  first?.parentNode?.insertBefore(script, first);

  if (!PIXEL_ID) return;
  window.fbq("init", PIXEL_ID.trim());
  window.fbq("track", "PageView");
  window.fbq("track", "ViewContent", {
    content_name: "Alto do Galleria II",
    content_category: "Apartamento Residencial",
    // Sem PII — apenas metadados do produto
  });
}

// ── Evento Lead ───────────────────────────────────────────────────────────────

/**
 * fireLeadEvent — dispara o evento Lead para a Meta.
 *
 * DEVE ser chamado SOMENTE após submitLead retornar com sucesso.
 * Não recebe PII. Envia apenas metadados de produto e campanha.
 */
export function fireLeadEvent(params?: {
  /** Parcela selecionada — não é PII */
  parcela?: string;
  /** Objetivo declarado — não é PII */
  objetivo?: string;
}): void {
  if (typeof window === "undefined") return;
  if (!isEnabled() || !window.fbq) return;

  window.fbq("track", "Lead", {
    content_name: "Alto do Galleria II",
    content_category: "Apartamento Residencial",
    ...(params?.parcela ? { parcela: params.parcela } : {}),
    ...(params?.objetivo ? { objetivo: params.objetivo } : {}),
  });
}
