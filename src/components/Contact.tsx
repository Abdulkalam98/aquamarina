import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-aqua-light/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-ocean-deep mb-4">
            Contact Us
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to experience pure, fresh mineral water? Get in touch with us today.
          </p>
        </div>
        
        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Card className="hover:shadow-soft transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-aqua-primary to-wave-blue rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ocean-deep">Phone</h3>
                    <p className="text-muted-foreground">+91-9876543210</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-soft transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-aqua-primary to-wave-blue rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ocean-deep">Email</h3>
                    <p className="text-muted-foreground">orders@aquamarina.com</p>
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
                      123 Water Street, Industrial Area<br />
                      Mumbai, Maharashtra 400001
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
                      Morning: 7 AM - 12 PM<br />
                      Evening: 4 PM - 8 PM
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
                onClick={() => window.open('https://wa.me/919XXXXXXXXX?text=Hi! I would like to know more about your water delivery services.', '_blank')}
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