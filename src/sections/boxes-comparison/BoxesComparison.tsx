"use client"

import Image from "next/image"
import Link from "next/link"
import { boxes } from "@/data/boxes"
import { formatPrice } from "@/utils/formatPrice"

type Props = {
  activeBox?: string
}

export default function BoxesComparison({ activeBox }: Props) {

  return (

    <section className="py-5">

      <div className="max-w-[1100px] mx-auto px-6">

        <div className="text-center mb-14">

          <h2 className="text-[34px] font-semibold mb-2">
            Compara las Vivabox
          </h2>

        </div>

        <div className="overflow-x-auto">

          <div className="min-w-[720px]">

            {/* HEADER */}

            <div className="grid grid-cols-[110px_1fr_1fr_1fr] md:grid-cols-[140px_1fr_1fr_1fr] gap-6 mb-10 items-end">

              <div></div>

              {boxes.map((box) => {

                const active = box.slug === activeBox

                return (

                  <div
                    key={box.slug}
                    className={`text-center p-4 rounded-xl ${
                      active ? "bg-[#f5f5f5]" : ""
                    }`}
                  >

                    <div className="relative w-[110px] h-[110px] mx-auto mb-3">

                      <Image
                        src={box.image}
                        alt={box.name}
                        fill
                        className="object-contain"
                      />

                    </div>

                    <h3 className={`font-semibold text-[18px] ${
                      active ? "text-black" : "text-[#444]"
                    }`}>
                      {box.name}
                    </h3>

                    <div className="text-[18px] font-semibold mt-1">
                      ${formatPrice(box.price)}
                    </div>

                    <div className="text-[#fe842f] text-sm mt-1">
                      +{box.experiences} experiencias
                    </div>

                    <Link
                      href={`/cajas/${box.slug}`}
                      className="inline-flex mt-4 h-10 px-5 items-center justify-center rounded-xl bg-[#fe842f] text-white text-sm font-semibold hover:brightness-95 transition"
                    >
                      Descubrir
                    </Link>

                  </div>

                )

              })}

            </div>

            {/* TABLE */}

            <div className="divide-y text-sm md:text-[15px]">

              {/* EXPERIENCIAS */}

              <div className="grid grid-cols-[110px_1fr_1fr_1fr] md:grid-cols-[140px_1fr_1fr_1fr] py-5">

                <div className="text-[#6B6B6B]">
                  Experiencias
                </div>

                <div className="text-center">+120</div>
                <div className="text-center">+350</div>
                <div className="text-center">+700</div>

              </div>

              {/* PERSONAS */}

              <div className="grid grid-cols-[110px_1fr_1fr_1fr] md:grid-cols-[140px_1fr_1fr_1fr] py-5 bg-[#fafafa]">

                <div className="text-[#6B6B6B]">
                  Personas
                </div>

                <div className="text-center">
                  Principalmente 1
                </div>

                <div className="text-center">
                  1 o 2
                </div>

                <div className="text-center">
                  1 o 2
                </div>

              </div>

              {/* VALOR */}

              <div className="grid grid-cols-[110px_1fr_1fr_1fr] md:grid-cols-[140px_1fr_1fr_1fr] py-5">

                <div className="text-[#6B6B6B]">
                  Valor
                </div>

                <div className="text-center">
                  sencillas
                </div>

                <div className="text-center">
                  premium
                </div>

                <div className="text-center">
                  extraordinarias
                </div>

              </div>

              {/* NIVEL */}

              <div className="grid grid-cols-[110px_1fr_1fr_1fr] md:grid-cols-[140px_1fr_1fr_1fr] py-5 bg-[#fafafa]">

                <div className="text-[#6B6B6B]">
                  Nivel
                </div>

                <div className="text-center">●●○</div>
                <div className="text-center">●●●</div>
                <div className="text-center">●●●●</div>

              </div>

              {/* IDEAL */}

              <div className="grid grid-cols-[110px_1fr_1fr_1fr] md:grid-cols-[140px_1fr_1fr_1fr] py-5">

                <div className="text-[#6B6B6B]">
                  Ideal para
                </div>

                <div className="text-center">
                  Detalles
                </div>

                <div className="text-center">
                  Regalos importantes
                </div>

                <div className="text-center">
                  Celebraciones
                </div>

              </div>

              {/* UBICACIÓN */}

              <div className="grid grid-cols-[110px_1fr_1fr_1fr] md:grid-cols-[140px_1fr_1fr_1fr] py-5 bg-[#fafafa]">

                <div className="text-[#6B6B6B]">
                  Ubicación
                </div>

                <div className="text-center leading-tight">
                  Bogotá<br/>Cundinamarca
                </div>

                <div className="text-center leading-tight">
                  Bogotá<br/>Cundinamarca
                </div>

                <div className="text-center leading-tight">
                  Bogotá<br/>Cundinamarca
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  )
}
