import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-water.jpg";
import { Droplets, Phone, Sparkles, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110 animate-pulse"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Enhanced Gradient Overlay with Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-deep/90 via-aqua-primary/70 to-wave-blue/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-aqua-light/20" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-bounce delay-1000">
        <Sparkles className="w-8 h-8 text-aqua-light/60" />
      </div>
      <div className="absolute top-32 right-16 animate-bounce delay-2000">
        <Star className="w-6 h-6 text-wave-blue/50" />
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce delay-500">
        <Droplets className="w-10 h-10 text-aqua-light/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-8 animate-fade-in">
          <div className="relative">
            <Droplets className="w-16 h-16 text-aqua-light mr-6 animate-pulse" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-aqua-light rounded-full animate-ping"></div>
          </div>
          <h1 className="text-9xl font-bold bg-gradient-to-r from-aqua-light to-white bg-clip-text text-transparent drop-shadow-2xl">
            Aqua Marina
          </h1>
        </div>
        
        <h2 className="text-5xl font-light mb-8 max-w-4xl mx-auto leading-relaxed animate-slide-up delay-300 bg-gradient-to-r from-aqua-light/90 to-white/80 bg-clip-text text-transparent">
          Pure & Fresh Mineral Water, Delivered to Your Doorstep.
        </h2>
        
        <p className="text-3xl mb-12 max-w-3xl mx-auto opacity-90 animate-slide-up delay-500 leading-relaxed">
          We bring you premium quality mineral water – tested, certified, and trusted by families and businesses.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up delay-700">
          <Button 
            variant="hero" 
            size="lg" 
            className="text-xl px-12 py-8 bg-gradient-to-r from-orange-500 to-red-600 hover:from-red-600 hover:to-orange-500 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-orange-500/50 border-2 border-orange-300/30 text-white font-bold"
            onClick={() => {
              const orderForm = document.getElementById('order-form');
              if (orderForm) {
                orderForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            <Droplets className="w-6 h-6 mr-3 animate-pulse" />
            💧 Order Now
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-xl px-12 py-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-teal-600 hover:to-emerald-500 border-2 border-emerald-300/70 text-white hover:text-white transform hover:scale-105 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-emerald-500/40 font-bold"
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            <Phone className="w-6 h-6 mr-3" />
            Contact Us
          </Button>
        </div>
        
        <div className="mt-16 flex items-center justify-center text-aqua-light animate-slide-up delay-1000">
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-aqua-light/30 hover:bg-white/20 transition-all duration-300">
            <Phone className="w-8 h-8 mr-4 animate-pulse" />
            <span className="text-2xl font-semibold">Call us: +91-8124886893</span>
          </div>
        </div>
      </div>
      
      {/* Wave Animation */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          className="w-full h-20"
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