// src/app/checkout/layout.tsx

import Navbar from "@/components/Navbar"
import BrandRibbon from "@/components/ui/BrandRibbon"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface relative">

      {/* Ambient warmth — almost invisible, no pattern */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(700px circle at 105% -5%, rgba(254,132,47,0.07), transparent 60%),
            radial-gradient(600px circle at -5% 105%, rgba(254,132,47,0.05), transparent 60%)
          `,
        }}
      />

      <Navbar />

      <div className="pt-[72px]">
        <BrandRibbon />
        <main>
          {children}
        </main>
      </div>

    </div>
  )
}
