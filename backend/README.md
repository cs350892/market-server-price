# Market Server Price - Complete Backend Setup

## 🎯 Overview
Complete role-based authentication system supporting **Admin** and **User** flows on the same server, running on the same port.

### Tech Stack
- **Node.js** + **Express.js** (ES Modules)
- **MongoDB** + **Mongoose**
- **JWT** + **bcrypt** for authentication
- **MVC Architecture**

---

## 🚀 Quick Start

### 1. Installation
```powershell
cd backend
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend directory:
```env
PORT=5001
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174
```

### 3. Create Admin User
```powershell
node setup-admin.js
```
**Default Admin Credentials:**
- 📧 Email: `admin@market.com`
- 🔑 Password: `admin123456`

### 4. Start Server
```powershell
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on: **http://localhost:5001**

---

## 📋 Features

### 🧑‍💼 Admin Flow
✅ Admin logs in with email/password  
✅ Access admin dashboard only after login  
✅ Manage:
  - **Brands** (Create, Read, Update, Delete)
  - **Categories** (Create, Read, Update, Delete)
  - **Products** (Create, Read, Update, Delete)
  - **Orders** (View all, Update status, Track)
  - **Users** (View all, Update role, Delete)
  - **Inventory** (Stock management)
  - **Analytics** (Sales, Users, Products, Revenue)

### 👤 User Flow
✅ Browse products **WITHOUT login** (brand-wise, category-wise)  
✅ Calculate dynamic pricing **WITHOUT login**  
✅ **Login required** when proceeding to checkout/payment  
✅ After login:
  - Place orders (delivery or warehouse pickup)
  - Manage delivery addresses
  - View order history
  - Manage profile
  - Cancel pending orders
✅ Role = **"user"** by default on registration

---

## 🔐 Authentication System

### User Registration
- Default role: **"user"**
- Password automatically hashed with bcrypt
- JWT token issued on login

### Admin Access
- Role: **"admin"**
- Created via setup script
- Full access to admin routes

### JWT Token
- Sent in header: `Authorization: Bearer <token>`
- Contains: user ID, email, role
- Expires in 24 hours (configurable)

---

## 🛣️ API Routes

### Public Routes (No Authentication)
```
GET    /api/v1/products              - Browse all products
GET    /api/v1/products/:id          - Get product details
GET    /api/v1/brands                - Browse brands
GET    /api/v1/categories            - Browse categories
POST   /api/v1/auth/register         - User registration
POST   /api/v1/auth/login            - User/Admin login
```

### Protected Routes (Login Required)
```
GET    /api/v1/auth/profile          - Get user profile
GET    /api/v1/users/profile         - Get detailed profile
PUT    /api/v1/users/profile         - Update profile
GET    /api/v1/users/addresses       - Get addresses
POST   /api/v1/users/addresses       - Add address
POST   /api/v1/orders                - Create order (checkout)
GET    /api/v1/orders/my-orders      - View order history
PUT    /api/v1/orders/:id/cancel     - Cancel order
```

### Admin Routes (Admin Only)
```
GET    /api/v1/admin/analytics       - Dashboard analytics
GET    /api/v1/admin/brands          - Manage brands
POST   /api/v1/admin/brands          - Create brand
GET    /api/v1/admin/categories      - Manage categories
POST   /api/v1/admin/categories      - Create category
GET    /api/v1/admin/products        - All products
POST   /api/v1/admin/products        - Create product
GET    /api/v1/admin/orders          - All orders
PUT    /api/v1/admin/orders/:id      - Update order status
GET    /api/v1/admin/users           - All users
PUT    /api/v1/admin/users/:id       - Update user role
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/              # Mongoose schemas
│   │   ├── user.model.js      - User with roles & addresses
│   │   ├── product.model.js   - Product with dynamic pricing
│   │   ├── order.model.js     - Order with delivery options
│   │   ├── brand.model.js     - Brand management
│   │   └── category.model.js  - Category management
│   │
│   ├── controllers/         # Business logic
│   │   ├── authController.js      - Login/Register
│   │   ├── user.controller.js     - User profile & addresses
│   │   ├── product.controller.js  - Product CRUD
│   │   ├── order.controller.js    - Order management
│   │   ├── brand.controller.js    - Brand CRUD
│   │   ├── category.controller.js - Category CRUD
│   │   └── analytics.controller.js- Dashboard stats
│   │
│   ├── routes/              # API endpoints
│   │   ├── authRoutes.js          - Auth routes
│   │   ├── users.routes.js        - User routes
│   │   ├── products.routes.js     - Product routes
│   │   ├── orders.routes.js       - Order routes
│   │   ├── brands.routes.js       - Brand routes
│   │   ├── categories.routes.js   - Category routes
│   │   └── admin.routes.js        - Admin dashboard routes
│   │
│   ├── middleware/          # Express middleware
│   │   ├── authMiddleware.js      - JWT verify & role check
│   │   ├── validateRequest.js     - Input validation
│   │   └── globalErrorHandler.js  - Error handling
│   │
│   ├── config/              # Configuration
│   │   ├── db.js                  - MongoDB connection
│   │   └── index.js               - Environment variables
│   │
│   ├── utils/               # Helper functions
│   │   └── genrateToken.js        - JWT token generation
│   │
│   ├── app.js               # Express app setup
│   └── index.js             # Server entry point
│
├── setup-admin.js           # Admin user creation script
├── API_DOCUMENTATION.md     # Complete API docs
├── package.json
└── .env                     # Environment variables
```

