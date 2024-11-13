# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.4] - 2024-11-13

### Added
- Implemented placeholder image service for community cover images
- Added community membership database schema
- Created database setup and initialization scripts
- Added comprehensive error handling for community-related operations

### Changed
- Updated translation structure for community-related content
- Reorganized community selector translations under unified namespace
- Enhanced database configuration with better error handling
- Improved community context error handling and logging

### Fixed
- Resolved community membership table schema issues
- Fixed 500 error in user communities endpoint
- Corrected missing roles in community memberships
- Fixed placeholder image 404 errors
- Improved error handling in CommunityContext and CommunitySwitcher

## [0.4.3] - 2024-11-03

### Added
- Implemented comprehensive role-based access control system
- Created database schema for roles and permissions
- Added role initialization script with hierarchical permissions
- Added detailed permission definitions for all system functionalities
- Implemented role-based navigation with permission checks
- Enhanced database configuration to support both pooled and transactional operations

### Changed
- Updated database configuration to support both connection pooling and dedicated clients
- Modified navigation to use role-based access control
- Enhanced authentication system to include role and permission information in JWT
- Updated documentation to reflect new role-based system

### Security
- Implemented granular permission system with scoped access control
- Added role hierarchy with clearly defined capabilities
- Enhanced database transaction handling for sensitive operations

## [0.4.2] - 2024-10-27

### Added
- Implemented CommunityContext for global community state management
- Added CommunityLanding page with rich community details
- Created CommunitySwitcher component for easy community navigation
- Enhanced ProjectList and EventCalendar with community-aware filtering
- Added comprehensive community-related translations for English and Swedish
- Created sample data script for testing community features

### Changed
- Updated database schema to support enhanced community features
- Moved context files to dedicated contexts directory
- Modified navigation to support community-specific views
- Updated App.js routing configuration to include community routes
- Enhanced existing components to respect community context

### Fixed
- Resolved component import issues in App.js and EventCalendar.js
- Fixed translation structure for community-related content
- Corrected context provider hierarchy in App.js

## [0.4.1] - 2024-10-07

### Added
- Implemented weather-based theming system
- Created Weather model and weather history table
- Added weather service for fetching and updating weather data
- Implemented scheduler for periodic weather updates
- Added tests for weather service, community controller, and API endpoints
- Created integration tests for weather API

### Changed
- Updated Community model to include weather-related data
- Modified ThemeSwitcher component to support weather-based themes
- Enhanced API to serve weather data for communities

### Fixed
- Optimized API calls to prevent unnecessary weather data fetches

## [0.4.0] - 2024-09-30

### Added
- Implemented location-based theming system
- Added user-selectable themes with a new ThemeSwitcher component
- Integrated dark mode toggle using Chakra UI's color mode

### Changed
- Refactored App.js to use the new theming system
- Updated LanguageSwitcher and ThemeSwitcher components for consistent styling
- Improved overall UI consistency and readability

### Fixed
- Resolved issues with theme application and color mode
- Fixed styling inconsistencies in dropdown menus

## [0.3.0] - 2024-09-24

### Added
- Enhanced multi-language support with comprehensive translations for many components
- Token refresh mechanism for improved authentication
- Detailed project view component with volunteer management
- Improved create project functionality
- File upload capability for projects

### Changed
- Updated user interface components to use Chakra UI
- Improved error handling and user feedback across components
- Enhanced event calendar with RSVP functionality
- Updated authentication context to handle token refresh

### Fixed
- Resolved issues with expired JWT tokens
- Fixed database schema to properly store project and volunteer information

## [0.2.0] - 2024-09-15

### Added
- Initial project setup
- User management system with CRUD operations
- Multi-language support for English and Swedish
- Basic React frontend
- Express backend with PostgreSQL database
- Project management system with CRUD operations
- Search and filter functionality for projects
- Pagination for project listing
- User authentication system with JWT
- Login component and protected routes
- Messaging system with send and receive functionality
- User profile component with edit capabilities
- Notification system with create and fetch endpoints
- Event management system with CRUD operations
- Community event calendar functionality
- RSVP feature for events
- User roles and permissions system
- Admin user creation script
- Authentication routes and controller

### Changed
- Updated user routes to include authentication middleware
- Improved error handling and added loading states in components
- Updated user table structure to include name, password, and updated_at columns
- Modified ProjectDetails component to show edit/delete options only to admins or creators
- Enhanced error handling and logging in admin user creation script

### Security
- Implemented role-based access control for projects and events

### Deprecated

### Removed

### Fixed

### Security
- Implemented token-based authentication for API routes
- Added authentication middleware to protect sensitive routes

## [0.1.0] - 2024-08-23
- Initial release

[Unreleased]: https://github.com/BjornKennentHolmstrom/CommuniTree/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/BjornKennethHolmstrom/CommuniTree/releases/tag/v0.1.0
