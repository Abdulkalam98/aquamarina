import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cookieUtils } from "@/lib/utils";
import { Droplet, Eye, EyeOff } from "lucide-react";
import type { User, Session } from '@supabase/supabase-js';

const Auth = () => {
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      console.log('User already authenticated, redirecting to home');
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });

      if (error) {
        toast({
          description: error.message,
          variant: "destructive"
        });
      } else {
        // If user is immediately logged in (email confirmation disabled)
        if (data.session) {
          // Set session cookies for persistence
          cookieUtils.setSessionData(data.session);
          
          toast({
            description: "Account created and signed in successfully! Redirecting...",
          });
          
          // Let the useEffect handle navigation when user state updates
          console.log('Sign-up successful, waiting for auth state update...');
        } else {
          toast({
            description: "Account created! Please check your email to verify your account.",
          });
        }
      }
    } catch (error: any) {
      if (error.message.includes("already registered")) {
        toast({
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive"
        });
      } else {
        toast({
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Starting sign in process...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        
        if (error.message.includes("Invalid login credentials")) {
          toast({
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive"
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            description: "Please confirm your email address before signing in.",
            variant: "destructive"
          });
        } else {
          toast({
            description: error.message || "Sign in failed. Please try again.",
            variant: "destructive"
          });
        }
      } else if (data.session && data.user) {
        console.log('Sign in successful:', data.user.email);
        
        // Set session cookies for persistence
        cookieUtils.setSessionData(data.session);
        
        toast({
          description: "Successfully signed in! Redirecting...",
        });
        
        // Let the useEffect handle navigation when user state updates
        console.log('Sign-in successful, waiting for auth state update...');
      } else {
        toast({
          description: "Sign in failed. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Sign in exception:', error);
      toast({
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgb(248, 250, 252) 50%, rgba(59, 130, 246, 0.05) 100%)'
    }}>
      <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg" style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)'
          }}>
            <Droplet className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
          </div>
          <span className="text-xl sm:text-3xl font-bold" style={{
            background: 'linear-gradient(90deg, #1e40af 0%, #0ea5e9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Aqua Marina
          </span>
        </div>

        <Card className="w-full shadow-lg" style={{
          borderColor: 'rgba(14, 165, 233, 0.3)',
          boxShadow: '0 10px 40px -10px rgba(14, 165, 233, 0.3)'
        }}>
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-center text-ocean-deep">Welcome</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-8 sm:h-10">
                <TabsTrigger value="signin" className="text-sm sm:text-base">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-sm sm:text-base">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-3 sm:space-y-4 mt-4">
                <form onSubmit={handleSignIn} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="signin-email" className="text-sm">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="h-9 sm:h-10"
                    />
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="signin-password" className="text-sm">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-9 sm:h-10"
                        placeholder="Enter your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2 sm:px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full h-9 sm:h-10 text-sm sm:text-base" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-3 sm:space-y-4 mt-4">
                <form onSubmit={handleSignUp} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="signup-name" className="text-sm">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="h-9 sm:h-10"
                    />
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="signup-email" className="text-sm">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="h-9 sm:h-10"
                    />
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="signup-phone" className="text-sm">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="h-9 sm:h-10"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="signup-password" className="text-sm">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Create a password"
                        className="h-9 sm:h-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2 sm:px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-9 sm:h-10 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700" 
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;