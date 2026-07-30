"use client";

import { X, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLOR,
  CATEGORY_DESCRIPTIONS,
  DEFAULT_CATEGORY_DESCRIPTION,
  CATEGORY_WHY_VIVABOX,
  DEFAULT_WHY_VIVABOX,
  getExperienceHighlights,
  formatDuration,
} from "@/data/categories";

type Experience = {
  title: string
  city?: string
  category: string
  image?: string
  shortDescription?: string
  duration?: string
  ambiance?: string
  environment?: string
  engagement?: string
  vivanote?: string
}

type Props = {
  experience: Experience | null
  onClose: () => void
}

export default function ExperienceModal({ experience, onClose }: Props) {

  if (!experience) return null

  const categoryKey = experience.category?.toLowerCase() || ""

  const categoryColor = CATEGORY_COLORS[categoryKey] || DEFAULT_CATEGORY_COLOR

  const barColor = categoryColor.dot
  const badgeColor = `${categoryColor.bg} ${categoryColor.text}`

  const description = CATEGORY_DESCRIPTIONS[categoryKey] || DEFAULT_CATEGORY_DESCRIPTION
  const highlights = getExperienceHighlights(experience)
  const whyVivabox = experience.vivanote?.trim() || CATEGORY_WHY_VIVABOX[categoryKey] || DEFAULT_WHY_VIVABOX
  const duration = formatDuration(experience.duration)

  const imageSrc =
    experience.image?.includes("images.pexels.com") ||
    experience.image?.includes("images.unsplash.com")
      ? experience.image
      : "/images/box-includes/vivabox-caja-regalo.png"

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
          <X size={18} strokeWidth={1.5}/>
        </button>

        {/* image */}
        <div className="relative w-full h-[160px] overflow-hidden">

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
        <div className="p-5 sm:p-6">

          <h3 className="text-lg font-semibold mb-0.5">
            {experience.title}
          </h3>

          {/* PRACTICAL INFO — secondary, single line */}
          {(experience.city || duration) && (
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
              {experience.city && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} strokeWidth={1.5} />
                  {experience.city}
                </span>
              )}
              {duration && (
                <span className="flex items-center gap-1">
                  <Clock size={12} strokeWidth={1.5} />
                  {duration}
                </span>
              )}
            </div>
          )}

          {/* HIGHLIGHTS — unique to this experience, scannable at a glance */}
          <div className="flex flex-wrap gap-2 mb-3">
            {highlights.map((highlight, i) => {
              const Icon = highlight.icon
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-ink"
                >
                  <Icon size={13} className="text-primary" strokeWidth={1.5} />
                  {highlight.label}
                </span>
              )
            })}
          </div>

          {/* EMOTIONAL SENTENCE */}
          <p className="text-sm text-gray-600 mb-3">
            {description}
          </p>

          {/* WHY VIVABOX — curated editorial block */}
          <div className="flex items-center gap-3 bg-surface rounded-xl p-3">

            <Image src="/icons/logo.png" alt="Vivabox" width={26} height={26} className="shrink-0" />

            <div className="w-px self-stretch bg-ink/10 shrink-0" />

            <div>
              <p className="text-xs font-semibold text-ink mb-0.5">
                Elegida por Vivabox
              </p>
              <p className="text-xs text-muted leading-snug">
                {whyVivabox}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}