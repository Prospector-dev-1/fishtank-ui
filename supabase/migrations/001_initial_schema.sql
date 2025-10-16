-- Fishtank Database Schema Migration
-- Part 1: Core Tables and Enums

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom enum types
CREATE TYPE user_role AS ENUM ('creator', 'innovator', 'investor');
CREATE TYPE availability_status AS ENUM ('open', 'busy', 'closed');
CREATE TYPE compensation_type AS ENUM ('hourly', 'fixed', 'equity', 'commission');
CREATE TYPE service_type AS ENUM ('fixed', 'hourly');
CREATE TYPE media_type AS ENUM ('image', 'video', 'link');
CREATE TYPE startup_phase AS ENUM ('Idea', 'MVP', 'Growth', 'Launched');
CREATE TYPE investor_type AS ENUM ('VC', 'Angel', 'Corporate', 'Accelerator');
CREATE TYPE interaction_stage AS ENUM ('viewed', 'nda_requested', 'nda_signed', 'meeting_scheduled', 'funding_committed');
CREATE TYPE interest_level AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE portfolio_status AS ENUM ('saved', 'interested', 'contacted', 'passed');
CREATE TYPE brief_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE proposal_status AS ENUM ('pending', 'accepted', 'declined', 'withdrawn');
CREATE TYPE contract_status AS ENUM ('active', 'completed', 'cancelled', 'disputed');
CREATE TYPE milestone_status AS ENUM ('pending', 'in_progress', 'submitted', 'approved', 'rejected', 'paid');
CREATE TYPE nda_status AS ENUM ('pending', 'signed', 'declined', 'expired');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'declined');
CREATE TYPE earnings_status AS ENUM ('pending', 'held', 'released', 'paid');
CREATE TYPE dispute_status AS ENUM ('open', 'under_review', 'resolved', 'closed');
CREATE TYPE notification_type AS ENUM ('message', 'proposal', 'milestone', 'payment', 'review', 'system');
CREATE TYPE message_system_type AS ENUM ('nda', 'proposal', 'milestone', 'release', 'dispute');
CREATE TYPE activity_type AS ENUM ('proposal_submitted', 'milestone_completed', 'contract_started', 'review_received', 'connection_made', 'startup_published');

-- ============================================================================
-- CORE USER TABLES
-- ============================================================================

-- Main profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    timezone TEXT DEFAULT 'UTC',
    website TEXT,
    social_linkedin TEXT,
    social_twitter TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CREATOR TABLES
-- ============================================================================

CREATE TABLE creator_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    headline TEXT,
    skills TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0,
    availability availability_status DEFAULT 'open',
    compensation_types TEXT[] DEFAULT '{}',
    hourly_rate DECIMAL(12,2),
    response_time TEXT,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    released_earnings DECIMAL(12,2) DEFAULT 0,
    held_earnings DECIMAL(12,2) DEFAULT 0,
    pending_earnings DECIMAL(12,2) DEFAULT 0,
    endorsement_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE creator_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    scope TEXT[] DEFAULT '{}',
    eta_days INTEGER,
    type service_type NOT NULL,
    price DECIMAL(12,2),
    hourly_rate DECIMAL(12,2),
    offers TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE creator_portfolio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    media_type media_type NOT NULL,
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE creator_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reviewer_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    text TEXT,
    project_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE creator_endorsements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    endorser_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skill TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(creator_id, endorser_id, skill)
);

-- ============================================================================
-- INNOVATOR TABLES
-- ============================================================================

CREATE TABLE innovator_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT,
    industry TEXT,
    stage startup_phase,
    pitch_video_url TEXT,
    pitch_deck_url TEXT,
    elevator_pitch TEXT,
    problem_statement TEXT,
    solution TEXT,
    target_market TEXT,
    business_model TEXT,
    traction_metrics JSONB DEFAULT '{}',
    funding_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE startups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    blurb TEXT,
    category TEXT,
    phase startup_phase NOT NULL,
    website TEXT,
    banner_url TEXT,
    video_url TEXT,
    long_video_url TEXT,
    poster_url TEXT,
    nda_required BOOLEAN DEFAULT FALSE,
    open_positions TEXT[] DEFAULT '{}',
    problem_solution TEXT,
    founder_note TEXT,
    current_status TEXT,
    tags TEXT[] DEFAULT '{}',
    metrics_views INTEGER DEFAULT 0,
    metrics_avg_watch_sec INTEGER DEFAULT 0,
    metrics_interest INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

CREATE TABLE startup_team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE startup_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE startup_faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE startup_traction (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    metric TEXT NOT NULL,
    value TEXT NOT NULL,
    date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INVESTOR TABLES
-- ============================================================================

CREATE TABLE investor_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    firm_name TEXT,
    investor_type investor_type,
    investment_thesis TEXT,
    preferred_sectors TEXT[] DEFAULT '{}',
    preferred_stages TEXT[] DEFAULT '{}',
    ticket_size_min DECIMAL(12,2),
    ticket_size_max DECIMAL(12,2),
    portfolio_count INTEGER DEFAULT 0,
    active_investments INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE investor_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    stage interaction_stage DEFAULT 'viewed',
    view_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMPTZ,
    nda_signed_at TIMESTAMPTZ,
    meeting_scheduled_at TIMESTAMPTZ,
    funding_amount DECIMAL(12,2),
    interest_level interest_level,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE investor_portfolio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    status portfolio_status DEFAULT 'saved',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(investor_id, startup_id)
);

CREATE TABLE investor_playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE investor_playlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID NOT NULL REFERENCES investor_playlists(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(playlist_id, startup_id)
);

-- Continued in next migration file...

