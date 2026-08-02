"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useCheckoutStore, DeliveryMethod } from "@/features/checkout/checkoutStore"
import CheckoutSummary from "@/app/checkout/components/CheckoutSummary"
import { Home, Gift } from "lucide-react"

type CheckoutBox = {
  slug: string
  name: string
  price: number
}

type Props = {
  box: CheckoutBox
}

const DELIVERY_PRICES: Record<DeliveryMethod, number> = {
  domicilio: 15000,
  retiro: 0,
  digital: 0,
}

// Legacy mapping expected by the existing /api/checkout/start backend contract
function toLegacyDelivery(method: DeliveryMethod) {
  if (method === "domicilio") return { type: "physical", speed: "outside" }
  if (method === "retiro") return { type: "physical", speed: "standard" }
  return { type: "digital", speed: null }
}

export default function DeliveryStep({ box }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const hasHydrated = useCheckoutStore(s => s.hasHydrated)
  const storeBox = useCheckoutStore(s => s.box)
  const quantity = useCheckoutStore(s => s.quantity)

  const deliveryMethod = useCheckoutStore(s => s.deliveryMethod)

  const deliveryDestination = useCheckoutStore(s => s.deliveryDestination)
  const setDestination = useCheckoutStore(s => s.setDestination)

  const recipientName = useCheckoutStore(s => s.recipientName)
  const recipientPhone = useCheckoutStore(s => s.recipientPhone)
  const setRecipientInfo = useCheckoutStore(s => s.setRecipientInfo)

  const address = useCheckoutStore(s => s.address)
  const city = useCheckoutStore(s => s.city)
  const addressExtra = useCheckoutStore(s => s.addressExtra)
  const setAddressInfo = useCheckoutStore(s => s.setAddressInfo)

  const buyerName = useCheckoutStore(s => s.buyerName)
  const buyerEmail = useCheckoutStore(s => s.buyerEmail)
  const setBuyer = useCheckoutStore(s => s.setBuyer)

  const firstPurchaseEmail = useCheckoutStore(s => s.firstPurchaseEmail)
  const firstPurchaseApplied = useCheckoutStore(s => s.firstPurchaseApplied)

  const setVentaId = useCheckoutStore(s => s.setVentaId)
  const setPricing = useCheckoutStore(s => s.setPricing)

  // ======================
  // GUARD
  // ======================

  useEffect(() => {
    if (!hasHydrated) return
    if (!storeBox) router.replace(`/checkout/${box.slug}`)
  }, [hasHydrated, storeBox, box.slug, router])

  // Prefill buyer email from first-purchase benefit, only once
  useEffect(() => {
    if (firstPurchaseApplied && firstPurchaseEmail && !buyerEmail) {
      setBuyer({ name: buyerName, email: firstPurchaseEmail, phone: "" })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPurchaseApplied, firstPurchaseEmail])

  if (!hasHydrated || !storeBox) {
    return <div className="p-6 text-center">Cargando...</div>
  }

  const needsAddress = deliveryMethod === "domicilio"

  function getEstimatedPricing() {
    const subtotal = box.price * quantity
    const delivery = DELIVERY_PRICES[deliveryMethod]

    return {
      subtotal,
      delivery,
      total: subtotal + delivery,
    }
  }

  const canSubmit =
    !!buyerName &&
    !!buyerEmail &&
    (!needsAddress ||
      (!!deliveryDestination &&
        !!address &&
        !!city &&
        (deliveryDestination !== "recipient" || (!!recipientName && !!recipientPhone))))

  async function handleGoToPayment() {
    if (loading || !canSubmit) return

    setLoading(true)

    try {
      const res = await fetch("/api/checkout/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          box: box.slug,
          quantity,
          buyer: {
            name: buyerName.trim(),
            email: buyerEmail.trim(),
            phone: "",
          },
          delivery: toLegacyDelivery(deliveryMethod),
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

  return (
    <section className="section pb-10">

      <div className="container">

        <Link href={`/checkout/${box.slug}`} className="text-sm text-[#6B6B6B] mb-3 inline-block">
          ← Volver
        </Link>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6 max-w-[1050px] mx-auto">

          {/* LEFT */}
          <div className="space-y-4">

            {needsAddress && (
              <div
                className="checkout-card p-5 space-y-4 animate-step"
                style={{ animationDelay: "0ms" }}
              >
                <p className="font-semibold text-ink">¿Dónde la enviamos?</p>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={deliveryDestination === "self"}
                      onChange={() => setDestination("self")}
                      className="accent-primary"
                    />
                    <Home size={16} strokeWidth={1.75} className="text-primary" />
                    <span className="text-sm">En mi dirección</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={deliveryDestination === "recipient"}
                      onChange={() => setDestination("recipient")}
                      className="accent-primary"
                    />
                    <Gift size={16} strokeWidth={1.75} className="text-primary" />
                    <span className="text-sm">Directamente a quien la recibe</span>
                  </label>
                </div>

                {/* ANIMATED EXPAND — CSS grid-rows accordion, no JS height calc needed */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    deliveryDestination ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pt-3 space-y-3 border-t border-[#ECECEC]">
                      {deliveryDestination === "recipient" && (
                        <>
                          <input
                            type="text"
                            placeholder="Nombre"
                            value={recipientName}
                            onChange={(e) => setRecipientInfo({ name: e.target.value, phone: recipientPhone })}
                            className="checkout-input"
                          />
                          <input
                            type="text"
                            placeholder="WhatsApp"
                            value={recipientPhone}
                            onChange={(e) => setRecipientInfo({ name: recipientName, phone: e.target.value })}
                            className="checkout-input"
                          />
                        </>
                      )}

                      <input
                        type="text"
                        placeholder="Dirección"
                        value={address}
                        onChange={(e) => setAddressInfo({ address: e.target.value, city, addressExtra })}
                        className="checkout-input"
                      />
                      <input
                        type="text"
                        placeholder="Ciudad"
                        value={city}
                        onChange={(e) => setAddressInfo({ address, city: e.target.value, addressExtra })}
                        className="checkout-input"
                      />
                      <input
                        type="text"
                        placeholder="Detalles adicionales (opcional)"
                        value={addressExtra}
                        onChange={(e) => setAddressInfo({ address, city, addressExtra: e.target.value })}
                        className="checkout-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {deliveryMethod === "retiro" && (
              <div className="checkout-card p-4 animate-step">
                <p className="text-sm text-[#6B6B6B]">
                  Retiras tu Vivabox en punto de entrega. Te contactaremos para coordinar.
                </p>
              </div>
            )}

            {deliveryMethod === "digital" && (
              <div className="checkout-card p-4 animate-step">
                <p className="text-sm text-[#6B6B6B]">
                  Tu Vivabox digital llega al instante al correo que registres abajo.
                </p>
              </div>
            )}

            {/* BUYER */}
            <div
              className="checkout-card p-5 space-y-3 animate-step"
              style={{ animationDelay: "80ms" }}
            >
              <p className="font-semibold text-ink">Para completar tu compra</p>

              <input
                type="text"
                placeholder="Nombre completo"
                value={buyerName}
                onChange={(e) => setBuyer({ name: e.target.value, email: buyerEmail, phone: "" })}
                className="checkout-input"
              />

              <input
                type="email"
                placeholder="Email"
                value={buyerEmail}
                onChange={(e) => setBuyer({ name: buyerName, email: e.target.value, phone: "" })}
                className="checkout-input"
              />
            </div>

          </div>

          {/* RIGHT */}
          <div
            className="space-y-3 animate-step"
            style={{ animationDelay: "140ms" }}
          >

            <CheckoutSummary estimatedPricing={getEstimatedPricing()} />

            <button
              onClick={handleGoToPayment}
              disabled={loading || !canSubmit}
              className="checkout-btn-primary w-full h-12"
            >
              {loading ? "Procesando..." : "Ir a pagar"}
            </button>

            <div className="text-xs text-[#6B6B6B]/70 text-center space-y-1">
              <p>🔒 Pago seguro</p>
              <p>✔ Entrega garantizada</p>
            </div>

          </div>

        </div>

      </div>

    </section>
  )
}
