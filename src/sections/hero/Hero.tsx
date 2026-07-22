"use client"

export default function Hero() {
  return (
    <section className="relative h-[78vh] md:h-[82vh] min-h-[620px] overflow-hidden">

      {/* IMAGE */}

      <img
        src="/images/hero/hero.png"
        alt="Persona recibiendo una Vivabox como regalo"
        className="
          absolute inset-0
          w-full h-full
          object-cover
          object-[74%_center]
          md:object-center
        "
      />

      {/* LEFT OVERLAY */}

      <div
        className="
          absolute
          inset-y-0
          left-0
          w-[58%]
          bg-gradient-to-r
          from-black/72
          via-black/28
          to-transparent
        "
      />

      {/* TOP OVERLAY */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[170px]
          bg-gradient-to-b
          from-black/35
          via-black/10
          to-transparent
        "
      />

      {/* CONTENT */}

      <div className="relative h-full max-w-[1200px] mx-auto px-7 md:px-10">

        <div className="flex flex-col h-full pt-[120px]">

          {/* TEXT */}

          <div className="max-w-[355px] md:max-w-[520px]">

            <h1
              className="
                text-white
                font-semibold
                text-[37px]
                md:text-[64px]
                leading-[1.04]
                tracking-[-0.025em]
              "
            >
              El mejor regalo
              <br />
              deja elegir.
            </h1>

            <p className="mt-7 text-[17px] md:text-[22px] leading-relaxed text-white/90">
              <span className="font-semibold text-white">
                Regalas una Vivabox.
              </span>

              <br />

              Quien la recibe elige
              <br />
              la experiencia.
            </p>

          </div>

          {/* CTA */}

          <div className="mt-auto pb-[68px]">

            <div className="flex items-center gap-3">

              {/* PRIMARY */}

              <a
                href="#comprar"
                className="
                  flex-[1.25]
                  h-[54px]
                  rounded-xl
                  bg-[#FE842F]
                  text-white
                  text-[17px]
                  font-semibold
                  inline-flex
                  items-center
                  justify-center
                  shadow-[0_10px_35px_rgba(254,132,47,.35)]
                  transition
                  hover:bg-[#E67629]
                "
              >
                Regalar Vivabox
              </a>

              {/* SECONDARY */}

              <a
                href="#incluye"
                className="
                  flex-1
                  h-[54px]
                  rounded-xl
                  border
                  border-white/45
                  bg-transparent
                  text-white
                  text-[16px]
                  font-medium
                  inline-flex
                  items-center
                  justify-center
                  transition
                  hover:bg-white/8
                "
              >
                Cómo funciona
              </a>

            </div>

          </div>

        </div>

      </div>

      {/* SCROLL */}

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-sm text-white/70 animate-bounce">
        ↓ Descubre más
      </div>

    </section>
  )
}