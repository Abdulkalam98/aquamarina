import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Droplet, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { CartItem } from "./Cart";

interface Product {
  id: string;
  name: string;
  size: string;
  price: number;
  unit: string;
  description?: string;
}

interface ProductSelectorProps {
  onAddToCart: (item: CartItem) => void;
}

const ProductSelector = ({ onAddToCart }: ProductSelectorProps) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('price');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId: string, quantity: string) => {
    const numQuantity = parseInt(quantity) || 0;
    setQuantities(prev => ({
      ...prev,
      [productId]: numQuantity
    }));
  };

  const handleAddToCart = (product: Product) => {
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

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aqua-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-ocean-deep">
          <Package className="w-5 h-5 text-aqua-primary" />
          Premium Water Cases & Packages
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          All products are sold as complete cases for better value
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="border-aqua-light/30 hover:shadow-water transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-aqua-primary to-wave-blue rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-ocean-deep">{product.size}</h4>
                    <p className="text-xs text-aqua-primary font-medium mb-1">Premium Quality</p>
                    <p className="text-sm font-bold text-ocean-deep">₹{product.price} {product.unit}</p>
                    {product.description && (
                      <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                    )}
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