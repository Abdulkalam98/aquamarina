import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Package, Building, Home } from "lucide-react";

const services = [
  {
    icon: Calendar,
    title: "Subscriptions",
    description: "Regular delivery schedules tailored to your needs. Daily, weekly, or monthly options available.",
    features: ["Flexible scheduling", "Cost-effective", "Never run out of water"]
  },
  {
    icon: Package,
    title: "Bulk Orders",
    description: "Large quantity orders for events, functions, and special occasions.",
    features: ["Volume discounts", "Event planning support", "Flexible delivery timing"]
  },
  {
    icon: Building,
    title: "Office Supply",
    description: "Reliable water delivery for offices, businesses, and corporate environments.",
    features: ["B2B pricing", "Regular maintenance", "Professional service"]
  },
  {
    icon: Home,
    title: "Home Delivery",
    description: "Convenient doorstep delivery for households and families.",
    features: ["Timely delivery", "Quality assurance", "Easy reordering"]
  }
];

const Services = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-aqua-light/10 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-ocean-deep mb-4">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the service that fits your needs perfectly.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="hover:shadow-water transition-all duration-300 group h-full"
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-aqua-primary to-wave-blue rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-ocean-deep">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-2 h-2 bg-aqua-primary rounded-full mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;