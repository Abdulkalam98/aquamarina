import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Products from "@/components/Products";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Products />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;