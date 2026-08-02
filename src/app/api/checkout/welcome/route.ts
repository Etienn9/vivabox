import { NextResponse } from "next/server"
import { getSupabase } from "@/services/supabase"
import { generateWelcomeCode } from "@/features/promotions/generateWelcomeCode"

const EXPIRATION_DAYS = 30
const MAX_ATTEMPTS = 5
const UNIQUE_VIOLATION = "23505"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const consent = body.consent === true

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "INVALID_EMAIL" })
    }

    if (!consent) {
      return NextResponse.json({ ok: false, error: "CONSENT_REQUIRED" })
    }

    const supabase = getSupabase()

    const { error: contactError } = await supabase
      .from("contacts")
      .upsert(
        {
          email,
          source: "checkout",
          campaign: "first_purchase_shipping",
          consent: true,
        },
        { onConflict: "email" }
      )

    if (contactError) {
      console.error("CONTACT UPSERT ERROR:", contactError)
      return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
    }

    const expiresAt = new Date(Date.now() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000).toISOString()

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const code = generateWelcomeCode()

      const { error: codeError } = await supabase
        .from("promo_codes")
        .insert({
          code,
          type: "free_shipping",
          source: "first_purchase_welcome",
          contact_email: email,
          expires_at: expiresAt,
        })

      if (!codeError) {
        return NextResponse.json({ ok: true, code, expiresAt })
      }

      if (codeError.code !== UNIQUE_VIOLATION) {
        console.error("PROMO CODE INSERT ERROR:", codeError)
        return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
      }
    }

    console.error("PROMO CODE GENERATION EXHAUSTED ATTEMPTS")
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" })

  } catch (error) {
    console.error("WELCOME ERROR:", error)
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
  }
}
