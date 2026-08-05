import { getCounts } from "./data"
import { BottomNav } from "./components"

// Jamais indexée, jamais liée depuis le site — accès uniquement via l'URL
// directe + mot de passe (voir middleware.ts).
export const metadata = {
  robots: { index: false, follow: false },
}

export default async function PedidosLayout({ children }: { children: React.ReactNode }) {
  const counts = await getCounts()

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: "#1a1a1a" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 100px" }}>
        {children}
      </div>
      <BottomNav counts={counts} />
    </div>
  )
}
