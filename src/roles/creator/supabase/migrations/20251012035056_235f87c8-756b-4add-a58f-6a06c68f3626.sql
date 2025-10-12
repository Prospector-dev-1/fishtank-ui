-- Add DELETE policy for team_members so users can exit groups
CREATE POLICY "Users can leave teams"
ON public.team_members
FOR DELETE
USING (auth.uid() = user_id);

-- Add DELETE policy for teams so creators can delete their teams
CREATE POLICY "Team creators can delete their teams"
ON public.teams
FOR DELETE
USING (auth.uid() = created_by);