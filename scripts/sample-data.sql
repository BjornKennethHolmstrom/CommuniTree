-- sample_data.sql - Run this after init.sql to populate the database with test data

-- Optionally clear existing data first (uncomment if needed)
-- DELETE FROM community_memberships;
-- DELETE FROM community_role_permissions;
-- DELETE FROM community_roles;
-- DELETE FROM community_tag_assignments;
-- DELETE FROM community_settings;
-- DELETE FROM weather_history;
-- DELETE FROM events;
-- DELETE FROM projects;
-- DELETE FROM communities;
-- DELETE FROM community_tags;
-- DELETE FROM community_categories;
-- DELETE FROM users WHERE username = 'admin';

-- First create a test admin user if it doesn't exist
INSERT INTO users (
    username, email, password, name, role
)
SELECT 
    'admin',
    'admin@communitree.com',
    '$2a$10$rS7HYcO3HT1bWYH9fvEp8uMqC7TVQXnnFW0LPNcmYzLEfCvR7InqK',
    'Admin User',
    'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'admin'
);

-- Add community categories if they don't exist
INSERT INTO community_categories (name, description)
SELECT name, description
FROM (VALUES
    ('Neighborhood', 'Local neighborhood communities'),
    ('Environmental', 'Communities focused on environmental initiatives'),
    ('Education', 'Learning and educational communities'),
    ('Cultural', 'Cultural and heritage communities'),
    ('Sports & Recreation', 'Sports and outdoor activity communities')
) v(name, description)
WHERE NOT EXISTS (
    SELECT 1 FROM community_categories c WHERE c.name = v.name
);

-- Add community tags if they don't exist
INSERT INTO community_tags (name)
SELECT name
FROM (VALUES
    ('sustainable'),
    ('family-friendly'),
    ('active'),
    ('urban'),
    ('gardening'),
    ('education'),
    ('seniors'),
    ('youth'),
    ('arts'),
    ('technology')
) v(name)
WHERE NOT EXISTS (
    SELECT 1 FROM community_tags t WHERE t.name = v.name
);

-- Add sample communities
INSERT INTO communities (
    name, description, latitude, longitude, timezone,
    category_id, is_private, join_approval_required, cover_image_url
) VALUES
    ('Green Valley Community', 'A vibrant neighborhood focused on sustainable living', 59.3293, 18.0686, 'Europe/Stockholm',
        (SELECT id FROM community_categories WHERE name = 'Neighborhood'), false, false,
        '/api/placeholder/800/200'),
    ('Urban Gardeners Stockholm', 'Community of urban gardening enthusiasts', 59.3293, 18.0686, 'Europe/Stockholm',
        (SELECT id FROM community_categories WHERE name = 'Environmental'), false, false,
        '/api/placeholder/800/200'),
    ('Youth Coding Club', 'Teaching programming to young minds', 59.3293, 18.0686, 'Europe/Stockholm',
        (SELECT id FROM community_categories WHERE name = 'Education'), false, true,
        '/api/placeholder/800/200'),
    ('Senior Social Circle', 'Connecting seniors in our community', 59.3293, 18.0686, 'Europe/Stockholm',
        (SELECT id FROM community_categories WHERE name = 'Cultural'), false, false,
        '/api/placeholder/800/200'),
    ('Local Sports Network', 'Organizing local sports events and activities', 59.3293, 18.0686, 'Europe/Stockholm',
        (SELECT id FROM community_categories WHERE name = 'Sports & Recreation'), false, false,
        '/api/placeholder/800/200');

-- Create and populate community_tag_assignments table
CREATE TABLE IF NOT EXISTS community_tag_assignments (
    community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES community_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (community_id, tag_id)
);

-- Add community tag assignments
INSERT INTO community_tag_assignments (community_id, tag_id)
SELECT c.id, t.id
FROM communities c, community_tags t
WHERE 
    (c.name = 'Green Valley Community' AND t.name IN ('sustainable', 'family-friendly')) OR
    (c.name = 'Urban Gardeners Stockholm' AND t.name IN ('gardening', 'sustainable')) OR
    (c.name = 'Youth Coding Club' AND t.name IN ('education', 'technology', 'youth')) OR
    (c.name = 'Senior Social Circle' AND t.name IN ('seniors', 'arts')) OR
    (c.name = 'Local Sports Network' AND t.name IN ('active', 'family-friendly'));

-- Add community roles for each community
INSERT INTO community_roles (community_id, name, description)
SELECT c.id, r.name, r.description
FROM communities c
CROSS JOIN (
    VALUES 
        ('admin', 'Community Administrator'),
        ('moderator', 'Content Moderator'),
        ('organizer', 'Event Organizer'),
        ('member', 'Regular Member')
) AS r(name, description);

