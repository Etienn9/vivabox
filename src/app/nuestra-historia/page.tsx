import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";

import StoryHero from "@/sections/story/StoryHero";
import StoryPhotoBand from "@/sections/story/StoryPhotoBand";
import StoryWhy from "@/sections/story/StoryWhy";
import StoryIdea from "@/sections/story/StoryIdea";
import StoryTeam from "@/sections/story/StoryTeam";
import StoryValues from "@/sections/story/StoryValues";
import StoryVision from "@/sections/story/StoryVision";
import StoryCTA from "@/sections/story/StoryCTA";

export default function StoryPage() {
  return (
    <>
      <Navbar />

      <main>
        <StoryHero />

        <StoryPhotoBand
          src="/images/hero/hero2.jpg"
          alt="Una experiencia Vivabox vivida al aire libre"
          objectPosition="center 30%"
        />

        <StoryWhy />
        <StoryIdea />

        <StoryPhotoBand
          src="/images/hero/hero.png"
          alt="Alguien regalando una Vivabox"
          objectPosition="center 35%"
        />

        <StoryTeam />
        <StoryValues />
        <StoryVision />
        <StoryCTA />
      </main>

      <Footer />
      <WhatsappButton />
    </>
  );
}
