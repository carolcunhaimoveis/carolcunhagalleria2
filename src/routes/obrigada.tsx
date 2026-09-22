import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, CircleCheck } from "lucide-react";
import { trackEvent } from "../lib/events";
import { readUtmParams } from "../lib/utm";

export const Route = createFileRoute("/obrigada")({
  head: () => ({
    meta: [
      { title: "Obrigada | Alto do Galleria II" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@700&display=swap",
      },
    ],
  }),
  component: Obrigada,
});

function Obrigada() {
  useEffect(() => {
    const utms = readUtmParams();
    trackEvent("thank_you_view", {
      section: "obrigada",
      utm_source: utms.utm_source,
      utm_campaign: utms.utm_campaign,
    });
  }, []);
  return (
    <>
      {/* Fundo flare — idêntico à landing */}
      <div className="flare-bg" aria-hidden="true" />
      <div className="fw" aria-hidden="true">
        <div className="fl f1" />
        <div className="fl f2" />
        <div className="fl f3" />
        <div className="fl f4" />
      </div>

      {/* Wrapper com nav e conteúdo */}
      <div className="w">
        {/* Nav mínimo */}
        <nav>
          <div className="c ni">
            <Link to="/" className="lo">
              Carol <span>Cunha</span>
            </Link>
            <Link to="/" className="btn bh tks-nav-back">
              <ArrowLeft className="size-4 shrink-0 text-[var(--am)]" aria-hidden="true" />
              Voltar ao site
            </Link>
          </div>
        </nav>

        {/* Conteúdo central */}
        <div className="tks-page">
          <div className="c">
            <div className="tks-card rv2">
              {/* Ícone de confirmação */}
              <div className="tks-icon" aria-hidden="true">
                <CircleCheck className="size-12 text-[var(--am)]" strokeWidth={1.8} />
              </div>

              {/* Títulos */}
              <h1 className="tks-title">Pronto, recebi seu interesse!</h1>
              <p className="tks-text">
                Agora posso te enviar as informações do Alto do Galleria II e esclarecer suas
                dúvidas.
              </p>

              <div className="btn bg tks-cta" role="status">
                Obrigado pelo seu contato
              </div>

              {/* Texto secundário */}
              <p className="tks-secondary">
                Em breve entrarei em contato pelos dados informados.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé mínimo */}
        <footer>
          <div className="c">
            <p>© 2026 Alto do Galleria II</p>
          </div>
        </footer>
      </div>
    </>
  );
}
