-- Create teams table
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create team_members table
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(team_id, user_id)
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams
CREATE POLICY "Users can view teams they are members of"
  ON public.teams FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.team_members WHERE team_id = teams.id
    )
  );

CREATE POLICY "Users can create teams"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team creators can update their teams"
  ON public.teams FOR UPDATE
  USING (auth.uid() = created_by);

-- RLS Policies for team_members
CREATE POLICY "Users can view members of their teams"
  ON public.team_members FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.team_members tm WHERE tm.team_id = team_members.team_id
    )
  );

CREATE POLICY "Team creators can add members"
  ON public.team_members FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT created_by FROM public.teams WHERE id = team_id
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();