import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";

import StoryHero from "@/sections/story/StoryHero";
import StoryWhy from "@/sections/story/StoryWhy";
import StoryIdea from "@/sections/story/StoryIdea";
import StoryValues from "@/sections/story/StoryValues";
import StoryTeam from "@/sections/story/StoryTeam";
import StoryCTA from "@/sections/story/StoryCTA";

export default function StoryPage() {
  return (
    <>
      <Navbar />

      <main>
        <StoryHero />
        <StoryWhy />
        <StoryIdea />
        <StoryValues />
        <StoryTeam />
        <StoryCTA />
      </main>

      <Footer />
      <WhatsappButton />
    </>
  );
}