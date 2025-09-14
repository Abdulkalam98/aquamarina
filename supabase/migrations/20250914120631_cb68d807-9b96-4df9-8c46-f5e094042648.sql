-- Add user_id column to orders table
ALTER TABLE orders ADD COLUMN user_id uuid REFERENCES auth.users (id);

-- Create a function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;

-- Create new RLS policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id OR public.get_current_user_role() = 'admin');

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders" 
ON public.orders 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete orders"
ON public.orders
FOR DELETE
USING (public.get_current_user_role() = 'admin');

-- Create a products table for admin price control
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  size text NOT NULL,
  price integer NOT NULL,
  unit text NOT NULL DEFAULT 'per case',
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Everyone can view active products" 
ON public.products 
FOR SELECT 
USING (is_active = true OR public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Insert default products as cases
INSERT INTO public.products (name, size, price, unit, description) VALUES
('Pure Water', '20L Jar', 120, 'per jar', 'Best for Homes & Offices - Purity you can trust'),
('Pure Water', '2L Bottle (Pack of 9)', 270, 'per pack', 'Perfect for Family Use - Convenient family packs'),
('Pure Water', '1L Bottle (Case of 12)', 300, 'per case', 'Ideal for Daily Use - Perfect portion size'),
('Pure Water', '500ml Bottle (Case of 24)', 360, 'per case', 'Great for Travel & Gym - Travel-friendly size'),
('Pure Water', '250ml Bottle (Case of 24)', 240, 'per case', 'Perfect for Kids & Events - Kid-friendly size'),
('Pure Water', '200ml Bottle (Case of 48)', 400, 'per case', 'Compact & Convenient - Ultra-portable');

-- Create trigger for products updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();