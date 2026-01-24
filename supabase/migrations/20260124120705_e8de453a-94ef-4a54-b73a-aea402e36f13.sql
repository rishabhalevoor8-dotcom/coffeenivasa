-- Add spice_type column to menu_items table
ALTER TABLE public.menu_items 
ADD COLUMN spice_type text NOT NULL DEFAULT 'not_spicy' 
CHECK (spice_type IN ('not_spicy', 'mild', 'spicy'));