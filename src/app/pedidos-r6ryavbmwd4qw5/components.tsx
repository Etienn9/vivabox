"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Truck, History } from "lucide-react"
import { PAGE_PATH, Order, formatDate } from "./types"

export function ActionButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      style={{
        background: "#fe842f",
        color: "white",
        border: "none",
        borderRadius: 8,
        padding: "10px 18px",
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  )
}

export function OrderCard({ order, action, actionLabel }: { order: Order; action?: (formData: FormData) => void; actionLabel?: string }) {
  const destinatario = order.recipient_name || order.buyer_name
  const contacto = order.recipient_contact || order.buyer_email

  return (
    <div style={{ border: "1px solid #e2e2e2", borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 1, marginBottom: 14, color: "#fe842f" }}>
        {order.code ?? "⚠ Sin código generado"}
      </div>

      <p style={{ margin: "4px 0" }}><strong>Caja:</strong> {order.box_slug} x{order.quantity}</p>
      <p style={{ margin: "4px 0" }}><strong>Comprador:</strong> {order.buyer_name} ({order.buyer_email})</p>
      <p style={{ margin: "4px 0" }}><strong>Destinatario:</strong> {destinatario} {contacto ? `(${contacto})` : ""}</p>
      {order.delivery_direccion && (
        <p style={{ margin: "4px 0" }}>
          <strong>Dirección:</strong> {order.delivery_direccion}, {order.delivery_ciudad}
          {order.delivery_detalles ? ` — ${order.delivery_detalles}` : ""}
        </p>
      )}
      {order.prepared_at && (
        <p style={{ margin: "4px 0", color: "#666" }}><strong>Preparada:</strong> {formatDate(order.prepared_at)}</p>
      )}
      {order.shipped_at && (
        <p style={{ margin: "4px 0", color: "#666" }}><strong>Enviada:</strong> {formatDate(order.shipped_at)}</p>
      )}
      <p style={{ color: "#999", fontSize: 12, margin: "10px 0 0" }}>Venta ID: {order.id}</p>

      {action && actionLabel && (
        <form action={action} style={{ marginTop: 14 }}>
          <input type="hidden" name="ventaId" value={order.id} />
          <ActionButton label={actionLabel} />
        </form>
      )}
    </div>
  )
}

type Counts = { toPrepare: number; toShip: number }

const TABS = [
  { href: `${PAGE_PATH}/por-preparar`, label: "Por preparar", icon: Package, countKey: "toPrepare" as const },
  { href: `${PAGE_PATH}/preparadas`, label: "Preparadas", icon: Truck, countKey: "toShip" as const },
  { href: `${PAGE_PATH}/historial`, label: "Historial", icon: History, countKey: null },
]

export function BottomNav({ counts }: { counts: Counts }) {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "white",
        borderTop: "1px solid #e2e2e2",
        display: "flex",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", width: "100%", maxWidth: 860, margin: "0 auto" }}>
        {TABS.map(({ href, label, icon: Icon, countKey }) => {
          const active = pathname === href
          const count = countKey ? counts[countKey] : null

          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "10px 4px 14px",
                textDecoration: "none",
                color: active ? "#fe842f" : "#888",
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                position: "relative",
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
              {label}
              {!!count && (
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    right: "28%",
                    background: "#fe842f",
                    color: "white",
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700,
                    minWidth: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                  }}
                >
                  {count}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
