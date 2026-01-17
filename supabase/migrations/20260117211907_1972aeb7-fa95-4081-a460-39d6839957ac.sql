-- Add card_pending to payment_status enum
ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'card_pending';