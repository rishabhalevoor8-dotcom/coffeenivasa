-- Add a policy for admins to view ALL menu items (including inactive)
CREATE POLICY "Admins can view all menu items" 
ON public.menu_items 
FOR SELECT 
USING (is_admin((auth.jwt() ->> 'email'::text)));