import { NextResponse } from "next/server"
import { getSupabase } from "@/services/supabase"
import { sendOrderReadyEmail } from "@/services/email"

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

    const { data: updatedVenta, error: updateError } = await supabase
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
      .select("id, box_slug, quantity, buyer_name, buyer_email, delivery_type, recipient_name, recipient_contact, delivery_direccion, delivery_ciudad, delivery_detalles")
      .single()

    if (updateError || !updatedVenta) {
      console.error("SUPABASE UPDATE ERROR:", updateError)
      return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
    }

    // Notifie l'équipe pour préparer la commande — best-effort, ne bloque
    // jamais la confirmation d'achat même si Resend est indisponible.
    const { data: activationCodeRow } = await supabase
      .from("activation_codes")
      .select("code")
      .eq("venta_id", ventaId)
      .maybeSingle()

    if (activationCodeRow) {
      await sendOrderReadyEmail({
        ventaId: updatedVenta.id,
        boxSlug: updatedVenta.box_slug,
        quantity: updatedVenta.quantity,
        buyerName: updatedVenta.buyer_name,
        buyerEmail: updatedVenta.buyer_email,
        deliveryType: updatedVenta.delivery_type,
        activationCode: activationCodeRow.code,
        recipientName: updatedVenta.recipient_name,
        recipientContact: updatedVenta.recipient_contact,
        address: updatedVenta.delivery_direccion,
        city: updatedVenta.delivery_ciudad,
        addressExtra: updatedVenta.delivery_detalles,
      })
    } else {
      console.error("ORDER READY EMAIL SKIPPED: no activation_codes row for venta", ventaId)
    }

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error("COMPLETE ERROR:", error)
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
  }
}
