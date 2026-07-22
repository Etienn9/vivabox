"use client"

import Image from "next/image"
import { useEffect, useState, useMemo } from "react"
import { formatPrice } from "@/utils/formatPrice"
import { Check } from "lucide-react"
import { kalam } from "@/lib/fonts"
import { useRouter } from "next/navigation"

type BoxHeroProps = {
  name: string
  description: string
  price: number
  experiences: number
  image: string
  signatureColor: string
  slug: string
}

export default function BoxHero({
  name,
  description,
  price,
  experiences,
  image,
  signatureColor,
  slug,
}: BoxHeroProps) {

  const router = useRouter()
  const [index, setIndex] = useState(0)

  const heroImages = useMemo(() => [
    `/images/hero/${slug}-1.jpg`,
    `/images/hero/${slug}-2.jpg`,
    `/images/hero/${slug}-3.jpg`,
    `/images/hero/${slug}-4.jpg`,
    `/images/hero/${slug}-5.jpg`,
  ], [slug])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [heroImages])

  const parts = name.split(" ")
  const brand = parts[0]
  const boxName = parts[1] ?? ""

  const scrollToIncludes = () => {
    const el = document.getElementById("box-includes")
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  const handleCheckout = () => {
    router.push(`/checkout/${slug}`)
  }

  return (
    <section className="relative overflow-hidden py-24">

      {/* BACKGROUND IMAGES */}
      <div className="absolute inset-0 -z-10">
        {heroImages.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="Experiencias Vivabox"
            fill
            priority={i === 0}
            className={`object-cover blur-[5px] brightness-[0.8] scale-110 transition-opacity duration-[4000ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="max-w-[1150px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* TEXT */}
        <div className="text-white">

          <h1 className="text-[42px] md:text-[52px] font-semibold mb-1">
            {brand}{" "}
            <span
              className={`${kalam.className} font-bold text-[1.15em]`}
              style={{ color: signatureColor }}
            >
              {boxName}
            </span>
          </h1>

          <p className="text-[20px] text-white/80 mb-2 max-w-[460px]">
            {description}
          </p>

          {/* BOX MOBILE */}
          <div className="flex justify-center my-1 md:hidden">
            <Image
              src={image}
              alt={name}
              width={260}
              height={260}
              className="object-contain drop-shadow-[0_50px_70px_rgba(0,0,0,0.55)]"
            />
          </div>

          {/* EXPERIENCES */}
          <div className="text-[20px] font-semibold text-[#E67626] mb-3">
            Más de {experiences} experiencias para elegir
          </div>

          {/* TRUST */}
          <div className="space-y-2 mb-8 text-[15px] text-white/80">
            <div className="flex items-center gap-2">
              <Check size={18} className="text-[#E67626]" />
              Entrega física o digital
            </div>
            <div className="flex items-center gap-2">
              <Check size={18} className="text-[#E67626]" />
              Válida por 12 meses
            </div>
            <div className="flex items-center gap-2">
              <Check size={18} className="text-[#E67626]" />
              La persona elige su experiencia
            </div>
          </div>

          {/* PRICE */}
          <div className="text-[30px] font-semibold mb-6">
            ${formatPrice(price)}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">

            <button
              onClick={handleCheckout}
              className="h-12 px-10 rounded-xl bg-[#E67626] text-white font-semibold text-[16px] hover:brightness-95 transition shadow-xl"
            >
              Comprar Vivabox
            </button>

            <button
              onClick={scrollToIncludes}
              className="h-12 px-8 rounded-xl border border-white/40 text-white text-[15px] hover:bg-white/10 transition"
            >
              ¿Qué incluye?
            </button>

          </div>

        </div>

        {/* BOX DESKTOP */}
        <div className="hidden md:flex justify-center">
          <Image
            src={image}
            alt={name}
            width={440}
            height={440}
            className="object-contain drop-shadow-[0_60px_80px_rgba(0,0,0,0.55)]"
          />
        </div>

      </div>

    </section>
  )
}