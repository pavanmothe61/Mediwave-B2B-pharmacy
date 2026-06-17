# Pharmacy B2B Ordering Portal - Final Project Blueprint

## 1. Executive Summary
The Pharmacy B2B Ordering Portal is a comprehensive digital solution for Pharmacy B2B Ordering Portal, designed to digitize the pharmaceutical supply chain. It replaces manual phone and WhatsApp ordering with a robust, trackable, and scalable web application. Built over 26 working days by a team of three students, the system bridges the gap between pharmacies, medical representatives, and warehouse administration.

## 2. Problem Statement
Currently, pharmacies rely on phone calls, WhatsApp messages, and spreadsheets to place orders and track inventory. This manual process leads to:
- Delayed responses and scattered communication.
- Missed revenue opportunities due to inefficient follow-ups.
- Lack of a centralized system to track order history, status, and ownership.
- High administrative overhead for the Mediwave team.

## 3. Existing System Analysis
**Existing Systems**: Traditional ERPs or manual entry tools (e.g., WhatsApp + Excel).
**Limitations**: 
- No dedicated B2B storefront for pharmacies to browse up-to-date catalogs.
- High licensing costs for full-scale ERPs.
- Lack of real-time status updates for pharmacies.
- Complex interfaces not optimized for quick B2B bulk ordering.

## 4. Proposed System
A specialized Pharmacy B2B Ordering Portal built with React.js and Node.js. 
- **Pharmacies** get a modern UI to browse medicines, add to cart, and track orders.
- **Admins** get a dashboard to manage inventory, update order statuses, and generate reports.
- **System** acts as a single source of truth for all transactions.

## 5. Project Objectives
1. Eliminate manual ordering methods by providing a 24/7 digital portal.
2. Provide real-time inventory visibility to pharmacies.
3. Streamline order processing for Mediwave's administrative team.
4. Deliver a fully functional, tested, and deployed prototype within 26 working days.

## 6. Functional Requirements
- **User Authentication**: Secure Login/Register with JWT.
- **Product Catalog**: View, search, and filter medicines.
- **Cart & Checkout**: Add items in bulk, place orders.
- **Order Tracking**: Pharmacies can view order history and real-time status.
- **Admin Dashboard**: Manage products, users, inventory, and update order statuses.

## 7. Non-Functional Requirements
- **Performance**: API response times under 500ms.
- **Security**: Password hashing (bcrypt), JWT authentication, SQL injection prevention.
- **Usability**: Responsive UI for desktop and tablet viewing.
- **Reliability**: 99% uptime for the deployed prototype.

## 8. Complete System Workflow
1. Pharmacy registers/logs into the portal.
2. Pharmacy browses the medicine catalog and searches for specific drugs.
3. Pharmacy adds required quantities to the cart and proceeds to checkout.
4. System validates inventory and creates an order in the database.
5. Admin logs into the dashboard, views new orders.
6. Admin updates order status (e.g., Pending -> Shipped -> Delivered).
7. Pharmacy views updated status in their Order History.

## 9. User Roles and Permissions
- **Pharmacy (User)**: Can view catalog, manage own cart, place orders, view own order history.
- **Admin**: Can manage (CRUD) all medicines, view all users/pharmacies, view all orders, change order statuses, view analytics.

## 10. Frontend Module Design
**Stack**: React.js, React Router, Tailwind CSS (or Vanilla CSS), Axios.
- **Login/Register**: Purpose: Authentication. Validation: Email format, Password length.
- **Dashboard**: Purpose: Overview of recent activities.
- **Medicine Catalog**: Purpose: Display all available medicines. Components: Search bar, filter sidebar, medicine cards.
- **Medicine Details**: Purpose: Show composition, batch info, expiry.
- **Cart & Checkout**: Purpose: Review selected items and submit order.
- **Order History**: Purpose: Track past orders.
- **Admin Dashboard**: Purpose: System analytics.
- **Inventory Management**: Purpose: Admin CRUD operations on medicines.
- **Orders Management**: Purpose: Admin updates order status.

