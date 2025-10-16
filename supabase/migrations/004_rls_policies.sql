-- Fishtank Database Schema Migration
-- Part 4: Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_traction ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE nda_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES - Public read, own write
-- ============================================================================

CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================================================
-- CREATOR PROFILES & DATA
-- ============================================================================

CREATE POLICY "Creator profiles are viewable by everyone"
    ON creator_profiles FOR SELECT
    USING (true);

CREATE POLICY "Creators can update own profile"
    ON creator_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Creators can insert own profile"
    ON creator_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Creator Services
CREATE POLICY "Creator services are viewable by everyone"
    ON creator_services FOR SELECT
    USING (true);

CREATE POLICY "Creators can manage own services"
    ON creator_services FOR ALL
    USING (auth.uid() = creator_id);

-- Creator Portfolio
CREATE POLICY "Creator portfolio is viewable by everyone"
    ON creator_portfolio FOR SELECT
    USING (true);

CREATE POLICY "Creators can manage own portfolio"
    ON creator_portfolio FOR ALL
    USING (auth.uid() = creator_id);

-- Creator Reviews
CREATE POLICY "Creator reviews are viewable by everyone"
    ON creator_reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create reviews"
    ON creator_reviews FOR INSERT
    WITH CHECK (auth.uid() = reviewer_id);

-- Creator Endorsements
CREATE POLICY "Endorsements are viewable by everyone"
    ON creator_endorsements FOR SELECT
    USING (true);

CREATE POLICY "Users can endorse others"
    ON creator_endorsements FOR INSERT
    WITH CHECK (auth.uid() = endorser_id);

CREATE POLICY "Users can remove own endorsements"
    ON creator_endorsements FOR DELETE
    USING (auth.uid() = endorser_id);

-- ============================================================================
-- INNOVATOR & STARTUP POLICIES
-- ============================================================================

CREATE POLICY "Innovator profiles are viewable by everyone"
    ON innovator_profiles FOR SELECT
    USING (true);

CREATE POLICY "Innovators can update own profile"
    ON innovator_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Innovators can insert own profile"
    ON innovator_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Startups
CREATE POLICY "Published startups are viewable by everyone"
    ON startups FOR SELECT
    USING (published_at IS NOT NULL OR auth.uid() = owner_id);

CREATE POLICY "Innovators can manage own startups"
    ON startups FOR ALL
    USING (auth.uid() = owner_id);

-- Startup Team Members
CREATE POLICY "Startup team members are viewable by everyone"
    ON startup_team_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM startups
            WHERE startups.id = startup_team_members.startup_id
            AND (startups.published_at IS NOT NULL OR startups.owner_id = auth.uid())
        )
    );

CREATE POLICY "Startup owners can manage team members"
    ON startup_team_members FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM startups
            WHERE startups.id = startup_team_members.startup_id
            AND startups.owner_id = auth.uid()
        )
    );

-- Startup Milestones, FAQs, Traction (similar pattern)
CREATE POLICY "Startup milestones viewable for published startups"
    ON startup_milestones FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM startups
            WHERE startups.id = startup_milestones.startup_id
            AND (startups.published_at IS NOT NULL OR startups.owner_id = auth.uid())
        )
    );

CREATE POLICY "Startup owners can manage milestones"
    ON startup_milestones FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM startups
            WHERE startups.id = startup_milestones.startup_id
            AND startups.owner_id = auth.uid()
        )
    );

CREATE POLICY "Startup FAQs viewable for published startups"
    ON startup_faqs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM startups
            WHERE startups.id = startup_faqs.startup_id
            AND (startups.published_at IS NOT NULL OR startups.owner_id = auth.uid())
        )
    );

CREATE POLICY "Startup owners can manage FAQs"
    ON startup_faqs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM startups
            WHERE startups.id = startup_faqs.startup_id
            AND startups.owner_id = auth.uid()
        )
    );

