export default function Occasions() {

  const occasions = [
    {
      name: "Cumpleaños",
      subtitle: "Un regalo que no se olvida",
      image: "/images/occasions/cumpleanos.jpg",
    },
    {
      name: "Aniversario",
      subtitle: "Un momento especial para dos",
      image: "/images/occasions/aniversario.jpg",
    },
    {
      name: "Agradecimiento",
      subtitle: "Para decir gracias de una forma única",
      image: "/images/occasions/agradecimiento.jpg",
    },
    {
      name: "Matrimonio",
      subtitle: "Para celebrar el amor",
      image: "/images/occasions/boda.jpg",
    },
    {
      name: "Para dos",
      subtitle: "Experiencias para compartir",
      image: "/images/occasions/pareja.jpg",
    },
    {
      name: "Regalo Empresarial",
      subtitle: "Para agradecer y reconocer",
      image: "/images/occasions/empresarial.jpg",
    },
  ];

  return (
    <section className="bg-white py-3">

      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-3xl font-semibold text-center mb-3">
          Un regalo para cualquier ocasión
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          {occasions.map((item) => (
            <div
              key={item.name}
              tabIndex={0}
              className="relative rounded-lg overflow-hidden group cursor-pointer focus:outline-none"
            >

              <img
                src={item.image}
                alt={item.name}
                className="w-full h-[190px] object-cover transition duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition duration-300 group-hover:from-black/85" />

              <div className="absolute bottom-3 left-3 right-3 text-white">

                <h3 className="text-base font-semibold transition-transform duration-300
                  group-hover:-translate-y-4
                  group-focus:-translate-y-4">
                  {item.name}
                </h3>

                <p className="text-xs mt-[2px] opacity-0 transition-all duration-300
                  group-hover:opacity-100
                  group-focus:opacity-100">
                  {item.subtitle}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}