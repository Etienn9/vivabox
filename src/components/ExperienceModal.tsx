"use client";

import {
  X,
  MapPin,
  Clock,
  Tag,
  Leaf,
  Target,
  Activity
} from "lucide-react";
import Image from "next/image";

type Experience = {
  title: string
  city?: string
  category: string
  image?: string
  duration?: string
  zone?: string
  shortDescription?: string
  ambiance?: string
  idealFor?: string
  effortLevel?: string
}

type Props = {
  experience: Experience | null
  onClose: () => void
}

export default function ExperienceModal({ experience, onClose }: Props) {

  if (!experience) return null

  const categoryKey = experience.category?.toLowerCase() || ""

  const categoryBar: Record<string,string> = {
    gastronomia: "bg-orange-500",
    bienestar: "bg-blue-500",
    aventura: "bg-red-500",
    cultura: "bg-purple-500",
    estancias: "bg-green-500",
  }

  const categoryBadge: Record<string,string> = {
    gastronomia: "bg-orange-100 text-orange-700",
    bienestar: "bg-blue-100 text-blue-700",
    aventura: "bg-red-100 text-red-700",
    cultura: "bg-purple-100 text-purple-700",
    estancias: "bg-green-100 text-green-700",
  }

  const barColor = categoryBar[categoryKey] || "bg-gray-300"
  const badgeColor = categoryBadge[categoryKey] || "bg-gray-100 text-gray-700"

  const imageSrc =
    experience.image?.includes("images.pexels.com") ||
    experience.image?.includes("images.unsplash.com")
      ? experience.image
      : "/images/experience-placeholder.jpg"

  return (

    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-xl w-full rounded-2xl overflow-hidden relative shadow-xl"
      >

        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow z-20"
        >
          <X size={18}/>
        </button>

        {/* image */}
        <div className="relative w-full h-[200px] overflow-hidden">

          <Image
            src={imageSrc}
            alt={experience.title}
            fill
            className="object-cover"
          />

          {/* vertical category bar */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-[8px] ${barColor}`}
          />

          {/* category badge */}
          <div className="absolute top-4 left-4 z-10">

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}
            >
              {experience.category}
            </span>

          </div>

        </div>

        {/* content */}
        <div className="p-7">

          <h3 className="text-xl font-semibold mb-1">
            {experience.title}
          </h3>

          {experience.city && (
            <p className="text-gray-500 mb-5">
              {experience.city}
            </p>
          )}

          {/* key info grid */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm mb-6">

            {experience.zone && (
              <div className="flex items-center gap-3">
                <MapPin size={16}/>
                {experience.zone}
              </div>
            )}

            {experience.duration && (
              <div className="flex items-center gap-3">
                <Clock size={16}/>
                {experience.duration} min
              </div>
            )}

            {experience.ambiance && (
              <div className="flex items-center gap-3">
                <Leaf size={16}/>
                {experience.ambiance}
              </div>
            )}

            {experience.idealFor && (
              <div className="flex items-center gap-3">
                <Target size={16}/>
                {experience.idealFor}
              </div>
            )}

            {experience.effortLevel && (
              <div className="flex items-center gap-3">
                <Activity size={16}/>
                {experience.effortLevel}
              </div>
            )}

          </div>

          {experience.shortDescription && (
            <p className="text-sm text-gray-600 mb-6">
              {experience.shortDescription}
            </p>
          )}

          <p className="text-sm text-gray-500">
            Forma parte de la selección de experiencias Vivabox.
            Las opciones pueden variar según la caja.
          </p>

        </div>

      </div>

    </div>
  )
}