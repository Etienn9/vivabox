"use client";

import { useEffect, useRef } from "react";
import { Package, Truck, Palette, CalendarCheck } from "lucide-react";

const ITEMS = [
  { icon: Package, text: "Pedidos pequeños o grandes" },
  { icon: Truck, text: "Entrega física o digital" },
  { icon: Palette, text: "Personalización para empresas" },
  { icon: CalendarCheck, text: "Nosotros gestionamos las reservas" },
] as const;

export default function EmpresasQuickBenefits() {

  const containerRef = useRef<HTMLDivElement>(null);
  const loopItems = [...ITEMS, ...ITEMS, ...ITEMS];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const itemWidth = container.scrollWidth / 3;

    // internal floating-point accumulator — the DOM scrollLeft rounds to
    // whole pixels, so reading it back every frame loses sub-pixel deltas
    // and slow speeds appear to freeze
    let pos = itemWidth;
    container.scrollLeft = pos;

    let paused = false;
    let rafId: number;

    const autoScroll = () => {
      if (!paused) {
        pos += 0.12;

        if (pos >= itemWidth * 2) {
          pos -= itemWidth;
        }

        container.scrollLeft = pos;
      } else {
        pos = container.scrollLeft;
      }

      rafId = requestAnimationFrame(autoScroll);
    };

    rafId = requestAnimationFrame(autoScroll);

    const pause = () => (paused = true);
    const resume = () => (paused = false);

    container.addEventListener("touchstart", pause);
    container.addEventListener("touchend", resume);
    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("touchstart", pause);
      container.removeEventListener("touchend", resume);
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
    };

  }, []);

  return (
    <div className="bg-surface border-b-2 border-[#3A2E22]">

      <div className="max-w-6xl mx-auto">

        {/* MOBILE */}
        <div
          ref={containerRef}
          className="md:hidden flex gap-8 py-4 px-4 overflow-x-auto no-scrollbar"
        >
          {loopItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2 whitespace-nowrap text-ink text-sm font-medium"
              >
                <Icon size={20} strokeWidth={1.5} className="text-primary" />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex justify-between py-5 px-6">
          {ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2 text-ink text-sm font-medium"
              >
                <Icon size={20} strokeWidth={1.5} className="text-primary" />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
