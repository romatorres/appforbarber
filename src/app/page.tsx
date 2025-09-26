import About from "@/components/site/About";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import Plans from "@/components/site/Plans";
import Contacts from "@/components/site/Contacts";

export default function Home() {
  return (
    <div>
      <section id="home">
        <Header />
      </section>
      <section id="hero" className="scroll-mt-20 md:scroll-mt-24">
        <Hero />
      </section>
      <section id="about" className="scroll-mt-16 md:scroll-mt-24">
        <About />
      </section>
      <section id="plans" className="scroll-mt-16 md:scroll-mt-24">
        <Plans />
      </section>
      <section id="contacts" className="scroll-mt-20 md:scroll-mt-24">
        <Contacts />
      </section>
      <section id="footer" className="scroll-mt-20 md:scroll-mt-24">
        <Footer />
      </section>
    </div>
  );
}
