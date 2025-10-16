# Fishtank Database Schema Design

## Overview
This document outlines the complete database schema for the Fishtank platform, supporting Creator, Innovator, and Investor roles.

## Core Tables

### 1. **users** (Auth table - managed by Supabase Auth)
- `id` (uuid, PK) - Supabase auth user ID
- `email` (text, unique)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 2. **profiles**
User profile information shared across all roles.

```sql
- id (uuid, PK, FK → users.id)
- role (enum: 'creator', 'innovator', 'investor')
- full_name (text)
- avatar_url (text)
- bio (text)
- timezone (text)
- website (text)
- social_linkedin (text)
- social_twitter (text)
- created_at (timestamp)
- updated_at (timestamp)
```

## Creator-Specific Tables

### 3. **creator_profiles**
Extended profile data for creators.

```sql
- id (uuid, PK, FK → users.id)
- headline (text) - e.g., "Brand Designer & Pitch Deck Specialist"
- skills (text[]) - Array of skills
- rating (decimal) - Average rating
- availability (enum: 'open', 'busy', 'closed')
- compensation_types (text[]) - ['hourly', 'fixed', 'equity', 'commission']
- hourly_rate (decimal)
- response_time (text) - e.g., "Usually responds within 2 hours"
- total_earnings (decimal) - Lifetime earnings
- released_earnings (decimal) - Released from escrow
- held_earnings (decimal) - In escrow
- pending_earnings (decimal) - Pending approval
- endorsement_count (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

### 4. **creator_services**
Services offered by creators.

```sql
- id (uuid, PK)
- creator_id (uuid, FK → users.id)
- title (text)
- scope (text[]) - Array of deliverables
- eta_days (integer)
- type (enum: 'fixed', 'hourly')
- price (decimal) - For fixed type
- hourly_rate (decimal) - For hourly type
- offers (text[]) - ['equity', 'commission']
- is_active (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

### 5. **creator_portfolio**
Portfolio items for creators.

```sql
- id (uuid, PK)
- creator_id (uuid, FK → users.id)
- media_type (enum: 'image', 'video', 'link')
- url (text)
- title (text)
- description (text)
- tags (text[])
- display_order (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

### 6. **creator_reviews**
Reviews for creators.

```sql
- id (uuid, PK)
- creator_id (uuid, FK → users.id)
- reviewer_id (uuid, FK → users.id)
- reviewer_name (text)
- rating (integer) - 1-5
- text (text)
- project_id (uuid) - Optional reference to project
- created_at (timestamp)
- updated_at (timestamp)
```

### 7. **creator_endorsements**
Skill endorsements for creators.

```sql
- id (uuid, PK)
- creator_id (uuid, FK → users.id)
- endorser_id (uuid, FK → users.id)
- skill (text)
- created_at (timestamp)
```

## Innovator-Specific Tables

### 8. **innovator_profiles**
Extended profile data for innovators.

```sql
- id (uuid, PK, FK → users.id)
- company_name (text)
- industry (text)
- stage (enum: 'Idea', 'MVP', 'Growth', 'Launched')
- pitch_video_url (text)
- pitch_deck_url (text)
- elevator_pitch (text)
- problem_statement (text)
- solution (text)
- target_market (text)
- business_model (text)
- traction_metrics (jsonb)
- funding_status (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### 9. **startups**
Startup/project information for innovators.

```sql
- id (uuid, PK)
- owner_id (uuid, FK → users.id)
- name (text)
- blurb (text)
- category (text) - AI, HealthTech, FinTech, etc.
- phase (enum: 'Idea', 'MVP', 'Growth', 'Launched')
- website (text)
- banner_url (text)
- video_url (text) - Short pitch video
- long_video_url (text) - Full pitch video
- poster_url (text) - Video thumbnail
- nda_required (boolean)
- open_positions (text[])
- problem_solution (text)
- founder_note (text)
- current_status (text)
- tags (text[])
- metrics_views (integer)
- metrics_avg_watch_sec (integer)
- metrics_interest (integer)
- created_at (timestamp)
- updated_at (timestamp)
- published_at (timestamp)
```

### 10. **startup_team_members**
Team members for startups.

```sql
- id (uuid, PK)
- startup_id (uuid, FK → startups.id)
- user_id (uuid, FK → users.id) - Optional, if user exists on platform
- name (text)
- role (text)
- avatar_url (text)
- bio (text)
- display_order (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

### 11. **startup_milestones**
Milestones for startups.

```sql
- id (uuid, PK)
- startup_id (uuid, FK → startups.id)
- label (text)
- date (date)
- is_completed (boolean)
- created_at (timestamp)
```

### 12. **startup_faqs**
FAQ items for startups.

```sql
- id (uuid, PK)
- startup_id (uuid, FK → startups.id)
- question (text)
- answer (text)
- display_order (integer)
- created_at (timestamp)
```

### 13. **startup_traction**
Traction metrics for startups.

```sql
- id (uuid, PK)
- startup_id (uuid, FK → startups.id)
- metric (text) - "Monthly Revenue", "Active Users", etc.
- value (text)
- date (date)
- created_at (timestamp)
```

## Investor-Specific Tables

### 14. **investor_profiles**
Extended profile data for investors.

```sql
- id (uuid, PK, FK → users.id)
- firm_name (text)
- investor_type (enum: 'VC', 'Angel', 'Corporate', 'Accelerator')
- investment_thesis (text)
- preferred_sectors (text[])
- preferred_stages (text[]) - ['Pre-Seed', 'Seed', 'Series A', 'Series B']
- ticket_size_min (decimal)
- ticket_size_max (decimal)
- portfolio_count (integer)
- active_investments (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

### 15. **investor_interactions**
Track investor interactions with startups.

```sql
- id (uuid, PK)
- investor_id (uuid, FK → users.id)
- startup_id (uuid, FK → startups.id)
- stage (enum: 'viewed', 'nda_requested', 'nda_signed', 'meeting_scheduled', 'funding_committed')
- view_count (integer)
- last_viewed_at (timestamp)
- nda_signed_at (timestamp)
- meeting_scheduled_at (timestamp)
- funding_amount (decimal)
- interest_level (enum: 'Low', 'Medium', 'High')
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### 16. **investor_portfolio**
Track saved and interested startups for investors.

```sql
- id (uuid, PK)
- investor_id (uuid, FK → users.id)
- startup_id (uuid, FK → startups.id)
- status (enum: 'saved', 'interested', 'contacted', 'passed')
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### 17. **investor_playlists**
Custom playlists of startups for investors.

```sql
- id (uuid, PK)
- investor_id (uuid, FK → users.id)
- title (text)
- description (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### 18. **investor_playlist_items**
Items in investor playlists.

```sql
- id (uuid, PK)
- playlist_id (uuid, FK → investor_playlists.id)
- startup_id (uuid, FK → startups.id)
- display_order (integer)
- created_at (timestamp)
```

## Shared/Cross-Role Tables

### 19. **briefs** (Project Briefs)
Project briefs posted by innovators.

```sql
- id (uuid, PK)
- innovator_id (uuid, FK → users.id)
- startup_id (uuid, FK → startups.id) - Optional
- title (text)
- description (text)
- category (text)
- budget (decimal)
- timeline (text)
- required_skills (text[])
- compensation_type (enum: 'hourly', 'fixed', 'equity', 'commission')
- status (enum: 'open', 'in_progress', 'completed', 'cancelled')
- created_at (timestamp)
- updated_at (timestamp)
- deadline (timestamp)
```

### 20. **proposals**
Proposals from creators for briefs.

```sql
- id (uuid, PK)
- brief_id (uuid, FK → briefs.id)
- creator_id (uuid, FK → users.id)
- cover_letter (text)
- proposed_budget (decimal)
- proposed_timeline (text)
- milestones (jsonb) - Array of milestone objects
- status (enum: 'pending', 'accepted', 'declined', 'withdrawn')
- created_at (timestamp)
- updated_at (timestamp)
```

### 21. **contracts**
Active contracts between creators and innovators.

```sql
- id (uuid, PK)
- brief_id (uuid, FK → briefs.id)
- proposal_id (uuid, FK → proposals.id)
- creator_id (uuid, FK → users.id)
- innovator_id (uuid, FK → users.id)
- title (text)
- total_amount (decimal)
- status (enum: 'active', 'completed', 'cancelled', 'disputed')
- start_date (timestamp)
- end_date (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

### 22. **contract_milestones**
Milestones within contracts.

```sql
- id (uuid, PK)
- contract_id (uuid, FK → contracts.id)
- title (text)
- description (text)
- amount (decimal)
- due_date (timestamp)
- status (enum: 'pending', 'in_progress', 'submitted', 'approved', 'rejected', 'paid')
- submitted_at (timestamp)
- approved_at (timestamp)
- paid_at (timestamp)
- deliverable_urls (text[])
- feedback (text)
- display_order (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

### 23. **messages**
Direct messages between users.

```sql
- id (uuid, PK)
- sender_id (uuid, FK → users.id)
- recipient_id (uuid, FK → users.id)
- thread_id (uuid) - For grouping messages
- content (text)
- attachment_urls (text[])
- attachment_types (text[])
- is_read (boolean)
- is_system_message (boolean)
- system_type (enum: 'nda', 'proposal', 'milestone', 'release', 'dispute')
- created_at (timestamp)
- updated_at (timestamp)
```

### 24. **notifications**
System notifications for users.

```sql
- id (uuid, PK)
- user_id (uuid, FK → users.id)
- type (enum: 'message', 'proposal', 'milestone', 'payment', 'review', 'system')
- title (text)
- content (text)
- link (text) - Deep link to relevant page
- is_read (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

### 25. **nda_requests**
NDA requests and signatures.

```sql
- id (uuid, PK)
- startup_id (uuid, FK → startups.id)
- requester_id (uuid, FK → users.id) - Usually investor
- status (enum: 'pending', 'signed', 'declined', 'expired')
- signed_at (timestamp)
- document_url (text)
- created_at (timestamp)
- updated_at (timestamp)
- expires_at (timestamp)
```

### 26. **friend_requests**
Friend/connection requests between users.

```sql
- id (uuid, PK)
- sender_id (uuid, FK → users.id)
- recipient_id (uuid, FK → users.id)
- status (enum: 'pending', 'accepted', 'declined')
- created_at (timestamp)
- updated_at (timestamp)
```

### 27. **connections**
Established connections between users.

```sql
- id (uuid, PK)
- user_id_1 (uuid, FK → users.id)
- user_id_2 (uuid, FK → users.id)
- created_at (timestamp)
```

### 28. **invitations**
Invitations to collaborate.

```sql
- id (uuid, PK)
- brief_id (uuid, FK → briefs.id)
- from_user_id (uuid, FK → users.id)
- to_user_id (uuid, FK → users.id)
- message (text)
- status (enum: 'pending', 'accepted', 'declined')
- created_at (timestamp)
- updated_at (timestamp)
```

### 29. **earnings**
Track creator earnings.

```sql
- id (uuid, PK)
- creator_id (uuid, FK → users.id)
- contract_id (uuid, FK → contracts.id)
- milestone_id (uuid, FK → contract_milestones.id)
- amount (decimal)
- status (enum: 'pending', 'held', 'released', 'paid')
- held_until (timestamp) - Release date
- released_at (timestamp)
- paid_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

### 30. **disputes**
Dispute resolution.

```sql
- id (uuid, PK)
- contract_id (uuid, FK → contracts.id)
- milestone_id (uuid, FK → contract_milestones.id)
- raised_by_id (uuid, FK → users.id)
- reason (text)
- evidence_urls (text[])
- status (enum: 'open', 'under_review', 'resolved', 'closed')
- resolution (text)
- resolved_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
- deadline (timestamp)
```

### 31. **team_invitations**
Invitations to join startup teams.

```sql
- id (uuid, PK)
- startup_id (uuid, FK → startups.id)
- from_user_id (uuid, FK → users.id)
- to_user_id (uuid, FK → users.id)
- role (text)
- equity_percentage (decimal)
- message (text)
- status (enum: 'pending', 'accepted', 'declined')
- created_at (timestamp)
- updated_at (timestamp)
```

### 32. **referrals**
User referrals for rewards.

```sql
- id (uuid, PK)
- referrer_id (uuid, FK → users.id)
- referred_email (text)
- referred_user_id (uuid, FK → users.id) - Set when they sign up
- status (enum: 'pending', 'signed_up', 'completed')
- reward_amount (decimal)
- created_at (timestamp)
- updated_at (timestamp)
```

### 33. **activities** (Activity Feed)
Track user activities for feeds.

```sql
- id (uuid, PK)
- user_id (uuid, FK → users.id)
- activity_type (enum: 'proposal_submitted', 'milestone_completed', 'contract_started', 'review_received', 'connection_made', 'startup_published')
- content (jsonb) - Activity-specific data
- is_public (boolean)
- created_at (timestamp)
```

## Indexes

Key indexes for performance:

```sql
-- User lookups
CREATE INDEX idx_profiles_role ON profiles(role);

-- Creator searches
CREATE INDEX idx_creator_profiles_rating ON creator_profiles(rating DESC);
CREATE INDEX idx_creator_profiles_availability ON creator_profiles(availability);
CREATE INDEX idx_creator_services_creator_id ON creator_services(creator_id);

-- Startup searches
CREATE INDEX idx_startups_category ON startups(category);
CREATE INDEX idx_startups_phase ON startups(phase);
CREATE INDEX idx_startups_owner_id ON startups(owner_id);
CREATE INDEX idx_startups_published_at ON startups(published_at DESC);

-- Investor queries
CREATE INDEX idx_investor_interactions_investor_id ON investor_interactions(investor_id);
CREATE INDEX idx_investor_interactions_startup_id ON investor_interactions(startup_id);
CREATE INDEX idx_investor_portfolio_investor_id ON investor_portfolio(investor_id);

-- Messages and notifications
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Contracts and proposals
CREATE INDEX idx_briefs_innovator_id ON briefs(innovator_id);
CREATE INDEX idx_briefs_status ON briefs(status);
CREATE INDEX idx_proposals_brief_id ON proposals(brief_id);
CREATE INDEX idx_proposals_creator_id ON proposals(creator_id);
CREATE INDEX idx_contracts_creator_id ON contracts(creator_id);
CREATE INDEX idx_contracts_innovator_id ON contracts(innovator_id);
CREATE INDEX idx_contract_milestones_contract_id ON contract_milestones(contract_id);

-- Earnings
CREATE INDEX idx_earnings_creator_id ON earnings(creator_id);
CREATE INDEX idx_earnings_status ON earnings(status);
```

## Row Level Security (RLS) Policies

All tables will have RLS enabled with appropriate policies:

1. **Users can read their own data**
2. **Public profiles are readable by all authenticated users**
3. **Messages are only accessible to sender and recipient**
4. **Contracts are only accessible to involved parties**
5. **Investors can view published startups**
6. **Creators can view open briefs**
7. **Earnings are private to the creator**
8. **Startup owners can edit their startups**
9. **Admin users have elevated permissions**

## Storage Buckets

Supabase Storage buckets for file uploads:

1. **avatars** - User profile pictures (public)
2. **portfolio** - Creator portfolio media (public)
3. **pitch-videos** - Startup pitch videos (public/private based on NDA)
4. **pitch-decks** - Startup pitch decks (private, NDA required)
5. **deliverables** - Project deliverables (private, contract parties only)
6. **documents** - NDAs, contracts, etc. (private)
7. **attachments** - Message attachments (private)

## Real-time Subscriptions

Key real-time features using Supabase Realtime:

1. **New messages** - Instant message delivery
2. **Notification updates** - Real-time notifications
3. **Milestone status changes** - Updates on project milestones
4. **Investor activity** - Track when investors view pitches
5. **Proposal submissions** - Notify when new proposals arrive

---

## Implementation Notes

- All timestamps use `timestamptz` for timezone awareness
- All monetary values use `decimal(12,2)` for precision
- All foreign keys have `ON DELETE CASCADE` or `SET NULL` as appropriate
- All tables have `created_at` and `updated_at` triggers
- Enums are implemented as PostgreSQL enum types for type safety

