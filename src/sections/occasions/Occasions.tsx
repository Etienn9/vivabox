"use client";

import BrandDots from "@/components/ui/BrandDots";

export default function Occasions() {

  const occasions = [
    {
      name: "Cumpleaños",
      image: "/images/occasions/cumpleanos.jpg",
      ariaLabel: "Regalo de cumpleaños",
    },
    {
      name: "Aniversario",
      image: "/images/occasions/aniversario.jpg",
      ariaLabel: "Regalo de aniversario",
    },
    {
      name: "Agradecimiento",
      image: "/images/occasions/agradecimiento.jpg",
      ariaLabel: "Regalo de agradecimiento",
    },
    {
      name: "Matrimonio",
      image: "/images/occasions/boda.jpg",
      ariaLabel: "Regalo de matrimonio",
    },
    {
      name: "Para dos",
      image: "/images/occasions/pareja.jpg",
      ariaLabel: "Regalo para parejas",
    },
    {
      name: "Empresas",
      image: "/images/occasions/empresarial.jpg",
      ariaLabel: "Regalos empresariales",
    },
  ];

  return (
    <section className="bg-ink py-12 md:py-14">

      <div className="max-w-6xl mx-auto px-6 mb-6 md:mb-8">

        <BrandDots className="mx-auto justify-center" />

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
              className="relative shrink-0 w-[70%] sm:w-[300px] aspect-[3/4] rounded-[24px] overflow-hidden snap-start"
              aria-label={item.ariaLabel}
            >

              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">

                <h3 className="text-white text-[20px] md:text-[22px] font-semibold leading-tight [text-shadow:0_2px_12px_rgba(0,0,0,.25)]">
                  {item.name}
                </h3>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}
