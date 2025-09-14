import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProductSelector from "./ProductSelector";
import Cart, { CartItem } from "./Cart";

const serviceTypes = [
  "One-time Delivery",
  "Weekly Subscription", 
  "Monthly Subscription"
];

const OrderForm = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    serviceType: "",
    deliveryDate: "",
    deliveryTime: "",
    specialInstructions: ""
  });

  const { toast } = useToast();
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
        title: "Cart is empty",
        description: "Please add some products to your cart before placing an order.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address || !formData.serviceType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
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

      if (orders.length > 0) {
        await sendAdminNotification(orders[0].id);
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Your order for ₹${totalCost} has been received. You will be contacted soon for delivery confirmation.`,
      });

      setFormData({
        fullName: "", phone: "", email: "", address: "", serviceType: "",
        deliveryDate: "", deliveryTime: "", specialInstructions: ""
      });
      setCartItems([]);

    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
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

      if (orders.length > 0) {
        await sendAdminNotification(orders[0].id);
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
    <section className="py-20 bg-gradient-to-b from-aqua-light/10 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-ocean-deep mb-4">Place Your Order</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select your products and provide delivery details for fresh water delivery
          </p>
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
                      <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Enter your full name" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Enter your phone number" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address (Optional)</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Enter your email address" />
                  </div>

                  <div>
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select value={formData.serviceType} onValueChange={(value) => setFormData({...formData, serviceType: value})}>
                      <SelectTrigger><SelectValue placeholder="Choose service type" /></SelectTrigger>
                      <SelectContent>{serviceTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Enter complete delivery address" required className="min-h-24" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
                      <Input id="deliveryDate" type="date" value={formData.deliveryDate} onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})} />
                    </div>
                    <div>
                      <Label htmlFor="deliveryTime">Preferred Delivery Time</Label>
                      <Input id="deliveryTime" value={formData.deliveryTime} onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})} placeholder="e.g., 10 AM - 2 PM" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialInstructions">Special Instructions</Label>
                    <Textarea id="specialInstructions" value={formData.specialInstructions} onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})} placeholder="Any special delivery instructions..." className="min-h-20" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button type="submit" variant="water" size="lg" className="w-full text-lg">
                      <Truck className="w-5 h-5 mr-2" />Submit Order
                    </Button>
                    <Button type="button" onClick={handleWhatsAppOrder} variant="outline" size="lg" className="w-full text-lg border-green-500 text-green-700 hover:bg-green-50">
                      💬 Order via WhatsApp
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Cart items={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onClearCart={handleClearCart} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;