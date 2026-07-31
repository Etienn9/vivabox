"use client";

export default function Occasions() {

  const occasions = [
    {
      name: "Cumpleaños",
      subtitle: "Sorpréndelo con algo que recordará.",
      image: "/images/occasions/cumpleanos.jpg",
      ariaLabel: "Regalo de cumpleaños",
    },
    {
      name: "Aniversario",
      subtitle: "Un momento para compartir juntos.",
      image: "/images/occasions/aniversario.jpg",
      ariaLabel: "Regalo de aniversario",
    },
    {
      name: "Agradecimiento",
      subtitle: "La mejor forma de decir gracias.",
      image: "/images/occasions/agradecimiento.jpg",
      ariaLabel: "Regalo de agradecimiento",
    },
    {
      name: "Matrimonio",
      subtitle: "Un regalo para disfrutar en pareja.",
      image: "/images/occasions/boda.jpg",
      ariaLabel: "Regalo de matrimonio",
    },
    {
      name: "Para dos",
      subtitle: "Tiempo de calidad para compartir.",
      image: "/images/occasions/pareja.jpg",
      ariaLabel: "Regalo para parejas",
    },
    {
      name: "Empresas",
      subtitle: "Cada persona elige su experiencia.",
      image: "/images/occasions/empresarial.jpg",
      ariaLabel: "Regalos empresariales",
    },
  ];

  return (
    <section className="bg-ink py-12 md:py-14">

      <div className="max-w-6xl mx-auto px-6 mb-6 md:mb-8">

        <h2 className="h2 text-white text-center">
          ¿Para qué ocasión regalar una Vivabox?
        </h2>

      </div>

      {/* CAROUSEL — first card fully visible, next peeks in to invite swiping */}

      <div className="max-w-6xl mx-auto">

        <div className="flex gap-4 md:gap-5 overflow-x-auto px-6 pb-2 no-scrollbar snap-x snap-mandatory scroll-smooth">

          {occasions.map((item) => (

            <div
              key={item.name}
              className="group relative shrink-0 w-[78vw] sm:w-[320px] aspect-[3/4.3] rounded-[24px] overflow-hidden snap-start shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-shadow duration-300 ease-out hover:shadow-[0_14px_34px_rgba(0,0,0,0.4)]"
              aria-label={item.ariaLabel}
            >

              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">

                <h3 className="text-white text-[20px] md:text-[22px] font-semibold leading-tight truncate [text-shadow:0_2px_12px_rgba(0,0,0,.25)]">
                  {item.name}
                </h3>

                <p className="mt-1 text-white/80 text-[13px] md:text-[14px] font-normal leading-snug line-clamp-2 [text-shadow:0_1px_8px_rgba(0,0,0,.3)]">
                  {item.subtitle}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}
