import { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export interface Testimonial {
  name: string;
  quote: string;
  image: string;
}

interface TestimonialsCarouselProps {
  eyebrow?: string;
  title: string;
  description: string;
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({
  eyebrow = "Quem já conheceu",
  title,
  description,
  testimonials,
}: TestimonialsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("[data-testimonial-card]");
    if (!track || !card) return;
    track.scrollBy({
      left: direction * (card.getBoundingClientRect().width + 20),
      behavior: "smooth",
    });
  };

  return (
    <section className="sec overflow-hidden" aria-labelledby="testimonials-title">
      <div className="c">
        <div className="sh mb-7 md:mb-10">
          <span className="slb">{eyebrow}</span>
          <h2 className="st" id="testimonials-title">
            {title}
          </h2>
          <p className="sd">{description}</p>
        </div>

        <div className="relative">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-roledescription="carrossel"
            aria-label="Depoimentos"
            tabIndex={0}
          >
            {testimonials.map((testimonial) => {
              return (
                <article
                  key={testimonial.name}
                  data-testimonial-card
                  className="flex w-[84vw] max-w-[310px] shrink-0 snap-start flex-col items-center rounded-2xl border border-[var(--bdw)] bg-[var(--bgc)] px-6 py-7 text-center shadow-[0_18px_50px_rgba(0,0,0,.18)] md:w-[calc((100%_-_40px)/3)]"
                >
                  <img
                    className="mb-4 size-24 rounded-full border-2 border-[var(--gd)] object-cover shadow-[0_0_0_5px_rgba(212,167,106,.10)]"
                    src={testimonial.image}
                    alt={`Foto ilustrativa de ${testimonial.name}`}
                    loading="lazy"
                    width={96}
                    height={96}
                  />
                  <h3 className="mb-3 text-base font-bold text-[var(--tx)]">{testimonial.name}</h3>
                  <Quote
                    className="mb-3 size-5 text-[var(--gd)]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-[var(--tx2)]">“{testimonial.quote}”</p>
                </article>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-end gap-4">
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => move(-1)}
                className="grid size-11 place-items-center rounded-full border border-[var(--gd)] bg-transparent text-[var(--gd)] transition hover:bg-[var(--gd)] hover:text-[var(--bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gd)]"
                aria-label="Ver depoimento anterior"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                className="grid size-11 place-items-center rounded-full border border-[var(--gd)] bg-transparent text-[var(--gd)] transition hover:bg-[var(--gd)] hover:text-[var(--bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gd)]"
                aria-label="Ver próximo depoimento"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
