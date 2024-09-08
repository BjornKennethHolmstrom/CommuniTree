# CommuniTree

CommuniTree is a community engagement platform designed to connect municipalities with their residents, facilitating volunteer work, paid tasks, and intergenerational collaboration.

## Features

- User management system with CRUD operations
- Multi-language support (English and Swedish)
- Project management system with CRUD operations
- Search and filter functionality for projects
- Pagination for project listing
- User authentication system with JWT
- Protected routes for authenticated users
- Messaging system for user communication
- User profiles with edit capabilities
- Notification system for user alerts

## Technical Stack

- Backend: Node.js with Express
- Frontend: React (Create React App)
- Database: PostgreSQL
- State Management: React Hooks (useState, useEffect)
- Internationalization: react-i18next
- Authentication: JSON Web Tokens (JWT)

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
communitree/
├── client/                 # React frontend
│   ├── public/
│   │   └── locales/        # Translation files
│   └── src/
│       ├── components/
│       └── i18n.js         # i18next configuration
├── src/                    # Express backend
│   ├── routes/
│   ├── models/
│   └── controllers/
├── config/
│   └── database.js         # Database configuration
├── .env                    # Environment variables
├── server.js               # Main server file
├── README.md
├── CHANGELOG.md
└── LICENSE.md              # Custom license
```

## Contributing

We welcome contributions to CommuniTree! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under a custom license - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Claude 3.5 Sonnet for invaluable assistance
