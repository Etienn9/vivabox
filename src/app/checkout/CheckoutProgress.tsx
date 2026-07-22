"use client"

import { Check } from "lucide-react"

type Step = "elegir" | "pagar" | "enviar"

const steps: { key: Step; label: string }[] = [
  { key: "elegir", label: "Elegir" },
  { key: "pagar", label: "Pagar" },
  { key: "enviar", label: "Enviar" },
]

export default function CheckoutProgress({ current }: { current: Step }) {

  const order: Step[] = ["elegir", "pagar", "enviar"]

  return (
    <div className="bg-white border-b">
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
                    w-6 h-6 rounded-full flex items-center justify-center text-xs
                    ${
                      state === "done"
                        ? "bg-green-600 text-white"
                        : state === "active"
                        ? "border-2 border-black text-black"
                        : "border text-gray-400"
                    }
                  `}
                >
                  {state === "done" ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    index + 1
                  )}
                </div>

                <span
                  className={`
                    text-sm
                    ${
                      state === "active"
                        ? "font-medium text-black"
                        : "text-gray-500"
                    }
                  `}
                >
                  {step.label}
                </span>

              </div>

              {/* LINE */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-[1px] bg-gray-300 mx-3" />
              )}

            </div>
          )
        })}

      </div>
    </div>
  )
}