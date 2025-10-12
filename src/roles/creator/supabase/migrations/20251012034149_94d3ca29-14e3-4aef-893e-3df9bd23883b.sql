-- Add foreign key relationship between team_members.user_id and profiles.id
ALTER TABLE public.team_members
ADD CONSTRAINT fk_team_members_profiles
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;