import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { 
  Settings, 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  ShoppingCart,
  Users
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  size: string;
  price: number;
  unit: string;
  description?: string;
  is_active: boolean;
}

interface Order {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  product: string;
  quantity: number;
  total_cost: number;
  status: string;
  created_at: string;
}

const AdminPanel = () => {
  const { user, userRole, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const { toast } = useToast();

  const [productForm, setProductForm] = useState({
    name: "Pure Water",
    size: "",
    price: 0,
    unit: "per case",
    description: "",
    is_active: true
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || userRole !== 'admin') {
        navigate('/');
        return;
      }
      fetchProducts();
      fetchOrders();
    }
  }, [user, userRole, authLoading, navigate]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

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

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        description: "Failed to load orders",
        variant: "destructive"
      });
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productForm)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast({ description: "Product updated successfully" });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productForm]);

        if (error) throw error;
        toast({ description: "Product created successfully" });
      }

      setProductForm({
        name: "Pure Water",
        size: "",
        price: 0,
        unit: "per case",
        description: "",
        is_active: true
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      toast({
        description: error.message || "Failed to save product",
        variant: "destructive"
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      size: product.size,
      price: product.price,
      unit: product.unit,
      description: product.description || "",
      is_active: product.is_active
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      toast({ description: "Product deleted successfully" });
      fetchProducts();
    } catch (error: any) {
      toast({
        description: error.message || "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      toast({ description: `Order status updated to ${status}` });
      fetchOrders();
    } catch (error: any) {
      toast({
        description: error.message || "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aqua-primary"></div>
      </div>
    );
  }

  if (!user || userRole !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aqua-light/10 via-background to-wave-blue/5">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ocean-deep">Admin Panel</h1>
            <p className="text-muted-foreground">Manage products and orders</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Admin: {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          <Button
            variant={activeTab === 'products' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('products')}
            className="flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Products
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('orders')}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Orders
          </Button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="size">Product Size/Type</Label>
                    <Input
                      id="size"
                      value={productForm.size}
                      onChange={(e) => setProductForm({...productForm, size: e.target.value})}
                      placeholder="e.g., 20L Jar, 1L Bottle (Case of 12)"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={productForm.unit}
                      onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
                      placeholder="e.g., per case, per jar, per pack"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      placeholder="Product description"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={productForm.is_active}
                      onCheckedChange={(checked) => setProductForm({...productForm, is_active: checked})}
                    />
                    <Label htmlFor="is_active">Active Product</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </Button>
                    {editingProduct && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(null);
                          setProductForm({
                            name: "Pure Water",
                            size: "",
                            price: 0,
                            unit: "per case",
                            description: "",
                            is_active: true
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Products List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Products ({products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {products.map((product) => (
                    <div key={product.id} 
                         className={`p-4 border rounded-lg ${product.is_active ? 'border-aqua-light/30' : 'border-gray-300 opacity-60'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-ocean-deep">{product.size}</h4>
                          <p className="text-sm font-bold text-aqua-primary">₹{product.price} {product.unit}</p>
                          {product.description && (
                            <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Recent Orders ({orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 border border-aqua-light/30 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-ocean-deep">{order.full_name}</h4>
                        <p className="text-sm text-muted-foreground">{order.phone} • {order.email}</p>
                        <p className="text-sm text-muted-foreground">{order.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-ocean-deep">₹{order.total_cost}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{order.product}</p>
                        <p className="text-xs text-muted-foreground">Qty: {order.quantity}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                        
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="text-xs border border-aqua-light/30 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;