CREATE POLICY "Startup traction viewable for published startups"
    ON startup_traction FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM startups
            WHERE startups.id = startup_traction.startup_id
            AND (startups.published_at IS NOT NULL OR startups.owner_id = auth.uid())
        )
    );

CREATE POLICY "Startup owners can manage traction"
    ON startup_traction FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM startups
            WHERE startups.id = startup_traction.startup_id
            AND startups.owner_id = auth.uid()
        )
    );

-- ============================================================================
-- INVESTOR POLICIES
-- ============================================================================

CREATE POLICY "Investor profiles are viewable by everyone"
    ON investor_profiles FOR SELECT
    USING (true);

CREATE POLICY "Investors can update own profile"
    ON investor_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Investors can insert own profile"
    ON investor_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Investor Interactions
CREATE POLICY "Investors can view own interactions"
    ON investor_interactions FOR SELECT
    USING (auth.uid() = investor_id);

CREATE POLICY "Investors can manage own interactions"
    ON investor_interactions FOR ALL
    USING (auth.uid() = investor_id);

-- Investor Portfolio
CREATE POLICY "Investors can view own portfolio"
    ON investor_portfolio FOR SELECT
    USING (auth.uid() = investor_id);

CREATE POLICY "Investors can manage own portfolio"
    ON investor_portfolio FOR ALL
    USING (auth.uid() = investor_id);

-- Investor Playlists
CREATE POLICY "Investors can view own playlists"
    ON investor_playlists FOR SELECT
    USING (auth.uid() = investor_id);

CREATE POLICY "Investors can manage own playlists"
    ON investor_playlists FOR ALL
    USING (auth.uid() = investor_id);

-- Playlist Items
CREATE POLICY "Investors can view own playlist items"
    ON investor_playlist_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM investor_playlists
            WHERE investor_playlists.id = investor_playlist_items.playlist_id
            AND investor_playlists.investor_id = auth.uid()
        )
    );

CREATE POLICY "Investors can manage own playlist items"
    ON investor_playlist_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM investor_playlists
            WHERE investor_playlists.id = investor_playlist_items.playlist_id
            AND investor_playlists.investor_id = auth.uid()
        )
    );

-- ============================================================================
-- BRIEFS & PROPOSALS
-- ============================================================================

CREATE POLICY "Open briefs are viewable by everyone"
    ON briefs FOR SELECT
    USING (status = 'open' OR auth.uid() = innovator_id);

CREATE POLICY "Innovators can manage own briefs"
    ON briefs FOR ALL
    USING (auth.uid() = innovator_id);

-- Proposals
CREATE POLICY "Proposals viewable by brief owner and proposal creator"
    ON proposals FOR SELECT
    USING (
        auth.uid() = creator_id
        OR EXISTS (
            SELECT 1 FROM briefs
            WHERE briefs.id = proposals.brief_id
            AND briefs.innovator_id = auth.uid()
        )
    );

CREATE POLICY "Creators can create proposals"
    ON proposals FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own proposals"
    ON proposals FOR UPDATE
    USING (auth.uid() = creator_id);

-- ============================================================================
-- CONTRACTS & MILESTONES
-- ============================================================================

CREATE POLICY "Contracts viewable by involved parties"
    ON contracts FOR SELECT
    USING (auth.uid() = creator_id OR auth.uid() = innovator_id);

CREATE POLICY "Innovators can create contracts"
    ON contracts FOR INSERT
    WITH CHECK (auth.uid() = innovator_id);

CREATE POLICY "Involved parties can update contracts"
    ON contracts FOR UPDATE
    USING (auth.uid() = creator_id OR auth.uid() = innovator_id);

-- Contract Milestones
CREATE POLICY "Milestones viewable by contract parties"
    ON contract_milestones FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM contracts
            WHERE contracts.id = contract_milestones.contract_id
            AND (contracts.creator_id = auth.uid() OR contracts.innovator_id = auth.uid())
        )
    );

