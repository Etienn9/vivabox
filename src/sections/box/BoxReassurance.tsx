import { Check } from "lucide-react"

const items = [
  "La persona elige.",
  "Válida durante 6 meses.",
  "Envío gratis.",
  "Compra segura.",
]

export default function BoxReassurance() {
  return (
    <section className="py-10 md:py-12 bg-white">

      <div className="max-w-[720px] mx-auto px-6 text-center">

        <h2 className="h3 mb-6">
          ¿Por qué elegir Vivabox?
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">

          {items.map((text) => (
            <div key={text} className="flex items-center gap-2 text-[15px]">
              <Check size={16} className="text-primary-hover shrink-0" />
              {text}
            </div>
          ))}

        </div>

      </div>

    </section>
  )
}
