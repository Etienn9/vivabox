import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

export default function StoryCTA() {
  return (
    <section className="bg-[#fff4ec] py-20 md:py-[120px]">

      <div className="max-w-[1040px] mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

          <Reveal duration={400}>
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
              <Image
                src="/images/final-cta/persona-regalando-vivabox.png"
                alt="Alguien recibiendo una Vivabox de regalo"
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal duration={400} delay={100}>
            <div className="text-center md:text-left">
              <h2 className="h2 mb-4">
                Descubre Vivabox
              </h2>

              <p className="text-lg text-muted leading-relaxed mb-8">
                Un regalo. Muchas experiencias. El placer de elegir.
              </p>

              <a
                href="/#incluye"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-primary text-white font-semibold hover:brightness-95 transition"
              >
                Ver las Vivabox
              </a>
            </div>
          </Reveal>

        </div>

      </div>

    </section>
  );
}
