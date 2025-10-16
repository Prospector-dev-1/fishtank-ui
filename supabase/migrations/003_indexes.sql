-- Fishtank Database Schema Migration
-- Part 3: Indexes for Performance Optimization

-- ============================================================================
-- USER & PROFILE INDEXES
-- ============================================================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_full_name ON profiles(full_name);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- ============================================================================
-- CREATOR INDEXES
-- ============================================================================

CREATE INDEX idx_creator_profiles_rating ON creator_profiles(rating DESC);
CREATE INDEX idx_creator_profiles_availability ON creator_profiles(availability);
CREATE INDEX idx_creator_profiles_hourly_rate ON creator_profiles(hourly_rate);

CREATE INDEX idx_creator_services_creator_id ON creator_services(creator_id);
CREATE INDEX idx_creator_services_type ON creator_services(type);
CREATE INDEX idx_creator_services_is_active ON creator_services(is_active);

CREATE INDEX idx_creator_portfolio_creator_id ON creator_portfolio(creator_id);
CREATE INDEX idx_creator_portfolio_media_type ON creator_portfolio(media_type);

CREATE INDEX idx_creator_reviews_creator_id ON creator_reviews(creator_id);
CREATE INDEX idx_creator_reviews_rating ON creator_reviews(rating DESC);
CREATE INDEX idx_creator_reviews_created_at ON creator_reviews(created_at DESC);

CREATE INDEX idx_creator_endorsements_creator_id ON creator_endorsements(creator_id);
CREATE INDEX idx_creator_endorsements_skill ON creator_endorsements(skill);

-- ============================================================================
-- STARTUP/INNOVATOR INDEXES
-- ============================================================================

CREATE INDEX idx_startups_owner_id ON startups(owner_id);
CREATE INDEX idx_startups_category ON startups(category);
CREATE INDEX idx_startups_phase ON startups(phase);
CREATE INDEX idx_startups_published_at ON startups(published_at DESC NULLS LAST);
CREATE INDEX idx_startups_metrics_views ON startups(metrics_views DESC);
CREATE INDEX idx_startups_metrics_interest ON startups(metrics_interest DESC);
CREATE INDEX idx_startups_created_at ON startups(created_at DESC);

CREATE INDEX idx_startup_team_members_startup_id ON startup_team_members(startup_id);
CREATE INDEX idx_startup_team_members_user_id ON startup_team_members(user_id);

CREATE INDEX idx_startup_milestones_startup_id ON startup_milestones(startup_id);
CREATE INDEX idx_startup_milestones_date ON startup_milestones(date);

CREATE INDEX idx_startup_faqs_startup_id ON startup_faqs(startup_id);

CREATE INDEX idx_startup_traction_startup_id ON startup_traction(startup_id);
CREATE INDEX idx_startup_traction_date ON startup_traction(date DESC);

-- ============================================================================
-- INVESTOR INDEXES
-- ============================================================================

CREATE INDEX idx_investor_profiles_investor_type ON investor_profiles(investor_type);
CREATE INDEX idx_investor_profiles_firm_name ON investor_profiles(firm_name);

CREATE INDEX idx_investor_interactions_investor_id ON investor_interactions(investor_id);
CREATE INDEX idx_investor_interactions_startup_id ON investor_interactions(startup_id);
CREATE INDEX idx_investor_interactions_stage ON investor_interactions(stage);
CREATE INDEX idx_investor_interactions_interest_level ON investor_interactions(interest_level);
CREATE INDEX idx_investor_interactions_last_viewed_at ON investor_interactions(last_viewed_at DESC);

CREATE INDEX idx_investor_portfolio_investor_id ON investor_portfolio(investor_id);
CREATE INDEX idx_investor_portfolio_startup_id ON investor_portfolio(startup_id);
CREATE INDEX idx_investor_portfolio_status ON investor_portfolio(status);

CREATE INDEX idx_investor_playlists_investor_id ON investor_playlists(investor_id);

CREATE INDEX idx_investor_playlist_items_playlist_id ON investor_playlist_items(playlist_id);
CREATE INDEX idx_investor_playlist_items_startup_id ON investor_playlist_items(startup_id);

-- ============================================================================
-- PROJECT & COLLABORATION INDEXES
-- ============================================================================

