/**
 * events.ts — Camada de eventos internos de funil
 *
 * Propósito: registrar eventos de comportamento do usuário sem depender de
 * ferramenta externa. Usa window.dataLayer como contrato de saída padrão
 * (compatível com GTM/GA4 quando forem integrados), e loga no console em dev.
 *
 * REGRAS DE PII:
 * - Nunca receber ou registrar: nome, telefone, e-mail, CPF ou qualquer
 *   identificador pessoal. As assinaturas de tipo garantem isso em tempo
 *   de compilação.
 *
 * INTEGRAÇÃO COM SMARTLEADS: zero. Este módulo não toca em lead-proxy.ts,
 * handleSubmit, submitLead nem no webhook.
 */

// ── Catálogo de eventos ───────────────────────────────────────────────────────

export type FunnelEvent =
  | "hero_cta_click"
  | "mid_page_cta_click"
  | "sticky_cta_click"
  | "form_view"
  | "form_start"
  | "form_submit_success"
  | "form_submit_error"
  | "whatsapp_click"
  | "thank_you_view";

// ── Propriedades permitidas (sem PII) ─────────────────────────────────────────

export interface EventProps {
  /** Identificador da seção onde o evento ocorreu, ex: "hero", "localização" */
  section?: string;
  /** Rótulo descritivo do elemento, ex: "hero_cta", "wa_form_button" */
  label?: string;
  /** Posição no funil: "top" | "mid" | "bottom" */
  funnel_position?: "top" | "mid" | "bottom";
  /** Campo do formulário que foi tocado primeiro */
  first_field?: string;
  /** Parcela selecionada — não é PII */
  parcela?: string;
  /** Objetivo selecionado — não é PII */
  objetivo?: string;
  /** utm_source capturado — não é PII */
  utm_source?: string;
  /** utm_campaign capturado — não é PII */
  utm_campaign?: string;
  /** Mensagem de erro genérica — sem detalhes do servidor */
  error_type?: string;
}

// ── Tipo do dataLayer ─────────────────────────────────────────────────────────

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

// ── Função central ────────────────────────────────────────────────────────────

/**
 * trackEvent — dispara um evento de funil.
 *
 * @param event  Nome do evento (FunnelEvent)
 * @param props  Propriedades contextuais opcionais (sem PII)
 */
export function trackEvent(event: FunnelEvent, props?: EventProps): void {
  if (typeof window === "undefined") return;

  const payload: Record<string, unknown> = {
    event,
    timestamp: Date.now(),
    ...props,
  };

  // 1. Empurra para dataLayer (GTM/GA4 quando conectado)
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);

  // 2. Log no console em desenvolvimento
  if (import.meta.env.DEV) {
    console.debug(`[track] ${event}`, props ?? {});
  }
}
