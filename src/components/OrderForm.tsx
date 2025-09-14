import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calculator, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const products = [
  { id: "20l-jar", name: "20L Jar", price: 80 },
  { id: "2l-pack", name: "2L Bottle (Pack of 9)", price: 270 },
  { id: "1l-case", name: "1L Bottle (Case of 12)", price: 300 },
  { id: "500ml-case", name: "500ml Bottle (Case of 24)", price: 360 },
  { id: "250ml-case", name: "250ml Bottle (Case of 24)", price: 240 },
  { id: "200ml-case", name: "200ml Bottle (Case of 48)", price: 400 },
];

const serviceTypes = [
  "Subscription",
  "Bulk Order", 
  "Office Supply",
  "Home Delivery"
];

const OrderForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    serviceType: "",
    product: "",
    quantity: 1,
    deliveryDate: "",
    deliveryTime: "",
    specialInstructions: ""
  });
  
  const [totalCost, setTotalCost] = useState(0);
  const { toast } = useToast();

  const calculateTotal = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.price * quantity : 0;
  };

  const handleProductChange = (productId: string) => {
    setFormData(prev => ({ ...prev, product: productId }));
    setTotalCost(calculateTotal(productId, formData.quantity));
  };

  const handleQuantityChange = (quantity: number) => {
    setFormData(prev => ({ ...prev, quantity }));
    if (formData.product) {
      setTotalCost(calculateTotal(formData.product, quantity));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.serviceType || !formData.product) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Order Submitted!",
      description: "We'll contact you soon to confirm your order.",
    });
    
    // Reset form
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      serviceType: "",
      product: "",
      quantity: 1,
      deliveryDate: "",
      deliveryTime: "",
      specialInstructions: ""
    });
    setTotalCost(0);
  };

  const handleWhatsAppOrder = () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.serviceType || !formData.product) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before ordering via WhatsApp.",
        variant: "destructive"
      });
      return;
    }

    const selectedProduct = products.find(p => p.id === formData.product);
    const message = `Hi! I'd like to place an order:
    
Name: ${formData.fullName}
Phone: ${formData.phone}
Service: ${formData.serviceType}
Product: ${selectedProduct?.name}
Quantity: ${formData.quantity}
Total: ₹${totalCost}
Address: ${formData.address}
${formData.deliveryDate ? `Preferred Date: ${formData.deliveryDate}` : ''}
${formData.deliveryTime ? `Preferred Time: ${formData.deliveryTime}` : ''}
${formData.specialInstructions ? `Special Instructions: ${formData.specialInstructions}` : ''}`;

    const whatsappUrl = `https://wa.me/919XXXXXXXXX?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="order-form" className="py-20 bg-gradient-to-b from-background to-aqua-light/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-ocean-deep mb-4">
            Place Your Order
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Order directly from our website with instant price calculation.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-water">
            <CardHeader>
              <CardTitle className="text-2xl text-ocean-deep flex items-center gap-3">
                <Calculator className="w-8 h-8" />
                Order Form
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="text-ocean-deep">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-ocean-deep">Phone Number (WhatsApp Preferred) *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-ocean-deep">Email Address (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-ocean-deep">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your complete delivery address"
                    required
                  />
                </div>

                {/* Service and Product Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-ocean-deep">Service Type *</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-ocean-deep">Product Selection *</Label>
                    <Select onValueChange={handleProductChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - ₹{product.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="quantity" className="text-ocean-deep">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryDate" className="text-ocean-deep">Preferred Delivery Date</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryTime" className="text-ocean-deep">Preferred Time</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryTime: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (7 AM - 12 PM)</SelectItem>
                        <SelectItem value="evening">Evening (4 PM - 8 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="instructions" className="text-ocean-deep">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    placeholder="Any special delivery instructions or requirements..."
                  />
                </div>

                {/* Price Display */}
                {totalCost > 0 && (
                  <Card className="bg-gradient-to-r from-aqua-light/20 to-wave-blue/20 border-aqua-primary/30">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-ocean-deep mb-2">Total Cost</h3>
                        <p className="text-4xl font-bold text-aqua-primary">₹{totalCost}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {formData.quantity} x {products.find(p => p.id === formData.product)?.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button type="submit" variant="water" size="lg" className="flex-1">
                    <Send className="w-5 h-5 mr-2" />
                    Submit Order
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleWhatsAppOrder}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    💬 Order via WhatsApp
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;