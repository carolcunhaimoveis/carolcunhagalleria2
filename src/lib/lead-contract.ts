export interface CaptureResponse {
  success: boolean;
  leadId: string;
  updateToken: string;
}

/** Aceita somente a confirmação completa de criação retornada pelo SmartLeads. */
export function parseSuccessfulCaptureResponse(text: string): CaptureResponse {
  const result = JSON.parse(text) as Partial<CaptureResponse>;
  if (result.success !== true || !result.leadId || !result.updateToken) {
    throw new Error("SmartLeads não devolveu a confirmação completa de criação do lead.");
  }
  return result as CaptureResponse;
}
