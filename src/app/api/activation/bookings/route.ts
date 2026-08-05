import { NextResponse } from "next/server"
import { getSupabase } from "@/services/supabase"
import { hashSessionToken } from "@/utils/sessionToken"

const UNIQUE_VIOLATION = "23505"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const token = typeof body.token === "string" ? body.token : ""
    const experienceCode = typeof body.experienceCode === "string" ? body.experienceCode.trim() : ""
    const requestedDate = typeof body.requestedDate === "string" ? body.requestedDate : null
    const message = typeof body.message === "string" ? body.message.slice(0, 500) : null

    if (!token || !experienceCode) {
      return NextResponse.json({ ok: false, error: "INVALID_INPUT" })
    }

    const supabase = getSupabase()

    const { data: session, error: sessionError } = await supabase
      .from("activation_sessions")
      .select("activation_code_id, expires_at, revoked_at")
      .eq("token_hash", hashSessionToken(token))
      .maybeSingle()

    if (sessionError) {
      console.error("BOOKING SESSION FETCH ERROR:", sessionError)
      return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
    }

    if (!session || session.revoked_at || new Date(session.expires_at) < new Date()) {
      return NextResponse.json({ ok: false, error: "INVALID_SESSION" })
    }

    const { data: activationCode, error: codeError } = await supabase
      .from("activation_codes")
      .select("status")
      .eq("id", session.activation_code_id)
      .maybeSingle()

    if (codeError || !activationCode || activationCode.status !== "activated") {
      return NextResponse.json({ ok: false, error: "CANNOT_BOOK" })
    }

    const { data: booking, error: insertError } = await supabase
      .from("bookings")
      .insert({
        activation_code_id: session.activation_code_id,
        experience_code: experienceCode,
        requested_date: requestedDate,
        message,
      })
      .select("id")
      .single()

    if (insertError) {
      if (insertError.code === UNIQUE_VIOLATION) {
        return NextResponse.json({ ok: false, error: "ALREADY_HAS_BOOKING" })
      }

      console.error("BOOKING INSERT ERROR:", insertError)
      return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
    }

    return NextResponse.json({ ok: true, bookingId: booking.id })

  } catch (error) {
    console.error("BOOKING ERROR:", error)
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
  }
}
