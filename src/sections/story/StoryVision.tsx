import Reveal from "@/components/ui/Reveal";

const LINES = [
  "No queremos vender simplemente una caja.",
  "Queremos que regalar vuelva a sentirse personal.",
  "Que quien compra tenga la tranquilidad de haber acertado.",
  "Que quien recibe viva un momento inolvidable.",
  "Y que más personas descubran experiencias y negocios locales que merecen ser conocidos.",
];

export default function StoryVision() {
  return (
    <section className="bg-ink py-20 md:py-[120px]">

      <div className="max-w-[640px] mx-auto px-6">

        <Reveal duration={400}>
          <h2 className="h2 text-white mb-10">
            Lo que queremos construir
          </h2>
        </Reveal>

        <div className="space-y-4">
          {LINES.map((line, index) => (
            <Reveal key={line} duration={400} delay={index * 90}>
              <p className="text-white/70 leading-relaxed text-lg">
                {line}
              </p>
            </Reveal>
          ))}
        </div>

      </div>

    </section>
  );
}
