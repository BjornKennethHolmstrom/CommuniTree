# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
