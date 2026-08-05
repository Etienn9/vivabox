import { getHistory } from "../data"
import { HISTORY_LIMIT } from "../types"
import { OrderCard } from "../components"

export default async function HistorialPage() {
  const orders = await getHistory()

  return (
    <section>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Historial — enviadas</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        {orders.length === 0 ? "Ninguna todavía" : `Últimas ${orders.length} (máx. ${HISTORY_LIMIT})`}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    </section>
  )
}
