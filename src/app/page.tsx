import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsappButton from "@/components/WhatsappButton";
import Hero from "../sections/hero/Hero";
import HeroGuideArrow from "@/components/ui/HeroGuideArrow";
import WhatsIncluded from "../sections/whats-included/WhatsIncluded";
import ExperiencesPreview from "../sections/experiences-preview/ExperiencesPreview";
import Occasions from "../sections/occasions/Occasions";
import Testimonials from "../sections/testimonials/Testimonials";
import FAQ from "../sections/faq/FAQ";
import FinalCTA from "../sections/final-cta/FinalCTA";

import BrandRibbon from "@/components/ui/BrandRibbon";
import { getFAQPageSchema } from "@/data/faqSchema";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFAQPageSchema()) }}
      />

      <Navbar />

      <main>

        <div className="relative">
          <Hero />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 max-w-[1200px] mx-auto">
            <HeroGuideArrow />
          </div>
        </div>

        <section id="incluye" className="scroll-mt-24">
          <WhatsIncluded />
        </section>

        <section id="experiencias" className="scroll-mt-24">
          <ExperiencesPreview />
        </section>

        <Occasions />

        <BrandRibbon />

        <Testimonials />

        <section id="faq" className="scroll-mt-24">
          <FAQ />
        </section>

        <BrandRibbon />

        <FinalCTA />

      </main>

      <Footer />
      <WhatsappButton />
    </>
  );
}