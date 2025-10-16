-- Fishtank Database Schema Migration
-- Part 5: Helper Functions and Business Logic

-- ============================================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create basic profile for new user
    INSERT INTO public.profiles (id, role, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'role', 'creator')::user_role,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id::text)
    );

    -- Create role-specific profile based on user metadata
    IF (NEW.raw_user_meta_data->>'role' = 'creator') THEN
        INSERT INTO public.creator_profiles (id)
        VALUES (NEW.id);
    ELSIF (NEW.raw_user_meta_data->>'role' = 'innovator') THEN
        INSERT INTO public.innovator_profiles (id)
        VALUES (NEW.id);
    ELSIF (NEW.raw_user_meta_data->>'role' = 'investor') THEN
        INSERT INTO public.investor_profiles (id)
        VALUES (NEW.id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profiles
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- UPDATE CREATOR RATING ON NEW REVIEW
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_creator_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL(3,2);
BEGIN
    -- Calculate average rating for the creator
    SELECT AVG(rating)::DECIMAL(3,2)
    INTO avg_rating
    FROM creator_reviews
    WHERE creator_id = NEW.creator_id;

    -- Update creator profile with new rating
    UPDATE creator_profiles
    SET rating = avg_rating
    WHERE id = NEW.creator_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_creator_review_insert
    AFTER INSERT ON creator_reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_creator_rating();

-- ============================================================================
-- UPDATE ENDORSEMENT COUNT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_endorsement_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE creator_profiles
        SET endorsement_count = endorsement_count + 1
        WHERE id = NEW.creator_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE creator_profiles
        SET endorsement_count = GREATEST(endorsement_count - 1, 0)
        WHERE id = OLD.creator_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_endorsement_change
    AFTER INSERT OR DELETE ON creator_endorsements
    FOR EACH ROW EXECUTE FUNCTION public.update_endorsement_count();

-- ============================================================================
-- UPDATE CREATOR EARNINGS ON MILESTONE PAYMENT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_creator_earnings()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Add to pending earnings
        UPDATE creator_profiles
        SET 
            total_earnings = total_earnings + NEW.amount,
            pending_earnings = pending_earnings + NEW.amount
        WHERE id = NEW.creator_id;
        
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != NEW.status THEN
            IF NEW.status = 'held' THEN
                -- Move from pending to held
                UPDATE creator_profiles
                SET 
                    pending_earnings = pending_earnings - NEW.amount,
                    held_earnings = held_earnings + NEW.amount
                WHERE id = NEW.creator_id;
                
            ELSIF NEW.status = 'released' THEN
                -- Move from held to released
                UPDATE creator_profiles
                SET 
                    held_earnings = held_earnings - NEW.amount,
                    released_earnings = released_earnings + NEW.amount
                WHERE id = NEW.creator_id;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_earnings_change
    AFTER INSERT OR UPDATE ON earnings
    FOR EACH ROW EXECUTE FUNCTION public.update_creator_earnings();

-- ============================================================================
-- AUTO-CREATE EARNINGS ON MILESTONE APPROVAL
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_earnings_on_milestone_approval()
RETURNS TRIGGER AS $$
DECLARE
    contract_creator_id UUID;
    hold_days INTEGER := 7; -- Hold earnings for 7 days
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        -- Get the creator from the contract
        SELECT creator_id INTO contract_creator_id
        FROM contracts
        WHERE id = NEW.contract_id;

        -- Create earnings record
        INSERT INTO earnings (
            creator_id,
            contract_id,
            milestone_id,
            amount,
            status,
            held_until
        ) VALUES (
            contract_creator_id,
            NEW.contract_id,
            NEW.id,
            NEW.amount,
            'held',
            NOW() + INTERVAL '7 days'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_milestone_approved
    AFTER UPDATE ON contract_milestones
    FOR EACH ROW EXECUTE FUNCTION public.create_earnings_on_milestone_approval();

-- ============================================================================
-- AUTO-CREATE NOTIFICATION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_type notification_type,
    p_title TEXT,
    p_content TEXT,
    p_link TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, type, title, content, link)
    VALUES (p_user_id, p_type, p_title, p_content, p_link)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CREATE CONNECTION FROM FRIEND REQUEST
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_connection_from_request()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
        INSERT INTO connections (user_id_1, user_id_2)
        VALUES (
            LEAST(NEW.sender_id, NEW.recipient_id),
            GREATEST(NEW.sender_id, NEW.recipient_id)
        )
        ON CONFLICT (user_id_1, user_id_2) DO NOTHING;
        
        -- Create notification for sender
        PERFORM create_notification(
            NEW.sender_id,
            'system',
            'Connection Accepted',
            (SELECT full_name FROM profiles WHERE id = NEW.recipient_id) || ' accepted your connection request',
            '/network'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_friend_request_accepted
    AFTER UPDATE ON friend_requests
    FOR EACH ROW EXECUTE FUNCTION public.create_connection_from_request();

-- ============================================================================
-- INCREMENT STARTUP VIEW COUNT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.increment_startup_views(startup_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE startups
    SET metrics_views = metrics_views + 1
    WHERE id = startup_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- GET UNREAD MESSAGE COUNT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_unread_message_count(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    count INTEGER;
BEGIN
    SELECT COUNT(*)::INTEGER
    INTO count
    FROM messages
    WHERE recipient_id = user_uuid
    AND is_read = FALSE;
    
    RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GET USER ROLE
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role AS $$
DECLARE
    user_role_value user_role;
BEGIN
    SELECT role
    INTO user_role_value
    FROM profiles
    WHERE id = user_uuid;
    
    RETURN user_role_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SEARCH CREATORS (Full-text search helper)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.search_creators(search_term TEXT)
RETURNS SETOF creator_profiles AS $$
BEGIN
    RETURN QUERY
    SELECT cp.*
    FROM creator_profiles cp
    JOIN profiles p ON p.id = cp.id
    WHERE
        p.full_name ILIKE '%' || search_term || '%'
        OR cp.headline ILIKE '%' || search_term || '%'
        OR EXISTS (
            SELECT 1 FROM unnest(cp.skills) AS skill
            WHERE skill ILIKE '%' || search_term || '%'
        )
    ORDER BY cp.rating DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEARCH STARTUPS (Full-text search helper)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.search_startups(search_term TEXT)
RETURNS SETOF startups AS $$
BEGIN
    RETURN QUERY
    SELECT s.*
    FROM startups s
    WHERE
        s.published_at IS NOT NULL
        AND (
            s.name ILIKE '%' || search_term || '%'
            OR s.blurb ILIKE '%' || search_term || '%'
            OR s.category ILIKE '%' || search_term || '%'
            OR EXISTS (
                SELECT 1 FROM unnest(s.tags) AS tag
                WHERE tag ILIKE '%' || search_term || '%'
            )
        )
    ORDER BY s.metrics_interest DESC, s.published_at DESC;
END;
$$ LANGUAGE plpgsql;

