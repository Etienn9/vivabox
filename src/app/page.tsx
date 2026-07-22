import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsappButton from "@/components/WhatsappButton";
import Hero from "../sections/hero/Hero";
import Boxes from "../sections/boxes/Boxes";
import HowItWorks from "../sections/how-it-works/HowItWorks";
import ExperiencesPreview from "../sections/experiences-preview/ExperiencesPreview";
import Occasions from "../sections/occasions/Occasions";
import Testimonials from "../sections/testimonials/Testimonials";
import FAQ from "../sections/faq/FAQ";
import FinalCTA from "../sections/final-cta/FinalCTA";

import BenefitsBar from "@/components/BenefitsBar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>

        <Hero />

        <BenefitsBar />

        <section id="cajas" className="scroll-mt-24">
  <Boxes />
</section>

<section id="como-funciona" className="scroll-mt-24">
  <HowItWorks />
</section>

<section id="experiencias" className="scroll-mt-24">
  <ExperiencesPreview />
</section>

<Occasions />
<Testimonials />

<section id="faq" className="scroll-mt-24">
  <FAQ />
</section>

        <FinalCTA />

      </main>

      <Footer />
      <WhatsappButton />
    </>
  );
}