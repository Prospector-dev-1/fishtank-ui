-- Add skills, interests, and seeking columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS seeking text[] DEFAULT '{}';