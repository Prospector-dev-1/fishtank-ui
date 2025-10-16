-- Fishtank Database Schema Migration
-- Part 6: Storage Buckets Configuration

-- ============================================================================
-- CREATE STORAGE BUCKETS
-- ============================================================================

-- Avatars (public)
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Creator Portfolio (public)
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Pitch Videos (conditional access based on NDA)
INSERT INTO storage.buckets (id, name, public) VALUES ('pitch-videos', 'pitch-videos', false)
ON CONFLICT (id) DO NOTHING;

-- Pitch Decks (private, NDA required)
INSERT INTO storage.buckets (id, name, public) VALUES ('pitch-decks', 'pitch-decks', false)
ON CONFLICT (id) DO NOTHING;

-- Project Deliverables (private, contract parties only)
INSERT INTO storage.buckets (id, name, public) VALUES ('deliverables', 'deliverables', false)
ON CONFLICT (id) DO NOTHING;

-- Legal Documents (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Message Attachments (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Avatars: Anyone can read, users can upload their own
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Portfolio: Anyone can read, creators can upload their own
CREATE POLICY "Portfolio items are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio');

CREATE POLICY "Creators can upload portfolio items"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'portfolio'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Creators can update own portfolio items"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'portfolio'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Creators can delete own portfolio items"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'portfolio'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Pitch Videos: Startup owners and users with NDA can access
CREATE POLICY "Startup owners can upload pitch videos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'pitch-videos'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Pitch videos accessible to authorized users"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'pitch-videos'
        AND (
            -- Owner can access
            (storage.foldername(name))[1] = auth.uid()::text
            -- Or user has signed NDA for this startup
            OR EXISTS (
                SELECT 1 FROM nda_requests nr
                JOIN startups s ON s.id = nr.startup_id
                WHERE nr.requester_id = auth.uid()
                AND nr.status = 'signed'
                AND s.owner_id::text = (storage.foldername(name))[1]
            )
            -- Or startup doesn't require NDA
            OR EXISTS (
                SELECT 1 FROM startups s
                WHERE s.owner_id::text = (storage.foldername(name))[1]
                AND s.nda_required = FALSE
            )
        )
    );

-- Pitch Decks: Startup owners and users with signed NDA
CREATE POLICY "Startup owners can upload pitch decks"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'pitch-decks'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Pitch decks accessible to NDA-signed users"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'pitch-decks'
        AND (
            -- Owner can access
            (storage.foldername(name))[1] = auth.uid()::text
            -- Or user has signed NDA
            OR EXISTS (
                SELECT 1 FROM nda_requests nr
                JOIN startups s ON s.id = nr.startup_id
                WHERE nr.requester_id = auth.uid()
                AND nr.status = 'signed'
                AND s.owner_id::text = (storage.foldername(name))[1]
            )
        )
    );

-- Deliverables: Contract parties only
CREATE POLICY "Contract creators can upload deliverables"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'deliverables'
        AND EXISTS (
            SELECT 1 FROM contracts c
            WHERE c.id::text = (storage.foldername(name))[1]
            AND c.creator_id = auth.uid()
        )
    );

CREATE POLICY "Contract parties can view deliverables"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'deliverables'
        AND EXISTS (
            SELECT 1 FROM contracts c
            WHERE c.id::text = (storage.foldername(name))[1]
            AND (c.creator_id = auth.uid() OR c.innovator_id = auth.uid())
        )
    );

-- Documents: Private, user-specific
CREATE POLICY "Users can upload own documents"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'documents'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view own documents"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'documents'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update own documents"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'documents'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete own documents"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'documents'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Attachments: Message participants only
CREATE POLICY "Message senders can upload attachments"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'attachments'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Message participants can view attachments"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'attachments'
        AND EXISTS (
            SELECT 1 FROM messages m
            WHERE (
                m.id::text = (storage.foldername(name))[2]
                AND (m.sender_id = auth.uid() OR m.recipient_id = auth.uid())
            )
        )
    );

