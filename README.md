# CommuniTree

CommuniTree is a community engagement platform designed to connect municipalities with their residents, facilitating volunteer work, paid tasks, and intergenerational collaboration.

## Features

- User management system with CRUD operations
- Enhanced multi-language support (English and Swedish) with comprehensive translations
- Project management system with CRUD operations and detailed project views
- Event management system with CRUD operations
- Community management system with CRUD operations
- Community event calendar with RSVP functionality and community filtering
- Search and filter functionality for projects, events, and communities
- Pagination for project and event listings
- User authentication system with JWT and token refresh mechanism
- Protected routes for authenticated users
- Messaging system for user communication
- User profiles with edit capabilities
- Notification system for user alerts
- Improved error handling and user feedback
- Location-based theming system
- User-selectable themes with dark mode support
- Weather-based theming system with periodic updates
- Community Management System:
  - Rich community profiles with activity feeds
  - Multi-community support with easy switching
  - Community-specific content filtering
  - Community membership management
  - Community-based project and event organization
  - Community statistics and analytics
- Comprehensive Role-Based Access Control:
  - Hierarchical role system (Super Admin → Guest)
  - Granular permission definitions
  - Scoped access control (global, community, self)
  - Role-based navigation and UI adaptation
  - Permission-based feature access
  - Community-specific role assignments
- Enhanced Project Management System:
  - Centralized project data management with custom hooks
  - Advanced filtering and sorting capabilities
  - Skills-based search and validation
  - Progress tracking and volunteer management
  - Standardized project status handling

## Technical Stack

- Backend: Node.js with Express
- Frontend: React (Create React App)
- Database: PostgreSQL
- State Management: React Hooks (useState, useEffect)
- Internationalization: react-i18next
- Authentication: JSON Web Tokens (JWT)
- UI Components: Chakra UI and custom components
- Theming: Chakra UI theming system with custom hooks
- Testing: Jest and Supertest
- Weather Data: OpenWeatherMap API
- Scheduling: node-schedule
- State Management: 
  - React Hooks (useState, useEffect)
  - Custom hooks for domain-specific logic
  - Utility functions for common operations

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL


### Installation

1. Clone the repository:
   ```
   git clone https://github.com/BjornKennethHolmstrom/CommuniTree.git
   cd communitree
   ```

2. Install dependencies:
   ```
   npm install
   cd client
   npm install
   ```

3. Set up your PostgreSQL database and update the `.env` file with your database credentials.

   ```# After database setup, you can populate with sample data:
   psql -U your_username -d your_database -f scripts/init.sql
   psql -U your_username -d your_database -f scripts/sample-data.sql
   ```


4. Start the backend server:
   ```
   npm run dev
   ```

5. In a new terminal, start the React frontend:
   ```
   cd client
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### Database Setup

1. Create PostgreSQL database:
   ```sql
   CREATE DATABASE communitree;
   ```

2. Initialize the database schema:
   ```bash
   # Run the initial schema setup
   psql -U postgres -d communitree -f scripts/init.sql
   
   # Add sample data
   psql -U postgres -d communitree -f scripts/sample-data.sql

   # Run roles schema updates
   psql -U postgres -d communitree -f scripts/roles-schema.sql
   
   # Run community schema updates
   psql -U postgres -d communitree -f scripts/community-schema.sql
   ```

3. Create admin user:
   ```bash
   npm run create-admin
   ```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=communitree
DB_PASSWORD=your_password
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Project Structure

The project follows a monorepo structure:

```
CommuniTree
├── babel.config.js
├── CHANGELOG.md
├── client
│   ├── components
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── locales
│   │   │   ├── en
│   │   │   │   └── translation.json
│   │   │   └── sv
│   │   │       └── translation.json
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── README.md
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── assets
│       ├── components
│       │   ├── AddUserForm.js
│       │   ├── AuthContext.js
│       │   ├── Comments.js
│       │   ├── CommunityDetails.js
│       │   ├── CommunityForm.js
│       │   ├── CommunityList.js
│       │   ├── CreateProject.js
│       │   ├── Dashboard.js
│       │   ├── EditUserForm.js
│       │   ├── EventCalendar.js
│       │   ├── FileUpload.js
│       │   ├── LanguageSwitcher.js
│       │   ├── Login.js
│       │   ├── Login.test.js
│       │   ├── MessagingComponent.js
│       │   ├── Navigation.js
│       │   ├── NotificationComponent.js
│       │   ├── PrivateRoute.js
│       │   ├── ProjectDetails.js
│       │   ├── ProjectForm.js
│       │   ├── ProjectList.js
│       │   ├── ui
│       │   │   └── alert.js
│       │   ├── UserDetails.js
│       │   ├── UserList.js
│       │   └── UserProfile.js
│       ├── contexts/           # Application contexts
│       │   ├── AuthContext.js
│       │   ├── CommunityContext.js
│       │   ├── ErrorContext.js
│       │   └── ThemeContext.js
│       ├── i18n.js
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       └── setupTests.js
├── config
│   └── database.js
├── cypress.config.js
├── docs
│   ├── communitree-project-summary.md
│   ├── communitree-roadmap.md
│   ├── features-ideas-and-considerations.md
│   ├── message-for-next-session.md
│   └── postgresql-management-guide.md
├── jest.config.js
├── LICENSE.md
├── package.json
├── package-lock.json
├── README.md
├── scripts
│   └── createAdminUser.js
├── server.js
├── src
│   ├── controllers
│   │   ├── authController.js
│   │   ├── commentController.js
│   │   ├── communityController.js
│   │   ├── dashboardController.js
│   │   ├── eventController.js
│   │   ├── fileController.js
│   │   ├── projectController.js
│   │   └── userController.js
│   ├── middleware
│   │   ├── auth.js
│   │   └── checkPermission.js
│   ├── __mocks__
│   │   └── database.js
│   ├── models
│   │   ├── community.js
│   │   ├── communityMembership.js
│   │   ├── event.js
│   │   ├── index.js
│   │   ├── project.js
│   │   └── user.js
│   │   ├── weather.js
│   └── routes
│   │   ├── authRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── communityRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── fileRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── users (copy).js
│   │   └── users.js
│   └── schedulers
│       └── weatherScheduler.js
│   └── services
│       └── weatherService.js
├── start.js
├── tests
│   ├── api
│   │   ├── auth.test.js
│   │   └── project.test.js
│   ├── controllers
│   │   ├── authController.test.js
│   │   ├── commentController.test.js
│   │   ├── communityController.test.js
│   │   ├── dashboardController.test.js
│   │   ├── eventController.test.js
│   │   ├── fileController.test.js
│   │   ├── projectController.test.js
│   │   └── userController.test.js
│   ├── integration
│   │   └── projectFlow.test.js
│   ├── routes
│   │   ├── authRoutes.test.js
│   │   ├── commentRoutes.test.js
│   │   ├── communityRoutes.test.js
│   │   ├── dashboardRoutes.test.js
│   │   ├── eventRoutes.test.js
│   │   ├── fileRoutes.test.js
│   │   ├── messageRoutes.test.js
│   │   ├── notificationRoutes.test.js
│   │   ├── projectRoutes.test.js
│   │   └── users.test.js
│   ├── schedulers
│   │   └── weatherScheduler.test.js
│   ├── services
│   │   └── weatherService.test.js
│   └── setup.js
└── uploads

```

## Contributing

We welcome contributions to CommuniTree! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under a custom license - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Claude 3.5 Sonnet for invaluable assistance
