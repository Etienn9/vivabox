import { Users, HeartHandshake, PartyPopper } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const CARDS = [
  { icon: Users, title: "Empleados", items: ["Cumpleaños", "Reconocimientos", "Incentivos"] },
  { icon: HeartHandshake, title: "Clientes", items: ["Agradecimientos", "Fidelización", "Cierre de proyectos"] },
  { icon: PartyPopper, title: "Eventos", items: ["Conferencias", "Lanzamientos", "Activaciones"] },
] as const;

export default function EmpresasUseCases() {
  return (
    <section className="bg-[#F7F7F7] py-24 md:py-28">

      <div className="max-w-6xl mx-auto px-6">

        <Reveal>
          <h2 className="text-3xl md:text-4xl font-semibold text-center tracking-[-0.01em] mb-16">
            Ideal para
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">

          {CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={index * 100}>
                <div className="h-full bg-white p-10 rounded-2xl shadow-[0_8px_22px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] hover:-translate-y-[2px] transition-all duration-300 text-center">
                  <Icon size={40} strokeWidth={1.5} className="text-primary mx-auto mb-6" />
                  <h3 className="font-semibold text-xl mb-5">
                    {card.title}
                  </h3>
                  <ul className="space-y-2 text-[#6B6B6B]">
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
