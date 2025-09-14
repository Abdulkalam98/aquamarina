import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplets, Phone, Lock, UserIcon, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

const Auth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        navigate('/admin');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          navigate('/admin');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const phone = formData.get('phone') as string;
    setPhoneNumber(phone);
    
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: true
      }
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Check your SMS for the verification code.",
      });
    }
    
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const otp = formData.get('otp') as string;
    
    const { error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: 'sms'
    });

    if (error) {
      toast({
        title: "Verification Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome!",
        description: "You have successfully signed in.",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-aqua-light/10 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-ocean-deep hover:text-aqua-primary mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex justify-center items-center gap-3 mb-4">
            <Droplets className="w-8 h-8 text-aqua-primary" />
            <h1 className="text-3xl font-bold text-ocean-deep">Aqua Marina</h1>
          </div>
          <p className="text-muted-foreground">Access your account</p>
        </div>

        <Card className="shadow-water">
          <CardContent className="p-6">
            {!otpSent ? (
              <div className="space-y-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-xl text-center text-ocean-deep">Enter Your Phone</CardTitle>
                  <p className="text-center text-muted-foreground text-sm">We'll send you a verification code</p>
                </CardHeader>
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-ocean-deep">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1234567890"
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Include country code (e.g., +1 for US)</p>
                  </div>
                  <Button type="submit" variant="water" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Verification Code"}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-xl text-center text-ocean-deep">Enter Verification Code</CardTitle>
                  <p className="text-center text-muted-foreground text-sm">Enter the 6-digit code sent to {phoneNumber}</p>
                </CardHeader>
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-ocean-deep">Verification Code</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        placeholder="123456"
                        className="pl-10 text-center text-lg tracking-widest"
                        required
                        maxLength={6}
                        pattern="[0-9]{6}"
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="water" className="w-full" disabled={loading}>
                    {loading ? "Verifying..." : "Verify Code"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => {
                      setOtpSent(false);
                      setPhoneNumber('');
                    }}
                  >
                    Back to Phone Number
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Use phone number with admin access to view orders</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;