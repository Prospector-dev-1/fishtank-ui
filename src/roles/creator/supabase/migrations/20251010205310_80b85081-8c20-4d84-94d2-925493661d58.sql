-- Add equity and commission columns to services table
ALTER TABLE public.services
ADD COLUMN offers_equity boolean DEFAULT false,
ADD COLUMN offers_commission boolean DEFAULT false;