# Week 1 Internship Assignment

A secure, production-ready REST API built with Node.js, Express, PostgreSQL, and Sequelize. Features JWT authentication, structured MVC architecture, and full CRUD operations for tasks.

---

## Live Deployment

| Service | URL |
|---|---|
| Backend API | https://internship-assignment-week1.onrender.com |
| Frontend | https://internship-assignment-week1-1-frontend.onrender.com |

---

## Project Description

QuickBoard is a task management backend API that allows users to register, log in, create projects, and manage tasks. It is built with security best practices including bcrypt password hashing, JWT authentication, Helmet security headers, and centralized error handling.

---

## Folder Architecture

```
backend/
└── src/
    ├── config/
    │   └── db.js               # Sequelize DB connection
    ├── controllers/
    │   ├── authController.js   # Register & Login logic
    │   └── taskController.js   # Task CRUD logic
    ├── middleware/
    │   ├── authMiddleware.js   # JWT verification
    │   └── errorMiddleware.js  # Centralized error handler
    ├── models/
    │   ├── index.js            # Model associations
    │   ├── User.js
    │   ├── Project.js
    │   └── Task.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── taskRoutes.js
    ├── services/               # Business logic layer
    ├── validators/
    │   └── authValidator.js    # Joi validation schemas
    └── app.js                  # Express app entry point

frontend/
├── css/
│   └── style.css
├── js/
│   └── script.js
├── index.html
├── login.html
├── register.html
└── dashboard.html
```

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- PostgreSQL (local via Docker or cloud)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ParijatPal/internship-assignment-week1.git
cd internship-assignment-week1/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5433
DB_NAME=mydatabase
DB_USER=postgres
DB_PASSWORD=12345
JWT_SECRET=supersecretkey
JWT_EXPIRES=7d
FRONTEND_URL=http://localhost:5500
```

### 4. Start PostgreSQL with Docker

```bash
docker run --name quickboard-db \
  -e POSTGRES_PASSWORD=12345 \
  -e POSTGRES_DB=mydatabase \
  -p 5433:5432 \
  -d postgres
```

### 5. Start the Server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## Environment Variable Explanation

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5433` |
| `DB_NAME` | Database name | `mydatabase` |
| `DB_USER` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `12345` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `supersecretkey` |
| `JWT_EXPIRES` | JWT token expiry duration | `7d` |
| `FRONTEND_URL` | Allowed CORS origin for frontend | `https://your-frontend.onrender.com` |

> ⚠️ Never commit your `.env` file to GitHub. It is listed in `.gitignore`.

---

## Database Schema

### SQL Schema

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_owner_id ON projects(owner_id);

-- Tasks Table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'Todo' CHECK (status IN ('Todo', 'In Progress', 'Done')),
  due_date DATE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
```

### Schema Diagram

```
┌─────────────────────┐         ┌──────────────────────────┐
│        users        │         │         projects          │
├─────────────────────┤         ├──────────────────────────┤
│ id (UUID, PK)       │◄────────│ owner_id (UUID, FK)      │
│ name                │         │ id (UUID, PK)             │
│ email (unique)      │         │ name                      │
│ password (hashed)   │         │ description               │
│ created_at          │         │ created_at                │
└─────────────────────┘         └──────────────────────────┘
                                          │
                                          │ 1:many
                                          ▼
                                ┌──────────────────────────┐
                                │          tasks            │
                                ├──────────────────────────┤
                                │ id (UUID, PK)             │
                                │ title                     │
                                │ description               │
                                │ status (Todo/In Progress/ │
                                │         Done)             │
                                │ due_date                  │
                                │ project_id (UUID, FK)     │
                                │ created_at                │
                                └──────────────────────────┘
```

---

## API Endpoint Table

### Authentication (Public)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Projects (Protected - requires Bearer token)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | Get all projects for logged-in user |
| POST | `/api/projects` | Create a new project |

### Tasks (Protected - requires Bearer token)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks (filter by projectId) |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

---

## Example Request / Response

### POST /api/auth/register

**Request:**
```json
{
  "name": "Parijat Pal",
  "email": "parijat@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Parijat Pal",
    "email": "parijat@example.com"
  }
}
```

---

### POST /api/auth/login

**Request:**
```json
{
  "email": "parijat@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Parijat Pal",
    "email": "parijat@example.com"
  }
}
```

---

### POST /api/projects

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "My First Project",
  "description": "A sample project"
}
```

**Response (201 Created):**
```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "name": "My First Project",
  "description": "A sample project",
  "owner_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created_at": "2026-03-10T10:00:00.000Z"
}
```

---

### POST /api/tasks

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Design homepage",
  "description": "Create wireframes",
  "status": "Todo",
  "due_date": "2026-03-20",
  "projectId": "b2c3d4e5-f6a7-8901-bcde-f12345678901"
}
```

**Response (201 Created):**
```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "title": "Design homepage",
  "description": "Create wireframes",
  "status": "Todo",
  "due_date": "2026-03-20",
  "project_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "created_at": "2026-03-10T10:05:00.000Z"
}
```

---

### PUT /api/tasks/:id

**Request:**
```json
{
  "status": "In Progress"
}
```

**Response (200 OK):**
```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "title": "Design homepage",
  "status": "In Progress"
}
```

---

### Error Responses

| Status Code | Meaning | Example |
|---|---|---|
| 400 | Bad Request | `{ "error": "Email is required" }` |
| 401 | Unauthorized | `{ "error": "No token provided" }` |
| 403 | Forbidden | `{ "error": "Access denied" }` |
| 404 | Not Found | `{ "error": "Task not found" }` |
| 500 | Server Error | `{ "error": "Internal server error" }` |

---

## Security Features

- Password hashing with **bcrypt**
- JWT authentication with **7-day expiry**
- HTTP security headers with **Helmet**
- Input validation with **Joi**
- CORS restricted to allowed origins
- Centralized error handling middleware
- `.env` excluded from version control

---

## Postman Collection

The exported Postman collection is included in the repository:

```
quickboard-week1.postman_collection.json
```

Import it into Postman and set the `base_url` variable to either:
- Local: `http://localhost:5000`
- Production: `https://internship-assignment-week1.onrender.com`
