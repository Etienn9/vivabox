import { notFound } from "next/navigation"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import WhatsappButton from "@/components/WhatsappButton"

import BoxHero from "@/sections/box/BoxHero"
import BoxGiftMoment from "@/sections/box/BoxGiftMoment"
import BoxIncludes from "@/sections/box/BoxIncludes"
import BoxOccasions from "@/sections/box/BoxOccasions"

import ExperiencesPreview from "@/sections/experiences-preview/ExperiencesPreview"
import HowItWorks from "@/sections/how-it-works/HowItWorks"
import Testimonials from "@/sections/testimonials/Testimonials"
import FinalCTA from "@/sections/final-cta/FinalCTA"

import BoxesComparison from "@/sections/boxes-comparison/BoxesComparison"

import { boxes } from "@/data/boxes"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function BoxPage({ params }: PageProps) {

  const { slug } = await params

  const box = boxes.find((b) => b.slug === slug)

  if (!box) {
    notFound()
  }

  return (
    <>
      <Navbar />

      <main>

        {/* HERO */}

        <BoxHero
          name={box.name}
          description={box.description}
          price={box.price}
          experiences={box.experiences}
          image={box.image}
          signatureColor={box.signatureColor}
          slug={box.slug}
        />

        <BoxGiftMoment />

<BoxIncludes />

<ExperiencesPreview />

<HowItWorks />

<BoxOccasions />

<BoxesComparison />

<Testimonials />

<FinalCTA />

      </main>

      <Footer />

      <WhatsappButton />
    </>
  )
}
