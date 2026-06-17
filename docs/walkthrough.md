# Pharmacy B2B Ordering Portal - Walkthrough

The application has been successfully built according to the blueprint. The prototype connects a Vite + React frontend to an Express + SQLite backend, fulfilling all the requirements for the internship project.

## What Was Completed

1. **Backend API (Express.js)**
   - Created full CRUD routes for Authentication (`/api/auth/register`, `/login`).
   - Created routes for Medicine catalog management (`/api/medicines`).
   - Created order placement and status update routes (`/api/orders`).
   - Integrated Sequelize ORM with an SQLite database (`pharmacy.sqlite`) for easy local prototyping without needing a MySQL server installation right away.

2. **Frontend UI (React + Vite)**
   - Built a sleek, premium dark-mode interface with glassmorphism effects, smooth gradients, and modern typography.
   - **Login & Registration**: Secure token-based authentication pages.
   - **Catalog**: Pharmacy users can browse medicines, search, and add them to their cart.
   - **Cart**: Users can manage quantities and place an order.
   - **Dashboard**: Role-based views. Admins see total system orders and can update order statuses (Pending -> Shipped -> Delivered). Pharmacies see their own order history.

## How to Test Locally

To run the application locally on your machine, open two separate PowerShell/Terminal windows in your project folder (`c:\Users\pavan\OneDrive\Documents\pharmacy`):

**Terminal 1 (Backend)**
```bash
cd backend
node server.js
```

**Terminal 2 (Frontend)**
```bash
cd frontend
npm run dev
```

> [!TIP]
> After starting both servers, open the Local URL provided by Vite (usually `http://localhost:5173`) in your browser. 
> 
> You can register two accounts to test the roles:
> 1. Register an account with the role "Admin User".
> 2. Register an account with the role "Pharmacy User".
> 
> *Note: By default, the database is empty. You can add medicines by calling the `POST http://localhost:5000/api/medicines` endpoint using Postman with the Admin token, or by injecting rows directly into the `pharmacy.sqlite` database.*

## Next Steps for Deployment

As outlined in the blueprint, when you are ready to deploy for your final review:
1. Push this entire repository to GitHub.
2. Link the `backend` folder to a Render Web Service.
3. Link the `frontend` folder to a Render Static Site, ensuring API URLs point to the production backend.
