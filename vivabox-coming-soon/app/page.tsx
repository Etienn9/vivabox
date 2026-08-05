import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F6F2] flex items-center justify-center px-8">

      <section className="w-full max-w-2xl mx-auto text-center -translate-y-6">

        {/* Logo */}
        <div className="flex flex-col items-center">

          <Image
            src="/icons/logo.png"
            alt="Vivabox"
            width={76}
            height={76}
            priority
          />

          <Image
            src="/icons/vivabox.png"
            alt="Vivabox"
            width={240}
            height={54}
            priority
            className="mt-3"
          />

        </div>

        {/* Headline */}
        <h1 className="
          mt-20
          text-[42px]
          leading-[1.05]
          font-medium
          tracking-[-0.04em]
          text-[#152F40]
          md:text-[64px]
        ">
          El mejor regalo
          <br />
          está por llegar.
        </h1>

        {/* Subtitle */}
        <p className="
          mt-8
          max-w-xl
          mx-auto
          text-[19px]
          leading-8
          text-[#62707A]
          md:text-[22px]
        ">
          Estamos dando los últimos detalles para lanzar Vivabox
          y transformar la forma de regalar experiencias en Colombia.
        </p>

        {/* Status */}
        <div className="mt-16 flex items-center justify-center gap-3">

          <span className="h-2 w-2 rounded-full bg-[#FE842F] animate-pulse" />

          <span className="
            text-sm
            uppercase
            tracking-[0.18em]
            text-[#7C8790]
          ">
            Próximamente
          </span>

        </div>

      </section>

    </main>
  );
}