CREATE INDEX idx_briefs_innovator_id ON briefs(innovator_id);
CREATE INDEX idx_briefs_startup_id ON briefs(startup_id);
CREATE INDEX idx_briefs_status ON briefs(status);
CREATE INDEX idx_briefs_category ON briefs(category);
CREATE INDEX idx_briefs_created_at ON briefs(created_at DESC);
CREATE INDEX idx_briefs_deadline ON briefs(deadline);

CREATE INDEX idx_proposals_brief_id ON proposals(brief_id);
CREATE INDEX idx_proposals_creator_id ON proposals(creator_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_created_at ON proposals(created_at DESC);

CREATE INDEX idx_contracts_creator_id ON contracts(creator_id);
CREATE INDEX idx_contracts_innovator_id ON contracts(innovator_id);
CREATE INDEX idx_contracts_brief_id ON contracts(brief_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_created_at ON contracts(created_at DESC);

CREATE INDEX idx_contract_milestones_contract_id ON contract_milestones(contract_id);
CREATE INDEX idx_contract_milestones_status ON contract_milestones(status);
CREATE INDEX idx_contract_milestones_due_date ON contract_milestones(due_date);

-- ============================================================================
-- MESSAGING & COMMUNICATION INDEXES
-- ============================================================================

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON messages(is_read) WHERE is_read = FALSE;

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================================
-- CONNECTIONS & RELATIONSHIPS INDEXES
-- ============================================================================

CREATE INDEX idx_friend_requests_sender_id ON friend_requests(sender_id);
CREATE INDEX idx_friend_requests_recipient_id ON friend_requests(recipient_id);
CREATE INDEX idx_friend_requests_status ON friend_requests(status);

CREATE INDEX idx_connections_user_id_1 ON connections(user_id_1);
CREATE INDEX idx_connections_user_id_2 ON connections(user_id_2);

CREATE INDEX idx_invitations_brief_id ON invitations(brief_id);
CREATE INDEX idx_invitations_from_user_id ON invitations(from_user_id);
CREATE INDEX idx_invitations_to_user_id ON invitations(to_user_id);
CREATE INDEX idx_invitations_status ON invitations(status);

CREATE INDEX idx_team_invitations_startup_id ON team_invitations(startup_id);
CREATE INDEX idx_team_invitations_from_user_id ON team_invitations(from_user_id);
CREATE INDEX idx_team_invitations_to_user_id ON team_invitations(to_user_id);
CREATE INDEX idx_team_invitations_status ON team_invitations(status);

-- ============================================================================
-- LEGAL & FINANCIAL INDEXES
-- ============================================================================

CREATE INDEX idx_nda_requests_startup_id ON nda_requests(startup_id);
CREATE INDEX idx_nda_requests_requester_id ON nda_requests(requester_id);
CREATE INDEX idx_nda_requests_status ON nda_requests(status);

CREATE INDEX idx_earnings_creator_id ON earnings(creator_id);
CREATE INDEX idx_earnings_contract_id ON earnings(contract_id);
CREATE INDEX idx_earnings_status ON earnings(status);
CREATE INDEX idx_earnings_held_until ON earnings(held_until);

CREATE INDEX idx_disputes_contract_id ON disputes(contract_id);
CREATE INDEX idx_disputes_raised_by_id ON disputes(raised_by_id);
CREATE INDEX idx_disputes_status ON disputes(status);

-- ============================================================================
-- GROWTH & ACTIVITY INDEXES
-- ============================================================================

CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX idx_referrals_status ON referrals(status);

CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_activity_type ON activities(activity_type);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX idx_activities_is_public ON activities(is_public) WHERE is_public = TRUE;

-- ============================================================================
-- FULL TEXT SEARCH INDEXES (for future implementation)
-- ============================================================================

-- Creator search
CREATE INDEX idx_creator_profiles_skills_gin ON creator_profiles USING GIN (skills);

-- Startup search
CREATE INDEX idx_startups_tags_gin ON startups USING GIN (tags);
CREATE INDEX idx_startups_open_positions_gin ON startups USING GIN (open_positions);

-- Brief search
CREATE INDEX idx_briefs_required_skills_gin ON briefs USING GIN (required_skills);

