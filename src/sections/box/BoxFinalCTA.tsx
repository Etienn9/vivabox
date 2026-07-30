import Image from "next/image"
import { formatPrice } from "@/utils/formatPrice"

type Props = {
  price: number
  slug: string
}

export default function BoxFinalCTA({ price, slug }: Props) {
  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 bg-ink">

      <div className="relative w-full h-[380px] md:h-[480px]">
        <Image
          src="/images/final-cta/persona-regalando-vivabox.png"
          alt="Persona recibiendo una Vivabox"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-black/10 to-transparent" />
      </div>

      <div className="max-w-[500px] mx-auto px-6 py-12 md:py-14 text-center">

        <div className="text-white text-[32px] md:text-[38px] font-semibold mb-6">
          ${formatPrice(price)} COP
        </div>

        <a
          href={`/checkout/${slug}`}
          aria-label="Comprar ahora"
          className="inline-flex items-center justify-center h-14 px-12 rounded-xl bg-primary text-white text-[17px] font-semibold transition hover:bg-primary-hover shadow-[0_10px_35px_rgba(254,132,47,.35)]"
        >
          Comprar ahora
        </a>

      </div>

    </section>
  )
}
