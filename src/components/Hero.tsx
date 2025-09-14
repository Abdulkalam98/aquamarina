import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-water.jpg";
import { Droplets, Phone } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/80 via-aqua-primary/60 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Droplets className="w-12 h-12 text-aqua-light mr-4" />
          <h1 className="text-6xl lg:text-8xl font-bold">
            Aqua Marina
          </h1>
        </div>
        
        <h2 className="text-2xl lg:text-4xl font-light mb-6 max-w-4xl mx-auto leading-relaxed">
          Pure & Fresh Mineral Water, Delivered to Your Doorstep.
        </h2>
        
        <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          We bring you premium quality mineral water – tested, certified, and trusted by families and businesses.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            💧 Order Now
          </Button>
          <Button 
            variant="outline-light" 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contact Us
          </Button>
        </div>
        
        <div className="mt-12 flex items-center justify-center text-aqua-light">
          <Phone className="w-6 h-6 mr-2" />
          <span className="text-xl">Call us: +91-9876543210</span>
        </div>
      </div>
      
      {/* Wave Animation */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          className="w-full h-16 lg:h-20"
        >
          <path 
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" 
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;