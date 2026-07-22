"use client"

import { useCheckoutStore } from "@/features/checkout/checkoutStore"
import { formatPrice } from "@/utils/formatPrice"

type Pricing = {
  subtotal: number
  delivery: number
  total: number
}

type Props = {
  estimatedPricing: Pricing
}

export default function CheckoutSummary({ estimatedPricing }: Props) {

  const box = useCheckoutStore(s => s.box)
  const quantity = useCheckoutStore(s => s.quantity)
  const deliveryType = useCheckoutStore(s => s.deliveryType)
  const deliverySpeed = useCheckoutStore(s => s.deliverySpeed)
  const pricing = useCheckoutStore(s => s.pricing)
  const hasHydrated = useCheckoutStore(s => s.hasHydrated)

  // ======================
  // GUARD
  // ======================

  if (!hasHydrated || !box) {
    return (
      <div className="bg-white rounded-[18px] border p-6">
        <p className="text-sm text-[#6B6B6B]">Cargando...</p>
      </div>
    )
  }

  // ======================
  // SOURCE OF TRUTH (HYBRID)
  // ======================

  const finalPricing = pricing ?? estimatedPricing
  const isEstimated = !pricing

  function getDeliveryLabel() {
    if (deliveryType === "digital") return "Digital"
    if (deliverySpeed === "standard") return "Física (Estándar)"
    if (deliverySpeed === "express") return "Física (Rápida)"
    if (deliverySpeed === "outside") return "Física (Fuera cobertura)"
    return "Física"
  }

  const { subtotal, delivery, total } = finalPricing

  return (
    <div className="bg-white rounded-[18px] border border-[#ECECEC] p-6 shadow-[0_16px_35px_rgba(0,0,0,0.08)] sticky top-24 space-y-4">

      <h3 className="h3">Resumen de compra</h3>

      <div className="text-sm">
        <p className="font-medium">{box.name}</p>
        <p className="text-[#6B6B6B]">
          ${formatPrice(box.price)}
        </p>
      </div>

      <div className="space-y-2 text-sm text-[#6B6B6B]">

        <div className="flex justify-between">
          <span>Cantidad</span>
          <span>{quantity}</span>
        </div>

        <div className="flex justify-between">
          <span>Entrega</span>
          <span>{getDeliveryLabel()}</span>
        </div>

        <div className="flex justify-between">
          <span>Envío</span>
          <span>
            {delivery === 0
              ? "Gratis"
              : `+$${formatPrice(delivery)}`}
          </span>
        </div>

      </div>

      <div className="border-t pt-4 flex justify-between font-semibold text-[18px]">
        <span>Total</span>
        <span>${formatPrice(total)}</span>
      </div>

      {/* 🔥 UX SIGNAL */}
      {isEstimated && (
        <p className="text-xs text-[#6B6B6B]">
          Precio estimado — se confirma al pagar
        </p>
      )}

    </div>
  )
}