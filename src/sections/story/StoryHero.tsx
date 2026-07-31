import BrandDots from "@/components/ui/BrandDots";

export default function StoryHero() {
  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 0%, #fff9f4 0%, #fff4ec 55%, #ffe9d8 100%)",
      }}
    >

      <div className="max-w-[640px] mx-auto px-6 text-center">

        <BrandDots className="justify-center" />

        <h1 className="h1 mb-6">
          Nuestra historia
        </h1>

        <p className="text-lg text-muted leading-relaxed">
          Creemos que regalar debería ser más fácil.
          <br />
          Por eso creamos una forma diferente de regalar experiencias.
        </p>

      </div>

    </section>
  );
}
