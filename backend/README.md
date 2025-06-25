# Team Tasker Backend

This is the backend for the Team Tasker platform, a full-stack web-based task management system for small teams.

## Tech Stack
- Node.js + Express.js + TypeScript
- Sequelize ORM (PostgreSQL)
- JWT authentication & RBAC
- Socket.IO for real-time updates

## Features
- Authentication & Authorization (JWT)
- Role-Based Access Control (RBAC)
- Real-time updates (Socket.IO)
- Task CRUD operations
- Kanban board support
- Notifications

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up your PostgreSQL database and configure environment variables.
3. Run database migrations:
   ```sh
   npx sequelize-cli db:migrate
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Project Structure
- `/src` - Main source code
- `/models` - Sequelize models
- `/routes` - Express routes
- `/middleware` - Auth & RBAC middleware
- `/sockets` - Socket.IO logic

---
See the frontend folder for the React client setup.
