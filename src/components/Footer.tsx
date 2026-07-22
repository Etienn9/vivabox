import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">

      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-4 gap-10">

          <div>
            <h3 className="font-semibold mb-4">
              Vivabox
            </h3>

            <p className="text-gray-400 text-sm">
              El regalo que siempre acierta.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              Vivabox
            </h4>

            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/#como-funciona">Cómo funciona</Link>
              </li>
              <li>
                <Link href="/#cajas">Cajas</Link>
              </li>
              <li>
                <Link href="/#experiencias">Experiencias</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              Para empresas
            </h4>

            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/empresas">Regalos para empresas</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              Ayuda
            </h4>

            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/activar">Activar Vivabox</Link>
              </li>
              <li>
                <Link href="/#faq">Preguntas frecuentes</Link>
              </li>
              <li>
                <a
                  href="https://wa.me/573142590291"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Vivabox
        </div>

      </div>

    </footer>
  );
}