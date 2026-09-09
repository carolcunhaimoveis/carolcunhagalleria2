import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { enrichLead, submitLead } from "../lib/lead-proxy";
import { captureUtmParams, readUtmParams } from "../lib/utm";
import { trackEvent } from "../lib/events";
import { initPixel, fireLeadEvent } from "../lib/pixel";

// ── Máscara de telefone: (00) 0000-0000 ou (00) 00000-0000 ──────────────────
function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

function isValidPhone(phone: string): boolean {
  const d = phone.replace(/\D/g, "");
  return d.length >= 10 && d.length <= 11;
}

function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

const WA =
  "https://wa.me/5519986107562?text=Ol%C3%A1%2C%20vi%20o%20site%20do%20Alto do Galleria II%20de%20Nova%20Odessa%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es";

// ─── HTML estático completo ────────────────────────────────────────────────────
const BODY_HTML = `<div class="flare-bg" aria-hidden="true"></div><div class="fw" aria-hidden="true"><div class="fl f1"></div><div class="fl f2"></div><div class="fl f3"></div><div class="fl f4"></div></div>
<div class="w">
<nav><div class="c ni"><a href="#" class="lo">Carol <span>Cunha</span></a><ul class="nl"><li><a href="#sobre">Diferenciais</a></li><li><a href="#galeria">Galeria</a></li><li><a href="#lazer">Lazer</a></li><li><a href="#local">Localização</a></li><li><a href="https://www.instagram.com/carolcunha.imoveis/" target="_blank" rel="noopener" class="ig-link"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>@carolcunha.imoveis</a></li>
<li><a href="#contato" class="nc">Fale comigo</a></li></ul></div></nav>

<!-- 1. HERO -->
<section class="hero2">
  <div class="c h2c">
    <div class="h2t">
      <div class="h2ey">ALTO DO GALLERIA II</div>
      <h1 class="h2h1">Apartamentos de <span class="nt">45 a 47 m²</span> perto do Galleria Shopping</h1>
      <p class="h2sub">2 dormitórios, varanda integrada, lazer completo e soluções inteligentes no Jardim Boa Esperança, em Campinas.</p>
      <ul class="h2pills">
        <li><span class="h2pill">🛏️ 2 dormitórios</span></li>
        <li><span class="h2pill">📍 Campinas/SP</span></li>
        <li><span class="h2pill">🚗 Opções com vaga coberta</span></li>
      </ul>
      <a href="#contato" class="btn bg h2cta">QUERO RECEBER VALORES E CONDIÇÕES</a>
      <p class="h2micro">Atendimento direto com Carol Cunha • Corretora de Imóveis</p>
    </div>
    <div class="h2img">
      <img
        loading="eager"
        fetchpriority="high"
        decoding="sync"
        width="720"
        height="540"
        src="/images/galleria-01.webp"
        alt="Boulevard de entrada do Alto do Galleria II"
        sizes="(max-width:900px) 100vw, 50vw"
      />
    </div>
  </div>
</section>

<!-- 1.5. POR QUE CONHECER -->
<section class="sec pq-sec" id="porque"><div class="c"><div class="sh"><span class="slb">Uma escolha que faz sentido</span><h2 class="st">Por que conhecer o <span class="nt">Alto do Galleria II</span>?</h2></div><div class="pq-grid"><div class="pq-item rv2"><span class="pq-icon">🏠</span><h3>Plantas de 45 a 47 m²</h3><p>Tipologias de centro e ponta, com varanda e ambientes integrados.</p></div><div class="pq-item rv2"><span class="pq-icon">🏊</span><h3>Lazer completo</h3><p>Piscinas, academia, playground e salão gourmet.</p></div><div class="pq-item rv2"><span class="pq-icon">🔌</span><h3>Soluções inteligentes</h3><p>Fechadura eletrônica, tomadas USB e ponto para ar-condicionado.</p></div><div class="pq-item rv2"><span class="pq-icon">📍</span><h3>Perto de tudo</h3><p>Galleria Shopping, Taquaral e Rodovia Dom Pedro próximos.</p></div></div><div class="pq-cta"><a href="#contato" class="btn bg">QUERO RECEBER VALORES E CONDIÇÕES</a></div></div></section>

<!-- 2. PRINCIPAIS DIFERENCIAIS -->
<section class="sec" id="sobre"><div class="c"><div class="sh"><span class="slb">O Empreendimento</span><h2 class="st">Seu apartamento perto de <span class="nt">tudo</span></h2><p class="sd">Um lançamento da Zuma Engenharia pensado para o primeiro imóvel, com espaços funcionais, tecnologia e uma localização estratégica.</p></div><div class="cards"><div class="card rv2"><div class="ci ci-g">📐</div><h3>Plantas inteligentes</h3><p>Apartamentos de 45 a 47 m², com dois dormitórios e varanda integrada.</p><span class="ct">45 a 47 m²</span></div><div class="card rv2"><div class="ci ci-r">🍽️</div><h3>Ambientes integrados</h3><p>Cozinha, sala de estar e living conectados para aproveitar melhor cada espaço.</p><span class="ct">Mais funcionalidade</span></div><div class="card rv2"><div class="ci ci-a">🔐</div><h3>Fechadura eletrônica</h3><p>Tecnologia e praticidade desde a porta de entrada.</p><span class="ct">Mais segurança</span></div><div class="card rv2"><div class="ci ci-e">❄️</div><h3>Conforto preparado</h3><p>Ponto para ar-condicionado no dormitório do casal e tomadas USB.</p><span class="ct">Soluções atuais</span></div><div class="card rv2"><div class="ci ci-g">🚗</div><h3>Vaga coberta</h3><p>Tipologias divulgadas com uma vaga coberta; consulte disponibilidade.</p><span class="ct">Consulte unidades</span></div><div class="card rv2"><div class="ci ci-r">📈</div><h3>Localização valorizada</h3><p>Jardim Boa Esperança, próximo ao Galleria e à Rodovia Dom Pedro.</p><span class="ct">Campinas/SP</span></div></div></div></section>

<!-- 3. SEÇÃO VISUAL DE DESEJO -->
<section class="sec vd-sec" id="galeria"><div class="c"><div class="sh"><span class="slb">O Empreendimento em Imagens</span><h2 class="st">Conheça o <span class="nt">Alto do Galleria II</span></h2><p class="sd">Perspectivas reais do projeto, áreas comuns, apartamentos decorados e plantas.</p></div><div class="vd-wrap"><button class="vd-btn vd-pv" id="vd-prev" aria-label="Anterior">&#10094;</button><div class="vd-grid rv2" id="vd-track"><div class="vd-main"><img loading="lazy" decoding="async" width="800" height="600" src="/images/galleria-01.webp" alt="Fachada do residencial"><span class="vd-label">Fachada do residencial</span></div><div class="vd-side"><div class="vd-thumb"><img loading="lazy" decoding="async" width="480" height="320" src="/images/galleria-02.webp" alt="Portaria"><span class="vd-label">Portaria</span></div><div class="vd-thumb"><img loading="lazy" decoding="async" width="480" height="320" src="/images/galleria-03.webp" alt="Piscinas e deck"><span class="vd-label">Piscinas e deck</span></div></div><div class="vd-row"><div class="vd-thumb"><img loading="lazy" decoding="async" width="480" height="300" src="/images/galleria-04.webp" alt="Salão gourmet"><span class="vd-label">Salão gourmet</span></div><div class="vd-thumb"><img loading="lazy" decoding="async" width="480" height="300" src="/images/galleria-05.webp" alt="Academia"><span class="vd-label">Academia</span></div><div class="vd-thumb"><img loading="lazy" decoding="async" width="480" height="300" src="/images/galleria-06.webp" alt="Ambientes do apartamento"><span class="vd-label">Ambientes do apartamento</span></div></div></div><button class="vd-btn vd-nx" id="vd-next" aria-label="Próximo">&#10095;</button></div></div></section>

<!-- 4. LAZER E INFRAESTRUTURA -->
<section class="sec" id="lazer"><div class="c"><div class="sh"><span class="slb">Lazer &amp; Infraestrutura</span><h2 class="st">Estrutura para aproveitar <span class="nt">todos os dias</span></h2><p class="sd">Espaços planejados para convivência, bem-estar e qualidade de vida.</p></div><div class="lz-grid"><div class="lz-item rv2"><div class="lz-img"><img loading="lazy" decoding="async" width="480" height="300" src="/images/galleria-03.webp" alt="Piscinas"></div><div class="lz-info"><span class="lz-icon">🏊</span><h3>Piscinas</h3><p>Piscinas adulto e infantil integradas ao deck.</p></div></div><div class="lz-item rv2"><div class="lz-img"><img loading="lazy" decoding="async" width="480" height="300" src="/images/galleria-04.webp" alt="Salão Gourmet"></div><div class="lz-info"><span class="lz-icon">🍽️</span><h3>Salão Gourmet</h3><p>Espaço com churrasqueira para receber bem.</p></div></div><div class="lz-item rv2"><div class="lz-img"><img loading="lazy" decoding="async" width="480" height="300" src="/images/galleria-05.webp" alt="Academia"></div><div class="lz-info"><span class="lz-icon">🏋️</span><h3>Academia</h3><p>Ambiente planejado para uma rotina mais ativa.</p></div></div><div class="lz-item rv2"><div class="lz-img"><img loading="lazy" decoding="async" width="480" height="300" src="/images/galleria-06.webp" alt="Playground"></div><div class="lz-info"><span class="lz-icon">🧒</span><h3>Playground</h3><p>Diversão e convivência para as crianças.</p></div></div></div><details class="lz-more rv2"><summary class="lz-toggle">VER ESTRUTURA COMPLETA <span class="lz-arr">&#8964;</span></summary><div class="lz-extra"><div class="lz-tag"><span>💼</span>Espaço multiuso</div><div class="lz-tag"><span>🍖</span>Churrasqueira</div><div class="lz-tag"><span>🌿</span>Áreas de convivência</div><div class="lz-tag"><span>🚲</span>Bicicletas compartilhadas</div></div></details><div class="lz-infra rv2"><div class="lz-infra-head"><span class="slb">Diferenciais</span><h3 class="lz-infra-title">Detalhes pensados para o dia a dia</h3></div><div class="lz-infra-grid"><div class="lz-inf-item"><span>🛡</span><span> Guarita e acesso controlado</span></div><div class="lz-inf-item"><span>📦</span><span>Espaço para recebimento de entregas</span></div><div class="lz-inf-item"><span>🔌</span><span>Tomadas USB nos apartamentos</span></div><div class="lz-inf-item"><span>❄️</span><span>Ponto para ar-condicionado</span></div></div></div><div class="lz-cta"><a href="#contato" class="btn bg">QUERO RECEBER VALORES E CONDIÇÕES</a></div></div></section>

<!-- 5. LOCALIZAÇÃO -->
<section class="sec" id="local"><div class="c"><div class="loc-layout"><div class="loc-text"><span class="slb">Localização</span><h2 class="st">Perto do que importa em <span class="nt">Campinas</span></h2><p class="loc-desc">No Jardim Boa Esperança, próximo ao Galleria Shopping, Taquaral e Rodovia Dom Pedro I.</p><div class="loc-addr rv2"><span class="loc-pin">📍</span><div><strong>Jardim Boa Esperança — Campinas/SP</strong><span>Rua Antônio Pavin, 195</span></div></div><div class="loc-cards"><div class="loc-card rv2"><span class="loc-time">5 min</span><span class="loc-name">Galleria Shopping</span><span class="loc-via">Compras e gastronomia</span></div><div class="loc-card rv2"><span class="loc-time">7 min</span><span class="loc-name">Rodovia Dom Pedro I</span><span class="loc-via">Mobilidade regional</span></div><div class="loc-card rv2"><span class="loc-time">8 min</span><span class="loc-name">Parque do Taquaral</span><span class="loc-via">Lazer ao ar livre</span></div><div class="loc-card rv2"><span class="loc-time">10 min</span><span class="loc-name">Lagoa do Taquaral</span><span class="loc-via">Esporte e convivência</span></div></div><div class="loc-cta"><a href="#contato" class="btn bg">QUERO RECEBER VALORES E CONDIÇÕES</a></div></div><div class="loc-map"><iframe title="Localização Alto do Galleria II" src="https://www.google.com/maps?q=Jardim%20Boa%20Esperan%C3%A7a%20%E2%80%94%20Campinas%2FSP&output=embed" style="border:0;width:100%;height:100%;display:block" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div></div></section>

<!-- 6. CONDIÇÕES COMERCIAIS -->
<section class="sec" id="condicoes"><div class="c"><div class="sh"><span class="slb">Formas de Aquisição</span><h2 class="st">Condições para <span class="nt">planejar sua compra</span></h2><p class="sd">Receba informações atualizadas e uma análise personalizada.</p></div><div class="cond-grid"><div class="cond-item rv2"><div class="cond-icon">🏠</div><h3>Minha Casa Minha Vida</h3><p>Consulte o enquadramento e os benefícios aplicáveis ao seu perfil.</p></div><div class="cond-item rv2"><div class="cond-icon">💳</div><h3>Simulação personalizada</h3><p>Use o simulador do Smart Leads para estimar entrada e financiamento.</p></div><div class="cond-item rv2"><div class="cond-icon">🔑</div><h3>Primeiro imóvel</h3><p>Atendimento para organizar documentação e próximos passos.</p></div><div class="cond-item rv2"><div class="cond-icon">🤝</div><h3>Assessoria completa</h3><p>Acompanhamento da simulação à assinatura.</p></div></div><p class="cond-nota rv2">Valores, disponibilidade, financiamento e condições comerciais podem mudar. Confirme as condições vigentes no atendimento.</p></div></section>

<!-- 7. SEGURANÇA JURÍDICA -->
<section class="sec" id="juridico"><div class="c"><div class="sh"><span class="slb">Transparência</span><h2 class="st">Informações para uma decisão <span class="nt">segura</span></h2><p class="sd">Conte com atendimento profissional para validar disponibilidade, documentação e condições vigentes.</p></div><div class="jur-grid"><div class="jur-item rv2"><span class="jur-icon">📋</span><div><h4>Disponibilidade</h4><p>Unidades e condições são confirmadas no momento do atendimento.</p></div></div><div class="jur-item rv2"><span class="jur-icon">🏦</span><div><h4>Crédito e financiamento</h4><p>Sujeitos à análise e às regras da instituição financeira ou programa aplicável.</p></div></div><div class="jur-item rv2"><span class="jur-icon">✅</span><div><h4>Atendimento responsável</h4><p>Receba orientação para conferir todos os documentos antes da compra.</p></div></div></div><details class="jur-more rv2"><summary class="jur-toggle">VER AVISO IMPORTANTE <span class="jur-arr">&#8964;</span></summary><div class="jur-full"><p>O Alto do Galleria II é um lançamento da Zuma Engenharia. Áreas, vagas, valores, prazo de entrega, disponibilidade e enquadramento em programas habitacionais devem ser confirmados no atendimento. Perspectivas artísticas sujeitas a alterações.</p></div></details></div></section>
</div>`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alto do Galleria II | Carol Cunha Imóveis" },
      {
        name: "description",
        content:
          "Alto do Galleria II em Campinas/SP. Informações, condições e atendimento personalizado com Carol Cunha.",
      },
      { property: "og:title", content: "Alto do Galleria II | Carol Cunha Imóveis" },
      {
        property: "og:description",
        content:
          "2 dormitórios, varanda integrada, lazer completo e soluções inteligentes no Jardim Boa Esperança, em Campinas.",
      },
      { property: "og:url", content: "https://carolcunhagalleria2.lovable.app/" },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content:
          "https://carolcunhagalleria2.lovable.app/images/galleria-01.webp",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content:
          "https://carolcunhagalleria2.lovable.app/images/galleria-01.webp",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "preload",
        as: "image",
        href: "/images/galleria-01.webp",
        fetchPriority: "high",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    parcela: "",
    objetivo: "",
    consentimento: false,
  });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [step, setStep] = useState<1 | 2>(1);
  const [captureCredentials, setCaptureCredentials] = useState<{
    leadId: string;
    updateToken: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    nome?: string;
    telefone?: string;
    consentimento?: string;
  }>({});

  // flag para disparar form_start apenas uma vez por sessão de formulário
  const formStartedRef = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // form_start — dispara apenas na primeira interação
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent("form_start", { section: "contato", label: e.target.name });
    }
    const { name, value } = e.target;

    if (name === "consentimento" && e.target instanceof HTMLInputElement) {
      setForm((p) => ({ ...p, consentimento: e.target.checked }));
      setFieldErrors((p) => ({
        ...p,
        consentimento: e.target.checked ? undefined : p.consentimento,
      }));
    } else if (name === "telefone") {
      const masked = maskPhone(value);
      setForm((p) => ({ ...p, telefone: masked }));
      setFieldErrors((p) => ({
        ...p,
        telefone:
          isValidPhone(masked) || masked === "" ? undefined : "Digite um WhatsApp válido com DDD.",
      }));
    } else if (name === "nome") {
      setForm((p) => ({ ...p, nome: value }));
      setFieldErrors((p) => ({
        ...p,
        nome: isValidName(value) || value === "" ? undefined : "Informe seu nome.",
      }));
    } else if (name === "parcela") {
      setForm((p) => ({ ...p, parcela: value }));
    } else if (name === "objetivo") {
      setForm((p) => ({ ...p, objetivo: value }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valida todos os campos de uma vez, sem sair ao primeiro erro
    const errs: typeof fieldErrors = {};
    if (!isValidName(form.nome)) errs.nome = "Informe seu nome.";
    if (!isValidPhone(form.telefone)) errs.telefone = "Digite um WhatsApp válido com DDD.";
    if (!form.consentimento) errs.consentimento = "Confirme que podemos entrar em contato.";

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      // Foca o primeiro campo com erro para acessibilidade
      const firstErrField = ["nome", "telefone", "consentimento"].find(
        (f) => errs[f as keyof typeof errs],
      );
      if (firstErrField) {
        const el = document.getElementById(`lead-${firstErrField}`);
        el?.focus();
      }
      return;
    }

    setFormStatus("sending");
    try {
      const result = await submitLead({
        data: {
          name: form.nome,
          phone: form.telefone,
          utms: JSON.stringify(readUtmParams()),
          landingPage:
            typeof window !== "undefined" ? window.location.href.split("?")[0] : undefined,
        },
      });
      // ── sucesso confirmado pelo SmartLeads ─────────────────────────────
      // 1. Evento interno de funil
      trackEvent("form_submit_success", {
        section: "contato",
        utm_source: readUtmParams().utm_source,
        utm_campaign: readUtmParams().utm_campaign,
      });
      // 2. Meta Pixel Lead — SOMENTE aqui, após resposta positiva do servidor
      fireLeadEvent();
      // 3. O contato já está salvo; a etapa seguinte é opcional e só o enriquece.
      setCaptureCredentials({ leadId: result.leadId, updateToken: result.updateToken });
      setFormStatus("idle");
      setStep(2);
    } catch (err) {
      console.error("[form] submitLead error:", err);
      trackEvent("form_submit_error", { section: "contato", error_type: "server_error" });
      setFormStatus("error");
      // Não limpa o formulário em caso de erro
    }
  };

  const finishQualification = async (skip = false) => {
    if (!captureCredentials) return;
    setFormStatus("sending");
    try {
      if (!skip && (form.parcela || form.objetivo)) {
        await enrichLead({
          data: {
            ...captureCredentials,
            parcela: form.parcela || undefined,
            objetivo: form.objetivo || undefined,
          },
        });
        trackEvent("lead_qualification_success", {
          section: "contato",
          parcela: form.parcela,
          objetivo: form.objetivo,
        });
      }
      await router.navigate({ to: "/obrigada" });
    } catch (err) {
      console.error("[form] enrichLead error:", err);
      setFormStatus("error");
    }
  };

  useEffect(() => {
    // ── captura UTM/fbclid da URL ao montar ────────────────────────────────
    captureUtmParams();

    // ── Meta Pixel — PageView + ViewContent ────────────────────────────────
    initPixel();

    // ── carrossel ──────────────────────────────────────────────────────────
    let ci = 0;
    const sl = document.querySelectorAll<HTMLElement>(".cs");
    const tl = sl.length;
    const cr = document.getElementById("cr");
    const dt = document.getElementById("cdots");
    if (cr && dt) {
      const up = () => {
        cr.style.transform = "translateX(-" + ci * 100 + "%)";
        document.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("a", i === ci));
      };
      const mc = (d: number) => {
        ci = (ci + d + tl) % tl;
        up();
      };
      (window as unknown as { mc: (d: number) => void }).mc = mc;
      for (let i = 0; i < tl; i++) {
        const d = document.createElement("button");
        d.className = "dot" + (i === 0 ? " a" : "");
        d.onclick = () => {
          ci = i;
          up();
        };
        dt.appendChild(d);
      }
      const interval = window.setInterval(() => mc(1), 6000);
      window.__trevisoInterval = interval;
    }

    // ── sticky mobile CTA ─────────────────────────────────────────────────
    const stickyBtn = document.getElementById("cta-sticky");
    const heroEl = document.querySelector<HTMLElement>(".hero2");
    const contatoEl = document.getElementById("contato");
    let stickyOb: IntersectionObserver | undefined;
    if (stickyBtn && heroEl && contatoEl) {
      // sticky_cta_click
      stickyBtn.addEventListener("click", () =>
        trackEvent("sticky_cta_click", { label: "sticky_mobile", funnel_position: "mid" }),
      );
      const update = (heroVisible: boolean, contatoVisible: boolean) => {
        if (!heroVisible && !contatoVisible) {
          stickyBtn.classList.add("csm-visible");
        } else {
          stickyBtn.classList.remove("csm-visible");
        }
      };
      let heroV = true;
      let contatoV = false;
      stickyOb = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.target === heroEl) heroV = e.isIntersecting;
            if (e.target === contatoEl) contatoV = e.isIntersecting;
          });
          update(heroV, contatoV);
        },
        { threshold: 0.1 },
      );
      stickyOb.observe(heroEl);
      stickyOb.observe(contatoEl);
    }

    // ── carrossel galeria (vd-track) ───────────────────────────────────────
    const vdTrack = document.getElementById("vd-track") as HTMLElement | null;
    const vdPrev = document.getElementById("vd-prev") as HTMLButtonElement | null;
    const vdNext = document.getElementById("vd-next") as HTMLButtonElement | null;
    let vdPaused = false;
    let vdAutoInterval: number | undefined;

    if (vdTrack && vdPrev && vdNext) {
      const slideBy = () => {
        const items = vdTrack.querySelectorAll<HTMLElement>(".vd-main, .vd-thumb");
        const item = items[0];
        if (!item) return;
        const slideW = item.getBoundingClientRect().width + 12; // 12 = gap
        const max = vdTrack.scrollWidth - vdTrack.clientWidth;
        const next =
          vdTrack.scrollLeft + slideW > max - 4
            ? 0 // wrap around
            : vdTrack.scrollLeft + slideW;
        vdTrack.scrollTo({ left: next, behavior: "smooth" });
      };
      const slidePrev = () => {
        const items = vdTrack.querySelectorAll<HTMLElement>(".vd-main, .vd-thumb");
        const item = items[0];
        if (!item) return;
        const slideW = item.getBoundingClientRect().width + 12;
        const prev = Math.max(0, vdTrack.scrollLeft - slideW);
        vdTrack.scrollTo({ left: prev, behavior: "smooth" });
      };
      vdNext.addEventListener("click", () => {
        slideBy();
        vdPaused = true;
      });
      vdPrev.addEventListener("click", () => {
        slidePrev();
        vdPaused = true;
      });
      vdTrack.addEventListener("mouseenter", () => {
        vdPaused = true;
      });
      vdTrack.addEventListener("mouseleave", () => {
        vdPaused = false;
      });
      vdAutoInterval = window.setInterval(() => {
        if (!vdPaused) slideBy();
      }, 4000);
    }

    // ── eventos de funil (CTAs do BODY_HTML via delegação) ────────────────
    const heroCta = document.querySelector<HTMLElement>(".h2cta");
    const midCtaEls = document.querySelectorAll<HTMLElement>(".pq-cta a, .lz-cta a, .loc-cta a");
    const waEls = document.querySelectorAll<HTMLElement>(`a[href*="wa.me"]`);

    const onHeroCta = () =>
      trackEvent("hero_cta_click", { section: "hero", funnel_position: "top" });
    heroCta?.addEventListener("click", onHeroCta);

    const midHandlers: Array<{ el: Element; fn: () => void }> = [];
    midCtaEls.forEach((el) => {
      const fn = () =>
        trackEvent("mid_page_cta_click", {
          section: el.closest("section")?.id ?? "mid",
          funnel_position: "mid",
        });
      el.addEventListener("click", fn);
      midHandlers.push({ el, fn });
    });

    const waHandlers: Array<{ el: Element; fn: () => void }> = [];
    waEls.forEach((el) => {
      const fn = () =>
        trackEvent("whatsapp_click", {
          label: el.closest("section")?.id ?? el.className,
        });
      el.addEventListener("click", fn);
      waHandlers.push({ el, fn });
    });

    // form_view — dispara quando a seção #contato entra no viewport
    const formEl = document.getElementById("contato");
    let formViewed = false;
    let formViewOb: IntersectionObserver | undefined;
    if (formEl) {
      formViewOb = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !formViewed) {
            formViewed = true;
            trackEvent("form_view", { section: "contato", funnel_position: "bottom" });
            formViewOb?.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      formViewOb.observe(formEl);
    }

    // ── intersection observer (animações rv2) ──────────────────────────────
    const ob = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            ob.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px" },
    );
    document.querySelectorAll(".rv2").forEach((e) => ob.observe(e));

    // ── scroll suave ───────────────────────────────────────────────────────
    const anchorHandlers: Array<{ el: Element; fn: (e: Event) => void }> = [];
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      const fn = (e: Event) => {
        const href = a.getAttribute("href");
        if (!href || href === "#") return;
        const t = document.querySelector(href);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      a.addEventListener("click", fn);
      anchorHandlers.push({ el: a, fn });
    });

    return () => {
      if (window.__trevisoInterval) window.clearInterval(window.__trevisoInterval);
      if (vdAutoInterval) window.clearInterval(vdAutoInterval);
      stickyOb?.disconnect();
      formViewOb?.disconnect();
      ob.disconnect();
      anchorHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
      heroCta?.removeEventListener("click", onHeroCta);
      midHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
      waHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
      dt?.replaceChildren();
    };
  }, []);

  return (
    <>
      <FlarePicker />
      <div dangerouslySetInnerHTML={{ __html: BODY_HTML }} />

      {/* Apresentação da Carol */}
      <section className="sec carol-sec" id="carol">
        <div className="c">
          <div className="carol-layout rv2">
            <div className="carol-photo-wrap">
              <img
                loading="lazy"
                decoding="async"
                width={400}
                height={480}
                src="/images/carol-cunha.jpg"
                alt="Carol Cunha — Corretora de Imóveis"
                className="carol-photo"
                sizes="(max-width:900px) 60vw, 380px"
              />
            </div>
            <div className="carol-text">
              <span className="slb">Atendimento</span>
              <h2 className="st">
                Seu atendimento será <span className="nt">diretamente comigo</span>
              </h2>
              <p className="carol-bio">
                Sou Carol Cunha, corretora de imóveis. Posso te apresentar as condições disponíveis,
                esclarecer suas dúvidas e ajudar você a avaliar se o Alto do Galleria II combina
                com seus planos.
              </p>
              <ul className="carol-benefits">
                <li>Atendimento personalizado</li>
                <li>Informações sobre valores e disponibilidade</li>
                <li>Possibilidade de agendamento de visita</li>
              </ul>
              <a
                href="#contato"
                className="btn bg carol-cta"
                onClick={() =>
                  trackEvent("mid_page_cta_click", {
                    section: "carol",
                    label: "carol_cta",
                    funnel_position: "bottom",
                  })
                }
              >
                QUERO RECEBER VALORES E CONDIÇÕES
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de contato — JSX puro para que o formulário funcione sem portal */}
      <section className="sec" id="contato">
        <div className="c">
          <div className="lf-wrap rv2">
            {/* Cabeçalho da seção */}
            <div className="lf-head">
              <span className="slb">Fale com a Carol</span>
              <h2 className="lf-title">
                Receba valores e condições do <span className="nt">Alto do Galleria II</span>
              </h2>
              <p className="lf-sub">Preencha os dados abaixo. É rápido e sem compromisso.</p>
            </div>

            <div className="lf-body">
              {step === 1 ? (
                <form onSubmit={handleSubmit} className="lead-form" noValidate>
                  <div className="lead-form-fields">
                    {/* Nome */}
                    <div className="lead-field">
                      <label htmlFor="lead-nome">Seu nome</label>
                      <input
                        id="lead-nome"
                        type="text"
                        name="nome"
                        placeholder="Como podemos te chamar?"
                        value={form.nome}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                        aria-required="true"
                        aria-describedby={fieldErrors.nome ? "err-nome" : undefined}
                        className={fieldErrors.nome ? "input-error" : ""}
                      />
                      {fieldErrors.nome && (
                        <span id="err-nome" className="lead-field-err" role="alert">
                          {fieldErrors.nome}
                        </span>
                      )}
                    </div>

                    {/* WhatsApp */}
                    <div className="lead-field">
                      <label htmlFor="lead-telefone">Seu WhatsApp</label>
                      <input
                        id="lead-telefone"
                        type="tel"
                        name="telefone"
                        placeholder="(19) 9 9999-9999"
                        value={form.telefone}
                        onChange={handleChange}
                        required
                        autoComplete="tel"
                        inputMode="numeric"
                        aria-required="true"
                        aria-describedby={fieldErrors.telefone ? "err-telefone" : undefined}
                        className={fieldErrors.telefone ? "input-error" : ""}
                      />
                      {fieldErrors.telefone && (
                        <span id="err-telefone" className="lead-field-err" role="alert">
                          {fieldErrors.telefone}
                        </span>
                      )}
                    </div>

                    <div className="lead-field lead-field--full">
                      <label className="lf-consent" htmlFor="lead-consentimento">
                        <input
                          id="lead-consentimento"
                          type="checkbox"
                          name="consentimento"
                          checked={form.consentimento}
                          onChange={handleChange}
                          required
                        />
                        <span>
                          Concordo em receber informações e atendimento sobre este empreendimento.
                        </span>
                      </label>
                      {fieldErrors.consentimento && (
                        <span id="err-consentimento" className="lead-field-err" role="alert">
                          {fieldErrors.consentimento}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* /lead-form-fields */}

                  {/* Ações */}
                  <div className="lf-actions">
                    <button
                      type="submit"
                      className="btn bg lead-submit lf-btn"
                      disabled={formStatus === "sending"}
                    >
                      {formStatus === "sending" ? (
                        <>
                          <span className="lf-spinner" aria-hidden="true" />
                          Enviando…
                        </>
                      ) : (
                        "QUERO RECEBER AS CONDIÇÕES"
                      )}
                    </button>

                    {formStatus === "error" && (
                      <p className="lead-msg lead-err" role="alert">
                        Por favor, verifique os campos e tente novamente. Se preferir, fale direto
                        pelo WhatsApp.
                      </p>
                    )}

                    <p className="lf-micro">
                      Seus dados serão utilizados somente para entrar em contato sobre o Alto do Galleria II.
                    </p>
                    <p className="lf-privacy">
                      Ao continuar, você concorda com nossa{" "}
                      <a
                        href="/politica-de-privacidade"
                        className="lf-privacy-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Política de Privacidade
                      </a>
                      .
                    </p>
                  </div>
                </form>
              ) : (
                <div className="lead-form" aria-live="polite">
                  <div className="lf-step-head">
                    <span className="lf-step-check" aria-hidden="true">
                      ✓
                    </span>
                    <div>
                      <h3>Perfeito! Seu contato já foi enviado.</h3>
                      <p>
                        Só mais 2 perguntas opcionais para encontrarmos as opções mais adequadas
                        para você.
                      </p>
                    </div>
                  </div>
                  <div className="lead-form-fields">
                    <div className="lead-field lead-field--full">
                      <label htmlFor="lead-objetivo">O que você busca hoje?</label>
                      <select
                        id="lead-objetivo"
                        name="objetivo"
                        value={form.objetivo}
                        onChange={handleChange}
                        className="lead-select"
                      >
                        <option value="">Selecione uma opção (opcional)</option>
                        <option value="Comprar para morar">Comprar para morar</option>
                        <option value="Comprar para investir">Comprar para investir</option>
                        <option value="Comprar meu primeiro apartamento">
                          Comprar meu primeiro apartamento
                        </option>
                        <option value="Ainda estou pesquisando">Ainda estou pesquisando</option>
                      </select>
                    </div>
                    <div className="lead-field lead-field--full">
                      <label htmlFor="lead-parcela">
                        Qual faixa de parcela seria mais confortável para você?
                      </label>
                      <select
                        id="lead-parcela"
                        name="parcela"
                        value={form.parcela}
                        onChange={handleChange}
                        className="lead-select"
                      >
                        <option value="">Selecione uma opção (opcional)</option>
                        <option value="Até R$ 800">Até R$ 800</option>
                        <option value="R$ 800 a R$ 1.200">R$ 800 a R$ 1.200</option>
                        <option value="R$ 1.200 a R$ 1.600">R$ 1.200 a R$ 1.600</option>
                        <option value="R$ 1.600 a R$ 2.000">R$ 1.600 a R$ 2.000</option>
                        <option value="Acima de R$ 2.000">Acima de R$ 2.000</option>
                        <option value="Quero conhecer as condições primeiro">
                          Quero conhecer as condições primeiro
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="lf-actions">
                    <button
                      type="button"
                      className="btn bg lead-submit lf-btn"
                      disabled={formStatus === "sending"}
                      onClick={() => finishQualification(false)}
                    >
                      {formStatus === "sending" ? (
                        <>
                          <span className="lf-spinner" aria-hidden="true" />
                          Salvando…
                        </>
                      ) : (
                        "VER AS MELHORES OPÇÕES"
                      )}
                    </button>
                    <button
                      type="button"
                      className="lf-skip"
                      disabled={formStatus === "sending"}
                      onClick={() => finishQualification(true)}
                    >
                      Prefiro conhecer as condições primeiro
                    </button>
                    {formStatus === "error" && (
                      <p className="lead-msg lead-err" role="alert">
                        Seu contato já foi salvo. Não foi possível registrar estas respostas; você
                        pode continuar.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* /lf-body */}
          </div>
          {/* /lf-wrap */}
        </div>
      </section>

      <footer>
        <div className="c">
          <p>© 2026 Alto do Galleria II</p>
          <div className="ft-links">
            <a
              href="https://www.instagram.com/carolcunha.imoveis/"
              target="_blank"
              rel="noopener noreferrer"
              className="ig-link"
            >
              <IgSvg />
              @carolcunha.imoveis
            </a>
          </div>
          <p style={{ marginTop: 6, color: "var(--txm)", fontSize: ".72rem" }}>
            O Alto do Galleria II é um lançamento da Zuma Engenharia. Áreas, vagas, valores, prazo de entrega, disponibilidade e enquadramento em programas habitacionais devem ser confirmados no atendimento. Perspectivas artísticas sujeitas a alterações.
          </p>
        </div>
      </footer>

      <a
        href="#contato"
        className="cta-sticky-mobile"
        id="cta-sticky"
        aria-label="Receber valores e condições"
      >
        RECEBER VALORES E CONDIÇÕES
      </a>
    </>
  );
}

function WaSvg() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function IgSvg() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

// ── FlarePicker (inalterado) ───────────────────────────────────────────────────
const PRESETS = ["gold", "blue", "purple", "green", "pink"] as const;
type Preset = (typeof PRESETS)[number];

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

function FlarePicker() {
  const [active, setActive] = useState<Preset | "custom">(() => {
    if (typeof window === "undefined") return "gold";
    return (localStorage.getItem("flare") as Preset) || "gold";
  });

  useEffect(() => {
    if (active === "custom") return;
    document.body.dataset.flare = active === "gold" ? "" : active;
    localStorage.setItem("flare", active);
    ["--flare-1-core", "--flare-1-mid", "--flare-2-core", "--flare-2-mid"].forEach((v) =>
      document.body.style.removeProperty(v),
    );
  }, [active]);

  const applyCustom = (hex: string) => {
    const rgb = hexToRgb(hex);
    delete document.body.dataset.flare;
    document.body.style.setProperty("--flare-1-core", rgb);
    document.body.style.setProperty("--flare-1-mid", rgb);
    document.body.style.setProperty("--flare-2-core", rgb);
    document.body.style.setProperty("--flare-2-mid", rgb);
    setActive("custom");
    localStorage.setItem("flare-custom", hex);
  };

  return (
    <div className="flare-picker" aria-label="Cor do flare">
      {PRESETS.map((p) => (
        <button
          key={p}
          type="button"
          className={`fp-${p} ${active === p ? "a" : ""}`}
          title={p}
          onClick={() => setActive(p)}
        />
      ))}
      <label title="Cor personalizada">
        <input
          type="color"
          defaultValue={
            typeof window !== "undefined"
              ? localStorage.getItem("flare-custom") || "#ffcd78"
              : "#ffcd78"
          }
          onChange={(e) => applyCustom(e.target.value)}
        />
      </label>
    </div>
  );
}

// tipo para o intervalo global
declare global {
  interface Window {
    __trevisoInterval?: number;
  }
}
