"use client"

import { useEffect } from "react"
import Image from "next/image"
import { formatPrice } from "@/utils/formatPrice"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCheckoutStore } from "@/features/checkout/checkoutStore"

type BoxHeroProps = {
  name: string
  price: number
  experiences: number
  image: string
  signatureColor: string
  slug: string
}

export default function BoxHero({
  name,
  price,
  experiences,
  image,
  signatureColor,
  slug,
}: BoxHeroProps) {

  const router = useRouter()

  const parts = name.split(" ")
  const brand = parts[0]
  const boxName = parts.slice(1).join(" ")

  const quantity = useCheckoutStore((s) => s.quantity)
  const setQuantity = useCheckoutStore((s) => s.setQuantity)
  const setBox = useCheckoutStore((s) => s.setBox)

  useEffect(() => {
    setBox({ slug, name, price })
  }, [slug, name, price, setBox])

  const increase = () => setQuantity(Math.min(10, quantity + 1))
  const decrease = () => setQuantity(Math.max(1, quantity - 1))

  const subtotal = price * quantity

  const handleCheckout = () => {
    router.push(`/checkout/${slug}`)
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-24">

      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero/hero.png"
          alt="Experiencias Vivabox"
          fill
          priority
          className="object-cover blur-[5px] brightness-[0.8] scale-110"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="max-w-[1150px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* TEXT */}
        <div className="text-white">

          <h1 className="h1 mb-4 max-w-[440px]">
            Tu regalo ya casi está listo.
          </h1>

          {/* PRODUCT SUMMARY */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-6">
            <span className="text-[19px] font-semibold">
              {brand}{" "}
              <span
                className="font-accent font-bold"
                style={{ color: signatureColor }}
              >
                {boxName}
              </span>
            </span>
            <span className="text-white/40">·</span>
            <span className="text-[19px] font-semibold">
              ${formatPrice(price)} COP
            </span>
          </div>

          {/* BOX MOBILE */}
          <div className="flex justify-center my-2 md:hidden">
            <Image
              src={image}
              alt={name}
              width={220}
              height={220}
              className="object-contain drop-shadow-[0_50px_70px_rgba(0,0,0,0.55)]"
            />
          </div>

          {/* GIFT CONFIGURATION CARD */}
          <div className="bg-white/95 text-foreground rounded-2xl p-5 md:p-6 mb-6 shadow-2xl">

            <p className="text-[14px] font-medium text-muted mb-3">
              ¿Cuántas Vivabox quieres regalar?
            </p>

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={decrease}
                aria-label="Restar"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-[18px] font-semibold hover:bg-surface transition"
              >
                –
              </button>

              <span className="text-[20px] font-semibold w-6 text-center">
                {quantity}
              </span>

              <button
                onClick={increase}
                aria-label="Sumar"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-[18px] font-semibold hover:bg-surface transition"
              >
                +
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-[14px] text-muted">
                Subtotal
              </span>
              <span className="text-[18px] font-semibold">
                ${formatPrice(subtotal)} COP
              </span>
            </div>

          </div>

          {/* CHECKLIST */}
          <div className="space-y-2 mb-8 text-[15px] text-white/80">
            <div className="flex items-center gap-2">
              <Check size={18} strokeWidth={1.5} className="text-primary-hover" />
              Más de {experiences} experiencias
            </div>
            <div className="flex items-center gap-2">
              <Check size={18} strokeWidth={1.5} className="text-primary-hover" />
              La persona elige la experiencia
            </div>
            <div className="flex items-center gap-2">
              <Check size={18} strokeWidth={1.5} className="text-primary-hover" />
              Vigencia 6 meses
            </div>
            <div className="flex items-center gap-2">
              <Check size={18} strokeWidth={1.5} className="text-primary-hover" />
              Envío gratis
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            className="w-full sm:w-auto h-14 px-12 rounded-xl bg-primary-hover text-white font-semibold text-[17px] hover:brightness-95 transition shadow-xl"
          >
            Comprar ahora
          </button>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4 text-[13px] text-white/60">
            <span>Compra segura</span>
            <span>Pago protegido</span>
            <span>Envío gratis</span>
          </div>

        </div>

        {/* BOX DESKTOP */}
        <div className="hidden md:flex justify-center">
          <Image
            src={image}
            alt={name}
            width={420}
            height={420}
            className="object-contain drop-shadow-[0_60px_80px_rgba(0,0,0,0.55)]"
          />
        </div>

      </div>

    </section>
  )
}
