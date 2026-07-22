"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useCheckoutStore } from "@/features/checkout/checkoutStore"
import { formatPrice } from "@/utils/formatPrice"
import CheckoutProgress from "../../CheckoutProgress"

export default function PagoPage() {
  const router = useRouter()

  // ======================
  // STORE (SELECTORS CLEAN)
  // ======================
  const box = useCheckoutStore(s => s.box)
  const quantity = useCheckoutStore(s => s.quantity)

  const deliveryType = useCheckoutStore(s => s.deliveryType)
  const deliverySpeed = useCheckoutStore(s => s.deliverySpeed)

  const ventaId = useCheckoutStore(s => s.ventaId)
  const pricing = useCheckoutStore(s => s.pricing)
  const hasHydrated = useCheckoutStore(s => s.hasHydrated)

  const [loading, setLoading] = useState(false)

  // ======================
  // GUARDS
  // ======================
  useEffect(() => {
    if (!hasHydrated) return

    if (!box || !ventaId) {
      router.replace("/cajas")
    }
  }, [hasHydrated, box, ventaId, router])

  if (!hasHydrated || !box || !ventaId) {
    return <div className="p-6 text-center">Cargando...</div>
  }

  // 🔥 TS SAFE
  const safeBox = box

  // 🔴 NO FALLBACK → backend only
  if (!pricing) {
    return <div className="p-6 text-center">Cargando precio...</div>
  }

  const { subtotal, delivery, total } = pricing

  // ======================
  // LABEL
  // ======================
  function getDeliveryLabel() {
    if (deliveryType === "digital") return "Digital"
    if (deliverySpeed === "standard") return "Física (Estándar)"
    if (deliverySpeed === "express") return "Física (Rápida)"
    if (deliverySpeed === "outside") return "Física (Fuera cobertura)"
    return "Física"
  }

  // ======================
// PAY
// ======================
async function handleFakePayment() {
  if (loading) return

  if (!ventaId) {
    alert("Error interno: ventaId faltante")
    return
  }

  if (!quantity || !deliveryType) {
    alert("Error interno: datos incompletos")
    return
  }

  setLoading(true)

  try {
    const res = await fetch("/api/checkout/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "pay",
        ventaId,
      }),
    })

    const data = await res.json()

    // ======================
    // ERROR HANDLING
    // ======================

    if (!data.ok) {
      if (data.error === "RESERVATION_EXPIRED") {
        alert("La reserva expiró")
        router.replace("/cajas")
        return
      }

      if (data.error === "ALREADY_PAID") {
        router.replace(
          `/checkout/success?ventaId=${ventaId}&quantity=${quantity}&deliveryType=${deliveryType}`
        )
        return
      }

      alert(data.error || "No pudimos procesar el pago")
      setLoading(false)
      return
    }

    // ======================
    // SUCCESS
    // ======================

    router.replace(
      `/checkout/success?ventaId=${ventaId}&quantity=${quantity}&deliveryType=${deliveryType}`
    )

  } catch (error) {
    console.error("Payment error:", error)
    alert("Error procesando el pago")
    setLoading(false)
  }
}

  // ======================
  // UI
  // ======================
  return (
    <>
      <CheckoutProgress current="pagar" />

      <div className="min-h-screen bg-[#F6F7F8] py-10 px-4">

        <div className="w-full max-w-[900px] mx-auto grid md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="bg-white p-6 rounded-xl border space-y-5 h-fit">

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Pago seguro
              </h2>
              <span className="text-xs text-[#6B6B6B]">
                MercadoPago
              </span>
            </div>

            <input
              type="text"
              placeholder="Número de tarjeta"
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Nombre en la tarjeta"
              className="w-full border rounded-lg p-3"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM/AA"
                className="border rounded-lg p-3"
              />
              <input
                type="text"
                placeholder="CVV"
                className="border rounded-lg p-3"
              />
            </div>

            <p className="text-xs text-[#6B6B6B] text-center">
              Tus datos están protegidos
            </p>

          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-4">

            <div className="bg-white p-6 rounded-xl border space-y-4">

              <h3 className="font-semibold">
                Resumen
              </h3>

              <div className="flex justify-between text-sm">
                <span>{safeBox.name} x{quantity}</span>
                <span>${formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Entrega</span>
                <span>{getDeliveryLabel()}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Envío</span>
                <span>
                  {delivery === 0
                    ? "Gratis"
                    : `+$${formatPrice(delivery)}`}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${formatPrice(total)}</span>
              </div>

            </div>

            <button
              onClick={handleFakePayment}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#fe842f] text-white font-semibold disabled:opacity-50"
            >
              {loading
                ? "Procesando..."
                : `Pagar $${formatPrice(total)}`}
            </button>

            <p className="text-xs text-[#6B6B6B] text-center">
              Pago seguro · sin complicaciones
            </p>

          </div>

        </div>

      </div>
    </>
  )
}