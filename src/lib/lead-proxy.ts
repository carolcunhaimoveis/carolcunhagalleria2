import { createServerFn } from "@tanstack/react-start";

// ── Tipos do input ────────────────────────────────────────────────────────────

interface LeadInput {
  name: string;
  phone: string;
  email?: string;
  /** Faixa de parcela selecionada no formulário — mapeia para requestedInfo */
  parcela?: string;
  /** Objetivo declarado pelo lead: "Morar" | "Investir" */
  objetivo?: string;
  /** UTMs + fbclid serializados em JSON pelo cliente */
  utms?: string;
  /** Pathname ou URL completa da landing page, enviado pelo cliente */
  landingPage?: string;
}

interface EnrichmentInput {
  leadId: string;
  updateToken: string;
  parcela?: string;
  objetivo?: string;
}

interface CaptureResponse {
  success: boolean;
  leadId: string;
  updateToken: string;
}

const WEBHOOK_URL =
  "https://gkpmzsvhvwtotdwtryup.supabase.co/functions/v1/webhook-leads?source=galleria2&enterprise=Alto%20do%20Galleria%20II";

// ── Server Function ───────────────────────────────────────────────────────────

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = data as LeadInput;
    if (!d.name || !d.phone) {
      throw new Error("Campos obrigatórios: name, phone");
    }
    return d;
  })
  .handler(async ({ data }) => {
    // ── Desserializa UTMs recebidos do cliente ────────────────────────────
    // O campo "utms" chega como JSON string porque a server function transita
    // por uma requisição HTTP e objetos complexos são serializados pelo cliente.
    let utmSource: string | undefined;
    let utmMedium: string | undefined;
    let utmCampaign: string | undefined;
    let utmContent: string | undefined;
    let utmTerm: string | undefined;
    let fbclid: string | undefined;

    if (data.utms) {
      try {
        const u = JSON.parse(data.utms) as Record<string, string>;
        utmSource = u["utm_source"] || undefined;
        utmMedium = u["utm_medium"] || undefined;
        utmCampaign = u["utm_campaign"] || undefined;
        utmContent = u["utm_content"] || undefined;
        utmTerm = u["utm_term"] || undefined;
        // fbclid pode ser muito longo — trunca no cliente também por precaução
        fbclid = u["fbclid"] ? u["fbclid"].slice(0, 500) : undefined;
      } catch {
        // JSON inválido — ignora silenciosamente, UTMs ficam undefined
        console.warn("[leads] utms parse failed, continuando sem UTMs");
      }
    }

    // ── Monta a nota inicial (mantida para leitura humana no painel) ──────
    // Dados de atribuição seguem somente nos campos estruturados abaixo para
    // evitar duplicação e divergência entre as duas representações.
    const noteLines: string[] = ["Lead captado pelo site Alto do Galleria II"];
    if (data.parcela) noteLines.push(`Parcela desejada: ${data.parcela}`);
    if (data.objetivo) noteLines.push(`Objetivo: ${data.objetivo}`);

    const notes = noteLines.join(" | ");

    // ── Payload estruturado (novo formato) ────────────────────────────────
    // Campos de primeiro nível — a Edge Function os lê diretamente
    // sem precisar parsear texto do campo "notes".
    const payload = {
      // Campos existentes (retrocompatíveis)
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      propertyInterest: "Lote Residencial",
      familyIncome: 0,
      fgtsValue: 0,
      notes,
      source: "carolcunhagalleria2.com.br",

      // Campos de marketing estruturados (novos)
      objective: data.objetivo || undefined,
      requestedInfo: data.parcela || undefined,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      fbclid,
      landingPage: data.landingPage || "https://carolcunhagalleria2.lovable.app",
    };

    // Remove chaves com valor undefined para não poluir o JSON
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined),
    );

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanPayload),
    });

    const text = await response.text();
    console.log("[leads] SmartLeads status:", response.status, "body:", text);

    if (!response.ok) {
      throw new Error(`SmartLeads retornou ${response.status}: ${text}`);
    }

    const result = JSON.parse(text) as CaptureResponse;
    if (!result.leadId || !result.updateToken) {
      throw new Error("SmartLeads não devolveu as credenciais de enriquecimento do lead.");
    }
    return { ok: true, leadId: result.leadId, updateToken: result.updateToken };
  });

export const enrichLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = data as EnrichmentInput;
    if (!d.leadId || !d.updateToken) throw new Error("Lead inválido para enriquecimento.");
    return d;
  })
  .handler(async ({ data }) => {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "enrich",
        leadId: data.leadId,
        updateToken: data.updateToken,
        objective: data.objetivo || undefined,
        requestedInfo: data.parcela || undefined,
      }),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`SmartLeads retornou ${response.status}: ${text}`);
    return { ok: true };
  });
