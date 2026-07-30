"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, QrCode, Menu, X } from "lucide-react"

export default function Navbar() {

  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const forceSolid =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/experiencias") ||
    pathname.startsWith("/carrito") ||
    pathname.startsWith("/activar") ||
    pathname.startsWith("/empresas") ||
    pathname.startsWith("/nuestra-historia")

  useEffect(() => {
    if (forceSolid) return

    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)

  }, [forceSolid])

  const solid = forceSolid || scrolled

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          solid
            ? "bg-white/80 backdrop-blur-md border-b border-black/5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        }`}
      >

        <nav className="max-w-[1200px] mx-auto h-[72px] flex items-center justify-between px-4 md:px-6">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => setMenuOpen(true)}
              className={`md:hidden transition hover:scale-105 translate-y-[2px] ${
                solid ? "text-foreground" : "text-white"
              }`}
            >
              <Menu size={28} strokeWidth={1.5} />
            </button>

            <Link href="/" className="flex items-center gap-2 py-2 pr-2 group">

              <Image
                src={solid ? "/icons/logo.png" : "/icons/logo-white.png"}
                alt="Vivabox"
                width={42}
                height={42}
                priority
                className="transition group-hover:scale-105"
              />

              <Image
                src={solid ? "/icons/vivabox.png" : "/icons/vivabox-white.png"}
                alt="Vivabox"
                width={110}
                height={28}
                priority
                className="transition group-hover:opacity-80"
              />

            </Link>

          </div>

          {/* NAV DESKTOP */}
          <div
            className={`hidden md:flex gap-8 text-[15px] transition-colors ${
              solid ? "text-ink" : "text-white"
            }`}
          >
            <Link href="/#incluye">Cómo funciona</Link>
            <Link href="/#incluye">Cajas</Link>
            <Link href="/#experiencias">Experiencias</Link>
            <Link href="/proximamente">Empresas</Link>
            <Link href="/proximamente">Nuestra historia</Link>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* CTA SECONDARY (activation) */}
            <Link
              href="/proximamente"
              className={`
                inline-flex items-center gap-2
                h-10 px-3.5 md:px-4
                rounded-full border-2
                text-sm font-semibold
                whitespace-nowrap shrink-0
                transition-all duration-200
                ${
                  solid
                    ? "border-ink text-ink hover:bg-primary hover:text-white"
                    : "border-white text-white hover:bg-white hover:text-primary"
                }
              `}
            >
              <QrCode size={16} strokeWidth={1.5} />
              <span className="hidden sm:inline">Activar mi box</span>
              <span className="sm:hidden">Activar</span>
            </Link>

            {/* CART */}
            <Link
              href="/proximamente"
              className={`p-2 rounded-full transition ${
                solid
                  ? "text-ink hover:bg-black/5"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <ShoppingCart size={24} strokeWidth={1.5} />
            </Link>

          </div>

        </nav>
      </header>

      {/* MOBILE MENU */}
<div
  className={`fixed inset-0 z-50 ${
    menuOpen ? "pointer-events-auto" : "pointer-events-none"
  }`}
>

  {/* OVERLAY */}
  <div
    onClick={() => setMenuOpen(false)}
    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
      menuOpen ? "opacity-100" : "opacity-0"
    }`}
  />

  {/* PANEL */}
  <div
    className={`absolute left-0 top-0 h-full w-[300px] bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.12)] transform transition-transform duration-300 ${
      menuOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >

    <div className="p-6 flex flex-col h-full">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <p className="text-[18px] font-medium text-foreground">
          Vivabox
        </p>

        <button
          onClick={() => setMenuOpen(false)}
          className="p-1 opacity-70 hover:opacity-100 transition"
        >
          <X size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* CTA PRIMARY */}
<Link
  href="/#incluye"
  onClick={() => setMenuOpen(false)}
  className="
    mb-4 h-12 flex items-center justify-center
    rounded-full
    bg-white
    text-foreground
    font-medium
    border border-black/10
    active:scale-[0.97]
    transition
  "
>
  Ver las cajas
</Link>

{/* CTA SECONDARY */}
<Link
  href="/proximamente"
  onClick={() => setMenuOpen(false)}
  className="
    mb-10 h-12 flex items-center justify-center gap-2
    rounded-full
    border border-primary/50
    text-primary
    font-medium
    active:scale-[0.97]
    transition
  "
>
  <QrCode size={15} strokeWidth={1.5} />
  Activar mi box
</Link>

      {/* NAV */}
      <div className="flex flex-col gap-7 text-[16px] text-foreground">

        <Link href="/#incluye" onClick={() => setMenuOpen(false)}>
          Cómo funciona
        </Link>

        <Link href="/#experiencias" onClick={() => setMenuOpen(false)}>
          Experiencias
        </Link>

        <Link href="/proximamente" onClick={() => setMenuOpen(false)}>
          Empresas
        </Link>

      </div>

      {/* SEPARATOR */}
      <div className="my-10 border-t border-black/10" />

      {/* SECONDARY */}
      <div className="flex flex-col gap-5 text-[15px] text-gray-500">

        <Link href="/proximamente" onClick={() => setMenuOpen(false)}>
          Nuestra historia
        </Link>

        <Link href="/proximamente" onClick={() => setMenuOpen(false)}>
          Carrito
        </Link>

      </div>

      {/* TRUST (minimal) */}
      <div className="mt-auto pt-6 text-xs text-gray-400">
        +20 experiencias · Confirmación rápida
      </div>

    </div>
  </div>
</div>
    </>
  )
}