export default function EmpresasSolution() {
  return (
    <section className="bg-[#F7F7F7] py-16">

      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-3xl font-semibold text-center mb-10">
          Con Vivabox es mucho más fácil
        </h2>

        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-3">
              Para la empresa
            </h3>

            <ul className="space-y-2 text-[#6B6B6B]">
              <li>• No tiene que elegir una experiencia específica</li>
              <li>• Entrega física o digital</li>
              <li>• Pedidos pequeños o grandes</li>
              <li>• Descuentos por volumen</li>
              <li>• Nosotros coordinamos las reservas</li>
              <li>• Fácil de organizar</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-3">
              Para quien recibe el regalo
            </h3>

            <ul className="space-y-2 text-[#6B6B6B]">
              <li>• Puede elegir la experiencia</li>
              <li>• Lo usa cuando quiera</li>
              <li>• Vive algo diferente</li>
              <li>• Es un regalo memorable</li>
              <li>• Es una experiencia, no un objeto</li>
              <li>• Siempre es un buen regalo</li>
            </ul>
          </div>

        </div>

        <p className="text-center text-lg mt-12">
          La empresa regala la Vivabox.  
          La persona elige la experiencia.  
          Nosotros coordinamos todo.
        </p>

      </div>

    </section>
  );
}