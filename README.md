# Hierarchy-Based Task Management System

A full-stack MERN task management application with role-based access control, JWT authentication, team hierarchy management, task assignment, status tracking, and task activity logs.

The project is split into two apps:

- `Frontend`: React + Vite client application
- `Backend`: Express + MongoDB REST API

## Features

- Secure login with access and refresh tokens
- Role-based dashboards for `super_admin`, `admin`, `manager`, and `employee`
- Hierarchy-based user management
- Create, view, update, and delete users based on role permissions
- Create, assign, filter, update, and delete tasks
- Task status flow using `todo`, `in_progress`, `done`, and `closed`
- Task logs for status changes
- Protected frontend routes
- Axios API client with bearer token injection
- MongoDB persistence using Mongoose
- Security middleware with Helmet, CORS, request validation, and auth rate limiting

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- TanStack React Query
- Axios
- Tailwind CSS
- ESLint

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- express-validator
- express-rate-limit
- Helmet
- CORS
- dotenv
- Nodemon

## Project Structure

```text
.
+-- Backend
|   +-- config
|   +-- controllers
|   +-- middleware
|   +-- models
|   +-- routes
|   +-- utils
|   +-- package.json
|   +-- server.js
+-- Frontend
|   +-- public
|   +-- src
|   |   +-- components
|   |   +-- context
|   |   +-- hooks
|   |   +-- pages
|   |   +-- routes
|   |   +-- services
|   |   +-- utils
|   +-- package.json
|   +-- vite.config.js
+-- package.json
+-- nixpacks.toml
```

## Prerequisites

- Node.js 20.19.0 or newer
- npm
- MongoDB Atlas account or a local MongoDB instance

## Backend Setup

1. Move into the backend folder:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create the backend environment file:

```bash
cp .sample.env .env
```

On Windows PowerShell:

```powershell
Copy-Item .sample.env .env
```

4. Update `.env` with your MongoDB connection string and JWT secrets.

5. Start the backend in development mode:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/health
```

## Frontend Setup

1. Move into the frontend folder:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create the frontend environment file:

```bash
cp .sample.env .env
```

On Windows PowerShell:

```powershell
Copy-Item .sample.env .env
```

4. Confirm that `VITE_API_URL` points to your backend API.

5. Start the frontend development server:

```bash
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## Environment Variables

### Backend

Create `Backend/.env` from `Backend/.sample.env`.

| Variable | Description | Example |
| --- | --- | --- |
| `PORT` | Backend server port | `5000` |
| `DATABASE_URL` | MongoDB connection string | `mongodb://127.0.0.1:27017/taskflow` |
| `JWT_SECRET` | Secret used to sign access tokens | `change-this-access-secret` |
| `JWT_EXPIRY` | Access token lifetime | `1d` |
| `REFRESH_SECRET` | Secret used to sign refresh tokens | `change-this-refresh-secret` |
| `REFRESH_EXPIRY` | Refresh token lifetime | `7d` |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |

### Frontend

Create `Frontend/.env` from `Frontend/.sample.env`.

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_URL` | Backend API URL. The frontend accepts either the API root or a URL ending in `/api`. | `http://localhost:5000/api` |

## Default Super Admin

When the backend connects to MongoDB, it automatically creates a default super admin if one does not already exist.

```text
Email: superadmin@gmail.com
Password: admin123
Role: super_admin
```

Change this behavior before using the app in production.

## Role Permissions

| Role | Main Capabilities |
| --- | --- |
| `super_admin` | Full access to users, tasks, hierarchy, and logs |
| `admin` | Create managers and employees, manage assigned hierarchy, manage tasks |
| `manager` | Create employees, assign tasks to direct reports, track team task progress |
| `employee` | View assigned tasks and update task status |

## API Overview

Base API URL:

```text
http://localhost:5000/api
```

### Auth Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/login` | Login and receive access and refresh tokens |
| `POST` | `/auth/register` | Register a user. Requires authorized role |
| `POST` | `/auth/refresh` | Generate a new access token from refresh token |
| `POST` | `/auth/logout` | Logout and remove refresh token |

### User Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/users` | Create a user within role permissions |
| `GET` | `/users` | Get visible users for the current role |
| `PATCH` | `/users/:id` | Update a user |
| `DELETE` | `/users/:id` | Delete a user. Super admin only |

### Task Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/tasks` | Create and assign a task |
| `GET` | `/tasks` | Get visible tasks for the current role |
| `PATCH` | `/tasks/:id` | Update task details or status |
| `DELETE` | `/tasks/:id` | Delete a task |
| `GET` | `/tasks/logs` | Get all visible task logs |
| `GET` | `/tasks/:id/logs` | Get logs for one task |

Supported task query filters:

```text
GET /api/tasks?status=todo&priority=high&assignedTo=<userId>
```

## Frontend Routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/login` | Login page |
| `/register` | Protected user registration page |
| `/users` | User management |
| `/tasks` | Task management |
| `/task-logs` | Task log history |
| `/dashboard/super-admin` | Super admin dashboard |
| `/dashboard/admin` | Admin dashboard |
| `/dashboard/manager` | Manager dashboard |
| `/dashboard/employee` | Employee dashboard |

## Available Scripts

### Root

```bash
npm start
```

Installs backend dependencies and starts the backend. This is mainly useful for deployment setups that run the server from the repository root.

### Backend

```bash
npm run dev
```

Starts the backend with Nodemon.

```bash
npm start
```

Starts the backend with Node.

### Frontend

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint.

## Deployment Notes

- Set `VITE_API_URL` to the deployed backend API URL in the frontend hosting provider.
- Set `FRONTEND_URL` to the deployed frontend origin in the backend hosting provider.
- Set strong production values for `JWT_SECRET` and `REFRESH_SECRET`.
- Use a production MongoDB connection string for `DATABASE_URL`.
- The backend listens on `0.0.0.0` and uses `process.env.PORT`, which works well on common Node hosting platforms.

## Security Notes

- Do not commit real `.env` files.
- Replace the default super admin password before production use.
- Use long, random JWT secrets in deployed environments.
- Keep MongoDB credentials private.
- Configure CORS with the exact frontend URL in production.
