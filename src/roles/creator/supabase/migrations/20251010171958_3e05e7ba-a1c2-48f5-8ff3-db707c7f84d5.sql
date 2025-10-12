-- Create enums
CREATE TYPE public.app_role AS ENUM ('creator', 'startup', 'admin');
CREATE TYPE public.contract_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
CREATE TYPE public.milestone_status AS ENUM ('pending', 'in_progress', 'submitted', 'approved', 'rejected');
CREATE TYPE public.proposal_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE public.funding_stage AS ENUM ('pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'public');

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Creator profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  hourly_rate DECIMAL(10,2),
  project_rate DECIMAL(10,2),
  availability_status TEXT DEFAULT 'available',
  years_experience INTEGER,
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Startup profiles table
CREATE TABLE public.startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  industry TEXT,
  founding_date DATE,
  team_size INTEGER,
  location TEXT,
  funding_stage funding_stage,
  description TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Creator skills junction table
CREATE TABLE public.creator_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(creator_id, skill_id)
);

-- Portfolio items table
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Projects/Opportunities table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  timeline_weeks INTEGER,
  image_url TEXT,
  required_skills TEXT[],
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Proposals table
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_letter TEXT NOT NULL,
  proposed_rate DECIMAL(10,2) NOT NULL,
  proposed_timeline_weeks INTEGER NOT NULL,
  status proposal_status DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, creator_id)
);

-- Contracts table
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status contract_status DEFAULT 'pending',
  start_date DATE,
  end_date DATE,
  signed_nda BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Milestones table
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE,
  status milestone_status DEFAULT 'pending',
  submission_notes TEXT,
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  delivery_days INTEGER,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Earnings/Payments table
CREATE TABLE public.earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Endorsements table
CREATE TABLE public.endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  endorser_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(creator_id, endorser_id)
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT,
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for startups
CREATE POLICY "Public startups are viewable by everyone"
  ON public.startups FOR SELECT
  USING (true);

CREATE POLICY "Startup users can update own startup"
  ON public.startups FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Startup users can insert own startup"
  ON public.startups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for skills
CREATE POLICY "Skills are viewable by everyone"
  ON public.skills FOR SELECT
  USING (true);

-- RLS Policies for creator_skills
CREATE POLICY "Creator skills are viewable by everyone"
  ON public.creator_skills FOR SELECT
  USING (true);

CREATE POLICY "Creators can manage own skills"
  ON public.creator_skills FOR ALL
  USING (auth.uid() = creator_id);

-- RLS Policies for portfolio_items
CREATE POLICY "Portfolio items are viewable by everyone"
  ON public.portfolio_items FOR SELECT
  USING (true);

CREATE POLICY "Creators can manage own portfolio"
  ON public.portfolio_items FOR ALL
  USING (auth.uid() = creator_id);

-- RLS Policies for projects
CREATE POLICY "Projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Startups can manage own projects"
  ON public.projects FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM public.startups WHERE id = startup_id));

-- RLS Policies for proposals
CREATE POLICY "Creators can view own proposals"
  ON public.proposals FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "Startups can view proposals for their projects"
  ON public.proposals FOR SELECT
  USING (auth.uid() IN (
    SELECT s.user_id FROM public.startups s
    JOIN public.projects p ON p.startup_id = s.id
    WHERE p.id = project_id
  ));

CREATE POLICY "Creators can create proposals"
  ON public.proposals FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own proposals"
  ON public.proposals FOR UPDATE
  USING (auth.uid() = creator_id);

-- RLS Policies for contracts
CREATE POLICY "Creators can view own contracts"
  ON public.contracts FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "Startups can view own contracts"
  ON public.contracts FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM public.startups WHERE id = startup_id));

CREATE POLICY "Startups can create contracts"
  ON public.contracts FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.startups WHERE id = startup_id));

CREATE POLICY "Both parties can update contracts"
  ON public.contracts FOR UPDATE
  USING (
    auth.uid() = creator_id OR 
    auth.uid() IN (SELECT user_id FROM public.startups WHERE id = startup_id)
  );

-- RLS Policies for milestones
CREATE POLICY "Contract parties can view milestones"
  ON public.milestones FOR SELECT
  USING (
    auth.uid() IN (
      SELECT creator_id FROM public.contracts WHERE id = contract_id
      UNION
      SELECT user_id FROM public.startups s
      JOIN public.contracts c ON c.startup_id = s.id
      WHERE c.id = contract_id
    )
  );

CREATE POLICY "Startups can create milestones"
  ON public.milestones FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT s.user_id FROM public.startups s
      JOIN public.contracts c ON c.startup_id = s.id
      WHERE c.id = contract_id
    )
  );

CREATE POLICY "Contract parties can update milestones"
  ON public.milestones FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT creator_id FROM public.contracts WHERE id = contract_id
      UNION
      SELECT user_id FROM public.startups s
      JOIN public.contracts c ON c.startup_id = s.id
      WHERE c.id = contract_id
    )
  );

-- RLS Policies for services
CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT
  USING (true);

CREATE POLICY "Creators can manage own services"
  ON public.services FOR ALL
  USING (auth.uid() = creator_id);

-- RLS Policies for messages
CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update read status"
  ON public.messages FOR UPDATE
  USING (auth.uid() = recipient_id);

-- RLS Policies for earnings
CREATE POLICY "Creators can view own earnings"
  ON public.earnings FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "System can create earnings"
  ON public.earnings FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- RLS Policies for endorsements
CREATE POLICY "Endorsements are viewable by everyone"
  ON public.endorsements FOR SELECT
  USING (true);

CREATE POLICY "Users can create endorsements"
  ON public.endorsements FOR INSERT
  WITH CHECK (auth.uid() = endorser_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.startups
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.milestones
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Assign default creator role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'creator');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();