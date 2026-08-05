import Image from "next/image"
import BrandDots from "@/components/ui/BrandDots"

const items = [
  {
    image: "/images/hero/hero2.jpg",
    title: "Siempre aciertas.",
    text: "No tienes que adivinar: la persona elige lo que más le emociona.",
  },
  {
    image: "/images/final-cta/persona-regalando-vivabox.png",
    title: "El regalo se vive dos veces.",
    text: "Primero al abrir la caja. Después al disfrutar la experiencia.",
  },
  {
    image: "/images/box-includes/vivabox-catalogo-experiencias.png",
    title: "La persona elige.",
    text: "No importa si prefiere la gastronomía, el bienestar o la aventura. Ella decide.",
  },
]

export default function BoxWhyItWorks() {
  return (
    <section className="bg-white py-16 md:py-20">

      <div className="max-w-[640px] mx-auto px-6">

        <BrandDots />

        <h2 className="h2 mb-6 md:mb-8">
          ¿Por qué funciona tan bien como regalo?
        </h2>

        <div>

          {items.map(({ image, title, text }, i) => (
            <div
              key={title}
              className={`flex items-start gap-4 py-5 border-t border-border ${
                i === items.length - 1 ? "border-b" : ""
              }`}
            >

              <div className="shrink-0 relative w-[52px] h-[52px] rounded-full overflow-hidden">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="52px"
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="h3 mb-1">
                  {title}
                </h3>

                <p className="text-muted text-[14px] leading-relaxed">
                  {text}
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  )
}
