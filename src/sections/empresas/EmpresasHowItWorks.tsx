export default function EmpresasHowItWorks() {
  return (
    <section id="como-funciona-empresas" className="bg-[#F7F7F7] py-16">

      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-3xl font-semibold text-center mb-12">
          Cómo funciona Vivabox para empresas
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-semibold mb-2">1</div>
            <h3 className="font-semibold mb-2">
              La empresa elige la Vivabox
            </h3>
            <p className="text-[#6B6B6B] text-sm">
              Te ayudamos a elegir la Vivabox según tu presupuesto y cantidad.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-semibold mb-2">2</div>
            <h3 className="font-semibold mb-2">
              Entrega física o digital
            </h3>
            <p className="text-[#6B6B6B] text-sm">
              Podemos enviar las cajas o los códigos digitales a las personas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-semibold mb-2">3</div>
            <h3 className="font-semibold mb-2">
              Ellos eligen la experiencia
            </h3>
            <p className="text-[#6B6B6B] text-sm">
              La persona activa su código y reserva la experiencia.
            </p>
          </div>

        </div>

        <p className="text-center text-lg mt-12">
          Fácil para la empresa. Especial para quien recibe el regalo.
        </p>

      </div>

    </section>
  );
}