CREATE POLICY "Admins can delete admin users"
ON public.admin_users
FOR DELETE
TO authenticated
USING (is_admin((auth.jwt() ->> 'email'::text)));