import Image from "next/image";

export default function EmpresasHero() {
  return (
    <section className="relative w-full overflow-hidden bg-ink">

      <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 items-center gap-10 md:gap-14 py-16 md:py-0 md:h-[70vh]">

        {/* TEXT */}
        <div className="text-white">

          <p className="text-white/70 text-[13px] uppercase tracking-[0.14em] mb-5">
            Vivabox Empresas
          </p>

          <h1 className="text-[40px] sm:text-[48px] md:text-[56px] leading-[1.05] font-semibold tracking-[-0.02em] mb-6">
            Regalos corporativos<br />sin complicaciones
          </h1>

          <p className="text-[17px] md:text-[19px] leading-relaxed text-white/90 mb-10 max-w-[440px]">
            La empresa regala una Vivabox.<br />
            Cada persona elige la experiencia que más le guste.<br />
            Nosotros gestionamos la reserva.
          </p>

          <div className="flex items-center gap-5">

            <a
              href="https://wa.me/573142590291?text=Hola%2C%20me%20gustar%C3%ADa%20conocer%20las%20opciones%20de%20Vivabox%20para%20mi%20empresa."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-primary text-white px-7 py-3 rounded-xl text-[16px] font-semibold hover:bg-primary-hover transition shadow-lg"
            >
              Hablar por WhatsApp
            </a>

            <a
              href="#como-funciona-empresas"
              className="text-white text-[16px] font-medium hover:underline"
            >
              Cómo funciona
            </a>

          </div>

        </div>

        {/* LIFESTYLE IMAGE */}
        <div className="relative w-full aspect-[4/5] md:aspect-auto md:h-[520px] rounded-[28px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <Image
            src="/images/final-cta/persona-regalando-vivabox.png"
            alt="Empresa regalando una Vivabox a un colaborador"
            fill
            priority
            className="object-cover"
          />
        </div>

      </div>

    </section>
  );
}
