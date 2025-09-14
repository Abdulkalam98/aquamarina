import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const Cart = ({ items, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) => {
  const { toast } = useToast();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      onRemoveItem(id);
      toast({
        description: "Item removed from cart",
      });
    } else {
      onUpdateQuantity(id, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-ocean-deep">
            <ShoppingCart className="w-5 h-5" />
            Your Cart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Your cart is empty
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-ocean-deep">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Your Cart ({totalItems} items)
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-aqua-light/10 rounded-lg p-3">
            <div className="flex-1">
              <h4 className="font-medium text-ocean-deep">{item.name}</h4>
              <p className="text-sm text-muted-foreground">{item.size}</p>
              <p className="text-sm font-semibold text-ocean-deep">₹{item.price}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                <Minus className="w-3 h-3" />
              </Button>
              
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-red-500 hover:text-red-700"
                onClick={() => onRemoveItem(item.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center text-lg font-bold text-ocean-deep">
            <span>Total:</span>
            <span>₹{totalCost}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cart;