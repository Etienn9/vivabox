"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { getExperiencesPreview } from "@/services/experiences";
import ExperienceModal from "@/components/ExperienceModal";
import type { Experience } from "@/types/experience";

export default function ExperiencesPreview() {

  const [experiencesPreview, setExperiencesPreview] = useState<Experience[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    async function loadExperiences() {
      try {
        const data = await getExperiencesPreview();
        if (mounted) {
          setExperiencesPreview(data || []);
        }
      } catch (error) {
        console.error("Error loading experiences:", error);
        if (mounted) {
          setExperiencesPreview([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadExperiences();

    return () => {
      mounted = false;
    };
  }, []);

  // reset scroll when data loads
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [experiencesPreview]);

  const categoryBadge: Record<string,string> = {
    gastronomia: "bg-orange-100 text-orange-600",
    bienestar: "bg-blue-100 text-blue-600",
    aventura: "bg-red-100 text-red-600",
    cultura: "bg-purple-100 text-purple-600",
    estancias: "bg-green-100 text-green-600",
  };

  const categoryBar: Record<string,string> = {
    gastronomia: "bg-orange-500",
    bienestar: "bg-blue-500",
    aventura: "bg-red-500",
    cultura: "bg-purple-500",
    estancias: "bg-green-500",
  };

  return (
    <section id="experiencias" className="py-3">

      <div className="max-w-[1200px] mx-auto px-6">

        <div className="mb-6">
          <h2 className="text-[36px] font-semibold mb-1">
            Algunas experiencias disponibles
          </h2>
          <p className="text-[#6B6B6B]">
            Ejemplos de experiencias en Bogotá y Cundinamarca.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-sm text-[#6B6B6B]">
            Cargando experiencias...
          </div>
        )}

        {/* SCROLL CONTAINER */}
        {!loading && (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scroll-pl-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
          >

            {experiencesPreview.map((exp, index) => {

              const categoryKey = exp.category?.toLowerCase() || "";

              const badgeColor =
                categoryBadge[categoryKey] || "bg-gray-100 text-gray-600";

              const barColor =
                categoryBar[categoryKey] || "bg-gray-300";

              const imageSrc =
                exp.image?.includes("images.pexels.com") ||
                exp.image?.includes("images.unsplash.com")
                  ? exp.image
                  : "/images/experience-placeholder.jpg";

              return (

                <div
                  key={index}
                  onClick={() => setSelectedExperience(exp)}
                  className="group cursor-pointer snap-start min-w-[260px] bg-white rounded-[18px] shadow-[0_8px_22px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] hover:-translate-y-[2px] transition-all duration-300 overflow-hidden"
                >

                  {/* IMAGE */}
                  <div className="relative w-full h-[160px] overflow-hidden rounded-t-[18px]">

                    <Image
                      src={imageSrc}
                      alt={exp.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    <div
                      className={`absolute left-0 top-0 bottom-0 w-[6px] z-10 ${barColor}`}
                    />

                  </div>

                  {/* CONTENT */}
                  <div className="p-4">

                    <span
                      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-2 ${badgeColor}`}
                    >
                      {exp.category}
                    </span>

                    <h3 className="font-semibold mb-[2px]">
                      {exp.title}
                    </h3>

                    {exp.city && (
                      <p className="text-sm text-[#6B6B6B]">
                        {exp.city}
                      </p>
                    )}

                    {exp.duration && (
                      <p className="text-xs text-gray-500 mt-[2px]">
                        {exp.duration} min
                      </p>
                    )}

                  </div>

                </div>

              );
            })}

            {/* LAST CARD */}
            <div className="group snap-start min-w-[260px] bg-white rounded-[18px] shadow-[0_8px_22px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] hover:-translate-y-[2px] transition-all duration-300 overflow-hidden">

              <div className="relative w-full h-[160px] overflow-hidden rounded-t-[18px] bg-gradient-to-br from-[#fff4ec] to-[#f7f7f7] flex items-center justify-center">

                <Image
                  src="/icons/logo.png"
                  alt="Vivabox"
                  width={82}
                  height={82}
                  className="opacity-100"
                />

                <div className="absolute left-0 top-0 bottom-0 w-[6px] flex flex-col z-10">
                  <div className="flex-1 bg-orange-500"></div>
                  <div className="flex-1 bg-blue-500"></div>
                  <div className="flex-1 bg-red-500"></div>
                  <div className="flex-1 bg-purple-500"></div>
                  <div className="flex-1 bg-green-500"></div>
                </div>

              </div>

              <div className="p-4 text-center">

                <h3 className="font-semibold mb-1">
                  Y muchas más experiencias
                </h3>

                <p className="text-sm text-[#6B6B6B]">
                  Nuestra selección evoluciona constantemente.
                </p>

              </div>

            </div>

          </div>
        )}

        <p className="text-sm text-[#6B6B6B] mt-3">
          Más de 350 experiencias disponibles.
        </p>

      </div>

      <ExperienceModal
        experience={selectedExperience}
        onClose={() => setSelectedExperience(null)}
      />

    </section>
  );
}