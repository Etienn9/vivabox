import type { SupabaseClient } from "@supabase/supabase-js"

// Wraps the check_rate_limit() Postgres function (supabase/schema.sql):
// atomic counter, one row per (identifier, action), immune to the
// AppScript issue where the rate-limit key was an attacker-supplied email.
export async function checkRateLimit(
  supabase: SupabaseClient,
  identifier: string,
  action: string,
  maxAttempts: number,
  windowMinutes: number
): Promise<boolean> {
  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_identifier: identifier,
    p_action: action,
    p_max_attempts: maxAttempts,
    p_window_minutes: windowMinutes,
  })

  if (error) {
    console.error("RATE LIMIT CHECK ERROR:", error)
    return true // fail open — a broken rate limiter must never block real traffic
  }

  return data === true
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return "unknown"
}
