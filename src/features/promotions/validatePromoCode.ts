import type { SupabaseClient } from "@supabase/supabase-js"

export type PromoValidation =
  | { valid: true }
  | { valid: false; error: "INVALID_CODE" | "EXPIRED" | "USED_UP" | "NOT_YOURS" }

// Read-only check — never consumes a use (redeem_promo_code() does that,
// atomically, at pay time). Full validation (email match) only happens when
// buyerEmail is known; earlier in the funnel (CheckoutStep, before the buyer
// has entered their email) call with null and accept that a welcome code's
// ownership can't be confirmed yet — it's re-checked for real at `start`.
export async function validatePromoCode(
  supabase: SupabaseClient,
  rawCode: string,
  buyerEmail: string | null
): Promise<PromoValidation> {
  const code = rawCode.trim().toUpperCase()

  const { data: promo, error } = await supabase
    .from("promo_codes")
    .select("active, max_uses, uses_count, expires_at, contact_email")
    .eq("code", code)
    .maybeSingle()

  if (error) {
    console.error("PROMO VALIDATE ERROR:", error)
    return { valid: false, error: "INVALID_CODE" }
  }

  if (!promo || !promo.active) {
    return { valid: false, error: "INVALID_CODE" }
  }

  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return { valid: false, error: "EXPIRED" }
  }

  if (promo.max_uses !== null && promo.uses_count >= promo.max_uses) {
    return { valid: false, error: "USED_UP" }
  }

  if (promo.contact_email && buyerEmail && promo.contact_email !== buyerEmail.trim().toLowerCase()) {
    return { valid: false, error: "NOT_YOURS" }
  }

  return { valid: true }
}
