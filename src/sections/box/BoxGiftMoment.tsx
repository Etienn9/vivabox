export default function BoxGiftMoment() {
  return (
    <section className="py-6 bg-[#FAFAF8]">

      <div className="max-w-[900px] mx-auto px-6 text-center">

        {/* TITLE */}

        <h2 className="text-[30px] md:text-[32px] font-semibold text-[#1C1C1C] mb-6">
          Un regalo que se vive dos veces
        </h2>

        {/* CONTENT */}

        <div className="grid md:grid-cols-2 gap-4 max-w-[640px] mx-auto">

          <div>
            <p className="text-[16px] text-[#1C1C1C] font-medium">
              Al abrir la caja
            </p>
            <p className="text-[14px] text-[#6B6B6B] mt-1">
              La sorpresa, el momento, la emoción.
            </p>
          </div>

          <div>
            <p className="text-[16px] text-[#1C1C1C] font-medium">
              Al vivir la experiencia
            </p>
            <p className="text-[14px] text-[#6B6B6B] mt-1">
              Un plan real que se disfruta de verdad.
            </p>
          </div>

        </div>

      </div>

    </section>
  )
}