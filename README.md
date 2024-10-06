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
- User roles and permissions (Admin, Regular User)
- Protected routes for authenticated users
- Messaging system for user communication
- User profiles with edit capabilities
- Notification system for user alerts
- Improved error handling and user feedback
- Location-based theming system
- User-selectable themes with dark mode support

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
│   │   ├── project.js
│   │   └── user.js
│   └── routes
│       ├── authRoutes.js
│       ├── commentRoutes.js
│       ├── communityRoutes.js
│       ├── dashboardRoutes.js
│       ├── eventRoutes.js
│       ├── fileRoutes.js
│       ├── messageRoutes.js
│       ├── notificationRoutes.js
│       ├── projectRoutes.js
│       ├── users (copy).js
│       └── users.js
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
│   └── setup.js
└── uploads

```

## Contributing

We welcome contributions to CommuniTree! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under a custom license - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Claude 3.5 Sonnet for invaluable assistance
