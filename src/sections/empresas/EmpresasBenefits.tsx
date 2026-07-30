import { Building2, Gift } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const CARDS = [
  {
    icon: Building2,
    title: "Para tu empresa",
    items: ["Fácil de organizar", "Entrega física o digital", "Nosotros gestionamos las reservas"],
  },
  {
    icon: Gift,
    title: "Para quien recibe",
    items: ["Elige su experiencia", "Cuando quiera", "Vive un momento inolvidable"],
  },
] as const;

export default function EmpresasBenefits() {
  return (
    <section className="bg-white py-24 md:py-28">

      <div className="max-w-5xl mx-auto px-6">

        <Reveal>
          <h2 className="text-3xl md:text-4xl font-semibold text-center tracking-[-0.01em] mb-16">
            Un solo regalo.<br />Miles de gustos.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">

          {CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={index * 120}>
                <div className="h-full bg-[#F7F7F7] p-10 rounded-2xl shadow-[0_8px_22px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] hover:-translate-y-[2px] transition-all duration-300">
                  <Icon size={40} strokeWidth={1.5} className="text-primary mb-6" />
                  <h3 className="font-semibold text-xl mb-5">
                    {card.title}
                  </h3>
                  <ul className="space-y-3 text-[#6B6B6B]">
                    {card.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}

        </div>

      </div>

    </section>
  );
}
