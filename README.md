# Team Tasker Project

This is a full-stack web-based task management platform for small teams.

## Tech Stack
- **Backend:** Node.js, Express.js, TypeScript, Sequelize (PostgreSQL), JWT, Socket.IO
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Shadcn UI, React Query, Axios, Socket.IO client

## Features
- Authentication & Authorization (JWT)
- Role-Based Access Control (RBAC)
- Real-time updates (Socket.IO)
- Task CRUD operations
- Kanban board support
- Notifications

---

# Getting Started

## Backend

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

### Project Structure (Backend)
- `/src` - Main source code
- `/models` - Sequelize models
- `/routes` - Express routes
- `/middleware` - Auth & RBAC middleware
- `/sockets` - Socket.IO logic

---

## Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and migrated to Vite for faster builds and HMR.

### Available Scripts

In the `frontend` directory, you can run:

#### `npm start`
Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

#### `npm test`
Launches the test runner in the interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes. Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

---

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
