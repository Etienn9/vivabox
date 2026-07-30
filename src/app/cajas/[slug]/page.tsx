import { notFound } from "next/navigation"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import WhatsappButton from "@/components/WhatsappButton"

import BoxHero from "@/sections/box/BoxHero"
import Occasions from "@/sections/occasions/Occasions"
import BoxReassurance from "@/sections/box/BoxReassurance"
import BoxFinalCTA from "@/sections/box/BoxFinalCTA"

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
          price={box.price}
          experiences={box.experiences}
          image={box.image}
          signatureColor={box.signatureColor}
          slug={box.slug}
        />

        <Occasions />

        <BoxReassurance />

        <BoxFinalCTA price={box.price} slug={box.slug} />

      </main>

      <Footer />

      <WhatsappButton />
    </>
  )
}
