import { NextResponse } from "next/server"

function normalizeDeliveryType(type: any) {
  if (!type) return null

  const t = String(type).toLowerCase()

  if (t === "physical" || t === "fisico") return "fisico"
  if (t === "digital") return "digital"

  return null
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { ventaId, items, delivery } = body

    // 🔥 FIX ICI
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

      if (deliveryType === "fisico") {
        if (!item.direccion || !item.ciudad) {
          return NextResponse.json({ ok: false, error: "MISSING_ADDRESS" })
        }
      }
    }

    // ======================
    // NORMALISATION
    // ======================

    const cleanItems = items.map((item: any) => ({
  para: item.para || "",
  de: item.de || "",

  beneficiario: item.beneficiario || "",
  contacto: item.contacto || "",

  mensaje: item.mensaje || "",

  direccion: item.direccion || "",
  ciudad: item.ciudad || "",
  detalles: item.detalles || "",

  programado: !!item.programado,
  fecha_envio: item.fecha_envio || null,
  hora_envio: item.hora_envio || null,
}))

    // ======================
    // CALL GAS
    // ======================

    const response = await fetch(process.env.APPS_SCRIPT_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "complete",
        ventaId,
        delivery: { type: deliveryType }, // 🔥 aligné avec GAS
        items: cleanItems,
      }),
    })

    const data = await response.json()

    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
  }
}