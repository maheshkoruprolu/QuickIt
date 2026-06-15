# QuickIt Backend

Express.js REST API for the QuickIt ecommerce platform. Handles user authentication, product management, shopping cart, orders, and admin controls.

## 🔧 Tech Stack

- **Express 5** – Web framework
- **MongoDB + Mongoose** – Database
- **JWT** – Authentication
- **bcryptjs** – Password hashing
- **Cloudinary** – Image storage
- **Multer** – File upload middleware
- **Resend** – Email delivery
- **Helmet** – Security headers
- **Morgan** – Request logging

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm run dev
```

Starts on `http://localhost:8080` with auto-reload.

## 🏗️ Project Structure

```
backend/
├── index.js              # App bootstrap, routes setup
├── config/               # Database, email, storage config
├── models/               # MongoDB schemas
├── controllers/          # Business logic
├── routes/               # API endpoints
├── middlewares/          # Auth, upload, admin checks
└── utils/                # Helpers (token, OTP, templates)
```

## 📚 API Routes

- **Auth** – `/api/user/login`, `/register`, `/refresh-token`
- **Products** – `/api/product/...`
- **Cart** – `/api/cart/...`
- **Orders** – `/api/order/...`
- **Admin** – `/api/category/`, `/api/subcategory/`, `/api/product/` (protected)

## 🔐 Environment Variables

```
MONGODB_URI         # MongoDB connection string
PORT                # Server port (default: 8080)
JWT_ACCESS_SECRET   # JWT access token secret
JWT_REFRESH_SECRET  # JWT refresh token secret
CLOUDINARY_NAME     # Cloudinary cloud name
CLOUDINARY_API_KEY  # Cloudinary API key
CLOUDINARY_API_SECRET # Cloudinary API secret
RESEND_API          # Resend email API key
FRONTEND_URL        # Frontend origin for CORS
```

## 🧪 Testing

Currently no automated tests. Manual testing via Postman or the frontend app recommended.

## 📖 Notes

- Password hashing uses bcryptjs (10 rounds)
- JWT tokens expire after 15 minutes; refresh tokens renew them
- Admin routes require admin role in JWT claims
- Cloudinary handles image resizing and optimization
- Email templates use Resend API for deliverability
