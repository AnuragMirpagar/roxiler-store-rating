# Store Rating Platform — Roxiler Coding Challenge

A full-stack web application for submitting and managing store ratings.

## Tech Stack

- Frontend: React.js (Vite)
- Backend: NestJS
- Database: MySQL

## How to Run

### 1. Database Setup

Open MySQL and run:

    CREATE DATABASE roxiler_db;

### 2. Backend Setup

    cd backend
    npm install
    npm run start:dev

### 3. Create Admin User

    npx ts-node src/seed.ts

### 4. Frontend Setup

    cd frontend
    npm install
    npm run dev

### 5. Open Browser

    http://localhost:5173

## Login Credentials

| Role        | Email             | Password   |
|-------------|-------------------|------------|
| Admin       | admin@roxiler.com | Admin@123  |
| Normal User | user@test.com     | User@1234  |
| Store Owner | owner@test.com    | Owner@1234 |

## Features

- Role based access control
- Store ratings 1 to 5 stars
- Admin dashboard with stats
- Filter and search on all tables
- Sorting on all columns
- Full form validation
- JWT authentication
- Password change for all roles