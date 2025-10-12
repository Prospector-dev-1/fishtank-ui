-- Drop and recreate the SELECT policy to allow creators to see their teams
DROP POLICY IF EXISTS "Users can view teams they are members of" ON public.teams;

CREATE POLICY "Users can view their teams"
  ON public.teams FOR SELECT
  USING (
    auth.uid() = created_by OR 
    public.is_team_member(id, auth.uid())
  );