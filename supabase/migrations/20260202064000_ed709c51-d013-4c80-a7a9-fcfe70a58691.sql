-- Add description column to menu_items table
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- Add Breakfast category
INSERT INTO public.menu_categories (name, icon, display_order)
VALUES ('Breakfast', '🍳', 13)
ON CONFLICT DO NOTHING;

-- Create storage bucket for menu item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public to view menu images
CREATE POLICY "Anyone can view menu images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'menu-images');

-- Allow admins to upload menu images
CREATE POLICY "Admins can upload menu images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'menu-images' 
  AND is_admin((SELECT auth.jwt() ->> 'email'::text))
);

-- Allow admins to update menu images
CREATE POLICY "Admins can update menu images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'menu-images' 
  AND is_admin((SELECT auth.jwt() ->> 'email'::text))
);

-- Allow admins to delete menu images
CREATE POLICY "Admins can delete menu images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'menu-images' 
  AND is_admin((SELECT auth.jwt() ->> 'email'::text))
);