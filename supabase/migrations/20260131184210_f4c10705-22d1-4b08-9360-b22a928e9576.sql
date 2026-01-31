-- Add food_type column to menu_items table
-- Values: 'veg', 'non_veg', 'egg'
ALTER TABLE public.menu_items 
ADD COLUMN food_type text NOT NULL DEFAULT 'veg' 
CHECK (food_type IN ('veg', 'non_veg', 'egg'));

-- Migrate existing data: set food_type based on is_veg column
UPDATE public.menu_items SET food_type = CASE 
  WHEN is_veg = true THEN 'veg' 
  ELSE 'non_veg' 
END;