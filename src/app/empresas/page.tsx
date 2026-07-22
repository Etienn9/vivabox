import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";

import EmpresasHero from "@/sections/empresas/EmpresasHero";
import EmpresasProblem from "@/sections/empresas/EmpresasProblem";
import EmpresasSolution from "@/sections/empresas/EmpresasSolution";
import EmpresasUseCases from "@/sections/empresas/EmpresasUseCases";
import EmpresasHowItWorks from "@/sections/empresas/EmpresasHowItWorks";
import EmpresasOptions from "@/sections/empresas/EmpresasOptions";
import EmpresasContact from "@/sections/empresas/EmpresasContact";
import EmpresasFinalCTA from "@/sections/empresas/EmpresasFinalCTA";

export default function EmpresasPage() {
  return (
    <>
      <Navbar />

      <main>
        <EmpresasHero />
        <EmpresasProblem />
        <EmpresasSolution />
        <EmpresasUseCases />
        <EmpresasHowItWorks />
        <EmpresasOptions />
        <EmpresasContact />
        <EmpresasFinalCTA />
      </main>

      <Footer />
      <WhatsappButton />
    </>
  );
}