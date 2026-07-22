"use client";

import { useEffect, useRef } from "react";
import {
  Zap,
  Calendar,
  RefreshCw,
  Clock,
  MapPin,
  Truck
} from "lucide-react";

export default function BenefitsBar() {

  const containerRef = useRef<HTMLDivElement>(null);

  const items = [
    { icon: Truck, text: "Envío gratis" },
    { icon: Zap, text: "E-box instantánea" },
    { icon: Calendar, text: "Reserva fácil" },
    { icon: RefreshCw, text: "Cambio gratuito" },
    { icon: Clock, text: "12 meses" },
    { icon: MapPin, text: "+350 experiencias" },
  ];

  const loopItems = [...items, ...items, ...items];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const itemWidth = container.scrollWidth / 3;

    // start in the middle
    container.scrollLeft = itemWidth;

    let paused = false;

    const autoScroll = () => {
      if (!paused) {
        container.scrollLeft += 0.35;
      }
      requestAnimationFrame(autoScroll);
    };

    requestAnimationFrame(autoScroll);

    const pause = () => (paused = true);
    const resume = () => (paused = false);

    container.addEventListener("touchstart", pause);
    container.addEventListener("touchend", resume);
    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);

    const handleScroll = () => {

      if (container.scrollLeft <= 0) {
        container.scrollLeft = itemWidth;
      }

      if (container.scrollLeft >= itemWidth * 2) {
        container.scrollLeft = itemWidth;
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("touchstart", pause);
      container.removeEventListener("touchend", resume);
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
    };

  }, []);

  return (
    <div className="bg-[#F7F7F7] border-y">

      <div className="max-w-7xl mx-auto">

        {/* MOBILE */}
        <div
          ref={containerRef}
          className="md:hidden flex gap-8 py-3 px-4 overflow-x-auto no-scrollbar"
        >
          {loopItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-600 font-medium"
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                  className="text-[#fe842f]"
                />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex justify-between py-3 px-6">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600 font-medium"
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                  className="text-[#fe842f]"
                />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}