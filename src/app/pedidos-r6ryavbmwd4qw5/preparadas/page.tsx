import { getToShip } from "../data"
import { markShipped } from "../actions"
import { OrderCard } from "../components"

export default async function PreparadasPage() {
  const orders = await getToShip()

  return (
    <section>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Preparadas — listas para enviar</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        {orders.length === 0 ? "Nada en espera de envío" : `${orders.length} pedido(s)`}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} action={markShipped} actionLabel="Marcar como enviada" />
        ))}
      </div>
    </section>
  )
}
