"use client"

import Image from "next/image"
import { ArrowRight, CalendarCheck, User } from "lucide-react"
import { boxes } from "@/data/boxes"
import { formatPrice } from "@/utils/formatPrice"
import BrandRibbon from "@/components/ui/BrandRibbon"
import BenefitsBar from "@/components/BenefitsBar"

function IncludedCard({
  src,
  alt,
}: {
  src: string
  alt: string
}) {
  return (
    <div className="group relative w-full aspect-square rounded-2xl overflow-hidden shadow-[6px_10px_12px_-4px_rgba(24,20,15,0.4)]">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
    </div>
  )
}

const CATEGORIES = [
  { label: "Gastronomía", src: "/images/box-includes/Gastronomía.svg", size: "w-[50px] h-[50px] sm:w-[68px] sm:h-[68px] md:w-[92px] md:h-[92px]", offset: "translate-y-3 md:translate-y-4" },
  { label: "Aventura", src: "/images/box-includes/Aventura.svg", size: "w-[46px] h-[46px] sm:w-[62px] sm:h-[62px] md:w-[80px] md:h-[80px]", offset: "-translate-y-3 md:-translate-y-4" },
  { label: "Bienestar", src: "/images/box-includes/Bienestar.svg", size: "w-11 h-11 sm:w-[58px] sm:h-[58px] md:w-[72px] md:h-[72px]", offset: "translate-y-3 md:translate-y-4" },
  { label: "Estancias", src: "/images/box-includes/Estancias.svg", size: "w-[50px] h-[50px] sm:w-[68px] sm:h-[68px] md:w-[92px] md:h-[92px]", offset: "-translate-y-3 md:-translate-y-4" },
  { label: "Cultura", src: "/images/box-includes/Cultura.svg", size: "w-10 h-10 sm:w-[52px] sm:h-[52px] md:w-[68px] md:h-[68px]", offset: "translate-y-3 md:translate-y-4" },
] as const

