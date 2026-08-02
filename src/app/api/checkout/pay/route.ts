import { NextResponse } from "next/server"
import { supabase } from "@/services/supabase"

const RESERVATION_TTL_MS = 30 * 60 * 1000 // 30 min

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ventaId } = body

    if (!ventaId) {
      return NextResponse.json({ ok: false, error: "MISSING_VENTA_ID" })
    }

    const { data: venta, error: fetchError } = await supabase
      .from("ventas")
      .select("id, status, created_at")
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

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error("PAY ERROR:", error)
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
  }
}
