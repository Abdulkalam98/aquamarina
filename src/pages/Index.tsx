import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import Products from "@/components/Products";
import OrderForm from "@/components/OrderForm";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Services />
      <Products />
      <OrderForm />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;