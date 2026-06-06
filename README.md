# Store Rating Platform

Built as part of Roxiler Systems internship coding challenge.

## What is this?

A web app where users can browse stores and give them ratings from 1 to 5.
Different users have different access based on their role.

## Built With

- React.js for frontend
- NestJS for backend  
- MySQL for database

## Getting Started

First create the database in MySQL:

    CREATE DATABASE roxiler_db;

Then setup the backend:

    cd backend
    npm install
    npm run start:dev

Create the default admin account:

    npx ts-node src/seed.ts

Then setup the frontend:

    cd frontend
    npm install
    npm run dev

Open browser and go to http://localhost:5173

## Test Accounts

Admin
- Email: admin@roxiler.com
- Password: Admin@123

Normal User
- Email: user@test.com
- Password: User@1234

Store Owner
- Email: owner@test.com
- Password: Owner@1234

## What each user can do

Admin can add stores, add users, and see overall stats on the dashboard.

Normal users can browse all stores, search by name or address, and submit
or update their rating for any store.

Store owners can see who rated their store and what the average rating is.

## Validations

- Name must be between 20 and 60 characters
- Password must be 8 to 16 characters with one uppercase and one special character
- Email must be valid format
- Address cannot exceed 400 characters