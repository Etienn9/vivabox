import Image from "next/image"

export default function BoxOccasions() {

  const occasions = [
    {
      title: "Cumpleaños",
      image: "/images/occasions/cumpleanos.jpg",
    },
    {
      title: "Aniversario",
      image: "/images/occasions/aniversario.jpg",
    },
    {
      title: "Regalo Empresarial",
      image: "/images/occasions/empresarial.jpg",
    },
    {
      title: "Matrimonio",
      image: "/images/occasions/boda.jpg",
    },
  ]

  return (

    <section className="py-5 bg-white">

      <div className="max-w-[1100px] mx-auto px-6">

        <h2 className="text-[34px] font-semibold text-center mb-10">
          Una Vivabox para cada ocasión
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          {occasions.map((item, index) => (

            <div
              key={index}
              className="relative rounded-[18px] overflow-hidden group cursor-pointer"
            >

              <div className="relative h-[200px]">

                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

              </div>

              <div className="absolute inset-0 bg-black/20 flex items-end p-4">

                <h3 className="text-white font-semibold text-[18px]">
                  {item.title}
                </h3>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  )
}