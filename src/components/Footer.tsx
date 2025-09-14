import { Droplets, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-ocean-deep text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Droplets className="w-8 h-8 text-aqua-light mr-3" />
              <h3 className="text-2xl font-bold">Aqua Marina</h3>
            </div>
            <p className="text-aqua-light mb-6 max-w-md">
              Delivering pure, safe, and refreshing mineral water to your doorstep. 
              Your health and satisfaction are our priorities.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-aqua-primary rounded-full flex items-center justify-center hover:bg-wave-blue transition-colors cursor-pointer">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-aqua-primary rounded-full flex items-center justify-center hover:bg-wave-blue transition-colors cursor-pointer">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-aqua-primary rounded-full flex items-center justify-center hover:bg-wave-blue transition-colors cursor-pointer">
                <Linkedin className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-aqua-light">
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/auth" className="hover:text-white transition-colors">Admin Login</a></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-aqua-light">
              <li><a href="#services" className="hover:text-white transition-colors">Home Delivery</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Office Supply</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Bulk Orders</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Subscriptions</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-aqua-primary/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-aqua-light text-sm">
            © 2024 Aqua Marina. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-aqua-light hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-aqua-light hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;