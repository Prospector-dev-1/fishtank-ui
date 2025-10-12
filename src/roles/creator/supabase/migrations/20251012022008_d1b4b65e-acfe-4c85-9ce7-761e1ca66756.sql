-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view members of their teams" ON public.team_members;
DROP POLICY IF EXISTS "Team creators can add members" ON public.team_members;
DROP POLICY IF EXISTS "Users can view teams they are members of" ON public.teams;

-- Create security definer function to check team membership
CREATE OR REPLACE FUNCTION public.is_team_member(_team_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = _team_id AND user_id = _user_id
  )
$$;

-- Create security definer function to check if user created the team
CREATE OR REPLACE FUNCTION public.is_team_creator(_team_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teams
    WHERE id = _team_id AND created_by = _user_id
  )
$$;

-- Recreate policies using security definer functions
CREATE POLICY "Users can view teams they are members of"
  ON public.teams FOR SELECT
  USING (public.is_team_member(id, auth.uid()));

CREATE POLICY "Users can view members of their teams"
  ON public.team_members FOR SELECT
  USING (public.is_team_member(team_id, auth.uid()));

CREATE POLICY "Team creators can add members"
  ON public.team_members FOR INSERT
  WITH CHECK (public.is_team_creator(team_id, auth.uid()));