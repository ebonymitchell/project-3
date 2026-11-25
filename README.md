# TaskMaster API

## Project Overview

TaskMaster is a secure RESTful API developed for Productivity Inc.
The application allows users to register, log in, manage projects,
and organize tasks within their projects.

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt
- JSON Web Tokens (JWT)
- dotenv

## Data Models

### User
- username
- email
- password

### Project
- name
- description
- user (reference to User)

### Task
- title
- description
- status (To Do, In Progress, Done)
- project (reference to Project)

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/users/register | Register a user |
| POST | /api/users/login | Authenticate a user |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/projects | Create a project |
| GET | /api/projects | Retrieve all owned projects |
| GET | /api/projects/:id | Retrieve a project |
| PUT | /api/projects/:id | Update a project |
| DELETE | /api/projects/:id | Delete a project |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/projects/:projectId/tasks | Create a task |
| GET | /api/projects/:projectId/tasks | Retrieve project tasks |
| PUT | /api/tasks/:taskId | Update a task |
| DELETE | /api/tasks/:taskId | Delete a task |

## Authentication and Authorization

Passwords will be hashed using bcrypt, and authentication
will be managed using JWTs.

All project and task endpoints will require authentication.
Users will only be permitted to manage projects they own
and tasks belonging to those projects.