-- Add role permissions
INSERT INTO community_role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM community_roles r
CROSS JOIN community_permissions p
WHERE 
    (r.name = 'admin') OR
    (r.name = 'moderator' AND p.name IN ('moderate_content', 'create_events', 'create_projects', 'create_discussions')) OR
    (r.name = 'organizer' AND p.name IN ('create_events', 'manage_events')) OR
    (r.name = 'member' AND p.name IN ('create_discussions'));

-- Add community settings
INSERT INTO community_settings (
    community_id, theme, welcome_message, notification_preferences, featured_projects
) 
SELECT 
    id,
    '{"primaryColor": "#2ECC71", "secondaryColor": "#3498DB"}'::json,
    'Welcome to our community! We''re glad to have you here.',
    '{"events": true, "projects": true, "discussions": true}'::json,
    '[]'::json
FROM communities;

-- Add some sample projects
INSERT INTO projects (
    title, description, creator_id, community_id, status,
    required_skills, time_commitment, location
) VALUES
    ('Community Garden Project', 'Creating a shared garden space', 
        (SELECT id FROM users WHERE username = 'admin'),
        (SELECT id FROM communities WHERE name = 'Urban Gardeners Stockholm'),
        'open', ARRAY['gardening', 'planning'], '5 hours/week', 'Central Park'),
    ('Youth Programming Workshop', 'Weekly coding sessions for beginners', 
        (SELECT id FROM users WHERE username = 'admin'),
        (SELECT id FROM communities WHERE name = 'Youth Coding Club'),
        'in_progress', ARRAY['programming', 'teaching'], '2 hours/week', 'Community Center'),
    ('Senior Art Exhibition', 'Showcase of local senior artists', 
        (SELECT id FROM users WHERE username = 'admin'),
        (SELECT id FROM communities WHERE name = 'Senior Social Circle'),
        'open', ARRAY['art', 'organization'], '10 hours total', 'City Gallery'),
    ('Neighborhood Clean-up', 'Monthly community clean-up event', 
        (SELECT id FROM users WHERE username = 'admin'),
        (SELECT id FROM communities WHERE name = 'Green Valley Community'),
        'open', ARRAY['organizing', 'physical work'], '3 hours/month', 'Various Locations'),
    ('Local Sports Tournament', 'Summer sports tournament', 
        (SELECT id FROM users WHERE username = 'admin'),
        (SELECT id FROM communities WHERE name = 'Local Sports Network'),
        'planned', ARRAY['sports', 'event planning'], '20 hours total', 'Community Sports Center');

-- Add some sample events
INSERT INTO events (
    title, description, start_time, end_time,
    location, creator_id, community_id
) VALUES
    ('Garden Planning Meeting', 'Plan this season''s garden layout',
        CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP + INTERVAL '7 days 2 hours',
        'Community Center', (SELECT id FROM users WHERE username = 'admin'),
        (SELECT id FROM communities WHERE name = 'Urban Gardeners Stockholm')),
    ('Coding Workshop', 'Introduction to Python',
        CURRENT_TIMESTAMP + INTERVAL '14 days', CURRENT_TIMESTAMP + INTERVAL '14 days 3 hours',
        'Youth Center', (SELECT id FROM users WHERE username = 'admin'),
        (SELECT id FROM communities WHERE name = 'Youth Coding Club')),
    ('Art Class', 'Watercolor painting session',
        CURRENT_TIMESTAMP + INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '5 days 2 hours',
        'Senior Center', (SELECT id FROM users WHERE username = 'admin'),
        (SELECT id FROM communities WHERE name = 'Senior Social Circle')),
    ('Community Meeting', 'Monthly community update',
        CURRENT_TIMESTAMP + INTERVAL '10 days', CURRENT_TIMESTAMP + INTERVAL '10 days 1 hour',
        'Town Hall', (SELECT id FROM users WHERE username = 'admin'),
        (SELECT id FROM communities WHERE name = 'Green Valley Community')),
    ('Soccer Tournament', 'Local soccer tournament',
        CURRENT_TIMESTAMP + INTERVAL '21 days', CURRENT_TIMESTAMP + INTERVAL '21 days 6 hours',
        'Sports Field', (SELECT id FROM users WHERE username = 'admin'),
        (SELECT id FROM communities WHERE name = 'Local Sports Network'));

-- Add some weather history
INSERT INTO weather_history (community_id, weather, temperature)
SELECT 
    id,
    (ARRAY['Clear', 'Clouds', 'Rain'])[floor(random() * 3 + 1)],
    round((random() * 20)::numeric, 1)
FROM communities;

-- Make the admin user a member of all communities with admin role
INSERT INTO community_memberships (user_id, community_id, role_id, status)
SELECT 
    (SELECT id FROM users WHERE username = 'admin'),
    c.id,
    r.id,
    'active'
FROM communities c
JOIN community_roles r ON c.id = r.community_id AND r.name = 'admin';

-- Update member counts (trigger will handle this)
UPDATE community_memberships SET status = status WHERE status = 'active';
