"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { formatPrice } from "@/utils/formatPrice"
import { useCheckoutStore } from "@/features/checkout/checkoutStore"
import CheckoutSummary from "@/app/checkout/components/CheckoutSummary"
import WelcomeShippingModal from "@/app/checkout/components/WelcomeShippingModal"

import { Truck, Check } from "lucide-react"

type CheckoutBox = {
  slug: string
  name: string
  price: number
  image?: string
}

type Props = {
  box: CheckoutBox
}

const DELIVERY_PRICE = 15000

const BENEFITS = [
  "La persona elige la experiencia que más le guste",
  "Tú personalizas el regalo después",
  "Nosotros gestionamos la reserva",
]

export default function ProductStep({ box }: Props) {
  const router = useRouter()
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [promoInput, setPromoInput] = useState("")

  // ======================
  // STORE
  // ======================

  const quantity = useCheckoutStore(s => s.quantity)
  const setQuantity = useCheckoutStore(s => s.setQuantity)
  const setBox = useCheckoutStore(s => s.setBox)
  const setDeliveryMethod = useCheckoutStore(s => s.setDeliveryMethod)

  const promoCode = useCheckoutStore(s => s.promoCode)
  const promoApplied = useCheckoutStore(s => s.promoApplied)
  const setPromo = useCheckoutStore(s => s.setPromo)

  const firstPurchaseApplied = useCheckoutStore(s => s.firstPurchaseApplied)
  const setFirstPurchase = useCheckoutStore(s => s.setFirstPurchase)
  const setCodes = useCheckoutStore(s => s.setCodes)

  // ======================
  // INIT
  // ======================

  useEffect(() => {
    setBox(box)
    // MVP: caja física por domicilio única opción
    setDeliveryMethod("domicilio")
  }, [box, setBox, setDeliveryMethod])

  // ======================
  // ESTIMATED PRICING
  // ======================

  function getEstimatedPricing() {
    const subtotal = box.price * quantity
    const delivery = DELIVERY_PRICE

    return {
      subtotal,
      delivery,
      total: subtotal + delivery,
    }
  }

  const estimatedPricing = getEstimatedPricing()

  // ======================
  // QUANTITY
  // ======================

  function increase() {
    setQuantity(Math.min(10, quantity + 1))
  }

  function decrease() {
    setQuantity(Math.max(1, quantity - 1))
  }

  // ======================
  // PROMO (MOCK)
  // ======================

  function handleApplyPromo() {
    if (!promoInput.trim()) return
    setPromo(promoInput.trim(), true)
  }

  function handleWelcomeSuccess(email: string, code: string) {
    setFirstPurchase(email, true)
    setCodes([code])
  }

  // ======================
  // NAVIGATION
  // ======================

  function handleContinue() {
    router.push(`/checkout/${box.slug}/entrega`)
  }

  // ======================
  // UI
  // ======================

  return (
    <section className="section pb-6">
      <div className="container">

        <Link href="/cajas" className="text-sm text-[#6B6B6B] mb-3 inline-block">
          ← Volver
        </Link>

        {/* PRODUCT — visual hero */}
        <div
          className="checkout-card p-6 md:p-8 mb-5 animate-step"
          style={{ animationDelay: "0ms" }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">

            <div className="flex flex-col items-center gap-3 shrink-0">
              <Image
                src="/images/box-includes/vivabox-caja-regalo.png"
                alt="Vivabox"
                width={172}
                height={172}
                priority
                className="drop-shadow-[0_18px_28px_rgba(24,20,15,0.14)]"
              />

              <div className="flex items-center gap-3">
                <button onClick={decrease} className="w-7 h-7 border border-[#ECECEC] rounded-full text-sm text-[#6B6B6B]">–</button>
                <span className="font-semibold text-sm w-4 text-center">{quantity}</span>
                <button onClick={increase} className="w-7 h-7 border border-[#ECECEC] rounded-full text-sm text-[#6B6B6B]">+</button>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight text-ink mb-1">
                Vivabox
              </h1>

              <div className="text-lg font-medium text-ink/80 mb-3">
                ${formatPrice(box.price)}
              </div>

              <div className="text-sm text-[#6B6B6B] leading-relaxed space-y-1.5">
                {BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2 justify-center sm:justify-start">
                    <Check size={14} strokeWidth={2.5} className="text-primary shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-[#6B6B6B]/80 italic mt-3">
                Estás regalando el placer de elegir.
              </p>
            </div>

          </div>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 max-w-[1050px] mx-auto">

          {/* LEFT */}
          <div className="space-y-4">

            {/* DELIVERY (fixed, no selector) — secondary */}
            <div
              className="checkout-card p-4 animate-step"
              style={{ animationDelay: "80ms" }}
            >
              <div className="flex items-center gap-3">
                <Truck size={18} strokeWidth={1.75} className="text-primary" />
                <div className="flex-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">Envío a domicilio</span>
                  <span className="text-[#6B6B6B]">${formatPrice(DELIVERY_PRICE)} · 2–4 días hábiles</span>
                </div>
              </div>
            </div>

            {/* PROMOTIONS (merged) — tertiary */}
            <div
              className="checkout-card p-4 space-y-3 animate-step"
              style={{ animationDelay: "140ms" }}
            >

              {promoApplied ? (
                <div className="text-xs text-green-700">
                  ✓ Código aplicado — Envío incluido
                </div>
              ) : firstPurchaseApplied ? (
                <div className="text-xs text-green-700">
                  ✓ Beneficio de primera compra aplicado — Envío incluido
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-medium text-[#6B6B6B] mb-2">¿Tienes un código?</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Código"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="checkout-input flex-1 text-sm"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="px-4 rounded-2xl border border-[#ECECEC] text-sm font-medium text-ink transition hover:bg-black/[0.02] active:scale-[0.98]"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#6B6B6B]/70">
                    <div className="flex-1 h-px bg-[#ECECEC]" />
                    o
                    <div className="flex-1 h-px bg-[#ECECEC]" />
                  </div>

                  <div>
                    <p className="text-xs text-[#6B6B6B] mb-2">¿Es tu primera compra?</p>
                    <button
                      onClick={() => setWelcomeOpen(true)}
                      className="w-full h-9 rounded-2xl border border-[#ECECEC] text-sm font-medium text-ink transition hover:bg-black/[0.02] active:scale-[0.98]"
                    >
                      Obtener envío incluido
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* RIGHT */}
          <div
            className="space-y-3 animate-step"
            style={{ animationDelay: "200ms" }}
          >

            <CheckoutSummary estimatedPricing={estimatedPricing} />

            <button
              onClick={handleContinue}
              className="checkout-btn-primary w-full h-12"
            >
              Continuar
            </button>

            <div className="text-xs text-[#6B6B6B]/70 text-center space-y-1">
              <p>🔒 Pago seguro</p>
              <p>✔ Entrega garantizada</p>
              <p>✔ Lo completas después</p>
            </div>

          </div>

        </div>

      </div>

      {welcomeOpen && (
        <WelcomeShippingModal
          onClose={() => setWelcomeOpen(false)}
          onSuccess={handleWelcomeSuccess}
        />
      )}

    </section>
  )
}
