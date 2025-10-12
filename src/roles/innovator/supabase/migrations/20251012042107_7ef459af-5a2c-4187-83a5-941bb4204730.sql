-- Create team_invitations table
CREATE TABLE public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  innovation_id UUID NOT NULL REFERENCES public.innovations(id) ON DELETE CASCADE,
  invited_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invited_by_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(innovation_id, invited_user_id, status)
);

-- Enable RLS
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_invitations
CREATE POLICY "Users can view invitations sent to them"
ON public.team_invitations FOR SELECT
USING (invited_user_id = auth.uid() OR invited_by_user_id = auth.uid());

CREATE POLICY "Users can update their own invitations"
ON public.team_invitations FOR UPDATE
USING (invited_user_id = auth.uid());

CREATE POLICY "Innovation owners can create invitations"
ON public.team_invitations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.innovations
    WHERE id = innovation_id AND user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE innovation_id = team_invitations.innovation_id 
    AND user_id = auth.uid()
  )
);

-- Update innovations RLS to allow team members to view and update
CREATE POLICY "Team members can view their team innovations"
ON public.innovations FOR SELECT
USING (
  status = 'published' OR 
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.innovation_id = innovations.id
    AND team_members.user_id = auth.uid()
  )
);

CREATE POLICY "Team members can update their team innovations"
ON public.innovations FOR UPDATE
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.innovation_id = innovations.id
    AND team_members.user_id = auth.uid()
  )
);

-- Update pitches RLS to allow team members
CREATE POLICY "Team members can create pitches"
ON public.pitches FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND (
    EXISTS (
      SELECT 1 FROM public.innovations
      WHERE innovations.id = pitches.innovation_id
      AND innovations.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.innovation_id = pitches.innovation_id
      AND team_members.user_id = auth.uid()
    )
  )
);

CREATE POLICY "Team members can view their team pitches"
ON public.pitches FOR SELECT
USING (
  visibility = 'public' OR 
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.innovation_id = pitches.innovation_id
    AND team_members.user_id = auth.uid()
  )
);

CREATE POLICY "Team members can update their team pitches"
ON public.pitches FOR UPDATE
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.innovation_id = pitches.innovation_id
    AND team_members.user_id = auth.uid()
  )
);

CREATE POLICY "Team members can delete their team pitches"
ON public.pitches FOR DELETE
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.innovation_id = pitches.innovation_id
    AND team_members.user_id = auth.uid()
  )
);

-- Update pitch_analytics RLS
CREATE POLICY "Team members can view their team analytics"
ON public.pitch_analytics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.pitches
    JOIN public.team_members ON team_members.innovation_id = pitches.innovation_id
    WHERE pitches.id = pitch_analytics.pitch_id
    AND team_members.user_id = auth.uid()
  )
);

CREATE POLICY "Team members can insert analytics"
ON public.pitch_analytics FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pitches
    JOIN public.team_members ON team_members.innovation_id = pitches.innovation_id
    WHERE pitches.id = pitch_analytics.pitch_id
    AND team_members.user_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_team_invitations_updated_at
BEFORE UPDATE ON public.team_invitations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();