// src/app/checkout/layout.tsx

import Navbar from "@/components/Navbar"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F6F7F8]">

      <Navbar />

      <div className="pt-[72px]">
        <main>
          {children}
        </main>
      </div>

    </div>
  )
}