-- Create security definer function to get user permission level
CREATE OR REPLACE FUNCTION public.get_user_permission_level(
  _innovation_id uuid,
  _user_id uuid
)
RETURNS permission_level
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT permission_level 
  FROM team_members 
  WHERE innovation_id = _innovation_id 
    AND user_id = _user_id
  LIMIT 1;
$$;

-- Update RLS policies for innovations table
DROP POLICY IF EXISTS "Owners and admins can update innovations" ON public.innovations;
CREATE POLICY "Owners and admins can update innovations"
ON public.innovations
FOR UPDATE
USING (
  user_id = auth.uid() 
  OR get_user_permission_level(id, auth.uid()) IN ('founder', 'co_founder', 'admin')
);

-- Update RLS policies for pitches table
DROP POLICY IF EXISTS "Owners and admins can update pitches" ON public.pitches;
CREATE POLICY "Owners and admins can update pitches"
ON public.pitches
FOR UPDATE
USING (
  user_id = auth.uid() 
  OR get_user_permission_level(innovation_id, auth.uid()) IN ('founder', 'co_founder', 'admin')
);

DROP POLICY IF EXISTS "Owners and admins can delete pitches" ON public.pitches;
CREATE POLICY "Owners and admins can delete pitches"
ON public.pitches
FOR DELETE
USING (
  user_id = auth.uid() 
  OR get_user_permission_level(innovation_id, auth.uid()) IN ('founder', 'co_founder', 'admin')
);

DROP POLICY IF EXISTS "Team members can create pitches for their innovations" ON public.pitches;
CREATE POLICY "Team members can create pitches for their innovations"
ON public.pitches
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND get_user_permission_level(innovation_id, auth.uid()) IN ('founder', 'co_founder', 'member', 'admin')
);

-- Update RLS policies for team_members table
DROP POLICY IF EXISTS "Owners and admins can update team members" ON public.team_members;
CREATE POLICY "Owners and admins can update team members"
ON public.team_members
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM innovations i 
    WHERE i.id = team_members.innovation_id 
      AND i.user_id = auth.uid()
  )
  OR get_user_permission_level(innovation_id, auth.uid()) IN ('founder', 'co_founder', 'admin')
);

DROP POLICY IF EXISTS "Owners and admins can delete team members" ON public.team_members;
CREATE POLICY "Owners and admins can delete team members"
ON public.team_members
FOR DELETE
USING (
  (
    EXISTS (
      SELECT 1 FROM innovations i 
      WHERE i.id = team_members.innovation_id 
        AND i.user_id = auth.uid()
    )
    OR get_user_permission_level(innovation_id, auth.uid()) IN ('founder', 'co_founder', 'admin')
  )
  AND user_id != (
    SELECT user_id FROM innovations 
    WHERE id = team_members.innovation_id
  )
);

-- Update RLS policies for pitch_analytics table
DROP POLICY IF EXISTS "Team members can view their team analytics" ON public.pitch_analytics;
CREATE POLICY "Team members can view their team analytics"
ON public.pitch_analytics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM pitches p
    WHERE p.id = pitch_analytics.pitch_id
      AND get_user_permission_level(p.innovation_id, auth.uid()) IS NOT NULL
  )
);

DROP POLICY IF EXISTS "Team members can insert analytics" ON public.pitch_analytics;
CREATE POLICY "Team members can insert analytics"
ON public.pitch_analytics
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM pitches p
    WHERE p.id = pitch_analytics.pitch_id
      AND get_user_permission_level(p.innovation_id, auth.uid()) IN ('founder', 'co_founder', 'member', 'admin')
  )
);