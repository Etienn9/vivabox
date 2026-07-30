import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-white py-16">

      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-4 gap-10">

          <div>
            <h3 className="font-semibold mb-4">
              Vivabox
            </h3>

            <p className="text-gray-400 text-sm">
              La caja de regalo donde quien la recibe elige la experiencia.
            </p>
          </div>

          <nav aria-label="Footer" className="contents">

            <div>
              <h4 className="font-semibold mb-4">
                Vivabox
              </h4>

              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/#como-funciona" aria-label="Cómo funciona Vivabox">Cómo funciona</Link>
                </li>
                <li>
                  <Link href="/#cajas" aria-label="Caja de regalo Vivabox">Caja de regalo</Link>
                </li>
                <li>
                  <Link href="/#experiencias" aria-label="Experiencias Vivabox">Experiencias</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">
                Para empresas
              </h4>

              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/proximamente" aria-label="Regalos empresariales Vivabox">Regalos empresariales</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">
                Ayuda
              </h4>

              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/proximamente" aria-label="Activar Vivabox">Activar Vivabox</Link>
                </li>
                <li>
                  <Link href="/#faq" aria-label="Preguntas frecuentes Vivabox">Preguntas frecuentes</Link>
                </li>
                <li>
                  <a
                    href="https://wa.me/573142590291"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contacto Vivabox"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

          </nav>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center">
          <p className="text-xs text-gray-500 mb-2">
            Bogotá • Cundinamarca
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Vivabox
          </p>
        </div>

      </div>

    </footer>
  );
}