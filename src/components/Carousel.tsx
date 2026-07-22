"use client"

import { useRef, useEffect, useState, ReactNode } from "react"

export default function Carousel({
  children,
  cardWidth = 300,
  initialIndex = 1,
}: {
  children: ReactNode[]
  cardWidth?: number
  initialIndex?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(initialIndex)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const childrenArray = Array.from(container.children)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = childrenArray.indexOf(entry.target as Element)
            setActive(index)
          }
        })
      },
      {
        root: container,
        threshold: 0.65,
      }
    )

    childrenArray.forEach((child) => observer.observe(child))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const card = container.children[initialIndex] as HTMLElement

    const center =
      card.offsetLeft - container.clientWidth / 2 + card.clientWidth / 2

    container.scrollLeft = center

    setTimeout(() => {
      container.scrollTo({ left: center + 12, behavior: "smooth" })
      setTimeout(() => {
        container.scrollTo({ left: center, behavior: "smooth" })
      }, 350)
    }, 500)
  }, [initialIndex])

  return (
    <div className="relative">

      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar py-17 min-h-[460px]"
        style={{
          paddingLeft: `calc((100vw - ${cardWidth}px)/2)`,
          paddingRight: `calc((100vw - ${cardWidth}px)/2)`,
        }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className={`snap-center shrink-0 transition-all duration-500 ${
              i === active
                ? "scale-[1.08] z-20"
                : "scale-[0.92] opacity-70"
            }`}
            style={{ width: `${cardWidth}px` }}
          >
            {child}
          </div>
        ))}
      </div>

    </div>
  )
}