import { NextResponse } from "next/server"
import { boxes } from "@/data/boxes"
import { getSupabase } from "@/services/supabase"

function computeDelivery(type: string, speed: string | null) {
  if (type === "physical" && speed === "outside") return 15000
  return 0
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { box: boxSlug, quantity, buyer, delivery } = body

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
    const deliveryPrice = computeDelivery(delivery.type, delivery.speed || null)
    const total = subtotal + deliveryPrice

    const supabase = getSupabase()

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
      pricing: { subtotal, delivery: deliveryPrice, total },
    })

  } catch (error) {
    console.error("START ERROR:", error)
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
  }
}
