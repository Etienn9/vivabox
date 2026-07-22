"use client"

import { boxes } from "../../data/boxes"
import BoxCard from "../../components/BoxCard"
import Carousel from "../../components/Carousel"

export default function Boxes() {
  return (
    <section className="section bg-white">

      <div className="container">

        <h2 className="h2 text-center mb-6">
          Elige la Vivabox perfecta
        </h2>

        <p className="text-center text-[#6B6B6B] mb-28">
          3 niveles de experiencias para acertar siempre.
        </p>

        {/* MOBILE */}

        <div className="md:hidden">
          <Carousel initialIndex={1} cardWidth={300}>
            {boxes.map((box) => (
              <BoxCard key={box.slug} box={box} />
            ))}
          </Carousel>
        </div>

        {/* DESKTOP */}

        <div className="hidden md:grid grid-cols-3 gap-14 max-w-[1050px] mx-auto">
          {boxes.map((box) => (
            <BoxCard key={box.slug} box={box} />
          ))}
        </div>

      </div>

    </section>
  )
}