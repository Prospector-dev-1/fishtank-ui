-- Create invitations table
CREATE TABLE public.invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  note TEXT,
  split_pct INTEGER,
  nda_required BOOLEAN DEFAULT false,
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view invitations sent to them"
  ON public.invitations
  FOR SELECT
  USING (auth.uid() = to_creator_id);

CREATE POLICY "Users can view invitations they sent"
  ON public.invitations
  FOR SELECT
  USING (auth.uid() = from_user_id);

CREATE POLICY "Users can create invitations"
  ON public.invitations
  FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Invited users can update invitation status"
  ON public.invitations
  FOR UPDATE
  USING (auth.uid() = to_creator_id);

-- Add updated_at trigger
CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();