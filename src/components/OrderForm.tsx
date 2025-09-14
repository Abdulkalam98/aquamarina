import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Package, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ProductSelector from "./ProductSelector";
import Cart, { type CartItem } from "./Cart";

const serviceTypes = [
  "One-time Delivery",
  "Weekly Subscription", 
  "Monthly Subscription",
  "Bulk Orders",
  "Office Supply",
  "Home Delivery"
];

const OrderForm = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    serviceType: "",
    deliveryDate: "",
    deliveryTime: "",
    specialInstructions: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aqua-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }
  const totalCost = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => [...prev, item]);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast({ description: "Cart cleared successfully" });
  };

  const sendAdminNotification = async (orderId: string) => {
    try {
      await supabase.functions.invoke('send-admin-notification', {
        body: {
          orderId,
          customerName: formData.fullName,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          products: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            size: item.size,
            price: item.price
          })),
          totalCost,
          deliveryAddress: formData.address,
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
          specialInstructions: formData.specialInstructions,
          serviceType: formData.serviceType
        }
      });
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast({
        description: "Please add items to your cart before placing an order",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Calculate total cost
      const totalCost = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Create order for each cart item
      for (const item of cartItems) {
        const { error: orderError } = await supabase
          .from('orders')
          .insert([
            {
              user_id: user.id, // Add user_id for RLS
              full_name: formData.fullName,
              phone: formData.phone,
              email: formData.email,
              address: formData.address,
              service_type: formData.serviceType,
              product: `${item.name} - ${item.size}`,
              quantity: item.quantity,
              total_cost: item.price * item.quantity,
              delivery_date: formData.deliveryDate || null,
              delivery_time: formData.deliveryTime || null,
              special_instructions: formData.specialInstructions || null,
              status: 'pending'
            }
          ]);

        if (orderError) {
          console.error('Error creating order:', orderError);
          throw orderError;
        }
      }

      // Send admin notification
      try {
        await supabase.functions.invoke('send-admin-notification', {
          body: {
            orderId: 'ORDER_' + Date.now(), // Temporary ID since we have multiple items
            customerName: formData.fullName,
            customerPhone: formData.phone,
            customerEmail: formData.email,
            products: cartItems.map(item => ({
              name: item.name,
              quantity: item.quantity,
              size: item.size,
              price: item.price
            })),
            totalCost: totalCost,
            deliveryAddress: formData.address,
            deliveryDate: formData.deliveryDate,
            deliveryTime: formData.deliveryTime,
            specialInstructions: formData.specialInstructions,
            serviceType: formData.serviceType
          }
        });
      } catch (notificationError) {
        console.error('Error sending admin notification:', notificationError);
        // Don't fail the order if notification fails - database trigger will handle it
      }

      toast({
        description: "Order placed successfully! We'll contact you soon.",
      });

      // Reset form and cart
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        serviceType: "",
        deliveryDate: "",
        deliveryTime: "",
        specialInstructions: "",
      });
      setCartItems([]);

    } catch (error: any) {
      console.error('Order submission error:', error);
      toast({
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppOrder = async () => {
    if (cartItems.length === 0 || !formData.fullName || !formData.phone || !formData.address || !formData.serviceType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before proceeding to WhatsApp.",
        variant: "destructive"
      });
      return;
    }

    try {
      const orders = [];
      for (const item of cartItems) {
        const { data, error } = await supabase
          .from('orders')
          .insert({
            user_id: user.id, // Add user_id for RLS compatibility
            full_name: formData.fullName,
            phone: formData.phone,
            email: formData.email || null,
            address: formData.address,
            service_type: formData.serviceType,
            product: `${item.name} - ${item.size}`,
            quantity: item.quantity,
            total_cost: item.price * item.quantity,
            delivery_date: formData.deliveryDate || null,
            delivery_time: formData.deliveryTime || null,
            special_instructions: formData.specialInstructions || null,
            status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;
        orders.push(data);
      }

      // Send admin notification for the first order (trigger will handle all)
      if (orders.length > 0) {
        try {
          await supabase.functions.invoke('send-admin-notification', {
            body: {
              orderId: orders[0].id,
              customerName: formData.fullName,
              customerPhone: formData.phone,
              customerEmail: formData.email,
              products: cartItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                size: item.size,
                price: item.price
              })),
              totalCost,
              deliveryAddress: formData.address,
              deliveryDate: formData.deliveryDate,
              deliveryTime: formData.deliveryTime,
              specialInstructions: formData.specialInstructions,
              serviceType: formData.serviceType
            }
          });
        } catch (notificationError) {
          console.error('Error sending admin notification:', notificationError);
          // Don't fail the order if notification fails - trigger will handle it
        }
      }

      const productsList = cartItems.map(
        item => `• ${item.quantity} × ${item.size} - ₹${item.price * item.quantity}`
      ).join('%0A');
      
      const message = `Hi! I would like to place a water delivery order:%0A%0A*Order Details:*%0A${productsList}%0A%0A*Total: ₹${totalCost}*%0A%0A*Customer Details:*%0AName: ${formData.fullName}%0APhone: ${formData.phone}%0AAddress: ${formData.address}%0AService: ${formData.serviceType}${formData.deliveryDate ? `%0ADelivery Date: ${formData.deliveryDate}` : ''}${formData.deliveryTime ? `%0ADelivery Time: ${formData.deliveryTime}` : ''}${formData.specialInstructions ? `%0ASpecial Instructions: ${formData.specialInstructions}` : ''}%0A%0APlease confirm this order. Thank you!`;

      window.open(`https://wa.me/918124886893?text=${message}`, '_blank');

      setFormData({
        fullName: "", phone: "", email: "", address: "", serviceType: "",
        deliveryDate: "", deliveryTime: "", specialInstructions: ""
      });
      setCartItems([]);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-aqua-light/5">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-5xl font-bold text-ocean-deep mb-4">
              Place Your Order
            </h2>
            <p className="text-xl text-muted-foreground">
              Select your premium water cases and provide delivery details.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ProductSelector onAddToCart={handleAddToCart} />
            
            <Card className="shadow-water">
              <CardHeader>
                <CardTitle className="text-2xl text-ocean-deep text-center">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input 
                        id="fullName" 
                        value={formData.fullName} 
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                        placeholder="Enter your full name" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                        placeholder="Enter your phone number" 
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      placeholder="Enter your email address" 
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select value={formData.serviceType} onValueChange={(value) => setFormData({...formData, serviceType: value})}>
                      <SelectTrigger><SelectValue placeholder="Choose service type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="One-time Delivery">One-time Delivery</SelectItem>
                        <SelectItem value="Weekly Subscription">Weekly Subscription</SelectItem>
                        <SelectItem value="Monthly Subscription">Monthly Subscription</SelectItem>
                        <SelectItem value="Bulk Orders">Bulk Orders</SelectItem>
                        <SelectItem value="Office Supply">Office Supply</SelectItem>
                        <SelectItem value="Home Delivery">Home Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea 
                      id="address" 
                      value={formData.address} 
                      onChange={(e) => setFormData({...formData, address: e.target.value})} 
                      placeholder="Enter complete delivery address" 
                      required 
                      className="min-h-24" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
                      <Input 
                        id="deliveryDate" 
                        type="date" 
                        value={formData.deliveryDate} 
                        onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryTime">Preferred Delivery Time</Label>
                      <Select value={formData.deliveryTime} onValueChange={(value) => setFormData({...formData, deliveryTime: value})}>
                        <SelectTrigger><SelectValue placeholder="Choose delivery time" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9 AM - 1 PM">9 AM - 1 PM</SelectItem>
                          <SelectItem value="1 PM - 6 PM">1 PM - 6 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialInstructions">Special Instructions</Label>
                    <Textarea 
                      id="specialInstructions" 
                      value={formData.specialInstructions} 
                      onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})} 
                      placeholder="Any special delivery instructions..." 
                      className="min-h-20" 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="default" 
                    size="lg" 
                    className="w-full text-lg" 
                    disabled={loading}
                  >
                    <Package className="w-5 h-5 mr-2" />
                    {loading ? "Placing Order..." : "Place Order"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Cart 
              items={cartItems} 
              onUpdateQuantity={handleUpdateQuantity} 
              onRemoveItem={handleRemoveItem} 
              onClearCart={handleClearCart} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;