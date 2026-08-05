// List orders ready to pack (paid + shipping info collected) with their
// activation code, and mark them as shipped once the code is in the box.
// Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local, loaded
// via Node's built-in --env-file flag (Node 20.6+) — no dotenv dependency.
//
// Usage:
//   node --env-file=.env.local scripts/orders.mjs pending
//   node --env-file=.env.local scripts/orders.mjs ship --venta=50001d1c-82b1-4e31-8e90-d705275737be

import { createClient } from "@supabase/supabase-js"

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
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants — lance avec: node --env-file=.env.local scripts/orders.mjs ..."
    )
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

async function pending() {
  const supabase = getSupabase()

  const { data: ventas, error } = await supabase
    .from("ventas")
    .select(
      "id, created_at, box_slug, quantity, buyer_name, buyer_email, recipient_name, recipient_contact, delivery_direccion, delivery_ciudad, delivery_detalles"
    )
    .eq("status", "completed")
    .is("shipped_at", null)
    .order("created_at", { ascending: true })

  if (error) throw error

  if (!ventas.length) {
    console.log("Nada pendiente de empacar.")
    return
  }

  const { data: codes, error: codesError } = await supabase
    .from("activation_codes")
    .select("venta_id, code")
    .in("venta_id", ventas.map((v) => v.id))

  if (codesError) throw codesError

  const codeByVenta = new Map(codes.map((c) => [c.venta_id, c.code]))

  for (const v of ventas) {
    const code = codeByVenta.get(v.id) ?? "(sin código)"
    const destinatario = v.recipient_name || v.buyer_name
    const contacto = v.recipient_contact || v.buyer_email

    console.log(`\n${v.id}`)
    console.log(`  creado:       ${new Date(v.created_at).toLocaleString("es-CO")}`)
    console.log(`  caja:         ${v.box_slug} x${v.quantity}`)
    console.log(`  comprador:    ${v.buyer_name} <${v.buyer_email}>`)
    console.log(`  destinatario: ${destinatario} (${contacto})`)
    if (v.delivery_direccion) {
      console.log(`  dirección:    ${v.delivery_direccion}, ${v.delivery_ciudad}${v.delivery_detalles ? ` — ${v.delivery_detalles}` : ""}`)
    }
    console.log(`  código:       ${code}`)
  }

  console.log(`\n${ventas.length} comanda(s) pendiente(s) de empacar.`)
}

async function ship(args) {
  if (!args.venta) throw new Error("--venta est obligatoire (ex: --venta=50001d1c-...)")

  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("ventas")
    .update({ shipped_at: new Date().toISOString() })
    .eq("id", args.venta)
    .eq("status", "completed")
    .is("shipped_at", null)
    .select("id, buyer_name")
    .maybeSingle()

  if (error) throw error
  if (!data) {
    throw new Error(
      `Vente "${args.venta}" introuvable, pas encore "completed", ou déjà marquée comme expédiée.`
    )
  }

  console.log(`✓ Marquée comme expédiée: ${data.id} (${data.buyer_name})`)
}

async function main() {
  const { command, args } = parseArgs(process.argv.slice(2))

  try {
    if (command === "pending") await pending()
    else if (command === "ship") await ship(args)
    else {
      console.error("Commande inconnue. Utilise: pending | ship")
      process.exit(1)
    }
  } catch (err) {
    console.error("✗", err.message)
    process.exit(1)
  }
}

main()
