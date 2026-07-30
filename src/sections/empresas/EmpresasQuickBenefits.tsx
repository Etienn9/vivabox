import { Package, Truck, Sparkles, CalendarCheck } from "lucide-react";

const ITEMS = [
  { icon: Package, text: "Pedidos pequeños o grandes" },
  { icon: Truck, text: "Entrega física o digital" },
  { icon: Sparkles, text: "Personalización para empresas" },
  { icon: CalendarCheck, text: "Nosotros gestionamos las reservas" },
] as const;

export default function EmpresasQuickBenefits() {
  return (
    <div className="bg-surface border-y-2 border-[#3A2E22]">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
        {ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex flex-col items-center text-center gap-2.5">
              <Icon size={26} strokeWidth={1.5} className="text-primary" />
              <span className="text-ink text-[13px] sm:text-sm font-medium leading-snug">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
