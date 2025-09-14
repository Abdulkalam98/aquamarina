import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Droplet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CartItem } from "./Cart";

const products = [
  { id: "250ml", name: "Pure Water", size: "250ML Bottle", price: 10, unit: "per bottle" },
  { id: "500ml", name: "Pure Water", size: "500ML Bottle", price: 15, unit: "per bottle" },
  { id: "1l", name: "Pure Water", size: "1L Bottle", price: 25, unit: "per bottle" },
  { id: "20l", name: "Pure Water", size: "20L Can", price: 120, unit: "per can" },
];

interface ProductSelectorProps {
  onAddToCart: (item: CartItem) => void;
}

const ProductSelector = ({ onAddToCart }: ProductSelectorProps) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const handleQuantityChange = (productId: string, quantity: string) => {
    const numQuantity = parseInt(quantity) || 0;
    setQuantities(prev => ({
      ...prev,
      [productId]: numQuantity
    }));
  };

  const handleAddToCart = (product: typeof products[0]) => {
    const quantity = quantities[product.id] || 0;
    
    if (quantity < 1) {
      toast({
        description: "Please enter a valid quantity",
        variant: "destructive"
      });
      return;
    }

    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`, // Unique ID for cart item
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: product.size
    };

    onAddToCart(cartItem);
    
    // Reset quantity after adding
    setQuantities(prev => ({
      ...prev,
      [product.id]: 0
    }));

    toast({
      description: `Added ${quantity} × ${product.size} to cart`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-ocean-deep">
          <Droplet className="w-5 h-5 text-aqua-primary" />
          Select Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="border-aqua-light/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-aqua-primary to-wave-blue rounded-full flex items-center justify-center">
                    <Droplet className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-ocean-deep">{product.size}</h4>
                    <p className="text-sm text-muted-foreground">₹{product.price} {product.unit}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`quantity-${product.id}`} className="text-sm font-medium text-ocean-deep">
                      Quantity
                    </Label>
                    <Input
                      id={`quantity-${product.id}`}
                      type="number"
                      min="0"
                      value={quantities[product.id] || ""}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    size="sm"
                    className="mt-6"
                    disabled={!quantities[product.id] || quantities[product.id] < 1}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSelector;