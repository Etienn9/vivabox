"use client"

import Image from "next/image"

function IncludeCard({
  image,
  title,
  text,
  alt,
}: {
  image: string
  title: string
  text: string
  alt: string
}) {
  return (
    <div className="min-w-[260px] md:min-w-0 group">

      <div className="relative w-full h-[200px] mb-4 rounded-xl overflow-hidden">

        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

      </div>

      <h3 className="text-[18px] font-semibold mb-2">
        {title}
      </h3>

      <p className="text-[#6B6B6B] text-[14px] leading-relaxed">
        {text}
      </p>

    </div>
  )
}

export default function BoxIncludes() {

  return (
    <section id="box-includes" className="py-5 bg-[#fafafa]">

      <div className="max-w-[1100px] mx-auto px-6">

        {/* HEADER */}

        <div className="mb-14">

          <h2 className="text-[34px] md:text-[40px] font-semibold mb-4">
            ¿Qué incluye la Vivabox?
          </h2>

          <p className="text-[#6B6B6B] text-[17px] max-w-[620px]">
            Un regalo físico elegante que abre el acceso a experiencias para elegir.
          </p>

        </div>

        {/* MOBILE SCROLL */}

        <div className="flex gap-8 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible">

          <IncludeCard
            image="/images/box-includes/box-opening.png"
            alt="Caja Vivabox"
            title="Una caja para regalar"
            text="Una presentación elegante con mensaje personal y catálogo de inspiración."
          />

          <IncludeCard
            image="/images/box-includes/activation-card.png"
            alt="Tarjeta activación"
            title="Tarjeta con QR y código"
            text="Un código único para activar la Vivabox y descubrir las experiencias."
          />

          <IncludeCard
            image="/images/box-includes/experiences-map.png"
            alt="Explorar experiencias"
            title="Explorar experiencias"
            text="Acceso a gastronomía, bienestar, aventura, cultura y estancias."
          />

          <IncludeCard
            image="/images/box-includes/reservation-confirmation.png"
            alt="Elegir experiencia"
            title="Elegir y reservar"
            text="La persona elige su experiencia y Vivabox coordina la reserva."
          />

        </div>

      </div>

    </section>
  )
}