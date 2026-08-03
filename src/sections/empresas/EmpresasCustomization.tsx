import Image from "next/image";
import { Palette, Tag, Mail } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import BrandRibbon from "@/components/ui/BrandRibbon";

const CHIPS = [
  { icon: Palette, text: "Colores corporativos" },
  { icon: Tag, text: "Logo de la empresa" },
  { icon: Mail, text: "Mensaje personalizado" },
] as const;

export default function EmpresasCustomization() {
  return (
    <section className="bg-ink">

      <div className="max-w-6xl mx-auto px-6 py-24 md:py-28 grid md:grid-cols-2 items-center gap-14 md:gap-16">

        {/* TEXT */}
        <Reveal>
          <div className="text-white">

            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.01em] mb-4">
              Personaliza tu Vivabox
            </h2>

            <p className="text-white/70 text-lg leading-snug mb-6">
              Tu marca.<br />Tus colores.<br />Tu mensaje.
            </p>

            <p className="text-white/60 leading-relaxed mb-10 max-w-[440px]">
              Podemos personalizar la presentación de Vivabox para que el
              regalo refleje la identidad de tu empresa y haga la experiencia
              aún más especial.
            </p>

            <div className="flex flex-wrap gap-3">
              {CHIPS.map((chip) => {
                const Icon = chip.icon;
                return (
                  <div
                    key={chip.text}
                    className="flex items-center gap-2 bg-white/10 rounded-full pl-3 pr-4 py-2"
                  >
                    <Icon size={16} strokeWidth={1.5} className="text-primary" />
                    <span className="text-white text-sm font-medium">
                      {chip.text}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </Reveal>

        {/* MOCKUP */}
        <Reveal delay={120}>
          <div className="relative w-full aspect-square max-w-[440px] mx-auto">

            <div
              className="absolute left-[10%] top-[6%] w-[80%] aspect-square"
              style={{ transform: "perspective(1400px) rotateX(6deg) rotateY(-8deg) rotate(-2deg)" }}
            >
              <Image
                src="/images/box-includes/vivabox-caja-regalo.png"
                alt="Vivabox personalizable para empresas"
                fill
                sizes="(min-width: 440px) 352px, 80vw"
                className="object-contain drop-shadow-[18px_10px_20px_rgba(0,0,0,0.45)]"
              />
            </div>

            {/* CALLOUT — logo */}
            <div className="absolute right-[2%] top-[10%] bg-white/95 rounded-xl px-3 py-2 shadow-lg">
              <span className="text-ink text-xs font-semibold">Logo aquí</span>
            </div>

            {/* CALLOUT — colors */}
            <div className="absolute left-0 top-[48%] flex items-center gap-1.5 bg-white/95 rounded-xl px-3 py-2 shadow-lg">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent-blue" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
              <span className="text-ink text-xs font-semibold ml-1">Tus colores</span>
            </div>

            {/* CALLOUT — message */}
            <div className="absolute right-[6%] bottom-[6%] bg-white/95 rounded-xl px-3 py-2 shadow-lg">
              <span className="text-ink text-xs font-semibold">Mensaje personal</span>
            </div>

          </div>
        </Reveal>

      </div>

      <BrandRibbon />

    </section>
  );
}
