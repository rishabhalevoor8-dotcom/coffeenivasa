-- Create a function to reset the order number sequence
CREATE OR REPLACE FUNCTION public.reset_order_number_sequence()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Reset the sequence to start from 1
  ALTER SEQUENCE orders_order_number_seq RESTART WITH 1;
END;
$$;

-- Grant execute permission to authenticated users (admin check will be in RLS)
GRANT EXECUTE ON FUNCTION public.reset_order_number_sequence() TO authenticated;