-- Allow anyone to update order status (for PIN-protected kitchen display)
-- This is acceptable as the kitchen display is PIN protected at app level
CREATE POLICY "Anyone can update orders"
ON public.orders
FOR UPDATE
USING (true)
WITH CHECK (true);