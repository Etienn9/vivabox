import { getToPrepare } from "../data"
import { markPrepared } from "../actions"
import { OrderCard } from "../components"

export default async function PorPrepararPage() {
  const orders = await getToPrepare()

  return (
    <section>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Por preparar</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        {orders.length === 0 ? "Nada pendiente 🎉" : `${orders.length} pedido(s)`}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} action={markPrepared} actionLabel="Marcar como preparada" />
        ))}
      </div>
    </section>
  )
}
