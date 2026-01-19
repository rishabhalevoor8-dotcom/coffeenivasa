-- Allow kitchen staff to update order status
CREATE POLICY "Kitchen staff can update orders"
ON public.orders
FOR UPDATE
USING (has_staff_role(auth.uid(), 'kitchen'))
WITH CHECK (has_staff_role(auth.uid(), 'kitchen'));