// Create/deactivate/list promo_codes without opening Supabase Studio.
// Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local, loaded
// via Node's built-in --env-file flag (Node 20.6+) — no dotenv dependency.
//
// Usage:
//   node --env-file=.env.local scripts/promo-codes.mjs create --code=MARIA --maxUses=200 --expiresAt=2026-08-31 --label="Campaña Maria IG"
//   node --env-file=.env.local scripts/promo-codes.mjs deactivate --code=MARIA
//   node --env-file=.env.local scripts/promo-codes.mjs delete --code=MARIA
//   node --env-file=.env.local scripts/promo-codes.mjs list

import { createClient } from "@supabase/supabase-js"

const UNIQUE_VIOLATION = "23505"
// Never let a campaign code collide with/be confused for a system-generated
// one (VIVA- = activation codes, BIENVENIDA- = welcome codes).
const RESERVED_PREFIXES = ["VIVA-", "BIENVENIDA-"]

function parseArgs(argv) {
  const [command, ...rest] = argv
  const args = {}
  for (const part of rest) {
    const match = part.match(/^--([^=]+)=(.*)$/)
    if (match) args[match[1]] = match[2]
  }
  return { command, args }
}

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants — lance avec: node --env-file=.env.local scripts/promo-codes.mjs ..."
    )
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

async function create(args) {
  if (!args.code) throw new Error('--code est obligatoire (ex: --code=MARIA)')

  const code = args.code.trim().toUpperCase()
  const maxUses = args.maxUses ? Number(args.maxUses) : null
  const expiresAt = args.expiresAt ? new Date(args.expiresAt) : null

  if (!/^[A-Z0-9]{4,20}$/.test(code)) {
    throw new Error("--code doit être alphanumérique, sans espaces, entre 4 et 20 caractères")
  }
  if (RESERVED_PREFIXES.some((prefix) => code.startsWith(prefix))) {
    throw new Error(`--code ne peut pas commencer par ${RESERVED_PREFIXES.join(" ou ")} (réservé aux codes générés par le site)`)
  }
  if (args.maxUses && (!Number.isInteger(maxUses) || maxUses <= 0)) {
    throw new Error("--maxUses doit être un entier positif")
  }
  if (args.expiresAt && isNaN(expiresAt?.getTime())) {
    throw new Error("--expiresAt invalide (format attendu: AAAA-MM-JJ)")
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("promo_codes")
    .insert({
      code,
      type: "free_shipping",
      source: args.source || "campaign",
      max_uses: maxUses,
      label: args.label || null,
      expires_at: expiresAt ? expiresAt.toISOString() : null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === UNIQUE_VIOLATION) throw new Error(`Le code "${code}" existe déjà.`)
    throw error
  }

  console.log(
    `✓ Code créé: ${data.code} (max_uses=${data.max_uses ?? "illimité"}, expires_at=${data.expires_at ?? "jamais"})`
  )
}

async function deactivate(args) {
  if (!args.code) throw new Error("--code est obligatoire")
  const code = args.code.trim().toUpperCase()

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("promo_codes")
    .update({ active: false })
    .eq("code", code)
    .select()
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error(`Code "${code}" introuvable.`)

  console.log(`✓ Code désactivé: ${data.code}`)
}

async function remove(args) {
  if (!args.code) throw new Error("--code est obligatoire")
  const code = args.code.trim().toUpperCase()

  const supabase = getSupabase()
  const { data: existing, error: fetchError } = await supabase
    .from("promo_codes")
    .select("uses_count")
    .eq("code", code)
    .maybeSingle()

  if (fetchError) throw fetchError
  if (!existing) throw new Error(`Code "${code}" introuvable.`)
  if (existing.uses_count > 0) {
    throw new Error(
      `Le code "${code}" a déjà été utilisé ${existing.uses_count} fois — utilise "deactivate" plutôt que "delete" pour ne pas casser l'historique des ventes.`
    )
  }

  const { error } = await supabase.from("promo_codes").delete().eq("code", code)
  if (error) throw error

  console.log(`✓ Code supprimé: ${code}`)
}

async function list() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("promo_codes")
    .select("code, active, max_uses, uses_count, expires_at, label, source, created_at")
    .order("created_at", { ascending: false })

  if (error) throw error
  if (!data.length) {
    console.log("Aucun code promo.")
    return
  }

  for (const row of data) {
    const usage = row.max_uses ? `${row.uses_count}/${row.max_uses}` : `${row.uses_count}/∞`
    const status = row.active ? "actif" : "désactivé"
    console.log(
      `${row.code}  [${status}]  usages=${usage}  expire=${row.expires_at ?? "jamais"}  source=${row.source}  ${row.label ?? ""}`
    )
  }
}

async function main() {
  const { command, args } = parseArgs(process.argv.slice(2))

  try {
    if (command === "create") await create(args)
    else if (command === "deactivate") await deactivate(args)
    else if (command === "delete") await remove(args)
    else if (command === "list") await list()
    else {
      console.error("Commande inconnue. Utilise: create | deactivate | delete | list")
      process.exit(1)
    }
  } catch (err) {
    console.error("✗", err.message)
    process.exit(1)
  }
}

main()
