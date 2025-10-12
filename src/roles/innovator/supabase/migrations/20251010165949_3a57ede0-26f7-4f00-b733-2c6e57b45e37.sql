-- Add foreign key constraint from thoughts.user_id to profiles.id
ALTER TABLE public.thoughts 
ADD CONSTRAINT thoughts_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;