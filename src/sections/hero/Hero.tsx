"use client"

import { useEffect, useRef } from "react"
import BrandRibbon from "@/components/ui/BrandRibbon"

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // iOS Safari checks the `muted` attribute at parse time, before React
    // hydration has a chance to set it as a JS property — without this,
    // autoplay can silently fail on iPhone.
    video.muted = true
    video.play().catch(() => {})
  }, [])

  return (
    <section className="relative h-[78vh] md:h-[82vh] min-h-[620px] overflow-hidden">

      {/* VIDEO */}

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Persona recibiendo una Vivabox como regalo"
        className="
          absolute inset-0
          w-full h-full
          object-cover
          object-center
        "
      >
        <source src="/videos/hero/hero-mobile.mp4" media="(max-width: 767px)" />
        <source src="/videos/hero/hero.mp4" />
      </video>

      {/* SUBTLE READABILITY GRADIENT */}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,.40) 0%, rgba(0,0,0,.15) 30%, rgba(0,0,0,0) 55%)",
        }}
      />

      {/* TOP OVERLAY */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[130px]
          pointer-events-none
          bg-gradient-to-b
          from-ink/25
          via-ink/5
          to-transparent
        "
      />

      {/* CONTENT */}

      <div className="relative h-full max-w-[1200px] mx-auto px-7 md:px-10 flex flex-col pointer-events-none">

        {/* FLEXIBLE SPACE */}

        <div className="flex-1" />

        {/* HEADLINE */}

        <h1
          className="
            h1
            text-white
            [text-shadow:0_2px_16px_rgba(0,0,0,.35)]
          "
        >
          El regalo que
          <br />
          deja elegir.
        </h1>

        {/* SUBTITLE */}

        <p
          className="
            relative z-10
            mt-2
            max-w-[480px]
            text-white/90
            text-[16px]
            md:text-[18px]
            [text-shadow:0_2px_16px_rgba(0,0,0,.35)]
          "
        >
          Vivabox es una caja de regalo de experiencias.
        </p>

        {/* CTA */}

        <div className="relative z-10 mt-4 pb-6 md:pb-8 pointer-events-auto">

          <div className="flex items-center gap-3">

            {/* PRIMARY */}

            <a
              href="/proximamente"
              className="
                flex-[1.25] md:flex-none
                h-[54px]
                md:px-10
                rounded-xl
                bg-primary
                text-white
                text-[17px]
                font-semibold
                inline-flex
                items-center
                justify-center
                shadow-[0_10px_35px_rgba(254,132,47,.35)]
                transition
                hover:bg-primary-hover
              "
            >
              Comprar Vivabox
            </a>

            {/* SECONDARY */}

            <a
              href="#incluye"
              className="
                flex-1 md:flex-none
                h-[54px]
                md:px-8
                rounded-xl
                border-2
                border-white/70
                bg-white/5
                text-white
                text-[16px]
                font-medium
                inline-flex
                items-center
                justify-center
                transition
                hover:bg-white/15
              "
            >
              Cómo funciona
            </a>

          </div>

        </div>

      </div>

      {/* BRAND RIBBON */}

      <div className="absolute inset-x-0 bottom-0">
        <BrandRibbon />
      </div>

    </section>
  )
}
