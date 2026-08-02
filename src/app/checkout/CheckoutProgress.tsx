"use client"

import { Check } from "lucide-react"

type Step = "elegir" | "pagar" | "enviar"

const steps: { key: Step; label: string }[] = [
  { key: "elegir", label: "Elegir" },
  { key: "pagar", label: "Pagar" },
  { key: "enviar", label: "Enviar" },
]

type Props = {
  current: Step
  subStep?: 1 | 2
}

export default function CheckoutProgress({ current, subStep }: Props) {

  const order: Step[] = ["elegir", "pagar", "enviar"]

  return (
    <div className="bg-card border-b border-[#ECECEC]">
      <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">

        {steps.map((step, index) => {

          const currentIndex = order.indexOf(current)
          const stepIndex = order.indexOf(step.key)

          const state =
            stepIndex < currentIndex
              ? "done"
              : stepIndex === currentIndex
              ? "active"
              : "pending"

          return (
            <div key={step.key} className="flex items-center gap-3">

              {/* STEP */}
              <div className="flex items-center gap-2">

                <div
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors duration-300
                    ${
                      state === "done"
                        ? "bg-primary text-white"
                        : state === "active"
                        ? "border-2 border-ink text-ink"
                        : "border border-[#ECECEC] text-gray-400"
                    }
                  `}
                >
                  {state === "done" ? (
                    <Check className="w-3 h-3" strokeWidth={1.5} />
                  ) : (
                    index + 1
                  )}
                </div>

                <div className="flex flex-col leading-tight">
                  <span
                    className={`
                      text-sm
                      ${
                        state === "active"
                          ? "font-medium text-ink"
                          : "text-gray-500"
                      }
                    `}
                  >
                    {step.label}
                  </span>

                  {step.key === "elegir" && current === "elegir" && subStep && (
                    <span className="text-[11px] text-[#6B6B6B]">
                      Paso {subStep} de 2
                    </span>
                  )}
                </div>

              </div>

              {/* LINE */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-[1px] bg-[#ECECEC] mx-3" />
              )}

            </div>
          )
        })}

      </div>
    </div>
  )
}
