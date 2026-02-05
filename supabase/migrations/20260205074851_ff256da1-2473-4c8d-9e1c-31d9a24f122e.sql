-- Allow users to insert their own role (needed during signup)
CREATE POLICY "Users can insert their own role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow anyone to insert into admin_users (signup code verification happens in app)
CREATE POLICY "Anyone can insert admin users"
ON public.admin_users
FOR INSERT
WITH CHECK (true);