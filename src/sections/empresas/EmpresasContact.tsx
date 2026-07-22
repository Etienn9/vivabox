export default function EmpresasContact() {
  return (
    <section id="contacto-empresas" className="bg-[#fff4ec] py-16">

      <div className="max-w-4xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-semibold mb-4">
          Contacto para empresas
        </h2>

        <p className="text-[#6B6B6B] mb-10">
          Si tu empresa quiere regalar Vivabox, escríbenos y te ayudamos a organizar todo.
        </p>

        <div className="bg-white p-8 rounded-xl shadow-sm">

          <form className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Nombre"
              className="border border-[#E8E8E8] rounded-lg px-4 py-3"
            />

            <input
              type="text"
              placeholder="Empresa"
              className="border border-[#E8E8E8] rounded-lg px-4 py-3"
            />

            <input
              type="email"
              placeholder="Email"
              className="border border-[#E8E8E8] rounded-lg px-4 py-3"
            />

            <input
              type="tel"
              placeholder="Teléfono"
              className="border border-[#E8E8E8] rounded-lg px-4 py-3"
            />

            <input
              type="text"
              placeholder="Cantidad aproximada de cajas"
              className="border border-[#E8E8E8] rounded-lg px-4 py-3 md:col-span-2"
            />

            <textarea
              placeholder="Mensaje"
              className="border border-[#E8E8E8] rounded-lg px-4 py-3 md:col-span-2"
              rows={4}
            />

            <button
              type="submit"
              className="md:col-span-2 h-12 rounded-xl bg-[#fe842f] text-white font-semibold hover:brightness-95 transition"
            >
              Enviar solicitud
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}