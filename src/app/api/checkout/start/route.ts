import { NextResponse } from "next/server"
import { boxes } from "@/data/boxes"
import { getSupabase } from "@/services/supabase"
import { validatePromoCode } from "@/features/promotions/validatePromoCode"
import { checkRateLimit, getClientIp } from "@/utils/rateLimit"

const RATE_LIMIT_MAX_ATTEMPTS = 5
const RATE_LIMIT_WINDOW_MINUTES = 15
const GLOBAL_RATE_LIMIT_MAX_ATTEMPTS = 100
const GLOBAL_RATE_LIMIT_WINDOW_MINUTES = 10

function computeDelivery(type: string, speed: string | null) {
  if (type === "physical" && speed === "outside") return 15000
  return 0
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { box: boxSlug, quantity, buyer, delivery, promoCode } = body

    if (!boxSlug || typeof boxSlug !== "string") {
      return NextResponse.json({ ok: false, error: "INVALID_BOX" })
    }

    if (!quantity || quantity < 1) {
      return NextResponse.json({ ok: false, error: "INVALID_QUANTITY" })
    }

    if (!buyer?.name || !buyer?.email) {
      return NextResponse.json({ ok: false, error: "MISSING_BUYER" })
    }

    if (!delivery?.type || !["physical", "digital"].includes(delivery.type)) {
      return NextResponse.json({ ok: false, error: "INVALID_DELIVERY_TYPE" })
    }

    const box = boxes.find((b) => b.slug === boxSlug)

    if (!box) {
      return NextResponse.json({ ok: false, error: "INVALID_BOX" })
    }

    const subtotal = box.price * quantity
    const originalDeliveryPrice = computeDelivery(delivery.type, delivery.speed || null)
    let deliveryPrice = originalDeliveryPrice
    let discount = 0

    const supabase = getSupabase()

    // Le code promo n'est jamais bloquant : un code invalide/expiré/déjà
    // utilisé fait juste tomber le panier au prix plein, il ne casse jamais
    // l'achat (docs/09_checkout.md — la promo est additive, jamais requise).
    let promoCodeInput: string | null = null
    let promoWarning: string | null = null

    if (typeof promoCode === "string" && promoCode.trim()) {
      const normalizedPromo = promoCode.trim().toUpperCase()
      const ip = getClientIp(req)

      const [ipAllowed, codeAllowed, globalAllowed] = await Promise.all([
        checkRateLimit(supabase, `ip:${ip}`, "promo", RATE_LIMIT_MAX_ATTEMPTS, RATE_LIMIT_WINDOW_MINUTES),
        checkRateLimit(supabase, `code:${normalizedPromo}`, "promo", RATE_LIMIT_MAX_ATTEMPTS, RATE_LIMIT_WINDOW_MINUTES),
        checkRateLimit(supabase, "global", "promo", GLOBAL_RATE_LIMIT_MAX_ATTEMPTS, GLOBAL_RATE_LIMIT_WINDOW_MINUTES),
      ])

      if (!ipAllowed || !codeAllowed || !globalAllowed) {
        promoWarning = "TOO_MANY_ATTEMPTS"
      } else {
        const result = await validatePromoCode(supabase, normalizedPromo, buyer.email)

        if (result.valid) {
          deliveryPrice = 0
          discount = originalDeliveryPrice
          promoCodeInput = normalizedPromo
        } else {
          promoWarning = result.error
        }
      }
    }

    const total = subtotal + deliveryPrice

    const { data, error } = await supabase
      .from("ventas")
      .insert({
        box_slug: box.slug,
        quantity,

        buyer_name: buyer.name,
        buyer_email: buyer.email,
        buyer_phone: buyer.phone || "",

        delivery_type: delivery.type,
        delivery_speed: delivery.speed || null,

        subtotal,
        delivery_price: deliveryPrice,
        total,

        promo_code_input: promoCodeInput,
        discount,
      })
      .select("id")
      .single()

    if (error || !data) {
      console.error("SUPABASE INSERT ERROR:", error)
      return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
    }

    return NextResponse.json({
      ok: true,
      ventaId: data.id,
      pricing: { subtotal, delivery: deliveryPrice, total, discount },
      promoApplied: promoCodeInput !== null,
      promoWarning,
    })

  } catch (error) {
    console.error("START ERROR:", error)
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
  }
}
