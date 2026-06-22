import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import Programs from "@/components/programs";
import Testimonials from "@/components/testimonials";
import About from "@/components/about";
import Faq from "@/components/faq";
import Cta from "@/components/cta";
import Reveal from "@/components/reveal";

export default function Home() {
  return (
    <main>
      <Hero />
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <Programs />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <About />
      </Reveal>
      <Reveal>
        <Faq />
      </Reveal>
      <Reveal>
        <Cta />
      </Reveal>
    </main>
  );
}
