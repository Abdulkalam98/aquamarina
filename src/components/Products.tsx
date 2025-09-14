import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import productsImage from "@/assets/water-products.jpg";
import { Home, Users, Plane } from "lucide-react";

const products = [
  {
    icon: Home,
    name: "20L Jar",
    subtitle: "Best for Homes & Offices",
    features: ["Purity you can trust", "Easy exchange system", "Cost-effective"],
    price: "₹80",
    unit: "per jar"
  },
  {
    icon: Users,
    name: "2L Bottle (Pack of 9)",
    subtitle: "Perfect for Family Use",
    features: ["Convenient family packs", "Premium quality bottles", "BPA-free material"],
    price: "₹270",
    unit: "per pack"
  },
  {
    icon: Home,
    name: "1L Bottle (Case of 12)",
    subtitle: "Ideal for Daily Use",
    features: ["Perfect portion size", "Easy to carry", "Bulk savings"],
    price: "₹300",
    unit: "per case"
  },
  {
    icon: Plane,
    name: "500ml Bottle (Case of 24)",
    subtitle: "Great for Travel & Gym",
    features: ["Travel-friendly size", "Convenient for on-the-go", "Multi-pack value"],
    price: "₹360",
    unit: "per case"
  },
  {
    icon: Users,
    name: "250ml Bottle (Case of 24)",
    subtitle: "Perfect for Kids & Events",
    features: ["Kid-friendly size", "Event portions", "Easy handling"],
    price: "₹240",
    unit: "per case"
  },
  {
    icon: Plane,
    name: "200ml Bottle (Case of 48)",
    subtitle: "Compact & Convenient",
    features: ["Ultra-portable", "Bulk quantity", "Maximum value"],
    price: "₹400",
    unit: "per case"
  }
];

const Products = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-aqua-light/10 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-ocean-deep mb-4">
            Our Premium Products
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of pure mineral water products, designed for every need.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Products Grid */}
          <div className="space-y-6">
            {products.map((product, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-water transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-aqua-primary to-wave-blue rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <product.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-ocean-deep">
                            {product.name}
                          </h3>
                          <p className="text-aqua-primary font-medium">
                            {product.subtitle}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-ocean-deep">
                            {product.price}
                          </span>
                          <p className="text-sm text-muted-foreground">
                            {product.unit}
                          </p>
                        </div>
                      </div>
                      
                      <ul className="space-y-1 mb-4">
                        {product.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="text-muted-foreground flex items-center">
                            <div className="w-2 h-2 bg-aqua-primary rounded-full mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Product Image */}
          <div className="lg:order-first">
            <img 
              src={productsImage} 
              alt="Aqua Marina Water Products" 
              className="rounded-2xl shadow-water w-full h-auto"
            />
          </div>
        </div>
        
        <div className="text-center">
          <Button variant="water" size="lg" className="text-lg px-12 py-6">
            Order on WhatsApp Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;