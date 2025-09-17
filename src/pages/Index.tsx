import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import Products from "@/components/Products";
import OrderForm from "@/components/OrderForm";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  const { user, userRole, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Simple redirect effect
  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  // Handle sign out with redirect
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
      navigate('/auth', { replace: true });
    }
  };

  // Log current auth state for debugging
  console.log('Index page auth state:', { 
    loading, 
    hasUser: !!user, 
    userEmail: user?.email,
    userRole 
  });

  // Show loading with timeout - if loading takes too long, show button to continue
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-aqua-light/10 via-background to-wave-blue/5">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aqua-primary mx-auto mb-4"></div>
          <p className="text-ocean-deep mb-2">Loading...</p>
          <p className="text-sm text-muted-foreground mb-4">
            Checking authentication status...
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/auth')} 
              variant="outline" 
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If no user after loading is complete, redirect to auth
  if (!loading && !user) {
    return null; // Will redirect via useEffect
  }

  // If user is not logged in, show nothing (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Auth/Admin Navigation */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <div className="flex gap-2">
          {userRole === 'admin' && (
            <Button 
              onClick={() => navigate('/admin-panel')}
              size="sm"
              className="bg-white/90 text-ocean-deep hover:bg-white shadow-lg"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin Panel
            </Button>
          )}
          <Button 
            onClick={handleSignOut}
            size="sm"
            variant="outline"
            className="bg-white/90 text-ocean-deep hover:bg-white shadow-lg border-ocean-deep/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <Hero />
      <Features />
      <Services />
      <Products />
      <div id="order-form">
        <OrderForm />
      </div>
      <About />
      <div id="contact">
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default Index;