-- Create menu_categories table
CREATE TABLE public.menu_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_items table
CREATE TABLE public.menu_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    is_veg BOOLEAN NOT NULL DEFAULT true,
    subcategory TEXT,
    image_key TEXT NOT NULL DEFAULT 'sandwich',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table (for simple admin access)
CREATE TABLE public.admin_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for menu (everyone can view menu)
CREATE POLICY "Anyone can view menu categories" 
ON public.menu_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view active menu items" 
ON public.menu_items 
FOR SELECT 
USING (is_active = true);

-- Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users WHERE email = _email
    )
$$;

-- Admin can manage menu categories
CREATE POLICY "Admins can insert menu categories" 
ON public.menu_categories 
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admins can update menu categories" 
ON public.menu_categories 
FOR UPDATE 
TO authenticated 
USING (public.is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admins can delete menu categories" 
ON public.menu_categories 
FOR DELETE 
TO authenticated 
USING (public.is_admin(auth.jwt()->>'email'));

-- Admin can manage menu items
CREATE POLICY "Admins can insert menu items" 
ON public.menu_items 
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admins can update menu items" 
ON public.menu_items 
FOR UPDATE 
TO authenticated 
USING (public.is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admins can delete menu items" 
ON public.menu_items 
FOR DELETE 
TO authenticated 
USING (public.is_admin(auth.jwt()->>'email'));

-- Admin can view admin_users (only to check their own status)
CREATE POLICY "Admins can view admin list" 
ON public.admin_users 
FOR SELECT 
TO authenticated 
USING (public.is_admin(auth.jwt()->>'email'));

-- Create timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_menu_categories_updated_at
BEFORE UPDATE ON public.menu_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX idx_menu_items_active ON public.menu_items(is_active);
CREATE INDEX idx_admin_users_email ON public.admin_users(email);