export default function WhatsIncluded() {

  const box = boxes[0]

  return (
    <section className="bg-surface">

      {/* BRIDGE — connects the hero's promise to the explanation below */}

      <div className="bg-ink py-3 md:py-4 px-3 md:px-6">

        <div className="max-w-[820px] mx-auto flex flex-row items-center justify-center gap-2 sm:gap-5 md:gap-8">

          <div className="shrink-0 flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
            <Image
              src="/icons/logo-only-white.svg"
              alt="Vivabox"
              width={36}
              height={32}
              className="shrink-0 h-8 w-auto md:h-[38px]"
            />
            <p className="w-[92px] md:w-[134px] text-white font-semibold text-[13px] md:text-[19px] leading-snug whitespace-nowrap">
              Tú regalas
              <br />
              una Vivabox.
            </p>
          </div>

          <ArrowRight size={16} strokeWidth={1.5} className="shrink-0 text-white md:w-5 md:h-5" />

          <div className="shrink-0 flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
            <User size={32} strokeWidth={2.5} className="text-white shrink-0 md:w-9 md:h-9" />
            <p className="md:hidden text-white font-semibold text-[13px] leading-snug whitespace-nowrap">
              Quien la recibe
              <br />
              elige su experiencia.
            </p>
            <p className="hidden md:block text-white font-semibold text-[19px] leading-snug">
              Quien la recibe
              <br />
              elige su experiencia.
            </p>
          </div>

          <ArrowRight size={16} strokeWidth={1.5} className="shrink-0 text-white md:w-5 md:h-5" />

          <div className="shrink-0 flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
            <CalendarCheck size={28} strokeWidth={2.5} className="text-white shrink-0 md:w-8 md:h-8" />
            <p className="md:hidden w-[110px] text-white font-semibold text-[13px] leading-snug">
              Gestionamos la reserva.
            </p>
            <p className="hidden md:block md:w-[170px] text-white font-semibold text-[19px] leading-snug">
              Gestionamos la reserva.
            </p>
          </div>

        </div>

      </div>

      {/* QUÉ INCLUYE — the box dominates, three objects rest beside it as if just lifted out */}

      <div className="pt-10 md:pt-14 pb-2 md:pb-3">

        <div className="max-w-[1100px] mx-auto px-6">

          <h2 className="text-ink text-[28px] sm:text-[34px] md:text-[42px] font-semibold leading-[1.15] tracking-tight max-w-[420px] mb-2">
            Todo en una sola caja.
          </h2>

          <p className="text-ink/60 text-[15px] sm:text-[16px] md:text-[17px] max-w-[420px] mb-6 md:mb-8">
            Caja de regalo con catálogo de experiencias, mensaje personal y código de activación.
          </p>

        </div>

        {/* PRODUCT SHOT — full-bleed breakout: box and cards read at maximum scale, the two end cards nearly touching the viewport edges */}

        <div className="relative w-screen left-1/2 -translate-x-1/2 px-4 sm:px-6 md:px-10">

          <div className="relative w-full max-w-[1440px] mx-auto pt-4 md:pt-6">

            <div className="relative w-full aspect-[10/13.5]">

              {/* Lista para regalar. — to the left of the box, vertically centered on it */}
              <p className="absolute z-40 left-[-2%] top-[16%] w-[15%] text-right font-hand text-ink/90 text-[16px] sm:text-[20px] md:text-[26px] leading-snug -rotate-2">
                Lista para regalar.
              </p>

              {/* grounding shadow, cast to the bottom-right of the box — sharp and defined, not diffuse */}
              <div
                className="absolute left-[38%] top-[47%] w-[32%] h-[6%] rounded-[100%] blur-sm"
                style={{ background: "radial-gradient(ellipse, rgba(24,20,15,0.38) 0%, rgba(24,20,15,0.12) 60%, transparent 85%)" }}
              />

              {/* BOX — hero, slight 3D perspective, never frontal-flat, centered at 50%/26% */}

              <div
                className="absolute left-[15%] top-0 w-[70%] aspect-square z-10"
                style={{ transform: "perspective(1400px) rotateX(7deg) rotateY(-9deg) rotate(-3deg)" }}
              >
                <Image
                  src="/images/box-includes/vivabox-caja-regalo.png"
                  alt="Caja de regalo Vivabox con catálogo de experiencias"
                  fill
                  className="object-contain drop-shadow-[16px_22px_16px_rgba(24,20,15,0.34)]"
                  priority
                />
              </div>

              {/* CATALOGUE — left card, nearly at the frame's left edge */}

              <div className="absolute left-[2%] top-[66%] w-[30%] aspect-square z-10">
                <div
                  className="absolute inset-x-[18%] -bottom-[3%] h-[7%] rounded-[100%] blur-[3px]"
                  style={{ background: "radial-gradient(ellipse, rgba(24,20,15,0.35) 0%, transparent 80%)" }}
                />
                <div className="-rotate-3">
                  <IncludedCard
                    src="/images/box-includes/vivabox-catalogo-experiencias.png"
                    alt="Catálogo de experiencias Vivabox"
                  />
                </div>
              </div>

              {/* PERSONAL MESSAGE — center card, real gaps on both sides */}

              <div className="absolute left-[35%] top-[67%] w-[30%] aspect-square z-20">
                <div
                  className="absolute inset-x-[18%] -bottom-[3%] h-[7%] rounded-[100%] blur-[3px]"
                  style={{ background: "radial-gradient(ellipse, rgba(24,20,15,0.35) 0%, transparent 80%)" }}
                />
                <div className="rotate-1">
                  <IncludedCard
                    src="/images/box-includes/vivabox-dedicatoria-personal.png"
                    alt="Dedicatoria personalizada Vivabox"
                  />
                </div>
              </div>

              {/* ACTIVATION CARD — right card, nearly at the frame's right edge */}

              <div className="absolute left-[68%] top-[66.5%] w-[30%] aspect-square z-10">
                <div
                  className="absolute inset-x-[18%] -bottom-[3%] h-[7%] rounded-[100%] blur-[3px]"
                  style={{ background: "radial-gradient(ellipse, rgba(24,20,15,0.35) 0%, transparent 80%)" }}
                />
                <div className="rotate-2">
                  <IncludedCard
                    src="/images/box-includes/vivabox-codigo-activacion.png"
                    alt="Código de activación Vivabox"
                  />
                </div>
              </div>

              {/* Catálogo / De experiencias. — close above the catalogue card (card spans 2%-32%) */}
              <div className="absolute z-40 left-[2%] top-[56.5%] w-[30%] text-center leading-snug">
                <h3 className="font-sans uppercase tracking-wide font-semibold text-ink/70 text-[11px] sm:text-[13px] md:text-[14px]">
                  Catálogo
                </h3>
                <p className="font-sans text-ink/65 text-[10px] sm:text-[11px] md:text-[12px] font-normal mt-0.5">
                  De experiencias.
                </p>
              </div>

              {/* Mensaje / Personal. — close above the message card (card spans 35%-65%) */}
              <div className="absolute z-40 left-[35%] top-[56.5%] w-[30%] text-center leading-snug">
                <h3 className="font-sans uppercase tracking-wide font-semibold text-ink/70 text-[11px] sm:text-[13px] md:text-[14px]">
                  Mensaje
                </h3>
                <p className="font-sans text-ink/65 text-[10px] sm:text-[11px] md:text-[12px] font-normal mt-0.5">
                  Personal.
                </p>
              </div>

              {/* Activación / Código único. — close above the activation card (card spans 68%-98%) */}
              <div className="absolute z-40 left-[68%] top-[56.5%] w-[30%] text-center leading-snug">
                <h3 className="font-sans uppercase tracking-wide font-semibold text-ink/70 text-[11px] sm:text-[13px] md:text-[14px]">
                  Activación
                </h3>
                <p className="font-sans text-ink/65 text-[10px] sm:text-[11px] md:text-[12px] font-normal mt-0.5">
                  Código único.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="max-w-[1100px] mx-auto px-6">

        {/* GROUPING CONTAINER — border only, groups the categories title + grid */}

        <div className="mt-1 md:mt-2 border-2 border-[#3A2E22] rounded-[28px] sm:rounded-[36px] md:rounded-[48px] px-4 pt-3 pb-6 sm:px-8 sm:pt-5 sm:pb-8 md:px-12 md:pt-6 md:pb-10">

          {/* CATALOGUE CONTINUATION — categories read as an extension of "Para elegir.", not a new section */}

          <div className="max-w-[720px]">

            <p className="text-ink text-[22px] sm:text-[26px] md:text-[32px] font-semibold tracking-tight">
              ¿Qué experiencias podrá elegir?
            </p>

          </div>

          <div className="mt-3 md:mt-5">

            <div className="grid grid-cols-5 gap-x-1 sm:gap-x-6 md:gap-x-10">

              {CATEGORIES.map((cat) => (
                <div key={cat.label} className={`flex flex-col items-center text-center ${cat.offset}`} aria-label={`Categoría ${cat.label}`}>
                  <div className="h-[50px] sm:h-[68px] md:h-[92px] flex items-end justify-center mb-2 md:mb-3">
                    <div className={`relative ${cat.size}`}>
                      <Image src={cat.src} alt={`Categoría ${cat.label}`} fill className="object-contain" />
                    </div>
                  </div>
                  <span className="text-ink text-[12px] sm:text-[16px] md:text-[20px] font-medium leading-tight">
                    {cat.label}
                  </span>
                </div>
              ))}

            </div>

          </div>

        </div>

        <p className="mt-3 md:mt-4 text-muted text-[14px] sm:text-[15px] md:text-[16px] text-center">
          Más de 20 experiencias en Bogotá y Cundinamarca.
        </p>

        {/* PRICE — editorial, the price itself is the focal point, no card */}

        <div className="mt-6 md:mt-8 flex flex-col items-center text-center">

          <div className="w-10 h-px bg-ink/10 mb-3 md:mb-4" />

          <p className="text-muted text-[15px] md:text-[17px] mb-2">
            Una experiencia a elegir.
          </p>

          <div className="text-[44px] sm:text-[52px] md:text-[64px] font-semibold text-ink leading-none tracking-tight mb-4 md:mb-5">
            ${formatPrice(box.price)}
            <span className="text-[20px] sm:text-[24px] md:text-[30px] align-baseline"> COP</span>
          </div>

          <a
            href="/proximamente"
            className="h-[54px] px-10 rounded-xl bg-primary text-white text-[17px] font-semibold inline-flex items-center justify-center transition hover:bg-primary-hover shadow-[0_10px_35px_rgba(254,132,47,.35)]"
          >
            Comprar Vivabox
          </a>

          <p className="mt-5 md:mt-6 mb-6 md:mb-8 text-muted text-[13px] md:text-[14px]">
            Compra segura. Sin costos ocultos.
          </p>

        </div>

      </div>

      <BenefitsBar />

      {/* Y DESPUÉS — la experiencia continúa en la app */}

      <div className="relative w-screen left-1/2 -translate-x-1/2 bg-ink">

        <div className="max-w-[1200px] mx-auto grid grid-cols-2 items-stretch h-[480px] sm:h-[520px] md:h-[560px] lg:h-[620px]">

          <div className="relative w-full h-full" aria-label="App Vivabox para descubrir, elegir y reservar experiencias">
            <Image
              src="/images/app-phone/vivabox-app-experiencias.png"
              alt="App Vivabox mostrando experiencias disponibles en Bogotá y Cundinamarca"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center px-4 sm:px-8 md:px-14 lg:px-20 text-left -translate-y-6 sm:-translate-y-8 md:-translate-y-10 lg:-translate-y-12">

            <h2 className="text-white font-semibold tracking-tight leading-[1.05] text-[26px] sm:text-[32px] md:text-[42px] lg:text-[52px]">
              <span className="block">Explorar.</span>
              <span className="block">Elegir.</span>
              <span className="block">Reservar.</span>
            </h2>

            <div className="w-10 h-px bg-white/20 my-6 md:my-8" />

            <h3 className="text-white text-[16px] sm:text-[18px] md:text-[22px] lg:text-[25px] font-semibold leading-snug tracking-tight max-w-[360px] mb-3 md:mb-4">
              La experiencia continúa en la <span className="text-primary">app Vivabox</span>.
            </h3>

            <p className="text-white/70 text-[13px] sm:text-[15px] md:text-[16px] lg:text-[17px] leading-relaxed max-w-[400px]">
              Descubrirá todas las experiencias y podrá reservar con el acompañamiento del equipo Vivabox.
            </p>

          </div>

        </div>

      </div>

      <BrandRibbon />

    </section>
  )
}
