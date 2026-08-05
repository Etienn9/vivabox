import { Resend } from "resend"

let client: Resend | null = null

function getResend(): Resend {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY!)
  }
  return client
}

const NOTIFY_TO = "contact@vivabox.com.co"
// Domaine vivabox.com.co pas encore vérifié dans Resend — bascule vers une
// adresse @vivabox.com.co (ex: notificaciones@vivabox.com.co) une fois la
// vérification DNS faite dans le dashboard Resend.
const FROM = "Vivabox <onboarding@resend.dev>"

type OrderReadyEmailParams = {
  ventaId: string
  boxSlug: string
  quantity: number
  buyerName: string
  buyerEmail: string
  deliveryType: string
  activationCode: string
  recipientName?: string | null
  recipientContact?: string | null
  address?: string | null
  city?: string | null
  addressExtra?: string | null
}

// Le code d'activation est une clé au porteur valable 180 jours (activer ne
// vérifie que nom+email saisis sur place, pas l'identité du destinataire) —
// on ne le fait jamais transiter en clair par email/logs Resend. L'email
// sert juste à dire "cette commande est prête" ; le code complet se récupère
// à la préparation via `scripts/orders.mjs pending`, en direct depuis Supabase.
function maskCode(code: string): string {
  const dashIndex = code.indexOf("-")
  if (dashIndex === -1) return code

  const prefix = code.slice(0, dashIndex + 1)
  const suffix = code.slice(dashIndex + 1)
  const visible = suffix.slice(-4)
  const masked = "*".repeat(Math.max(suffix.length - 4, 0))

  return `${prefix}${masked}${visible}`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

// Best-effort : ne doit jamais faire échouer le checkout si Resend est down
// ou mal configuré. L'équipe peut toujours retrouver la commande via
// `scripts/orders.mjs pending` si l'email n'arrive pas.
export async function sendOrderReadyEmail(params: OrderReadyEmailParams) {
  const {
    ventaId, boxSlug, quantity, buyerName, buyerEmail, deliveryType,
    activationCode, recipientName, recipientContact, address, city, addressExtra,
  } = params

  const isPhysical = deliveryType === "physical"
  const maskedCode = maskCode(activationCode)

  const html = `
    <h2>Nueva Vivabox lista para preparar</h2>
    <p style="font-size:20px"><strong>Código: ${escapeHtml(maskedCode)}</strong></p>
    <p style="color:#888;font-size:13px">Código completo al empacar: <code>node scripts/orders.mjs pending</code></p>
    <ul>
      <li><strong>Caja:</strong> ${escapeHtml(boxSlug)} x${quantity}</li>
      <li><strong>Comprador:</strong> ${escapeHtml(buyerName)} (${escapeHtml(buyerEmail)})</li>
      <li><strong>Entrega:</strong> ${isPhysical ? "Física" : "Digital"}</li>
      ${recipientName ? `<li><strong>Destinatario:</strong> ${escapeHtml(recipientName)}${recipientContact ? ` (${escapeHtml(recipientContact)})` : ""}</li>` : ""}
      ${isPhysical && address ? `<li><strong>Dirección:</strong> ${escapeHtml(address)}, ${escapeHtml(city || "")}${addressExtra ? ` — ${escapeHtml(addressExtra)}` : ""}</li>` : ""}
    </ul>
    <p style="color:#888;font-size:12px">Venta ID: ${ventaId}</p>
  `

  try {
    await getResend().emails.send({
      from: FROM,
      to: NOTIFY_TO,
      subject: `Nueva Vivabox para preparar — ${maskedCode}`,
      html,
    })
  } catch (error) {
    console.error("ORDER READY EMAIL ERROR:", error)
  }
}
