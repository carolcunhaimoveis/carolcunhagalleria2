/** Integração centralizada com o Meta Pixel da Carol Cunha Imóveis. */

const META_PIXEL_ID = "1601525438422287";
const ENTERPRISE_ID = "galleria2";
const PRODUCTION_HOSTS = new Set(["carolcunhagalleria2.lovable.app"]);
const SCRIPT_ID = "carol-meta-pixel";

type MetaEventParams = Record<string, string>;
type FbqFn = (
  type: "init" | "track" | "trackCustom",
  eventOrId: string,
  params?: MetaEventParams,
) => void;

type FbqBootstrap = FbqFn & {
  callMethod?: (...args: unknown[]) => void;
  push: FbqBootstrap;
  loaded: boolean;
  version: string;
  queue: unknown[][];
};

interface CarolMetaPixelState {
  initialized: boolean;
  pageViewTracked: boolean;
  trackedLeadIds: Set<string>;
}

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
    __carolMetaPixelState?: CarolMetaPixelState;
  }
}

/** Previews, localhost e domínios Lovable genéricos não são autorizados. */
export function isMetaPixelAllowed(hostname: string): boolean {
  return PRODUCTION_HOSTS.has(hostname.toLowerCase());
}

function state(): CarolMetaPixelState {
  window.__carolMetaPixelState ??= {
    initialized: false,
    pageViewTracked: false,
    trackedLeadIds: new Set<string>(),
  };
  return window.__carolMetaPixelState;
}

function installOfficialBootstrap(): FbqFn {
  if (window.fbq) return window.fbq;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as FbqBootstrap;

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript?.parentNode) firstScript.parentNode.insertBefore(script, firstScript);
    else document.head.appendChild(script);
  }

  return fbq;
}

/** Inicializa o Pixel e registra um único PageView por carregamento da página. */
export function initMetaPixel(): boolean {
  if (typeof window === "undefined" || !isMetaPixelAllowed(window.location.hostname)) return false;

  const pixelState = state();
  const fbq = installOfficialBootstrap();

  if (!pixelState.initialized) {
    fbq("init", META_PIXEL_ID);
    pixelState.initialized = true;
  }
  if (!pixelState.pageViewTracked) {
    fbq("track", "PageView");
    pixelState.pageViewTracked = true;
  }
  return true;
}

/**
 * Registra Lead uma única vez para o cadastro confirmado pelo SmartLeads.
 * O leadId é usado somente para deduplicação local e nunca é enviado à Meta.
 */
export function trackLeadOnce(leadId: string): boolean {
  if (typeof window === "undefined" || !leadId || !isMetaPixelAllowed(window.location.hostname)) {
    return false;
  }

  const pixelState = state();
  if (!pixelState.initialized || !window.fbq || pixelState.trackedLeadIds.has(leadId)) {
    return false;
  }

  pixelState.trackedLeadIds.add(leadId);
  window.fbq("track", "Lead", { empreendimento: ENTERPRISE_ID });
  return true;
}
