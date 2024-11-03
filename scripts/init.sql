-- init.sql - Run this to set up the complete database schema

-- Drop tables if they exist (useful for clean restart)
DROP TABLE IF EXISTS community_role_permissions CASCADE;
DROP TABLE IF EXISTS community_tag_assignments CASCADE;
DROP TABLE IF EXISTS community_content_settings CASCADE;
DROP TABLE IF EXISTS community_settings CASCADE;
DROP TABLE IF EXISTS community_permissions CASCADE;
DROP TABLE IF EXISTS community_roles CASCADE;
DROP TABLE IF EXISTS community_tags CASCADE;
DROP TABLE IF EXISTS community_categories CASCADE;
DROP TABLE IF EXISTS community_memberships CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS weather_history CASCADE;
DROP TABLE IF EXISTS project_volunteers CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS file_uploads CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

-- Create base tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refresh_token TEXT
);

CREATE TABLE community_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE community_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE communities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    timezone VARCHAR(50),
    parent_id INTEGER REFERENCES communities(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES community_categories(id),
    member_count INTEGER DEFAULT 0,
    is_private BOOLEAN DEFAULT false,
    join_approval_required BOOLEAN DEFAULT false,
    cover_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE community_roles (
    id SERIAL PRIMARY KEY,
    community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(community_id, name)
);

CREATE TABLE community_permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE community_role_permissions (
    role_id INTEGER REFERENCES community_roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES community_permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE community_memberships (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES community_roles(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'inactive', 'banned')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP,
    PRIMARY KEY (user_id, community_id)
);

CREATE TABLE community_settings (
    community_id INTEGER PRIMARY KEY REFERENCES communities(id) ON DELETE CASCADE,
    theme JSON DEFAULT '{}',
    welcome_message TEXT,
    notification_preferences JSON DEFAULT '{}',
    featured_projects JSON DEFAULT '[]',
    custom_fields JSON DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    creator_id INTEGER REFERENCES users(id),
    community_id INTEGER REFERENCES communities(id),
    status VARCHAR(20) DEFAULT 'open',
    required_skills TEXT[],
    time_commitment VARCHAR(100),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(255),
    creator_id INTEGER REFERENCES users(id),
    community_id INTEGER REFERENCES communities(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create utility tables
CREATE TABLE weather_history (
    id SERIAL PRIMARY KEY,
    community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
    weather VARCHAR(50),
    temperature DECIMAL(4,1),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for better performance
CREATE INDEX idx_community_memberships_user_id ON community_memberships(user_id);
CREATE INDEX idx_community_memberships_community_id ON community_memberships(community_id);
CREATE INDEX idx_communities_parent_id ON communities(parent_id);
CREATE INDEX idx_communities_category_id ON communities(category_id);
CREATE INDEX idx_projects_community_id ON projects(community_id);
CREATE INDEX idx_events_community_id ON events(community_id);

-- Insert default permissions
INSERT INTO community_permissions (name, description) VALUES
    ('manage_members', 'Can manage community members'),
    ('manage_roles', 'Can manage community roles'),
    ('manage_settings', 'Can manage community settings'),
    ('create_events', 'Can create community events'),
    ('manage_events', 'Can manage all community events'),
    ('create_projects', 'Can create community projects'),
    ('manage_projects', 'Can manage all community projects'),
    ('create_discussions', 'Can create discussions'),
    ('moderate_content', 'Can moderate community content'),
    ('view_analytics', 'Can view community analytics');

-- Create member count trigger
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
        UPDATE communities SET member_count = member_count + 1 WHERE id = NEW.community_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != 'active' AND NEW.status = 'active' THEN
        UPDATE communities SET member_count = member_count + 1 WHERE id = NEW.community_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'active' AND NEW.status != 'active' THEN
        UPDATE communities SET member_count = member_count - 1 WHERE id = NEW.community_id;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
        UPDATE communities SET member_count = member_count - 1 WHERE id = OLD.community_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_member_count
AFTER INSERT OR UPDATE OR DELETE ON community_memberships
FOR EACH ROW EXECUTE FUNCTION update_community_member_count();


-- Create roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- Create user_roles junction table
CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
    assigned_by INTEGER REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id, community_id)
);

-- Add role-related columns to users table
ALTER TABLE users
ADD COLUMN default_role_id INTEGER REFERENCES roles(id),
ADD COLUMN is_active BOOLEAN DEFAULT true,
ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_user_roles_community_id ON user_roles(community_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
