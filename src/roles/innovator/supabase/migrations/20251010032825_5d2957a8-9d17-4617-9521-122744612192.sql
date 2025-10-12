-- Add FAQs column to innovations table
ALTER TABLE public.innovations
ADD COLUMN faqs JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.innovations.faqs IS 'Array of FAQ objects with question and answer fields';