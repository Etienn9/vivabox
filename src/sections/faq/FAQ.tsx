"use client";

import { useState } from "react";
import {
  HelpCircle,
  Heart,
  Clock,
  RefreshCw,
  MapPin,
  ChevronDown
} from "lucide-react";

export default function FAQ() {

  const faqs = [
    {
      icon: HelpCircle,
      question: "¿Cómo funciona Vivabox?",
      answer:
        "Regalas una Vivabox. La persona activa el código online y elige la experiencia que más le guste.",
    },
    {
      icon: Heart,
      question: "¿La persona puede elegir la experiencia que quiera?",
      answer:
        "Sí. La persona que recibe la Vivabox puede elegir libremente entre todas las experiencias disponibles en su caja.",
    },
    {
      icon: Clock,
      question: "¿Cuánto tiempo es válida?",
      answer:
        "Tienes tiempo de sobra para usar tu Vivabox. Podrás elegir la experiencia y reservar cuando quieras dentro del periodo de validez.",
    },
    {
      icon: RefreshCw,
      question: "¿Qué pasa si una experiencia no está disponible?",
      answer:
        "No pasa nada. Siempre hay muchas otras experiencias disponibles para elegir.",
    },
    {
      icon: MapPin,
      question: "¿Dónde se pueden usar las experiencias?",
      answer:
        "Las experiencias están disponibles en Bogotá y Cundinamarca. Seguimos ampliando nuevas ciudades.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#F7F7F7] py-3">

      <div className="container max-w-[760px]">

        <h2 className="text-3xl font-semibold text-center mb-8">
          Preguntas frecuentes
        </h2>

        <div className="divide-y">

          {faqs.map((faq, i) => {

            const Icon = faq.icon;
            const isOpen = open === i;

            return (

              <div
                key={i}
                className="py-5 transition-colors hover:bg-[#fafafa]"
              >

                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex items-center justify-between w-full text-left group"
                >

                  <div className="flex items-center gap-3">

                    <Icon
                      size={18}
                      className="text-[#fe842f]"
                    />

                    <span className="font-medium">
                      {faq.question}
                    </span>

                  </div>

                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#fe842f]" : ""
                    }`}
                  />

                </button>

                {/* ANSWER */}

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 mt-3" : "max-h-0"
                  }`}
                >

                  <p className="text-[#6B6B6B] text-sm leading-relaxed pl-7">
                    {faq.answer}
                  </p>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}