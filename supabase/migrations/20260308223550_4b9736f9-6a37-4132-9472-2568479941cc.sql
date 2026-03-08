
CREATE TABLE public.special_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  discount_text text NOT NULL DEFAULT '',
  badge text NOT NULL DEFAULT 'Popular',
  image_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active offers" ON public.special_offers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all offers" ON public.special_offers
  FOR SELECT USING (is_admin((auth.jwt() ->> 'email'::text)));

CREATE POLICY "Admins can insert offers" ON public.special_offers
  FOR INSERT WITH CHECK (is_admin((auth.jwt() ->> 'email'::text)));

CREATE POLICY "Admins can update offers" ON public.special_offers
  FOR UPDATE USING (is_admin((auth.jwt() ->> 'email'::text)));

CREATE POLICY "Admins can delete offers" ON public.special_offers
  FOR DELETE USING (is_admin((auth.jwt() ->> 'email'::text)));

-- Seed with initial offers
INSERT INTO public.special_offers (title, description, discount_text, badge, display_order) VALUES
  ('Combo Meal Deal', 'Any Sandwich + Cold Coffee at a special price', '20% OFF', 'Most Popular', 1),
  ('Pasta Fest', 'Try our signature pasta with a complimentary drink', '₹149 Only', 'Limited Time', 2),
  ('Dessert Special', 'Brownie Ice Cream Sundae — indulge your sweet tooth', 'Buy 1 Get 1', 'Weekend Only', 3);
