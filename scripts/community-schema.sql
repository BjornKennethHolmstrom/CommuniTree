-- First, let's check if we need to add the role column
DO $$ 
BEGIN
    -- Add role column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'community_memberships' AND column_name = 'role'
    ) THEN
        ALTER TABLE community_memberships ADD COLUMN role VARCHAR(50) DEFAULT 'member';
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'community_memberships' AND column_name = 'status'
    ) THEN
        ALTER TABLE community_memberships ADD COLUMN status VARCHAR(20) DEFAULT 'active';
    END IF;

    -- Add joined_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'community_memberships' AND column_name = 'joined_at'
    ) THEN
        ALTER TABLE community_memberships ADD COLUMN joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Now let's check the communities table structure and add any missing columns
DO $$ 
BEGIN
    -- Add cover_image_url if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'communities' AND column_name = 'cover_image_url'
    ) THEN
        ALTER TABLE communities ADD COLUMN cover_image_url TEXT;
    END IF;

    -- Add member_count if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'communities' AND column_name = 'member_count'
    ) THEN
        ALTER TABLE communities ADD COLUMN member_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add sample data only if tables are empty
INSERT INTO communities (name, description, latitude, longitude, timezone)
SELECT 'Sample Community', 'A sample community for testing', 59.3293, 18.0686, 'Europe/Stockholm'
WHERE NOT EXISTS (SELECT 1 FROM communities);

-- Add sample membership for the admin user if it doesn't exist
-- Using COALESCE to handle the case where either role or status might be NULL
INSERT INTO community_memberships (user_id, community_id, role, status)
SELECT 
    u.id,
    c.id,
    'admin',
    'active'
FROM users u
CROSS JOIN (SELECT id FROM communities ORDER BY id LIMIT 1) c
WHERE u.role = 'ADMIN'
AND NOT EXISTS (
    SELECT 1 FROM community_memberships cm 
    WHERE cm.user_id = u.id AND cm.community_id = c.id
)
LIMIT 1;

-- Update existing memberships to have default values if they're NULL
UPDATE community_memberships 
SET role = COALESCE(role, 'member'),
    status = COALESCE(status, 'active'),
    joined_at = COALESCE(joined_at, CURRENT_TIMESTAMP)
WHERE role IS NULL OR status IS NULL OR joined_at IS NULL;
