import { Shield, Award, Truck, RotateCcw } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Purity Guaranteed",
    description: "Every drop is tested for safety with advanced purification technology."
  },
  {
    icon: Award,
    title: "Certified by ISI & FSSAI",
    description: "Industry-standard quality assurance with official certifications."
  },
  {
    icon: Truck,
    title: "Fast & Reliable Delivery",
    description: "On-time doorstep service across all our coverage areas."
  },
  {
    icon: RotateCcw,
    title: "Flexible Subscription Plans",
    description: "Daily, weekly, or monthly delivery as per your needs."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-aqua-light/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-ocean-deep mb-4">
            Why Choose Aqua Marina?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the difference with our premium mineral water delivery service.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-8 text-center shadow-soft hover:shadow-water transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-aqua-primary to-wave-blue rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-ocean-deep mb-3">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;