-- Add innovation_id column to team_members table to link team members directly to innovations
ALTER TABLE public.team_members 
ADD COLUMN innovation_id uuid REFERENCES public.innovations(id) ON DELETE CASCADE;

-- Make team_id nullable since we'll be using innovation_id instead for innovation teams
ALTER TABLE public.team_members 
ALTER COLUMN team_id DROP NOT NULL;

-- Add check constraint to ensure either team_id or innovation_id is set
ALTER TABLE public.team_members
ADD CONSTRAINT team_or_innovation_required 
CHECK (
  (team_id IS NOT NULL AND innovation_id IS NULL) OR 
  (team_id IS NULL AND innovation_id IS NOT NULL)
);

-- Update RLS policy for team members to include innovation owners
DROP POLICY IF EXISTS "Team members are viewable by everyone" ON public.team_members;
CREATE POLICY "Team members are viewable by everyone"
ON public.team_members
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Team owners/admins can add members" ON public.team_members;
CREATE POLICY "Team owners/admins can add members"
ON public.team_members
FOR INSERT
WITH CHECK (
  -- Allow if user owns the team
  EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = team_members.team_id
    AND tm.user_id = auth.uid()
    AND tm.role IN ('owner', 'admin')
  )
  OR
  -- Allow if user owns the innovation
  EXISTS (
    SELECT 1 FROM innovations i
    WHERE i.id = team_members.innovation_id
    AND i.user_id = auth.uid()
  )
);

-- Add policy for updating team members
CREATE POLICY "Innovation owners can update team members"
ON public.team_members
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM innovations i
    WHERE i.id = team_members.innovation_id
    AND i.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = team_members.team_id
    AND tm.user_id = auth.uid()
    AND tm.role IN ('owner', 'admin')
  )
);

-- Add policy for deleting team members
CREATE POLICY "Innovation owners can delete team members"
ON public.team_members
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM innovations i
    WHERE i.id = team_members.innovation_id
    AND i.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = team_members.team_id
    AND tm.user_id = auth.uid()
    AND tm.role IN ('owner', 'admin')
  )
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_team_members_innovation_id ON public.team_members(innovation_id);