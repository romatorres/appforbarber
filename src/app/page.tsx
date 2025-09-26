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
      <section id="hero">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="">
        <Plans />
      </section>
      <section id="contact">
        <Contacts />
      </section>
      <section id="footer">
        <Footer />
      </section>
    </div>
  );
}
