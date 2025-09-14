import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogIn, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import Products from "@/components/Products";
import OrderForm from "@/components/OrderForm";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aqua-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Auth/Admin Navigation */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {!user ? (
          <Button 
            onClick={() => navigate('/auth')}
            size="sm"
            className="bg-white/90 text-ocean-deep hover:bg-white shadow-lg"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        ) : userRole === 'admin' && (
          <Button 
            onClick={() => navigate('/admin-panel')}
            size="sm"
            className="bg-white/90 text-ocean-deep hover:bg-white shadow-lg"
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin Panel
          </Button>
        )}
      </div>

      <Hero />
      <Features />
      <Services />
      <Products />
      <OrderForm />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;