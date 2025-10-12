-- Create team_messages table for team chat
CREATE TABLE public.team_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;

-- Team members can view team messages
CREATE POLICY "Team members can view team messages"
ON public.team_messages
FOR SELECT
USING (
  public.is_team_member(team_id, auth.uid())
);

-- Team members can send messages
CREATE POLICY "Team members can send messages"
ON public.team_messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  public.is_team_member(team_id, auth.uid())
);

-- Create index for faster queries
CREATE INDEX idx_team_messages_team_id ON public.team_messages(team_id);
CREATE INDEX idx_team_messages_created_at ON public.team_messages(created_at DESC);

-- Enable realtime for team messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_messages;