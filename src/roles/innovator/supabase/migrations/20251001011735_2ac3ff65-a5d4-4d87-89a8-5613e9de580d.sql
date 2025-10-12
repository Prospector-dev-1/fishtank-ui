-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'investor', 'innovator')),
  location TEXT,
  company TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create innovations table
CREATE TABLE public.innovations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  stage TEXT,
  status TEXT DEFAULT 'draft',
  image_url TEXT,
  video_url TEXT,
  tags TEXT[],
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create pitches table
CREATE TABLE public.pitches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  innovation_id UUID NOT NULL REFERENCES public.innovations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  deck_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'investors')),
  funding_goal NUMERIC,
  funding_raised NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create pitch analytics table
CREATE TABLE public.pitch_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pitch_id UUID NOT NULL REFERENCES public.pitches(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  engagement_rate NUMERIC DEFAULT 0,
  avg_watch_time INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(pitch_id, date)
);

-- Create opportunities table
CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('job', 'collaboration', 'investment', 'mentorship')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'filled')),
  location TEXT,
  remote_ok BOOLEAN DEFAULT false,
  skills_required TEXT[],
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(opportunity_id, user_id)
);

-- Create connections table
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  connected_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, connected_user_id),
  CHECK (user_id != connected_user_id)
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create team members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Create message threads table
CREATE TABLE public.message_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  type TEXT DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create thread participants table
CREATE TABLE public.thread_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  UNIQUE(thread_id, user_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  read_by UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  location TEXT,
  virtual_link TEXT,
  max_attendees INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create event attendees table
CREATE TABLE public.event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'declined')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitch_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Innovations RLS Policies
CREATE POLICY "Public innovations are viewable by everyone"
  ON public.innovations FOR SELECT
  USING (status = 'published' OR user_id = auth.uid());

CREATE POLICY "Users can create their own innovations"
  ON public.innovations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own innovations"
  ON public.innovations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own innovations"
  ON public.innovations FOR DELETE
  USING (auth.uid() = user_id);

-- Pitches RLS Policies
CREATE POLICY "Public pitches are viewable by everyone"
  ON public.pitches FOR SELECT
  USING (visibility = 'public' OR user_id = auth.uid());

CREATE POLICY "Users can create their own pitches"
  ON public.pitches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pitches"
  ON public.pitches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pitches"
  ON public.pitches FOR DELETE
  USING (auth.uid() = user_id);

-- Pitch Analytics RLS Policies
CREATE POLICY "Pitch owners can view their analytics"
  ON public.pitch_analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.pitches
    WHERE pitches.id = pitch_analytics.pitch_id
    AND pitches.user_id = auth.uid()
  ));

CREATE POLICY "Pitch owners can insert analytics"
  ON public.pitch_analytics FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.pitches
    WHERE pitches.id = pitch_analytics.pitch_id
    AND pitches.user_id = auth.uid()
  ));

-- Opportunities RLS Policies
CREATE POLICY "All opportunities are viewable by everyone"
  ON public.opportunities FOR SELECT
  USING (true);

CREATE POLICY "Users can create opportunities"
  ON public.opportunities FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own opportunities"
  ON public.opportunities FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own opportunities"
  ON public.opportunities FOR DELETE
  USING (auth.uid() = created_by);

-- Applications RLS Policies
CREATE POLICY "Users can view their own applications"
  ON public.applications FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.opportunities
      WHERE opportunities.id = applications.opportunity_id
      AND opportunities.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create their own applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.applications FOR UPDATE
  USING (auth.uid() = user_id);

-- Connections RLS Policies
CREATE POLICY "Users can view their own connections"
  ON public.connections FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "Users can create connections"
  ON public.connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connections"
  ON public.connections FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

-- Teams RLS Policies
CREATE POLICY "All teams are viewable by everyone"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Users can create teams"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team owners/admins can update teams"
  ON public.teams FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.team_id = teams.id
    AND team_members.user_id = auth.uid()
    AND team_members.role IN ('owner', 'admin')
  ));

-- Team Members RLS Policies
CREATE POLICY "Team members are viewable by everyone"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Team owners/admins can add members"
  ON public.team_members FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = team_members.team_id
    AND tm.user_id = auth.uid()
    AND tm.role IN ('owner', 'admin')
  ));

-- Message Threads RLS Policies
CREATE POLICY "Users can view threads they participate in"
  ON public.message_threads FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.thread_participants
    WHERE thread_participants.thread_id = message_threads.id
    AND thread_participants.user_id = auth.uid()
  ));

CREATE POLICY "Users can create message threads"
  ON public.message_threads FOR INSERT
  WITH CHECK (true);

-- Thread Participants RLS Policies
CREATE POLICY "Users can view participants in their threads"
  ON public.thread_participants FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.thread_participants tp
    WHERE tp.thread_id = thread_participants.thread_id
    AND tp.user_id = auth.uid()
  ));

CREATE POLICY "Users can add participants to threads they're in"
  ON public.thread_participants FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.thread_participants tp
    WHERE tp.thread_id = thread_participants.thread_id
    AND tp.user_id = auth.uid()
  ));

-- Messages RLS Policies
CREATE POLICY "Users can view messages in their threads"
  ON public.messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.thread_participants
    WHERE thread_participants.thread_id = messages.thread_id
    AND thread_participants.user_id = auth.uid()
  ));

CREATE POLICY "Users can send messages to their threads"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.thread_participants
      WHERE thread_participants.thread_id = messages.thread_id
      AND thread_participants.user_id = auth.uid()
    )
  );

-- Notifications RLS Policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Events RLS Policies
CREATE POLICY "All events are viewable by everyone"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Event creators can update events"
  ON public.events FOR UPDATE
  USING (auth.uid() = created_by);

-- Event Attendees RLS Policies
CREATE POLICY "All event attendees are viewable"
  ON public.event_attendees FOR SELECT
  USING (true);

CREATE POLICY "Users can register for events"
  ON public.event_attendees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attendance"
  ON public.event_attendees FOR UPDATE
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_innovations_updated_at BEFORE UPDATE ON public.innovations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pitches_updated_at BEFORE UPDATE ON public.pitches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON public.connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_message_threads_updated_at BEFORE UPDATE ON public.message_threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();