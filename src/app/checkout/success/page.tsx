"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Package, CheckCircle2, Truck, Mail, Sparkles } from "lucide-react"
import CheckoutProgress from "../CheckoutProgress"
import { useCheckoutStore } from "@/features/checkout/checkoutStore"
import { formatPrice } from "@/utils/formatPrice"

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessPageContent />
    </Suspense>
  )
}

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const ventaId = searchParams.get("ventaId") || ""

  const box = useCheckoutStore(s => s.box)
  const quantity = useCheckoutStore(s => s.quantity)
  const pricing = useCheckoutStore(s => s.pricing)

  const deliveryMethod = useCheckoutStore(s => s.deliveryMethod)
  const deliveryDestination = useCheckoutStore(s => s.deliveryDestination)

  const hasHydrated = useCheckoutStore(s => s.hasHydrated)
  const buyerName = useCheckoutStore(s => s.buyerName)
  const buyerPhone = useCheckoutStore(s => s.buyerPhone)

  const recipientName = useCheckoutStore(s => s.recipientName)
  const recipientPhone = useCheckoutStore(s => s.recipientPhone)

  const address = useCheckoutStore(s => s.address)
  const city = useCheckoutStore(s => s.city)

  const isGift = deliveryDestination === "recipient"
  const isPhysical = deliveryMethod !== "digital"

  const destinationName = isGift ? recipientName : buyerName
  const destinationContact = isGift ? recipientPhone : buyerPhone

  const [step, setStep] = useState<"message" | "done">("message")

  const [para, setPara] = useState("")
  const [de, setDe] = useState("")
  const [mensaje, setMensaje] = useState("")

  // Snapshot for the confirmation recap — taken right before the store is
  // reset, so the nav cart badge clears once the order is actually placed.
  const [orderSummary, setOrderSummary] = useState<{
    boxName: string
    quantity: number
    subtotal: number
    total: number | null
  } | null>(null)

  const reset = useCheckoutStore(s => s.reset)

  // El store se hidrata de forma asíncrona (persist) — prellenar "De" una
  // vez que el nombre del comprador esté disponible.
  useEffect(() => {
    if (hasHydrated && buyerName && !de) setDe(buyerName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, buyerName])

  const [loading, setLoading] = useState(false)
  const isSubmittingRef = useRef(false)

  async function handleComplete(withMessage: boolean) {
    if (isSubmittingRef.current || !ventaId) return

    isSubmittingRef.current = true
    setLoading(true)

    try {
      const res = await fetch("/api/checkout/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ventaId,
          message: withMessage ? { para, de, mensaje } : undefined,
        }),
      })

      const data = await res.json()

      if (!data.ok) {
        alert(data.error || "Error")
        return
      }

      setOrderSummary({
        boxName: box?.name ?? "",
        quantity,
        subtotal: pricing?.subtotal ?? 0,
        total: pricing?.total ?? null,
      })
      reset()
      setStep("done")
    } catch {
      alert("Error")
    } finally {
      setLoading(false)
      isSubmittingRef.current = false
    }
  }

  return (
    <>
      <CheckoutProgress current="enviar" />

      <div className="max-w-[520px] mx-auto py-8 px-4 space-y-6 pb-32">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <p className="text-sm text-green-600 font-medium">Pago confirmado</p>
          <h1 className="text-2xl font-semibold flex items-center justify-center gap-2">
            <Package size={20} strokeWidth={1.5} />
            {isGift ? "Tu regalo está listo" : "Tu Vivabox está lista"}
          </h1>
        </div>

        {step === "message" ? (
          <>
            {/* DESTINATION RECAP — read-only, already collected in "Elegir" */}
            <div className="bg-white border rounded-2xl p-5 space-y-1.5">
              <p className="font-semibold text-sm">Se envía a</p>
              <p className="text-sm text-gray-700">{destinationName}{destinationContact ? ` · ${destinationContact}` : ""}</p>
              {isPhysical && (
                <p className="text-sm text-gray-500">{address}{city ? `, ${city}` : ""}</p>
              )}
            </div>

            {/* PERSONAL MESSAGE — only makes sense when it's a gift */}
            {isGift && (
              <div className="bg-white border-2 border-[#fe842f] rounded-2xl p-5 space-y-3">
                <p className="font-semibold">Ahora dale tu toque personal</p>
                <p className="text-sm text-gray-500">Lo verá cuando abra su Vivabox. Es opcional.</p>

                <input
                  placeholder="Para"
                  value={para}
                  onChange={(e) => setPara(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />

                <input
                  placeholder="De"
                  value={de}
                  onChange={(e) => setDe(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />

                <textarea
                  placeholder="Escribe tu mensaje"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  maxLength={200}
                  rows={3}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={() => handleComplete(true)}
                disabled={loading || !ventaId}
                className="w-full bg-[#fe842f] text-white py-4 rounded-xl disabled:opacity-60"
              >
                {loading ? "Procesando..." : isGift ? "Guardar mensaje" : "Continuar"}
              </button>

              {isGift && (
                <button
                  onClick={() => handleComplete(false)}
                  disabled={loading || !ventaId}
                  className="w-full text-sm text-gray-500 py-2"
                >
                  Continuar sin mensaje
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* FINAL CONFIRMATION */}
            <div className="bg-white border rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 size={16} strokeWidth={1.5} className="text-green-600 shrink-0" />
                Pago confirmado
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail size={16} strokeWidth={1.5} className="text-[#fe842f] shrink-0" />
                Te enviamos la confirmación por correo
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Sparkles size={16} strokeWidth={1.5} className="text-[#fe842f] shrink-0" />
                Estamos preparando tu Vivabox
              </div>
              {isPhysical && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Truck size={16} strokeWidth={1.5} className="text-[#fe842f] shrink-0" />
                  Te avisaremos con las novedades del envío
                </div>
              )}
            </div>

            {orderSummary && (
              <div className="bg-white border rounded-2xl p-5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{orderSummary.boxName} × {orderSummary.quantity}</span>
                  <span>{orderSummary.subtotal ? `$${formatPrice(orderSummary.subtotal)}` : ""}</span>
                </div>
                {orderSummary.total !== null && (
                  <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                    <span>Total pagado</span>
                    <span>${formatPrice(orderSummary.total)}</span>
                  </div>
                )}
              </div>
            )}

            <p className="text-center text-sm text-gray-500">
              Gracias por elegir Vivabox. Ahora empieza la mejor parte.
            </p>

            <Link
              href="/"
              className="block w-full text-center bg-[#fe842f] text-white py-4 rounded-xl"
            >
              Seguir comprando
            </Link>
          </>
        )}
      </div>
    </>
  )
}
