import { createClient, SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | null = null

// Created lazily, on first use inside a request handler — not at module
// load, so the build doesn't fail when SUPABASE_URL isn't configured yet.
export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )
  }
  return client
}
