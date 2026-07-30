"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { formatPrice } from "@/utils/formatPrice"
import { useCheckoutStore } from "@/features/checkout/checkoutStore"
import CheckoutSummary from "@/app/checkout/components/CheckoutSummary"

import { Zap, Package } from "lucide-react"

type CheckoutBox = {
  slug: string
  name: string
  price: number
  image?: string
}

type Props = {
  box: CheckoutBox
}

export default function ProductStep({ box }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // ======================
  // STORE
  // ======================

  const quantity = useCheckoutStore(s => s.quantity)
  const setQuantity = useCheckoutStore(s => s.setQuantity)
  const setBox = useCheckoutStore(s => s.setBox)

  const deliveryType = useCheckoutStore(s => s.deliveryType)
  const deliverySpeed = useCheckoutStore(s => s.deliverySpeed)
  const setDelivery = useCheckoutStore(s => s.setDelivery)

  const buyerName = useCheckoutStore(s => s.buyerName)
  const buyerEmail = useCheckoutStore(s => s.buyerEmail)
  const setBuyer = useCheckoutStore(s => s.setBuyer)

  const setVentaId = useCheckoutStore(s => s.setVentaId)
  const setPricing = useCheckoutStore(s => s.setPricing)

  // ======================
  // INIT
  // ======================

  useEffect(() => {
    setBox(box)
  }, [box, setBox])

  // ======================
  // ESTIMATED PRICING
  // ======================

  function getEstimatedPricing() {
    const subtotal = box.price * quantity

    let delivery = 0

    if (deliveryType === "physical") {
      if (deliverySpeed === "express") delivery = 10000
      if (deliverySpeed === "outside") delivery = 15000
    }

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
  // NAVIGATION
  // ======================

  async function handleGoToPayment() {
    if (loading) return

    const name = buyerName.trim()
    const email = buyerEmail.trim()

    if (!name || !email) {
      alert("Completa tus datos")
      return
    }

    if (!box?.slug) {
      alert("Error producto")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/checkout/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "start",
          box: box.slug,
          quantity,
          buyer: {
            name,
            email,
            phone: "", // 👈 important pour compat backend
          },
          delivery: {
            type: deliveryType,
            speed:
              deliveryType === "physical"
                ? deliverySpeed || "standard"
                : null,
          },
        }),
      })

      const data = await res.json()

      if (!data.ok || !data.pricing || !data.ventaId) {
        alert("No pudimos iniciar la compra")
        setLoading(false)
        return
      }

      setVentaId(data.ventaId)
      setPricing(data.pricing)

      router.push(`/checkout/${box.slug}/pago`)

    } catch (err) {
      console.error("START ERROR:", err)
      alert("Error iniciando compra")
      setLoading(false)
    }
  }

  // ======================
  // UI
  // ======================

  return (
    <section className="section bg-[#F6F7F8] pb-10">
      <div className="container">

        <Link href="/cajas" className="text-sm text-[#6B6B6B] mb-4 inline-block">
          ← Volver a cajas
        </Link>

        {/* PRODUCT */}
        <div className="bg-white rounded-[18px] border p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            <div className="flex items-center gap-6">
              {box.image && (
                <Image src={box.image} alt={box.name} width={120} height={120} />
              )}

              <div>
                <h1 className="h3 mb-1">{box.name}</h1>

                <div className="font-semibold mb-2">
                  ${formatPrice(box.price)}
                </div>

                <div className="text-sm text-[#6B6B6B] space-y-1">
                  <div>✔ Lo compras en 1 minuto</div>
                  <div>✔ Personalizas después</div>
                  <div>✔ Sin complicaciones</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={decrease} className="w-8 h-8 border rounded">–</button>
              <span className="font-semibold">{quantity}</span>
              <button onClick={increase} className="w-8 h-8 border rounded">+</button>
            </div>

          </div>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 max-w-[1050px] mx-auto">

          {/* LEFT */}
          <div className="space-y-6">

            {/* DELIVERY */}
            <div className="bg-white border rounded-xl p-5 space-y-4">

              <p className="font-semibold">¿Cómo quieres recibirlo?</p>

              <div className="space-y-3">

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={deliveryType === "digital"}
                    onChange={() => setDelivery({ type: "digital", speed: null })}
                  />
                  <Zap size={16} strokeWidth={1.5} />
                  <div>
                    <div className="text-sm font-medium">Digital</div>
                    <div className="text-xs text-[#6B6B6B]">Llega al instante</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={deliveryType === "physical"}
                    onChange={() => setDelivery({ type: "physical", speed: "standard" })}
                  />
                  <Package size={16} strokeWidth={1.5} />
                  <div>
                    <div className="text-sm font-medium">Caja física</div>
                    <div className="text-xs text-[#6B6B6B]">Se envía después</div>
                  </div>
                </label>

              </div>

              {deliveryType === "physical" && (
                <div className="mt-4 space-y-3 border-t pt-4">

                  <p className="text-sm font-medium">Velocidad de entrega</p>

                  {[
                    { key: "standard", label: "Estándar", price: "Gratis" },
                    { key: "express", label: "Rápido", price: "$10.000" },
                    { key: "outside", label: "Fuera de cobertura", price: "$15.000" }
                  ].map(opt => (
                    <label key={opt.key} className="flex items-center justify-between cursor-pointer">
                      <div>
                        <div className="text-sm">{opt.label}</div>
                        <div className="text-xs text-[#6B6B6B]">{opt.price}</div>
                      </div>
                      <input
                        type="radio"
                        checked={deliverySpeed === opt.key}
                        onChange={() =>
                          setDelivery({ type: "physical", speed: opt.key as any })
                        }
                      />
                    </label>
                  ))}

                </div>
              )}

            </div>

            {/* BUYER */}
            <div className="bg-white border rounded-xl p-5 space-y-4">

              <p className="font-semibold">Para completar tu compra</p>

              <input
                type="text"
                placeholder="Nombre completo"
                value={buyerName}
                onChange={(e) =>
                  setBuyer({
                    name: e.target.value,
                    email: buyerEmail,
                    phone: "",
                  })
                }
                className="w-full border rounded-lg p-3"
              />

              <input
                type="email"
                placeholder="Email"
                value={buyerEmail}
                onChange={(e) =>
                  setBuyer({
                    name: buyerName,
                    email: e.target.value,
                    phone: "",
                  })
                }
                className="w-full border rounded-lg p-3"
              />

            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-4">

            <CheckoutSummary estimatedPricing={estimatedPricing} />

            <button
              onClick={handleGoToPayment}
              disabled={
                loading ||
                !buyerName ||
                !buyerEmail ||
                (deliveryType === "physical" && !deliverySpeed)
              }
              className="w-full h-12 rounded-xl bg-[#fe842f] text-white font-semibold disabled:opacity-50"
            >
              {loading ? "Procesando..." : "Ir a pagar"}
            </button>

            <div className="text-xs text-[#6B6B6B] text-center space-y-1">
              <p>🔒 Pago seguro</p>
              <p>✔ Entrega garantizada</p>
              <p>✔ Lo completas después</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}