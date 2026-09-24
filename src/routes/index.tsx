import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createElement, useEffect, useRef, useState } from "react";
import {
  Accessibility,
  ArrowUpDown,
  Baby,
  BedDouble,
  Building2,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  ClipboardList,
  CreditCard,
  Dumbbell,
  ExternalLink,
  Handshake,
  House,
  Instagram,
  KeyRound,
  Landmark,
  MapPin,
  Ruler,
  ShieldCheck,
  Snowflake,
  TrendingUp,
  Utensils,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { enrichLead, submitLead } from "../lib/lead-proxy";
import { captureUtmParams, readUtmParams } from "../lib/utm";
import { trackEvent } from "../lib/events";
import { initPixel, fireLeadEvent } from "../lib/pixel";
import { TestimonialsCarousel } from "../components/TestimonialsCarousel";
import { FamilyExperienceSection } from "../components/FamilyExperienceSection";
import { TESTIMONIALS } from "../data/testimonials";

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

function icon(Icon: LucideIcon): string {
  return renderToStaticMarkup(
    createElement(Icon, {
      "aria-hidden": true,
      className: "lp-icon size-[1em] shrink-0 text-[var(--am)]",
      strokeWidth: 1.8,
    }),
  );
}
// ─── HTML estático completo ────────────────────────────────────────────────────
const BODY_HTML = `<div class="flare-bg" aria-hidden="true"></div><div class="fw" aria-hidden="true"><div class="fl f1"></div><div class="fl f2"></div><div class="fl f3"></div><div class="fl f4"></div></div>
<div class="w">
<nav><div class="c ni"><a href="#" class="lo">Carol <span>Cunha</span></a><ul class="nl"><li><a href="#sobre">Diferenciais</a></li><li><a href="#galeria">Galeria</a></li><li><a href="#experiencia">Tour 360°</a></li><li><a href="#lazer">Lazer</a></li><li><a href="#local">Localização</a></li><li><a href="https://www.instagram.com/carolcunha.imoveis/" target="_blank" rel="noopener" class="ig-link">${icon(Instagram)}@carolcunha.imoveis</a></li>
<li><a href="#contato" class="nc">Fale comigo</a></li></ul></div></nav>

<!-- 1. HERO -->
<section class="hero2">
  <div class="c h2c">
    <div class="h2t">
      <div class="h2ey">ALTO DO GALLERIA II</div>
      <h1 class="h2h1">Apartamentos de <span class="nt">41,39 a 42,66 m²</span> perto do Galleria Shopping</h1>
      <p class="h2sub">2 dormitórios, varanda integrada e lazer completo no Jardim Conceição, em Campinas.</p>
      <ul class="h2pills">
        <li><span class="h2pill">${icon(BedDouble)} 2 dormitórios</span></li>
        <li><span class="h2pill">${icon(MapPin)} Campinas/SP</span></li>
        <li><span class="h2pill">${icon(Car)} Opções com vaga coberta</span></li>
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
        src="/images/galleria-10.webp"
        alt="Fachada e entrada do Alto do Galleria II"
        sizes="(max-width:900px) 100vw, 50vw"
      />
    </div>
  </div>
</section>

<!-- 1.5. POR QUE CONHECER -->
<section class="sec pq-sec" id="porque"><div class="c"><div class="sh"><span class="slb">Uma escolha que faz sentido</span><h2 class="st">Por que o <span class="nt">Alto do Galleria II</span>?</h2></div><div class="pq-grid"><div class="pq-item rv2"><span class="pq-icon">${icon(House)}</span><h3>Plantas de 41,39 a 42,66 m²</h3><p>Tipologias de ponta e meio, com varanda e ambientes integrados.</p></div><div class="pq-item rv2"><span class="pq-icon">${icon(Waves)}</span><h3>Lazer completo</h3><p>Piscinas, academia, playground, espaço multiuso e salão gourmet.</p></div><div class="pq-item rv2"><span class="pq-icon">${icon(Building2)}</span><h3>Torre única</h3><p>108 apartamentos, dois elevadores e acesso controlado.</p></div><div class="pq-item rv2"><span class="pq-icon">${icon(MapPin)}</span><h3>Perto de tudo</h3><p>A 1,8 km do Galleria Shopping e a 2 km da Lagoa do Taquaral.</p></div></div><div class="pq-cta"><a href="#contato" class="btn bg">QUERO RECEBER VALORES E CONDIÇÕES</a></div></div></section>

<!-- 2. PRINCIPAIS DIFERENCIAIS -->
<section class="sec" id="sobre"><div class="c"><div class="sh"><span class="slb">O Empreendimento</span><h2 class="st">Seu apartamento perto de <span class="nt">tudo</span></h2><p class="sd">Um lançamento da Zuma Engenharia com espaços funcionais, lazer equipado e localização estratégica em Campinas.</p></div><div class="cards"><div class="card rv2"><div class="ci ci-g">${icon(Ruler)}</div><h3>Plantas inteligentes</h3><p>Apartamentos de 41,39 a 42,66 m², com dois dormitórios e varanda integrada.</p><span class="ct">Ponta e meio</span></div><div class="card rv2"><div class="ci ci-r">${icon(Utensils)}</div><h3>Ambientes integrados</h3><p>Cozinha e área de serviço conectadas à sala de estar e jantar.</p><span class="ct">Mais funcionalidade</span></div><div class="card rv2"><div class="ci ci-a">${icon(Building2)}</div><h3>Condomínio compacto</h3><p>Torre única com 108 unidades e dois elevadores.</p><span class="ct">Projeto funcional</span></div><div class="card rv2"><div class="ci ci-e">${icon(Snowflake)}</div><h3>Conforto preparado</h3><p>Previsão para ar-condicionado no dormitório do casal.</p><span class="ct">Mais conforto</span></div><div class="card rv2"><div class="ci ci-g">${icon(Car)}</div><h3>Opções de vagas</h3><p>Unidades com vaga de carro, moto ou carro e moto. Consulte disponibilidade.</p><span class="ct">Conforme a unidade</span></div><div class="card rv2"><div class="ci ci-r">${icon(TrendingUp)}</div><h3>Localização valorizada</h3><p>Jardim Conceição, próximo ao Galleria Shopping e à Rodovia Dom Pedro I.</p><span class="ct">Campinas/SP</span></div></div></div></section>

<!-- 3. SEÇÃO VISUAL DE DESEJO -->
<section class="sec vd-sec" id="galeria"><div class="c"><div class="sh"><span class="slb">O Empreendimento em Imagens</span><h2 class="st">Conheça cada <span class="nt">ambiente</span></h2><p class="sd">Perspectivas artísticas do decorado, áreas comuns, fachada e plantas.</p></div><div class="vd-wrap"><button class="vd-btn vd-pv" id="vd-prev" aria-label="Foto anterior">${icon(ChevronLeft)}</button><div class="vd-grid rv2" id="vd-track" aria-label="Galeria de imagens do Alto do Galleria II">
<figure class="vd-main"><img loading="lazy" decoding="async" width="1283" height="1600" src="/images/galleria-10.webp" alt="Fachada e entrada do Alto do Galleria II"><figcaption class="vd-label">Fachada e entrada</figcaption></figure>
<figure class="vd-thumb"><img loading="lazy" decoding="async" width="1600" height="900" src="/images/galleria-02.webp" alt="Sala de estar do apartamento decorado"><figcaption class="vd-label">Sala de estar</figcaption></figure>
<figure class="vd-thumb"><img loading="lazy" decoding="async" width="1600" height="1283" src="/images/galleria-03.webp" alt="Dormitório principal do apartamento decorado"><figcaption class="vd-label">Dormitório principal</figcaption></figure>
<figure class="vd-thumb"><img loading="lazy" decoding="async" width="1600" height="900" src="/images/galleria-04.webp" alt="Segundo dormitório do apartamento decorado"><figcaption class="vd-label">Segundo dormitório</figcaption></figure>
<figure class="vd-thumb"><img loading="lazy" decoding="async" width="1283" height="1600" src="/images/galleria-01.webp" alt="Banheiro do apartamento decorado"><figcaption class="vd-label">Banheiro</figcaption></figure>
<figure class="vd-thumb"><img loading="lazy" decoding="async" width="1600" height="900" src="/images/galleria-08.webp" alt="Piscina adulto e deck"><figcaption class="vd-label">Piscina adulto e deck</figcaption></figure>
<figure class="vd-thumb"><img loading="lazy" decoding="async" width="1600" height="900" src="/images/galleria-06.webp" alt="Salão gourmet"><figcaption class="vd-label">Salão gourmet</figcaption></figure>
<figure class="vd-thumb"><img loading="lazy" decoding="async" width="1600" height="900" src="/images/galleria-07.webp" alt="Academia equipada"><figcaption class="vd-label">Academia</figcaption></figure>
<figure class="vd-thumb"><img loading="lazy" decoding="async" width="1600" height="900" src="/images/galleria-05.webp" alt="Playground"><figcaption class="vd-label">Playground</figcaption></figure>
<figure class="vd-thumb"><img loading="lazy" decoding="async" width="1283" height="1600" src="/images/galleria-09.webp" alt="Perspectiva da torre única"><figcaption class="vd-label">Torre única</figcaption></figure>
<figure class="vd-thumb vd-plan"><img loading="lazy" decoding="async" width="708" height="465" src="/images/galleria-11.webp" alt="Planta do apartamento de centro"><figcaption class="vd-label">Planta de meio</figcaption></figure>
<figure class="vd-thumb vd-plan"><img loading="lazy" decoding="async" width="528" height="521" src="/images/galleria-12.webp" alt="Planta do apartamento de ponta"><figcaption class="vd-label">Planta de ponta</figcaption></figure>
</div><button class="vd-btn vd-nx" id="vd-next" aria-label="Próxima foto">${icon(ChevronRight)}</button></div><p class="vd-disclaimer">Imagens e perspectivas artísticas meramente ilustrativas, sujeitas a alterações.</p></div></section>

<!-- 3.5. EXPERIÊNCIA IMERSIVA -->
<section class="sec exp-sec" id="experiencia"><div class="c"><div class="sh"><span class="slb">Visite sem sair de casa</span><h2 class="st">Explore o decorado em <span class="nt">vídeo e 360°</span></h2><p class="sd">Conheça os ambientes com mais detalhes antes de agendar sua visita.</p></div><div class="exp-grid">
<article class="exp-card rv2"><div class="exp-frame"><iframe src="https://www.youtube-nocookie.com/embed/a9h7DsbSoJA?rel=0" title="Vídeo de apresentação do Alto do Galleria II" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><div class="exp-copy"><span class="exp-kicker">Apresentação</span><h3>Veja o empreendimento em vídeo</h3><p>Uma visão rápida do projeto, ambientes e proposta do Alto do Galleria II.</p><a class="exp-link" href="https://youtu.be/a9h7DsbSoJA" target="_blank" rel="noopener noreferrer">Abrir vídeo em nova guia ${icon(ExternalLink)}</a></div></article>
<article class="exp-card rv2"><div class="exp-frame"><iframe src="https://tour360.meupasseiovirtual.com/071013/299212/tourvirtual/index.html" title="Tour virtual 360 graus do apartamento decorado" loading="lazy" allow="fullscreen; gyroscope; accelerometer" allowfullscreen></iframe></div><div class="exp-copy"><span class="exp-kicker">Tour virtual</span><h3>Caminhe pelo decorado em 360°</h3><p>Arraste a imagem para navegar pelos ambientes do apartamento.</p><a class="exp-link" href="https://tour360.meupasseiovirtual.com/071013/299212/tourvirtual/index.html" target="_blank" rel="noopener noreferrer">Abrir tour em tela cheia ${icon(ExternalLink)}</a></div></article>
</div></div></section>

<!-- 4. LAZER E INFRAESTRUTURA -->
<section class="sec" id="lazer"><div class="c"><div class="sh"><span class="slb">Lazer &amp; Infraestrutura</span><h2 class="st">Conforto para <span class="nt">todos os dias</span></h2><p class="sd">Espaços planejados para convivência, bem-estar e qualidade de vida.</p></div><div class="lz-grid"><div class="lz-item rv2"><div class="lz-img"><img loading="lazy" decoding="async" width="480" height="300" src="/images/galleria-08.webp" alt="Piscina adulto e deck"></div><div class="lz-info"><span class="lz-icon">${icon(Waves)}</span><h3>Piscinas</h3><p>Piscinas adulto e infantil integradas ao deck.</p></div></div><div class="lz-item rv2"><div class="lz-img"><img loading="lazy" decoding="async" width="480" height="300" src="/images/galleria-06.webp" alt="Salão Gourmet"></div><div class="lz-info"><span class="lz-icon">${icon(Utensils)}</span><h3>Salão Gourmet</h3><p>Espaço com churrasqueira para receber bem.</p></div></div><div class="lz-item rv2"><div class="lz-img"><img loading="lazy" decoding="async" width="480" height="300" src="/images/galleria-07.webp" alt="Academia"></div><div class="lz-info"><span class="lz-icon">${icon(Dumbbell)}</span><h3>Academia</h3><p>Ambiente planejado para uma rotina mais ativa.</p></div></div><div class="lz-item rv2"><div class="lz-img"><img loading="lazy" decoding="async" width="480" height="300" src="/images/galleria-05.webp" alt="Playground"></div><div class="lz-info"><span class="lz-icon">${icon(Baby)}</span><h3>Playground</h3><p>Diversão e convivência para as crianças.</p></div></div></div><div class="lz-infra rv2"><div class="lz-infra-head"><span class="slb">Diferenciais</span><h3 class="lz-infra-title">Detalhes pensados para o dia a dia</h3></div><div class="lz-infra-grid"><div class="lz-inf-item"><span>${icon(ShieldCheck)}</span><span>Guarita e acesso controlado</span></div><div class="lz-inf-item"><span>${icon(Accessibility)}</span><span>Acessos separados para pedestres e veículos</span></div><div class="lz-inf-item"><span>${icon(ArrowUpDown)}</span><span>Dois elevadores</span></div><div class="lz-inf-item"><span>${icon(Snowflake)}</span><span>Previsão para ar-condicionado no quarto do casal</span></div></div></div><div class="lz-cta"><a href="#contato" class="btn bg">QUERO RECEBER VALORES E CONDIÇÕES</a></div></div></section>

<!-- 5. LOCALIZAÇÃO -->
<section class="sec" id="local"><div class="c"><div class="loc-layout"><div class="loc-text"><span class="slb">Localização</span><h2 class="st">Perto do que importa em <span class="nt">Campinas</span></h2><p class="loc-desc">No Jardim Conceição, próximo ao Galleria Shopping, à Lagoa do Taquaral e à Rodovia Dom Pedro I.</p><div class="loc-addr rv2"><span class="loc-pin">${icon(MapPin)}</span><div><strong>Jardim Conceição — Campinas/SP</strong><span>Rua Antônio Pavin, 227</span></div></div><div class="loc-cards"><div class="loc-card rv2"><span class="loc-time">1,8 km</span><span class="loc-name">Galleria Shopping</span><span class="loc-via">Compras e gastronomia</span></div><div class="loc-card rv2"><span class="loc-time">2 km</span><span class="loc-name">Lagoa do Taquaral</span><span class="loc-via">Lazer ao ar livre</span></div><div class="loc-card rv2"><span class="loc-time">1,2 km</span><span class="loc-name">Dalben</span><span class="loc-via">Supermercado</span></div><div class="loc-card rv2"><span class="loc-time">50 m</span><span class="loc-name">Posto de saúde</span><span class="loc-via">Serviços próximos</span></div></div><div class="loc-cta"><a href="#contato" class="btn bg">QUERO RECEBER VALORES E CONDIÇÕES</a></div></div><div class="loc-map"><iframe title="Localização Alto do Galleria II" src="https://www.google.com/maps?q=Rua%20Ant%C3%B4nio%20Pavin%2C%20227%2C%20Jardim%20Concei%C3%A7%C3%A3o%2C%20Campinas%2C%20SP&output=embed" style="border:0;width:100%;height:100%;display:block" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div></div></section>

<!-- 6. CONDIÇÕES COMERCIAIS -->
<section class="sec" id="condicoes"><div class="c"><div class="sh"><span class="slb">Formas de Aquisição</span><h2 class="st">Planeje a <span class="nt">sua compra</span></h2><p class="sd">Receba informações atualizadas e uma análise personalizada.</p></div><div class="cond-grid"><div class="cond-item rv2"><div class="cond-icon">${icon(House)}</div><h3>Minha Casa Minha Vida</h3><p>Consulte os benefícios aplicáveis ao seu perfil.</p></div><div class="cond-item rv2"><div class="cond-icon">${icon(CreditCard)}</div><h3>Simulação personalizada</h3><p>Simule a entrada e as parcelas do financiamento.</p></div><div class="cond-item rv2"><div class="cond-icon">${icon(KeyRound)}</div><h3>Primeiro imóvel</h3><p>Acompanhamento pessoal na organização da documentação.</p></div><div class="cond-item rv2"><div class="cond-icon">${icon(Handshake)}</div><h3>Assessoria completa</h3><p>Assessoria total, desde a simulação até a assinatura.</p></div></div><p class="cond-nota rv2">Confirme no atendiimento valores, disponibilidade, financiamento e condições comerciais vigentes.</p></div></section>

<!-- 7. SEGURANÇA JURÍDICA -->
<section class="sec" id="juridico"><div class="c"><div class="sh"><span class="slb">Transparência</span><h2 class="st">Suporte para uma decisão <span class="nt">segura</span></h2><p class="sd">Conte com atendimento profissional para validar disponibilidade, documentação e condições vigentes.</p></div><div class="jur-grid"><div class="jur-item rv2"><span class="jur-icon">${icon(ClipboardList)}</span><div><h4>Disponibilidade</h4><p>Unidades e condições são confirmadas no momento do atendimento.</p></div></div><div class="jur-item rv2"><span class="jur-icon">${icon(Landmark)}</span><div><h4>Crédito e financiamento</h4><p>Sujeitos à análise e às regras da instituição financeira ou programa aplicável.</p></div></div><div class="jur-item rv2"><span class="jur-icon">${icon(CircleCheck)}</span><div><h4>Atendimento responsável</h4><p>Receba orientação para conferir todos os documentos antes da compra.</p></div></div></div><details class="jur-more rv2"><summary class="jur-toggle">VER AVISO IMPORTANTE <span class="jur-arr">${icon(ChevronDown)}</span></summary><div class="jur-full"><p>O Alto do Galleria II é um lançamento da Zuma Engenharia. Áreas, vagas, valores, prazo de entrega, disponibilidade e enquadramento em programas habitacionais devem ser confirmados no atendimento. Perspectivas artísticas sujeitas a alterações.</p></div></details></div></section>
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
          "2 dormitórios, varanda integrada e lazer completo no Jardim Conceição, em Campinas.",
      },
      { property: "og:url", content: "https://carolcunhagalleria2.lovable.app/" },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: "https://carolcunhagalleria2.lovable.app/images/galleria-10.webp",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: "https://carolcunhagalleria2.lovable.app/images/galleria-10.webp",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "preload",
        as: "image",
        href: "/images/galleria-10.webp",
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
    nome?: string | undefined;
    telefone?: string | undefined;
    consentimento?: string | undefined;
  }>({});

  // flag para disparar form_start apenas uma vez por sessão de formulário
  const formStartedRef = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    // form_start — dispara apenas na primeira interação
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent("form_start", { section: "contato", label: target.name });
    }
    const { name, value } = target;

    if (name === "consentimento" && target instanceof HTMLInputElement) {
      setForm((p) => ({ ...p, consentimento: target.checked }));
      setFieldErrors((p) => ({
        ...p,
        consentimento: target.checked ? undefined : p.consentimento,
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
        utm_source: readUtmParams()["utm_source"],
        utm_campaign: readUtmParams()["utm_campaign"],
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
          if (entry?.isIntersecting && !formViewed) {
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

      <FamilyExperienceSection
        title="Um novo jeito de viver Campinas"
        description="Espaços contemporâneos para compartilhar a rotina, contemplar a cidade e aproveitar cada momento em família."
        images={[
          {
            src: "/images/family-visit-01.png",
            alt: "Família conhecendo os ambientes do apartamento",
            caption: "Ambientes que acolhem a rotina",
          },
          {
            src: "/images/family-visit-02.png",
            alt: "Família contemplando a vista da varanda",
            caption: "Uma nova vista para Campinas",
          },
          {
            src: "/images/family-visit-03.png",
            alt: "Família conhecendo a área de lazer do condomínio",
            caption: "Lazer para aproveitar juntos",
          },
        ]}
      />

      <TestimonialsCarousel
        title="Praticidade para realizar o primeiro imóvel"
        testimonials={TESTIMONIALS}
      />

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
                tirar suas dúvidas e te ajudar a avaliar se o Alto do Galleria II combina com seus
                planos.
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
                Receba detalhes do <span className="nt">Alto do Galleria II</span>
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
                      Seus dados serão utilizados somente para entrar em contato sobre o Alto do
                      Galleria II.
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
                      <CircleCheck className="size-5 text-[var(--am)]" strokeWidth={2} />
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
              <Instagram className="size-[1em] shrink-0 text-[var(--am)]" aria-hidden="true" />
              @carolcunha.imoveis
            </a>
          </div>
          <p style={{ marginTop: 6, color: "var(--txm)", fontSize: ".72rem" }}>
            O Alto do Galleria II é um lançamento da Zuma Engenharia. Áreas, vagas, valores, prazo
            de entrega, disponibilidade e enquadramento em programas habitacionais devem ser
            confirmados no atendimento. Perspectivas artísticas sujeitas a alterações.
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
    document.body.dataset["flare"] = active === "gold" ? "" : active;
    localStorage.setItem("flare", active);
    ["--flare-1-core", "--flare-1-mid", "--flare-2-core", "--flare-2-mid"].forEach((v) =>
      document.body.style.removeProperty(v),
    );
  }, [active]);

  const applyCustom = (hex: string) => {
    const rgb = hexToRgb(hex);
    delete document.body.dataset["flare"];
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
              ? localStorage.getItem("flare-custom") || "#BF70FF"
              : "#BF70FF"
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
