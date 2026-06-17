# Pharmacy B2B Ordering Portal

An end-to-end B2B Ordering Portal built for Mediwave Life Sciences Pvt Ltd, allowing pharmacies to place wholesale medicine orders digitally.

## Tech Stack
- **Frontend**: React.js, Vite, Vanilla CSS with Glassmorphism UI
- **Backend**: Node.js, Express.js
- **Database**: SQLite (via Sequelize ORM - easily convertible to MySQL/PostgreSQL)

## Project Structure
- `/frontend` - Contains the React application
- `/backend` - Contains the Node.js API server
- `/docs` - Project blueprints and architecture documents

## Running Locally

### 1. Start the Backend
```bash
cd backend
npm install
node seed.js  # Optional: Adds dummy medicines to the database
node server.js
```
The backend will run on `http://localhost:5000`

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`

## Features
- **Authentication**: JWT-based secure login and registration.
- **Roles**: Distinct views for Admin Users and Pharmacy Users.
- **Medicine Catalog**: Real-time browsing and searching of medicines.
- **Cart System**: Local state shopping cart for bulk ordering.
- **Order Management**: End-to-end order tracking from Pending to Delivered.
