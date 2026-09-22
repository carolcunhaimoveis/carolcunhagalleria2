import { createFileRoute, Link } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | Alto do Galleria II" },
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
  component: PoliticaDePrivacidade,
});

function PoliticaDePrivacidade() {
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

      <div className="w">
        {/* Nav mínimo */}
        <nav>
          <div className="c ni">
            <Link to="/" className="lo">
              Carol <span>Cunha</span>
            </Link>
            <Link to="/" className="btn bh tks-nav-back">
              ← Voltar ao site
            </Link>
          </div>
        </nav>

        {/* Conteúdo */}
        <div className="pp-page">
          <div className="c">
            <div className="pp-wrap">
              <header className="pp-header">
                <span className="slb">Documento Legal</span>
                <h1 className="pp-title">Política de Privacidade</h1>
                <p className="pp-updated">Última atualização: agosto de 2026</p>
              </header>

              <div className="pp-body">
                <section className="pp-section">
                  <h2>1. Quem somos</h2>
                  <p>
                    Esta Política de Privacidade se aplica ao site{" "}
                    <strong>carolcunhagalleria2.lovable.app</strong>, operado por{" "}
                    <strong>Carol Cunha</strong>, corretora de imóveis, responsável exclusivamente
                    através deste site pelo atendimento comercial relacionado ao loteamento Alto do
                    Galleria II de Nova Odessa, localizado em Nova Odessa/SP.
                  </p>
                </section>

                <section className="pp-section">
                  <h2>2. Dados coletados</h2>
                  <p>Ao preencher o formulário de contato neste site, coletamos:</p>
                  <ul>
                    <li>
                      <strong>Nome completo</strong>
                    </li>
                    <li>
                      <strong>Número de WhatsApp</strong>
                    </li>
                    <li>
                      <strong>Faixa de parcela confortável</strong> (informação opcional,
                      selecionada pelo próprio usuário após o envio do contato)
                    </li>
                    <li>
                      <strong>Objetivo de compra</strong> (informação opcional, selecionada pelo
                      próprio usuário após o envio do contato)
                    </li>
                  </ul>
                  <p>
                    Não coletamos dados sensíveis, documentos de identificação, dados bancários ou
                    informações de pagamento por meio deste site.
                  </p>
                </section>

                <section className="pp-section">
                  <h2>3. Finalidade do uso</h2>
                  <p>Os dados coletados são usados exclusivamente para:</p>
                  <ul>
                    <li>
                      Entrar em contato com o interessado para fornecer informações sobre o Alto do
                      Galleria II de Nova Odessa;
                    </li>
                    <li>Apresentar valores, condições de pagamento e disponibilidade de lotes;</li>
                    <li>Agendar visitas ou atendimentos personalizados, quando solicitado.</li>
                  </ul>
                  <p>
                    Os dados <strong>não serão usados</strong> para envio de publicidade não
                    relacionada ao Alto do Galleria II, venda a terceiros ou qualquer finalidade
                    diferente do atendimento comercial descrito acima.
                  </p>
                </section>

                <section className="pp-section">
                  <h2>4. Armazenamento e segurança</h2>
                  <p>
                    Os dados submetidos pelo formulário são transmitidos via conexão segura (HTTPS)
                    e armazenados em infraestrutura gerenciada pelo <strong>Supabase</strong>,
                    plataforma de banco de dados em nuvem. O acesso aos dados é restrito à
                    responsável pelo atendimento.
                  </p>
                  <p>
                    Adotamos medidas técnicas razoáveis para proteger as informações contra acesso
                    não autorizado. Nenhum sistema é 100% seguro; em caso de incidente relevante, os
                    titulares afetados serão notificados.
                  </p>
                </section>
                <section className="pp-section">
                  <h2>5. Compartilhamentos</h2>
                  <p>
                    Os dados podem ser acessados pelas seguintes plataformas técnicas necessárias à
                    operação do site, sob suas respectivas políticas de privacidade:
                  </p>
                  <ul>
                    <li>
                      <strong>Supabase</strong> — armazenamento e processamento dos leads (
                      <a
                        href="https://supabase.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        política de privacidade
                      </a>
                      )
                    </li>
                    <li>
                      <strong>Cloudflare</strong> — hospedagem e entrega do site (
                      <a
                        href="https://www.cloudflare.com/privacypolicy/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        política de privacidade
                      </a>
                      )
                    </li>
                  </ul>
                  <p>
                    <strong>Não</strong> compartilhamos dados pessoais com corretoras parceiras,
                    listas de mailing ou qualquer terceiro comercial sem consentimento prévio.
                  </p>
                </section>

                <section className="pp-section">
                  <h2>6. Ferramentas analíticas e cookies</h2>
                  <p>
                    Atualmente, este site <strong>não utiliza</strong> ferramentas de rastreamento
                    como Google Analytics, Facebook Pixel ou similares.
                  </p>
                  <p>
                    O site pode utilizar cookies técnicos estritamente necessários ao funcionamento
                    (como preferências de tema). Esses cookies não identificam o usuário
                    pessoalmente e não são compartilhados com terceiros.
                  </p>
                  {/* TODO: Atualizar esta seção caso ferramentas analíticas sejam implementadas */}
                  <p className="pp-todo">
                    <TriangleAlert
                      className="inline size-4 shrink-0 text-[var(--am)]"
                      aria-hidden="true"
                    />{" "}
                    <strong>TODO:</strong> Atualizar caso Google Analytics, Meta Pixel ou similares
                    sejam implementados.
                  </p>
                </section>

                <section className="pp-section">
                  <h2>7. Direitos do titular</h2>
                  <p>
                    Nos termos da Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), você
                    tem direito a:
                  </p>
                  <ul>
                    <li>Confirmar a existência de tratamento dos seus dados;</li>
                    <li>Acessar os dados que possuímos sobre você;</li>
                    <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
                    <li>Solicitar a exclusão dos seus dados pessoais;</li>
                    <li>Revogar o consentimento dado a qualquer momento;</li>
                    <li>Obter informações sobre com quem seus dados foram compartilhados.</li>
                  </ul>
                  <p>
                    Para exercer qualquer desses direitos, entre em contato pelos canais abaixo.
                  </p>
                </section>

                <section className="pp-section">
                  <h2>8. Como entrar em contato</h2>
                  <p>Para dúvidas, solicitações de correção ou exclusão de dados:</p>
                  <ul>
                    <li>
                      <strong>E-mail:</strong>{" "}
                      <a
                        href="mailto:carolcunhagalleria2@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        carolcunhagalleria2@gmail.com
                      </a>
                    </li>
                    <li>
                      <strong>WhatsApp:</strong>{" "}
                      <a
                        href="https://wa.me/5519986107562"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        (19) 98610-7562
                      </a>
                    </li>
                  </ul>
                </section>

                <section className="pp-section">
                  <h2>9. Alterações nesta política</h2>
                  <p>
                    Esta política pode ser atualizada periodicamente. A data de última revisão
                    estará sempre indicada no topo do documento. O uso continuado do site após
                    alterações implica aceitação das novas condições.
                  </p>
                </section>
              </div>
              {/* /pp-body */}

              <div className="pp-back">
                <Link to="/" className="btn bh">
                  ← Voltar ao site
                </Link>
              </div>
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
