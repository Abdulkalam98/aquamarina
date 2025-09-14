import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Users, Plane, Droplets, Star, Sparkles } from "lucide-react";

const products = [
  {
    icon: Home,
    name: "20L Jar",
    subtitle: "Best for Homes & Offices",
    features: ["Purity you can trust", "Easy exchange system", "Cost-effective"],
    price: "₹80",
    unit: "per jar",
    gradient: "from-blue-500 to-cyan-500",
    popular: true
  },
  {
    icon: Users,
    name: "2L Bottle (Pack of 9)",
    subtitle: "Perfect for Family Use",
    features: ["Convenient family packs", "Premium quality bottles", "BPA-free material"],
    price: "₹270",
    unit: "per pack",
    gradient: "from-emerald-500 to-teal-500",
    popular: false
  },
  {
    icon: Home,
    name: "1L Bottle (Case of 12)",
    subtitle: "Ideal for Daily Use",
    features: ["Perfect portion size", "Easy to carry", "Bulk savings"],
    price: "₹300",
    unit: "per case",
    gradient: "from-violet-500 to-purple-500",
    popular: false
  },
  {
    icon: Plane,
    name: "500ml Bottle (Case of 24)",
    subtitle: "Great for Travel & Gym",
    features: ["Travel-friendly size", "Convenient for on-the-go", "Multi-pack value"],
    price: "₹360",
    unit: "per case",
    gradient: "from-orange-500 to-red-500",
    popular: true
  },
  {
    icon: Users,
    name: "250ml Bottle (Case of 24)",
    subtitle: "Perfect for Kids & Events",
    features: ["Kid-friendly size", "Event portions", "Easy handling"],
    price: "₹240",
    unit: "per case",
    gradient: "from-pink-500 to-rose-500",
    popular: false
  },
  {
    icon: Plane,
    name: "200ml Bottle (Case of 48)",
    subtitle: "Compact & Convenient",
    features: ["Ultra-portable", "Bulk quantity", "Maximum value"],
    price: "₹400",
    unit: "per case",
    gradient: "from-indigo-500 to-blue-500",
    popular: false
  }
];

const Products = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-aqua-light/5 via-background to-aqua-light/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in">
          <div className="flex justify-center items-center mb-6">
            <Droplets className="w-12 h-12 text-aqua-primary mr-4 animate-float" />
            <h2 className="text-7xl font-bold gradient-text">
              Our Premium Products
            </h2>
            <Sparkles className="w-12 h-12 text-wave-blue ml-4 animate-pulse" />
          </div>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose from our range of pure mineral water products, designed for every need and lifestyle.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-8 mb-20">
          {products.map((product, index) => (
            <Card 
              key={index} 
              className={`overflow-hidden hover-lift group relative border-2 transition-all duration-500 ${
                product.popular 
                  ? 'border-gradient-to-r from-yellow-400 to-orange-500 shadow-xl shadow-yellow-500/20' 
                  : 'border-aqua-light/30 hover:border-aqua-primary/50'
              } glass`}
            >
              {product.popular && (
                <div className="absolute -top-3 -right-3 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                    <Star className="w-4 h-4 mr-1" />
                    Popular
                  </div>
                </div>
              )}
              
              <CardContent className="p-8 relative">
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${product.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <product.icon className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-2xl font-bold text-ocean-deep mb-2 group-hover:text-aqua-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-aqua-primary font-semibold text-lg bg-aqua-light/20 rounded-full px-4 py-1 inline-block">
                    {product.subtitle}
                  </p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {product.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-muted-foreground flex items-center group-hover:text-ocean-deep transition-colors">
                      <div className="w-3 h-3 bg-gradient-to-r from-aqua-primary to-wave-blue rounded-full mr-4 flex-shrink-0 animate-pulse" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="text-center border-t border-aqua-light/30 pt-6 bg-gradient-to-r from-aqua-light/5 to-wave-blue/5 rounded-lg p-4 -mx-2">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold gradient-text">
                      {product.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground bg-white/50 rounded-full px-3 py-1 inline-block">
                    {product.unit}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center animate-slide-up">
          <div className="bg-gradient-to-r from-aqua-primary/10 to-wave-blue/10 rounded-3xl p-8 max-w-md mx-auto mb-8 glass">
            <Droplets className="w-16 h-16 text-aqua-primary mx-auto mb-4 animate-float" />
            <h3 className="text-2xl font-bold text-ocean-deep mb-2">Ready to Order?</h3>
            <p className="text-muted-foreground mb-6">Get instant quotes and place orders directly through WhatsApp!</p>
          </div>
          <Button 
            variant="water" 
            size="lg" 
            className="text-xl px-16 py-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-teal-500 hover:to-emerald-500 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 border-2 border-emerald-300/50"
            onClick={() => window.open('https://wa.me/918124886893?text=Hi! I would like to know more about your water products and place an order.', '_blank')}
          >
            <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
            💬 Order on WhatsApp Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;