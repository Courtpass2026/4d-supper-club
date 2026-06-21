import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import Programs from "@/components/programs";
import Testimonials from "@/components/testimonials";
import About from "@/components/about";
import Faq from "@/components/faq";
import Cta from "@/components/cta";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Programs />
      <Testimonials />
      <About />
      <Faq />
      <Cta />
    </main>
  );
}