CREATE POLICY "Contract parties can manage milestones"
    ON contract_milestones FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM contracts
            WHERE contracts.id = contract_milestones.contract_id
            AND (contracts.creator_id = auth.uid() OR contracts.innovator_id = auth.uid())
        )
    );

-- ============================================================================
-- MESSAGES & NOTIFICATIONS
-- ============================================================================

CREATE POLICY "Users can view messages they sent or received"
    ON messages FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
    ON messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update message read status"
    ON messages FOR UPDATE
    USING (auth.uid() = recipient_id);

-- Notifications
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
    ON notifications FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
    ON notifications FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- CONNECTIONS & REQUESTS
-- ============================================================================

CREATE POLICY "Users can view friend requests involving them"
    ON friend_requests FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send friend requests"
    ON friend_requests FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update requests involving them"
    ON friend_requests FOR UPDATE
    USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Connections
CREATE POLICY "Users can view own connections"
    ON connections FOR SELECT
    USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

CREATE POLICY "System can create connections"
    ON connections FOR INSERT
    WITH CHECK (true);

-- Invitations
CREATE POLICY "Users can view invitations involving them"
    ON invitations FOR SELECT
    USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send invitations"
    ON invitations FOR INSERT
    WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update invitations involving them"
    ON invitations FOR UPDATE
    USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Team Invitations
CREATE POLICY "Users can view team invitations involving them"
    ON team_invitations FOR SELECT
    USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Startup owners can send team invitations"
    ON team_invitations FOR INSERT
    WITH CHECK (
        auth.uid() = from_user_id
        AND EXISTS (
            SELECT 1 FROM startups
            WHERE startups.id = team_invitations.startup_id
            AND startups.owner_id = auth.uid()
        )
    );

-- ============================================================================
-- FINANCIAL & LEGAL
-- ============================================================================

-- NDA Requests
CREATE POLICY "Users can view own NDA requests"
    ON nda_requests FOR SELECT
    USING (auth.uid() = requester_id);

CREATE POLICY "Investors can create NDA requests"
    ON nda_requests FOR INSERT
    WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Requesters can update own NDA requests"
    ON nda_requests FOR UPDATE
    USING (auth.uid() = requester_id);

-- Earnings
CREATE POLICY "Creators can view own earnings"
    ON earnings FOR SELECT
    USING (auth.uid() = creator_id);

CREATE POLICY "System can manage earnings"
    ON earnings FOR ALL
    USING (auth.uid() = creator_id);

-- Disputes
CREATE POLICY "Contract parties can view disputes"
    ON disputes FOR SELECT
    USING (
        auth.uid() = raised_by_id
        OR EXISTS (
            SELECT 1 FROM contracts
            WHERE contracts.id = disputes.contract_id
            AND (contracts.creator_id = auth.uid() OR contracts.innovator_id = auth.uid())
        )
    );

CREATE POLICY "Contract parties can create disputes"
    ON disputes FOR INSERT
    WITH CHECK (
        auth.uid() = raised_by_id
        AND EXISTS (
            SELECT 1 FROM contracts
            WHERE contracts.id = disputes.contract_id
            AND (contracts.creator_id = auth.uid() OR contracts.innovator_id = auth.uid())
        )
    );

-- ============================================================================
-- REFERRALS & ACTIVITIES
-- ============================================================================

CREATE POLICY "Users can view own referrals"
    ON referrals FOR SELECT
    USING (auth.uid() = referrer_id);

CREATE POLICY "Users can create referrals"
    ON referrals FOR INSERT
    WITH CHECK (auth.uid() = referrer_id);

-- Activities
CREATE POLICY "Public activities viewable by everyone"
    ON activities FOR SELECT
    USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create own activities"
    ON activities FOR INSERT
    WITH CHECK (auth.uid() = user_id);