---

## 🧪 Testing the System

### 1. Test User Registration
```powershell
curl -X POST http://localhost:5001/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Test User","email":"user@test.com","password":"password123"}'
```

### 2. Test User Login
```powershell
curl -X POST http://localhost:5001/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"user@test.com","password":"password123"}'
```

### 3. Test Admin Login
```powershell
curl -X POST http://localhost:5001/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@market.com","password":"admin123456"}'
```

### 4. Test Public Product Browsing (No Auth)
```powershell
curl http://localhost:5001/api/v1/products
```

### 5. Test Admin Dashboard (Requires Admin Token)
```powershell
curl http://localhost:5001/api/v1/admin/analytics `
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 🔒 Security Features

✅ **JWT Authentication** - Stateless token-based auth  
✅ **bcrypt Password Hashing** - Secure password storage  
✅ **CORS Protection** - Controlled cross-origin requests  
✅ **Helmet.js** - Security headers  
✅ **HPP** - HTTP Parameter Pollution protection  
✅ **Role-Based Access Control** - Admin vs User permissions  
✅ **Input Validation** - express-validator  
✅ **Error Handling** - Global error middleware  

---

## 📊 Database Models

### User Model
- name, email, password (hashed)
- **role**: "user" | "admin"
- phone, avatar
- **addresses**: array of delivery addresses
- timestamps, lastActive

### Product Model
- id (custom), name, image, MRP
- **pricingTiers**: dynamic pricing based on quantity
- **packSizes**: different pack options
- category, brand, stock
- type: "high-margin" | "regional-brands"

### Order Model
- user (ref), items array
- totalAmount, status
- **deliveryType**: "delivery" | "pickup"
- shippingAddress / pickupLocation
- paymentMethod, paymentStatus
- trackingNumber, estimatedDelivery

### Brand & Category Models
- name, description, image/logo
- isActive flag

---

## 🎨 Frontend Integration

The backend is ready to integrate with your React frontend:

### User Flow Example
```javascript
// 1. Browse products (no auth needed)
const products = await fetch('http://localhost:5001/api/v1/products');

// 2. When user clicks checkout, show login
const loginResponse = await fetch('http://localhost:5001/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token } = await loginResponse.json();

// 3. Place order with token
await fetch('http://localhost:5001/api/v1/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(orderData)
});
```

### Admin Flow Example
```javascript
// 1. Admin logs in
const { token, user } = await login('admin@market.com', 'admin123456');

// 2. Check if role is admin
if (user.role === 'admin') {
  // 3. Access admin dashboard
  const analytics = await fetch('http://localhost:5001/api/v1/admin/analytics', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check `MONGODB_URI` in `.env`
- Ensure MongoDB is running
- Check network access in MongoDB Atlas

### CORS Error
- Verify `CLIENT_URL` matches your frontend URL exactly
- Remove trailing slashes

### JWT Token Error
- Check `JWT_SECRET` is set
- Verify token is sent in header: `Authorization: Bearer <token>`

### Admin Can't Access Routes
- Verify role is exactly "admin" (lowercase)
- Check token contains correct role

---

## 📚 Additional Resources

- **API Documentation**: See `API_DOCUMENTATION.md`
- **Postman Collection**: Import `postman_collection_msp.json`
- **Database Schema**: See model files in `src/models/`

---

## 🔄 Next Steps

1. ✅ Backend is complete and ready
2. 🔄 Integrate with frontend
3. 🔄 Add payment gateway (Razorpay/Stripe)
4. 🔄 Implement email notifications
5. 🔄 Add image upload (AWS S3/Cloudinary)
6. 🔄 Add refresh token rotation
7. 🔄 Implement rate limiting
8. 🔄 Add API documentation UI (Swagger)

---

## 📞 Support

For issues or questions:
1. Check `API_DOCUMENTATION.md`
2. Review error logs in console
3. Verify environment variables
4. Test with Postman collection

---

**🎉 Your backend is ready! Start the server and begin integrating with your frontend.**
