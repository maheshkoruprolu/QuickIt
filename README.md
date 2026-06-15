# QuickIt – Fast Shopping & Clean Checkout

A modern, full-stack ecommerce application built with React, Express, and MongoDB. Features a polished shopping experience with real-time cart management, admin product/category controls, and professional order tracking.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- MongoDB instance (local or cloud)
- Cloudinary account (for image uploads)
- Resend account (for emails)

### Setup

**1. Clone and install**

```bash
git clone https://github.com/maheshkoruprolu/QuickIt.git
cd QuickIt
npm install --prefix backend
npm install --prefix frontend
```

**2. Configure environment variables**

Backend: Copy `backend/.env.example` to `backend/.env` and fill in:

```
MONGODB_URI=your_mongo_connection
PORT=8080
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API=your_resend_api_key
FRONTEND_URL=http://localhost:5173
```

Frontend: Copy `frontend/.env.example` to `frontend/.env.example` and fill in:

```
VITE_API_BASE_URL=http://localhost:8080
```

**3. Run locally**

Backend (from project root):

```bash
cd backend && npm run dev
```

Frontend (from project root):

```bash
cd frontend && npm run dev
```

Backend runs on `http://localhost:8080`  
Frontend runs on `http://localhost:5173`

## 📁 Project Structure

- **backend/** – Express server, MongoDB models, admin routes
- **frontend/** – React + Vite app, Redux state management, Tailwind UI

## 🎯 Key Features

- **User Auth** – Login, register, JWT refresh tokens
- **Shopping** – Browse categories, search/filter, add to cart
- **Checkout** – Cart summary, order creation, payment integration ready
- **Orders** – Track orders, view history, payment status
- **Admin Panel** – Manage categories, subcategories, products with edit/delete
- **Profile** – Update personal info, avatar upload, saved addresses
- **Images** – Cloudinary integration for product and avatar uploads