## 11. Backend Architecture
**Stack**: Node.js, Express.js.
**Folder Structure**:
```
/backend
  /config       (Database config)
  /controllers  (Business logic)
  /middlewares  (Auth, Error handling)
  /models       (DB queries/models)
  /routes       (API endpoints)
  /utils        (Helpers, JWT)
  server.js     (Entry point)
```

## 12. Database Design (MySQL)
**ER Diagram Description**:
A User can have one Pharmacy profile. A Pharmacy can place multiple Orders. An Order contains multiple OrderItems. An OrderItem references one Medicine. A Medicine belongs to a Category.

**Tables & Keys**:
- **Users**: id (PK), role, email, password_hash, created_at.
- **Pharmacies**: id (PK), user_id (FK), name, license_no, address.
- **Medicines**: id (PK), name, description, price, stock, category_id (FK).
- **Categories**: id (PK), name.
- **Orders**: id (PK), user_id (FK), total_amount, status (Pending, Shipped, Delivered), created_at.
- **OrderItems**: id (PK), order_id (FK), medicine_id (FK), quantity, price_at_time.

## 13. REST API Documentation
**Authentication**
- `POST /api/auth/register` - Body: { email, password, role }
- `POST /api/auth/login` - Body: { email, password } -> Returns JWT.

**Medicine**
- `GET /api/medicines` - Query: ?search=...
- `POST /api/medicines` (Admin) - Body: { name, price, stock... }
- `PUT /api/medicines/:id` (Admin)

**Orders**
- `POST /api/orders` - Body: { items: [{medicine_id, quantity}] }
- `GET /api/orders` - Admin gets all, User gets own.
- `PUT /api/orders/:id/status` (Admin) - Body: { status }

## 14. GitHub Repository Structure
```
/pharmacy-b2b-portal
  /frontend (React app)
  /backend  (Node API)
  /docs     (Diagrams, test plans, blueprints)
  /tests    (Postman collections)
```

## 15. Review 1 Deliverables
- **Company Intro & Project Overview**: Mediwave Life Sciences digitizing B2B.
- **Problem Statement & Objectives**: Moving from WhatsApp to Web.
- **Abstract**: High-level summary of the solution.
- **Tech Stack & Roles**: React/Node/MySQL across 3 students.
- **Wireframes**: Initial UI sketches for Login, Catalog, Cart.

## 16. Review 2 Deliverables
- **Literature Survey & Existing Analysis**: Comparison with traditional phone ordering.
- **System Architecture**: Client-Server diagram.
- **Database Design**: ER Diagram and Schemas.
- **API Design**: Endpoint list.
- **Initial Code**: Working React routing and Express Hello World.

## 17. Review 3 Deliverables
- **Working Prototype**: Live deployed URL.
- **GitHub Repo**: Clean history, README.
- **Final Report & PPT**: Documentation of the 26 days.
- **Demo Video**: 3-5 minute walkthrough.

## 18. Testing Plan
- **Functional**: Can a user register? Can admin add medicine?
- **API (Postman)**: Check status codes (200 OK, 400 Bad Request, 401 Unauthorized).
- **UI**: Responsiveness, button clicks.
- **Integration**: From adding to cart on UI to order saved in DB.

## 19. Deployment Guide
- **Database**: Cloud MySQL (e.g., Aiven, Render, or Railway).
- **Backend**: Deployed as Web Service on Render. Environment variables: `DB_URL`, `JWT_SECRET`, `PORT`.
- **Frontend**: Deployed as Static Site on Render/Vercel. Environment variable: `VITE_API_URL`.

## 20. Final Interview Preparation
- **Frontend**: Explain Virtual DOM, React Hooks (useEffect, useState), React Router.
- **Backend**: Explain REST, Express Middleware, Event Loop, JWT flow.
- **Database**: Explain Normalization, Joins vs Subqueries, Indexing.
- **Deployment**: Explain CI/CD, Environment Variables, CORS.

## 21. Future Enhancements
- **AI Recommendation**: Suggesting medicines based on past orders.
- **WhatsApp API**: Automated invoice and delivery updates.
- **Mobile App**: React Native version for pharmacy owners.
- **Payment Gateway**: Integration with Stripe/Razorpay.
