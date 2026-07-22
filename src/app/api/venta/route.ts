import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log("RAW BODY:", body)

    const {
      box,
      quantity,
      total,
      buyer,
      delivery,
      multiBeneficiary
    } = body

    // ======================
    // VALIDATION
    // ======================

    if (!box) {
      return NextResponse.json({ ok: false, error: "Missing box" })
    }

    if (!quantity || quantity < 1) {
      return NextResponse.json({ ok: false, error: "Invalid quantity" })
    }

    if (!buyer?.phone) {
      return NextResponse.json({ ok: false, error: "Missing buyer phone" })
    }

    if (!delivery?.type) {
      return NextResponse.json({ ok: false, error: "Missing delivery type" })
    }

    if (!process.env.APPS_SCRIPT_URL) {
      console.error("Missing APPS_SCRIPT_URL")
      return NextResponse.json({ ok: false, error: "Server config error" })
    }

    // ======================
    // NORMALIZATION (CRITICAL FIX)
    // ======================

    let caja: string

    if (typeof box === "string") {
      caja = box.trim().toLowerCase()
    } else if (typeof box === "object" && box.slug) {
      caja = box.slug.toString().trim().toLowerCase()
    } else {
      return NextResponse.json({ ok: false, error: "Invalid box format" })
    }

    // ======================
    // PAYLOAD (STRICT GAS FORMAT)
    // ======================

    const payload = {
      caja,
      cantidad: quantity,
      total: total || 0,
      canalVenta: "Web",

      cliente: {
        nombre: buyer.name || "",
        telefono: buyer.phone || "",
        email: buyer.email || ""
      },

      entrega: {
        tipo: delivery.type,
        velocidad: delivery.speed || ""
      },

      multiBeneficiario: multiBeneficiary || false,

      // 🔥 TRACKING SYSTEM
      estadoCheckout: "step1_created",
      fechaCreacion: new Date().toISOString()
    }

    console.log("PAYLOAD TO APPS SCRIPT:", payload)

    // ======================
    // CALL APPS SCRIPT
    // ======================

    const response = await fetch(process.env.APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    console.log("GAS STATUS:", response.status)

    const text = await response.text()
    console.log("RAW GOOGLE RESPONSE:", text)

    let data

    try {
      data = JSON.parse(text)
    } catch (err) {
      console.error("GAS JSON PARSE ERROR:", err)

      return NextResponse.json({
        ok: false,
        error: "Invalid response from Apps Script",
        raw: text
      })
    }

    if (!data.ok) {
      return NextResponse.json({
        ok: false,
        error: data.error || "Apps Script error"
      })
    }

    // ======================
    // SUCCESS
    // ======================

    return NextResponse.json({
      ok: true,
      ventaId: data.ventaId,
      codes: data.codes || []
    })

  } catch (error) {
    console.error("API VENTA ERROR:", error)

    return NextResponse.json({
      ok: false,
      error: "Server error"
    })
  }
}