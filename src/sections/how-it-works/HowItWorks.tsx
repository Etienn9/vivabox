"use client"

import Image from "next/image"
import { QrCode, CalendarCheck } from "lucide-react"

export default function HowItWorks() {

  const steps = [
    {
      icon: "logo",
      title: "Regalas la caja",
      text: "Eliges una Vivabox y la entregas.",
    },
    {
      icon: "qr",
      title: "Activan el código",
      text: "Ingresan online en segundos.",
    },
    {
      icon: "calendar",
      title: "Reservan fácil",
      text: "Eligen fecha y disfrutan.",
    },
  ]

  return (
    <section className="py-6 bg-[#FAFAF8]">

      <div className="max-w-[1000px] mx-auto px-6">

        {/* TITLE */}

        <h2 className="text-[30px] md:text-[32px] font-semibold text-center mb-3 text-[#1C1C1C]">
          Así de fácil funciona
        </h2>

        {/* MOBILE */}

        <div className="flex flex-col md:hidden">

          {steps.map((step, i) => (

            <div key={i} className="flex items-start gap-4 py-4">

              {/* ICON */}

              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm border border-[#E8E8E8] shrink-0">

                {step.icon === "logo" && (
                  <Image
                    src="/icons/logo.png"
                    alt="Vivabox"
                    width={22}
                    height={22}
                  />
                )}

                {step.icon === "qr" && (
                  <QrCode size={22} className="text-[#1C1C1C]" />
                )}

                {step.icon === "calendar" && (
                  <CalendarCheck size={22} className="text-[#1C1C1C]" />
                )}

              </div>

              {/* TEXT */}

              <div>

                <h3 className="text-[18px] font-medium text-[#1C1C1C]">
                  {step.title}
                </h3>

                <p className="text-[14px] text-[#6B6B6B] mt-1 leading-relaxed">
                  {step.text}
                </p>

              </div>

            </div>

          ))}

        </div>

        {/* DESKTOP */}

        <div className="hidden md:grid grid-cols-3 gap-10 text-center">

          {steps.map((step, i) => (

            <div key={i} className="flex flex-col items-center">

              {/* ICON */}

              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-sm border border-[#E8E8E8] mb-4">

                {step.icon === "logo" && (
                  <Image
                    src="/icons/logo.png"
                    alt="Vivabox"
                    width={24}
                    height={24}
                  />
                )}

                {step.icon === "qr" && (
                  <QrCode size={24} className="text-[#1C1C1C]" />
                )}

                {step.icon === "calendar" && (
                  <CalendarCheck size={24} className="text-[#1C1C1C]" />
                )}

              </div>

              {/* TITLE */}

              <h3 className="text-[20px] font-medium text-[#1C1C1C] mb-2">
                {step.title}
              </h3>

              {/* TEXT */}

              <p className="text-[14px] text-[#6B6B6B] max-w-[220px] leading-relaxed">
                {step.text}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  )
}