-- Create enum for staff roles
CREATE TYPE public.staff_role AS ENUM ('admin', 'kitchen');

-- Create user_roles table for staff role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role staff_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_staff_role(_user_id UUID, _role staff_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_staff_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_staff_role(auth.uid(), 'admin'))
WITH CHECK (has_staff_role(auth.uid(), 'admin'));

-- Allow users to see their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Insert default signup codes into system_settings (if not exists)
INSERT INTO public.system_settings (key, value)
VALUES 
    ('admin_signup_code', 'ADMIN2024'),
    ('kitchen_signup_code', 'KITCHEN2024')
ON CONFLICT (key) DO NOTHING;