import { Building2, Gift, Truck, MousePointerClick, CalendarCheck } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import BrandRibbon from "@/components/ui/BrandRibbon";

const STEPS = [
  { icon: Building2, text: "Empresa" },
  { icon: Gift, text: "Elige una Vivabox" },
  { icon: Truck, text: "Entrega física o digital" },
  { icon: MousePointerClick, text: "Cada persona elige" },
  { icon: CalendarCheck, text: "Vivabox gestiona la reserva" },
] as const;

export default function EmpresasHowItWorks() {
  return (
    <section id="como-funciona-empresas" className="bg-ink">

      <div className="max-w-6xl mx-auto px-6 py-24 md:py-28">

        <Reveal>
          <h2 className="text-3xl md:text-4xl font-semibold text-center tracking-[-0.01em] text-white mb-20">
            Cómo funciona
          </h2>
        </Reveal>

        {/* DESKTOP — horizontal timeline */}
        <Reveal className="hidden md:block" delay={100}>
          <div className="relative">

            <div className="absolute left-0 right-0 top-7 h-px bg-white/15" />

            <div className="relative grid grid-cols-5">
              {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.text} className="flex flex-col items-center text-center px-2">
                    <div className="h-14 w-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center mb-5">
                      <Icon size={22} strokeWidth={1.5} className="text-primary" />
                    </div>
                    <span className="text-white/80 text-sm font-medium leading-snug max-w-[140px]">
                      {step.text}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </Reveal>

        {/* MOBILE — vertical timeline */}
        <div className="md:hidden relative pl-7">

          <div className="absolute left-[27px] top-2 bottom-2 w-px bg-white/15" />

          <div className="space-y-10">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.text} delay={index * 80}>
                  <div className="relative flex items-center gap-4">
                    <div className="relative z-10 h-14 w-14 shrink-0 rounded-full bg-ink border border-white/15 flex items-center justify-center -ml-7">
                      <Icon size={20} strokeWidth={1.5} className="text-primary" />
                    </div>
                    <span className="text-white/80 text-[15px] font-medium leading-snug">
                      {step.text}
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>

        </div>

      </div>

      <BrandRibbon />

    </section>
  );
}
