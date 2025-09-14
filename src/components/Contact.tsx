import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageCircle, Droplets, Star, Sparkles } from "lucide-react";

const Contact = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-aqua-light/10 via-background to-wave-blue/5 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 animate-float">
        <Droplets className="w-20 h-20 text-aqua-primary/20" />
      </div>
      <div className="absolute bottom-20 right-10 animate-bounce delay-1000">
        <Star className="w-16 h-16 text-wave-blue/20" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="flex justify-center items-center mb-6">
            <MessageCircle className="w-12 h-12 text-aqua-primary mr-4 animate-pulse" />
            <h2 className="text-7xl font-bold gradient-text">
              Contact Us
            </h2>
            <Sparkles className="w-12 h-12 text-wave-blue ml-4 animate-bounce" />
          </div>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to experience pure, fresh mineral water? Get in touch with us today for premium quality delivery.
          </p>
        </div>
        
        {/* Contact Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8 animate-slide-up">
            <Card className="hover-lift glass border-2 border-aqua-light/30 hover:border-aqua-primary/50 transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex items-center gap-6 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Phone className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ocean-deep text-xl mb-2">Phone</h3>
                    <p className="text-muted-foreground text-lg bg-aqua-light/20 rounded-full px-4 py-2 inline-block">+91-8124886893</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-lift glass border-2 border-aqua-light/30 hover:border-aqua-primary/50 transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex items-center gap-6 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Mail className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ocean-deep text-xl mb-2">Email</h3>
                    <p className="text-muted-foreground text-lg bg-aqua-light/20 rounded-full px-4 py-2 inline-block">abdulkalam081998@gmail.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-soft transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-aqua-primary to-wave-blue rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ocean-deep">Address</h3>
                     <p className="text-muted-foreground">
                       AquaMarina Subbarayan Nagar, Jagir Ammapalayam<br />
                       Salem - 636302
                     </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-soft transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-aqua-primary to-wave-blue rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ocean-deep">Delivery Hours</h3>
                    <p className="text-muted-foreground">
                      Morning Slot: 9 AM - 1 PM<br />
                      Afternoon Slot: 1 PM - 6 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Form */}
          <Card className="shadow-water">
            <CardHeader>
              <CardTitle className="text-2xl text-ocean-deep text-center">
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-ocean-deep mb-2 block">
                    Full Name
                  </label>
                  <Input placeholder="Enter your name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-ocean-deep mb-2 block">
                    Phone Number
                  </label>
                  <Input placeholder="Enter your phone" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-ocean-deep mb-2 block">
                  Message
                </label>
                <Textarea 
                  placeholder="Tell us about your water delivery needs..." 
                  className="min-h-32"
                />
              </div>
              
              <Button variant="water" size="lg" className="w-full text-lg">
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* WhatsApp CTA */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-8">
              <MessageCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                💬 Order Instantly on WhatsApp
              </h3>
              <p className="text-green-700 mb-6">
                Quick and easy ordering through WhatsApp for immediate delivery.
              </p>
              <Button 
                variant="default" 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => window.open('https://wa.me/918124886893?text=Hi! I would like to know more about your water delivery services.', '_blank')}
              >
                💬 Order on WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;