export default function EmpresasHero() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden">

      <img
        src="/images/hero/hero.png"
        alt="Regalos corporativos Vivabox"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="relative max-w-[1200px] mx-auto px-6 h-full flex items-center">

        <div className="max-w-[560px] text-white">

          <p className="text-white/70 text-[13px] uppercase tracking-[0.14em] mb-5">
            Vivabox Empresas
          </p>

          <h1 className="text-[48px] md:text-[58px] leading-[1.05] font-semibold tracking-[-0.02em] mb-6">
            Regalos corporativos<br />sin complicaciones
          </h1>

          <p className="text-[19px] text-white/90 mb-10">
            Para empleados, clientes o eventos.  
            La empresa regala la Vivabox.  
            La persona elige su experiencia.
          </p>

          <div className="flex items-center gap-5">

            <a
              href="#contacto-empresas"
              className="inline-flex items-center bg-[#fe842f] text-white px-7 py-3 rounded-xl text-[16px] font-semibold hover:brightness-95 transition shadow-lg"
            >
              Contactar
            </a>

            <a
              href="#como-funciona-empresas"
              className="text-white text-[16px] font-medium hover:underline"
            >
              Cómo funciona
            </a>

          </div>

        </div>

      </div>

    </section>
  );
}