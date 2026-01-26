-- Create reviews table for customer testimonials
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '👤',
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
ON public.reviews
FOR SELECT
USING (is_approved = true);

-- Anyone can submit a review
CREATE POLICY "Anyone can submit reviews"
ON public.reviews
FOR INSERT
WITH CHECK (true);

-- Admins can view all reviews
CREATE POLICY "Admins can view all reviews"
ON public.reviews
FOR SELECT
USING (is_admin((auth.jwt() ->> 'email'::text)));

-- Admins can update reviews (for approval)
CREATE POLICY "Admins can update reviews"
ON public.reviews
FOR UPDATE
USING (is_admin((auth.jwt() ->> 'email'::text)));

-- Admins can delete reviews
CREATE POLICY "Admins can delete reviews"
ON public.reviews
FOR DELETE
USING (is_admin((auth.jwt() ->> 'email'::text)));

-- Insert some initial approved reviews
INSERT INTO public.reviews (name, rating, text, avatar, is_approved) VALUES
('Priya Sharma', 5, 'The best coffee in Doddanekundi! The ambience is so cozy and the staff is incredibly friendly. My go-to place for weekend brunches.', '👩', true),
('Rahul Menon', 5, 'Amazing food and coffee. The Masala Maggi is addictive! Highly recommend this café for anyone looking for authentic flavors.', '👨', true),
('Sneha Reddy', 5, 'Love the vibe here! Perfect place to catch up with friends or work remotely. The cold coffee is absolutely divine.', '👩‍💼', true),
('Amit Kumar', 5, 'Fantastic place for students! Great WiFi, amazing coffee, and the prices are very reasonable. The fried rice is a must-try!', '👨‍💻', true),
('Deepa Nair', 5, 'Hidden gem in Bangalore! The paneer tikka sandwich is out of this world. Staff remembers your order after a few visits.', '👩‍🍳', true),
('Karthik Rao', 4, 'Lovely café with a warm atmosphere. The espresso is strong and flavorful. Only wish they had more seating during peak hours.', '👨‍🎓', true),
('Anjali Gupta', 5, 'My favorite spot for evening snacks! The spring rolls and mojito combo is perfect. Highly recommend for date nights.', '💁‍♀️', true),
('Vikram Singh', 5, 'Best cold coffee in the area, hands down! The staff is super polite and the place is always clean. 10/10 would recommend!', '🧑', true);