# Market Server Price - Backend API Documentation

## Overview
Complete role-based authentication system supporting Admin and User flows on the same server.

**Base URL:** `http://localhost:5001/api/v1`

---

## Authentication Flow

### User Registration
**POST** `/auth/register`
- **Access:** Public
- **Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+919876543210" // optional
}
```
- **Response:** User created with role "user" by default

### Login
**POST** `/auth/login`
- **Access:** Public
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response:** JWT token + user details

### Get Profile
**GET** `/auth/profile`
- **Access:** Protected (requires token)
- **Headers:** `Authorization: Bearer <token>`

### Logout
**POST** `/auth/logout`
- **Access:** Protected

---

## User Flow

### Browse Products (No Login Required)
**GET** `/products`
- **Access:** Public
- **Query params:** `?category=<category>&brand=<brand>`

**GET** `/products/:id`
- **Access:** Public

**POST** `/products/calculate-price`
- **Access:** Public
- **Body:**
```json
{
  "productId": "product-id",
  "packSizeId": "pack-size-id",
  "quantity": 10
}
```

### Browse Brands & Categories (No Login Required)
**GET** `/brands`
- **Access:** Public

**GET** `/categories`
- **Access:** Public

### User Profile Management (Login Required)
**GET** `/users/profile`
- **Access:** Protected (User)

**PUT** `/users/profile`
- **Access:** Protected (User)
- **Body:**
```json
{
  "name": "Updated Name",
  "phone": "+919876543210",
  "avatar": "https://avatar-url.com"
}
```

### Address Management (Login Required)
**GET** `/users/addresses`
- **Access:** Protected (User)

**POST** `/users/addresses`
- **Access:** Protected (User)
- **Body:**
```json
{
  "name": "Home",
  "address": "123 Main St",
  "city": "Mumbai",
  "pincode": "400001",
  "phone": "+919876543210",
  "isDefault": true
}
```

**PUT** `/users/addresses/:addressId`
- **Access:** Protected (User)

**DELETE** `/users/addresses/:addressId`
- **Access:** Protected (User)

### Order Management (Login Required for Checkout)
**POST** `/orders`
- **Access:** Protected (User) - Required for checkout
- **Body:**
```json
{
  "items": [
    {
      "product": "product-object-id",
      "quantity": 5,
      "packSize": {
        "id": "pack-1",
        "name": "Box of 10",
        "multiplier": 10
      },
      "pricePerUnit": 100,
      "tierRange": "1-20",
      "subtotal": 5000
    }
  ],
  "deliveryType": "delivery", // or "pickup"
  "shippingAddress": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "Mumbai",
    "pincode": "400001",
    "phone": "+919876543210"
  },
  "paymentMethod": "cod", // or "online", "upi"
  "notes": "Call before delivery"
}
```

**GET** `/orders/my-orders`
- **Access:** Protected (User)

**GET** `/orders/:id`
- **Access:** Protected (User - own orders only)

**PUT** `/orders/:id/cancel`
- **Access:** Protected (User - can cancel own pending orders)

---

## Admin Flow

### Admin Authentication
Admins must login first to access admin dashboard and APIs.

**POST** `/auth/login`
```json
{
  "email": "admin@market.com",
  "password": "admin123456"
}
```

All admin routes require:
- **Headers:** `Authorization: Bearer <admin-token>`
- **Role:** admin

---

### Admin Dashboard Analytics
**GET** `/admin/analytics`
- **Access:** Admin only
- **Returns:** Comprehensive dashboard statistics
  - User stats (total users, new users)
  - Product stats (total products, brands, categories, low stock)
  - Order stats (total, pending, delivered, cancelled)
  - Revenue stats (total, monthly)
  - Top categories and brands
  - Recent orders

---

### Brand Management (Admin Only)
**GET** `/admin/brands`
**POST** `/admin/brands`
```json
{
  "name": "Brand Name",
  "description": "Brand description",
  "logo": "https://logo-url.com",
  "isActive": true
}
```
**PUT** `/admin/brands/:id`
**DELETE** `/admin/brands/:id`

---

### Category Management (Admin Only)
**GET** `/admin/categories`
**POST** `/admin/categories`
```json
{
  "name": "Category Name",
  "description": "Category description",
  "image": "https://image-url.com",
  "isActive": true
}
```
**PUT** `/admin/categories/:id`
**DELETE** `/admin/categories/:id`

---

### Product Management (Admin Only)
**GET** `/admin/products`
**POST** `/admin/products`
```json
{
  "id": "unique-product-id",
  "type": "high-margin",
  "name": "Product Name",
  "image": "https://image-url.com",
  "mrp": 1000,
  "pricingTiers": [
    {
      "range": "1-20",
      "minQuantity": 1,
      "maxQuantity": 20,
      "price": 950,
      "margin": 5
    }
  ],
  "packSizes": [
    {
      "id": "pack-1",
      "name": "Box of 10",
      "multiplier": 10
    }
  ],
  "description": "Product description",
  "category": "Electronics",
  "brand": "Samsung",
  "stock": 1000
}
```
**PUT** `/admin/products/:id`
**DELETE** `/admin/products/:id`

---

### Order Management (Admin Only)
**GET** `/admin/orders`
- **Query params:** `?status=pending&limit=50&page=1`

**GET** `/admin/orders/stats`
- **Returns:** Order statistics

**PUT** `/admin/orders/:id/status`
```json
{
  "status": "processing", // pending|confirmed|processing|shipped|delivered|cancelled
  "trackingNumber": "TRACK123",
  "estimatedDelivery": "2025-11-10"
}
```

---

### User Management (Admin Only)
**GET** `/admin/users`
- **Query params:** `?role=user&limit=50&page=1`

**GET** `/admin/users/:id`
**PUT** `/admin/users/:id`
```json
{
  "name": "Updated Name",
  "role": "admin", // or "user"
  "phone": "+919876543210"
}
```
**DELETE** `/admin/users/:id`

---

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Create `.env` file:
```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174
```

### 3. Create Admin User
```bash
node setup-admin.js
```
Default admin credentials:
- Email: `admin@market.com`
- Password: `admin123456`

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

---

## Key Features

✅ **Role-Based Access Control**
- User role (default on registration)
- Admin role (for management)

✅ **Public Browsing**
- Browse products, brands, categories without login
- Calculate dynamic pricing

✅ **Protected Checkout**
- Login required only when proceeding to checkout
- Users must authenticate to place orders

✅ **Admin Dashboard**
- Complete analytics and statistics
- Manage all entities (products, orders, users)
- View real-time insights

✅ **Order Management**
- Support for delivery and pickup options
- Order status tracking
- Cancel functionality for users

✅ **Address Management**
- Multiple addresses per user
- Default address selection
- Used during checkout

---

## Error Handling
All errors follow this format:
```json
{
  "status": 400,
  "message": "Error message description"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Security Features
- JWT token-based authentication
- bcrypt password hashing
- CORS protection
- Helmet.js security headers
- HPP (HTTP Parameter Pollution) protection
- Request validation using express-validator
- Role-based route protection

---

## Next Steps
1. Implement refresh token rotation
2. Add email verification
3. Add password reset functionality
4. Implement file upload for product images
5. Add pagination for all list endpoints
6. Implement search and filtering
7. Add rate limiting
8. Set up payment gateway integration
