type FamilyImage = { src: string; alt: string; caption: string };
type Props = { title: string; description: string; images: FamilyImage[] };

export function FamilyExperienceSection({ title, description, images }: Props) {
  return (
    <section className="sec" id="experiencias-em-familia">
      <div className="c">
        <div className="sh">
          <span className="slb">Para viver juntos</span>
          <h2 className="st">{title}</h2>
          <p className="sd">{description}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-[1.35fr_.65fr] md:grid-rows-2">
          {images.map((item, index) => (
            <figure
              key={item.src}
              className={`rv2 group relative m-0 overflow-hidden rounded-2xl border border-[var(--bdw)] bg-[var(--bgc)] ${index === 0 ? "md:row-span-2 md:min-h-[560px]" : "md:min-h-[272px]"}`}
            >
              <img
                loading="lazy"
                decoding="async"
                width={1536}
                height={1024}
                src={item.src}
                alt={item.alt}
                className="h-full min-h-[280px] w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                sizes={
                  index === 0 ? "(max-width: 768px) 100vw, 65vw" : "(max-width: 768px) 100vw, 35vw"
                }
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-5 pb-5 pt-16">
                <figcaption className="text-sm font-semibold tracking-wide text-white sm:text-base">
                  {item.caption}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
