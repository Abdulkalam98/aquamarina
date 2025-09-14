import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Award, Beaker, Clock } from "lucide-react";

const certifications = [
  {
    icon: CheckCircle,
    title: "ISI Certified",
    description: "Bureau of Indian Standards approved"
  },
  {
    icon: Award,
    title: "FSSAI Approved",
    description: "Food Safety & Standards Authority"
  },
  {
    icon: Beaker,
    title: "5-Step Purification",
    description: "Advanced filtration process"
  },
  {
    icon: Clock,
    title: "Regular Lab Testing",
    description: "Quality checks every batch"
  }
];

const About = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* About Content */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-ocean-deep mb-6">
              About Aqua Marina
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              At Aqua Marina, we believe clean drinking water is a right, not a luxury. 
              Established in 2015, we have been delivering safe and pure mineral water to 
              households, offices, and events across the region.
            </p>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our state-of-the-art purification process and strict quality checks ensure 
              that every sip is fresh, healthy, and crystal clear. We never compromise on 
              quality – your health and safety are our priority.
            </p>
            
            <div className="bg-gradient-to-r from-aqua-light/20 to-aqua-primary/10 rounded-2xl p-6 border border-aqua-light">
              <h3 className="text-xl font-semibold text-ocean-deep mb-2">
                Our Mission
              </h3>
              <p className="text-muted-foreground">
                To provide pure, safe, and affordable mineral water to every household, 
                contributing to healthier communities across India.
              </p>
            </div>
          </div>
          
          {/* Certifications Grid */}
          <div>
            <h3 className="text-2xl font-bold text-ocean-deep mb-8 text-center">
              Certifications & Quality Assurance
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <Card key={index} className="text-center hover:shadow-soft transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-aqua-primary to-wave-blue rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <cert.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h4 className="font-semibold text-ocean-deep mb-2">
                      {cert.title}
                    </h4>
                    
                    <p className="text-sm text-muted-foreground">
                      {cert.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;