export default function EmpresasOptions() {
  return (
    <section className="bg-white py-16">

      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-3xl font-semibold text-center mb-12">
          Opciones para empresas
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-[#F7F7F7] p-6 rounded-xl">
            <h3 className="font-semibold mb-4">
              Pedidos corporativos
            </h3>

            <ul className="space-y-2 text-[#6B6B6B]">
              <li>• Pedidos desde pocas hasta muchas cajas</li>
              <li>• Descuentos por volumen</li>
              <li>• Entrega física o digital</li>
              <li>• Envíos a una dirección o a varias</li>
              <li>• Facturación para empresa</li>
            </ul>
          </div>

          <div className="bg-[#F7F7F7] p-6 rounded-xl">
            <h3 className="font-semibold mb-4">
              Personalización
            </h3>

            <ul className="space-y-2 text-[#6B6B6B]">
              <li>• Mensaje personalizado</li>
              <li>• Posibilidad de incluir logo</li>
              <li>• E-box personalizada</li>
              <li>• Asesoría para elegir Vivabox</li>
              <li>• Atención directa para empresas</li>
            </ul>
          </div>

        </div>

      </div>

    </section>
  );
}