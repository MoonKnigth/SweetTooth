# SweetTooth

SweetTooth is a full-stack, monorepo e-commerce application designed for a modern dessert and bakery shop. It provides a robust, secure, and user-friendly platform for customers to browse products, place orders, and track their history, while offering a comprehensive dashboard for administrators to manage operations.

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router), React, TailwindCSS, pnpm
- **Backend:** Laravel (PHP), RESTful API
- **Database:** PostgreSQL
- **Security:** JWT Authentication (Sanctum), Argon2id Password Hashing, CSRF Protection
- **DevOps:** Docker, Docker Compose

## ✨ Key Features

- **Storefront & Menu:** Dynamic product browsing with category filtering.
- **Shopping Cart & Checkout:** Seamless order placement (supports both Guest and Authenticated users).
- **Authentication:** Secure credential-based login (Argon2id) and **Google OAuth** integration.
- **Customer Dashboard:** Personalized profile with real-time order history tracking.
- **Admin Dashboard:** Centralized management for Products, Categories, and Orders. Role-based access control (RBAC).

## 🐳 How to Run Locally

This project uses Docker Compose for a streamlined local development and testing setup.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Cart_OrderProject
   ```

2. **Configure Environment Variables:**
   - Copy the backend environment file:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Update `backend/.env` with Postgres credentials:
     ```env
     DB_CONNECTION=pgsql
     DB_HOST=db
     DB_PORT=5432
     DB_DATABASE=sweettooth
     DB_USERNAME=sweetuser
     DB_PASSWORD=secret
     ```
   - Copy the frontend environment file (if applicable):
     ```bash
     cp frontend/.env.local.example frontend/.env.local
     ```

3. **Build and Run Containers:**
   ```bash
   docker compose up -d --build
   ```

4. **Initialize the Backend:**
   - Run migrations and seed the database:
     ```bash
     docker compose exec backend php artisan migrate --seed
     ```

5. **Access the Application:**
   - **Frontend:** `http://localhost:3000`
   - **Backend API:** `http://localhost:8000`
