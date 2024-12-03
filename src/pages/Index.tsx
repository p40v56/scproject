import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Blog from "@/components/Blog";
import FooterMenu from "@/components/FooterMenu";

const Index = () => {
  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <Team />
      <Testimonials />
      <Blog />
      <Contact />
      <FooterMenu />
    </div>
  );
};

export default Index;