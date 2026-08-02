import { NextResponse } from "next/server"
import { getSupabase } from "@/services/supabase"

function normalizeDeliveryType(type: any) {
  if (!type) return null

  const t = String(type).toLowerCase()

  if (t === "physical" || t === "fisico") return "physical"
  if (t === "digital") return "digital"

  return null
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { ventaId, items, delivery } = body

    const deliveryType = normalizeDeliveryType(
      delivery?.type || body.deliveryType
    )

    // ======================
    // VALIDATION
    // ======================

    if (!ventaId) {
      return NextResponse.json({ ok: false, error: "MISSING_VENTA_ID" })
    }

    if (!deliveryType) {
      return NextResponse.json({ ok: false, error: "INVALID_DELIVERY_TYPE" })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: "INVALID_ITEMS" })
    }

    for (const item of items) {
      if (!item.contacto) {
        return NextResponse.json({ ok: false, error: "INVALID_ITEM_FIELDS" })
      }

      if (deliveryType === "physical" && (!item.direccion || !item.ciudad)) {
        return NextResponse.json({ ok: false, error: "MISSING_ADDRESS" })
      }
    }

    // ======================
    // VENTA LOOKUP
    // ======================

    const supabase = getSupabase()

    const { data: venta, error: fetchError } = await supabase
      .from("ventas")
      .select("id, status")
      .eq("id", ventaId)
      .single()

    if (fetchError || !venta) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" })
    }

    if (venta.status !== "paid") {
      return NextResponse.json({ ok: false, error: "NOT_PAID" })
    }

    // ======================
    // UPDATE
    // ======================

    const item = items[0]

    const { error: updateError } = await supabase
      .from("ventas")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),

        recipient_name: item.beneficiario || "",
        recipient_contact: item.contacto || "",

        message_para: item.para || "",
        message_de: item.de || "",
        message_mensaje: item.mensaje || "",

        delivery_direccion: item.direccion || "",
        delivery_ciudad: item.ciudad || "",
        delivery_detalles: item.detalles || "",

        scheduled: !!item.programado,
        scheduled_date: item.fecha_envio || null,
        scheduled_time: item.hora_envio || null,
      })
      .eq("id", ventaId)

    if (updateError) {
      console.error("SUPABASE UPDATE ERROR:", updateError)
      return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
    }

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error("COMPLETE ERROR:", error)
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
  }
}
