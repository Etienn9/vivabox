import { NextResponse } from "next/server"
import { getSupabase } from "@/services/supabase"
import { generateActivationCode } from "@/features/activation/generateActivationCode"
import { normalizeCode } from "@/utils/normalizeCode"

const RESERVATION_TTL_MS = 30 * 60 * 1000 // 30 min
const ACTIVATION_VALIDITY_DAYS = 180 // 6 meses desde la compra (docs/01_product.md)
const MAX_CODE_ATTEMPTS = 5
const UNIQUE_VIOLATION = "23505"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ventaId } = body

    if (!ventaId) {
      return NextResponse.json({ ok: false, error: "MISSING_VENTA_ID" })
    }

    const supabase = getSupabase()

    const { data: venta, error: fetchError } = await supabase
      .from("ventas")
      .select("id, status, created_at, promo_code_input, buyer_email")
      .eq("id", ventaId)
      .single()

    if (fetchError || !venta) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" })
    }

    if (venta.status === "paid" || venta.status === "completed") {
      return NextResponse.json({ ok: false, error: "ALREADY_PAID" })
    }

    if (venta.status === "expired") {
      return NextResponse.json({ ok: false, error: "RESERVATION_EXPIRED" })
    }

    const age = Date.now() - new Date(venta.created_at).getTime()

    if (age > RESERVATION_TTL_MS) {
      await supabase.from("ventas").update({ status: "expired" }).eq("id", ventaId)
      return NextResponse.json({ ok: false, error: "RESERVATION_EXPIRED" })
    }

    const { error: updateError } = await supabase
      .from("ventas")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", ventaId)

    if (updateError) {
      console.error("SUPABASE UPDATE ERROR:", updateError)
      return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
    }

    // Consomme le code promo choisi à `start`, s'il y en a un. Best-effort :
    // si le code n'est plus valide (rare course avec `start`, ex. plafond
    // atteint entretemps), on logue mais on ne bloque jamais un paiement
    // déjà marqué payé.
    if (venta.promo_code_input) {
      const { data: redeemed, error: redeemError } = await supabase.rpc("redeem_promo_code", {
        p_code: venta.promo_code_input,
        p_venta_id: ventaId,
        p_buyer_email: venta.buyer_email,
      })

      if (redeemError) {
        console.error("PROMO REDEEM ERROR:", redeemError)
      } else if (!redeemed) {
        console.warn(`PROMO REDEEM FAILED (no longer valid): venta=${ventaId} code=${venta.promo_code_input}`)
      }
    }

    const expiresAt = new Date(
      Date.now() + ACTIVATION_VALIDITY_DAYS * 24 * 60 * 60 * 1000
    ).toISOString()

    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      const code = generateActivationCode()

      const { error: codeError } = await supabase
        .from("activation_codes")
        .insert({
          venta_id: ventaId,
          code,
          code_normalized: normalizeCode(code),
          expires_at: expiresAt,
        })

      if (!codeError) {
        return NextResponse.json({ ok: true, activationCode: code })
      }

      if (codeError.code !== UNIQUE_VIOLATION) {
        console.error("ACTIVATION CODE INSERT ERROR:", codeError)
        return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
      }
    }

    console.error("ACTIVATION CODE GENERATION EXHAUSTED ATTEMPTS")
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" })

  } catch (error) {
    console.error("PAY ERROR:", error)
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
  }
}
