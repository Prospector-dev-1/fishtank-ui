-- Allow users to add themselves to team_members when they have a pending invitation
CREATE POLICY "Users can accept team invitations"
ON public.team_members
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM team_invitations
    WHERE team_invitations.innovation_id = team_members.innovation_id
      AND team_invitations.invited_user_id = auth.uid()
      AND team_invitations.invited_user_id = team_members.user_id
      AND team_invitations.status = 'pending'
  )
);