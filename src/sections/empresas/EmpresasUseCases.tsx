export default function EmpresasUseCases() {
  return (
    <section className="bg-white py-16">

      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-3xl font-semibold text-center mb-12">
          Para qué usan Vivabox las empresas
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-[#F7F7F7] p-6 rounded-xl">
            <h3 className="font-semibold mb-4">
              Para empleados
            </h3>

            <ul className="space-y-2 text-[#6B6B6B]">
              <li>• Cumpleaños</li>
              <li>• Reconocimiento</li>
              <li>• Incentivos</li>
              <li>• Navidad</li>
              <li>• Bienvenida nuevos empleados</li>
              <li>• Premios internos</li>
            </ul>
          </div>

          <div className="bg-[#F7F7F7] p-6 rounded-xl">
            <h3 className="font-semibold mb-4">
              Para clientes
            </h3>

            <ul className="space-y-2 text-[#6B6B6B]">
              <li>• Regalos de agradecimiento</li>
              <li>• Fidelización</li>
              <li>• Regalos de fin de año</li>
              <li>• Cierre de proyectos</li>
              <li>• Clientes importantes</li>
            </ul>
          </div>

          <div className="bg-[#F7F7F7] p-6 rounded-xl">
            <h3 className="font-semibold mb-4">
              Para eventos
            </h3>

            <ul className="space-y-2 text-[#6B6B6B]">
              <li>• Eventos empresariales</li>
              <li>• Conferencias</li>
              <li>• Lanzamientos</li>
              <li>• Sorteos</li>
              <li>• Activaciones de marca</li>
            </ul>
          </div>

        </div>

      </div>

    </section>
  );
}