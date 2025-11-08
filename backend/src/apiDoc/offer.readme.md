# Offer Management API Documentation

## Overview
Complete admin-controlled offer management system for handling promotional discounts based on purchase amounts and products.

---

## Authentication
- **Admin Routes**: Require `authenticate` middleware + `checkAdminRole`
- **Public Routes**: No authentication required
- **Protected Routes**: Require `authenticate` middleware

---

## API Endpoints

### 1. Get All Offers (Admin Only)
**GET** `/api/offers/all`

**Query Parameters:**
- `status` (optional): Filter by status (active, inactive, expired)
- `limit` (optional): Results per page (default: 50)
- `page` (optional): Page number (default: 1)
- `sortBy` (optional): Sort field (default: createdAt)
- `order` (optional): Sort order (asc/desc, default: desc)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "totalOffers": 45,
  "page": 1,
  "totalPages": 5,
  "offers": [
    {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
      "code": "SAVE10",
      "description": "10% off on all products",
      "discount": 10,
      "discountType": "percentage",
      "minPurchaseAmount": 1000,
      "maxDiscountAmount": 500,
      "products": [],
      "status": "active",
      "expiry": "2025-12-31T23:59:59.999Z",
      "usageLimit": 100,
      "usageCount": 25,
      "createdBy": {
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Active Offers (Public)
**GET** `/api/offers/active`

Returns all currently active and valid offers.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "offers": [...]
}
```

---

### 3. Get Single Offer (Admin Only)
**GET** `/api/offers/:id`

**Response:**
```json
{
  "success": true,
  "offer": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "code": "SAVE10",
    "description": "10% off on all products",
    "discount": 10,
    "discountType": "percentage",
    "products": [],
    "status": "active",
    "expiry": "2025-12-31T23:59:59.999Z",
    "usageLimit": 100,
    "usageCount": 25
  }
}
```

---

### 4. Get Offer by Code (Public)
**GET** `/api/offers/code/:code`

Check if an offer code is valid.

**Example:** `/api/offers/code/SAVE10`

**Response:**
```json
{
  "success": true,
  "offer": {
    "code": "SAVE10",
    "description": "10% off on all products",
    "discount": 10,
    "discountType": "percentage",
    "products": []
  }
}
```

---

### 5. Create Offer (Admin Only)
**POST** `/api/offers/create`

**Request Body:**
```json
{
  "code": "WELCOME500",
  "description": "₹500 off on first purchase above ₹5000",
  "discount": 500,
  "discountType": "fixed",
  "minPurchaseAmount": 5000,
  "maxDiscountAmount": null,
  "products": [],
  "expiry": "2025-12-31T23:59:59.999Z",
  "usageLimit": 1000
}
```

**Example - Percentage Discount:**
```json
{
  "code": "SAVE5",
  "description": "5% discount on purchases above ₹10,000",
  "discount": 5,
  "discountType": "percentage",
  "minPurchaseAmount": 10000,
  "maxDiscountAmount": 2000,
  "products": [],
  "expiry": "2025-12-31T23:59:59.999Z",
  "usageLimit": null
}
```

**Example - Product-Specific:**
```json
{
  "code": "ELECTRONICS20",
  "description": "20% off on selected electronics",
  "discount": 20,
  "discountType": "percentage",
  "minPurchaseAmount": 0,
  "products": ["64f5a1b2c3d4e5f6g7h8i9j0", "64f5a1b2c3d4e5f6g7h8i9j1"],
  "expiry": "2025-06-30T23:59:59.999Z",
  "usageLimit": 500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Offer created successfully",
  "offer": {...}
}
```

---

### 6. Update Offer (Admin Only)
**PUT** `/api/offers/:id`

**Request Body:** (All fields optional)
```json
{
  "description": "Updated description",
  "discount": 15,
  "status": "active",
  "usageLimit": 200,
  "expiry": "2026-01-31T23:59:59.999Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Offer updated successfully",
  "offer": {...}
}
```

---

### 7. Delete Offer (Admin Only)
**DELETE** `/api/offers/:id`

**Response:**
```json
{
  "success": true,
  "message": "Offer deleted successfully"
}
```

---

### 8. Get Offer Statistics (Admin Only)
**GET** `/api/offers/stats`

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalOffers": 50,
    "activeOffers": 30,
    "expiredOffers": 15,
    "inactiveOffers": 5,
    "mostUsedOffers": [
      {
        "code": "SAVE10",
        "description": "10% off",
        "discount": 10,
        "discountType": "percentage",
        "usageCount": 250,
        "usageLimit": 1000
      }
    ],
    "totalDiscountGiven": 125000
  }
}
```

---

### 9. Get Offer Usage Details (Admin Only)
**GET** `/api/offers/:id/usage`

Get detailed usage statistics for a specific offer including which users used it.

**Response:**
```json
{
  "success": true,
  "offer": {
    "code": "SAVE10",
    "description": "10% off on all products",
    "discount": 10,
    "discountType": "percentage",
    "totalUsageCount": 45,
    "usageLimit": 100,
    "status": "active",
    "expiry": "2025-12-31T23:59:59.999Z"
  },
  "usageDetails": [
    {
      "userId": "64f5a1b2c3d4e5f6g7h8i9j0",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "usageCount": 3,
      "totalDiscount": 450,
      "totalOrderValue": 15000
    }
  ],
  "totalUsers": 42
}
```

---

### 10. Validate Offer (Public/Protected)
**POST** `/api/offers/validate`

Validate an offer code and calculate discount for a cart.

**Request Body:**
```json
{
  "code": "SAVE10",
  "cartItems": [
    {
      "productId": "64f5a1b2c3d4e5f6g7h8i9j0",
      "price": 5000,
      "quantity": 2
    },
    {
      "productId": "64f5a1b2c3d4e5f6g7h8i9j1",
      "price": 3000,
      "quantity": 1
    }
  ],
  "totalAmount": 13000
}
```

**Response - Success:**
```json
{
  "success": true,
  "valid": true,
  "offer": {
    "code": "SAVE10",
    "description": "10% off on all products",
    "discount": 10,
    "discountType": "percentage"
  },
  "discountAmount": 1300,
  "finalAmount": 11700
}
```

**Response - Product Specific:**
```json
{
  "success": true,
  "valid": true,
  "offer": {
    "code": "ELECTRONICS20",
    "description": "20% off on selected electronics",
    "discount": 20,
    "discountType": "percentage"
  },
  "discountAmount": 2000,
  "finalAmount": 11000
}
```

---

### 11. Bulk Update Status (Admin Only)
**PATCH** `/api/offers/bulk-status`

Update status for multiple offers at once.

**Request Body:**
```json
{
  "offerIds": [
    "64f5a1b2c3d4e5f6g7h8i9j0",
    "64f5a1b2c3d4e5f6g7h8i9j1",
    "64f5a1b2c3d4e5f6g7h8i9j2"
  ],
  "status": "inactive"
}
```

**Response:**
```json
{
  "success": true,
  "message": "3 offers updated successfully",
  "modifiedCount": 3
}
```

---

## Usage Examples

### Setting Up Tiered Discounts

**Example 1: 5% off on ₹10,000+**
```json
POST /api/offers/create
{
  "code": "BIG5",
  "description": "5% discount on purchases above ₹10,000",
  "discount": 5,
  "discountType": "percentage",
  "minPurchaseAmount": 10000,
  "maxDiscountAmount": 5000,
  "products": [],
  "expiry": "2025-12-31T23:59:59.999Z",
  "usageLimit": null
}
```

**Example 2: 2.5% off on ₹5,000+**
```json
POST /api/offers/create
{
  "code": "MID25",
  "description": "2.5% discount on purchases above ₹5,000",
  "discount": 2.5,
  "discountType": "percentage",
  "minPurchaseAmount": 5000,
  "maxDiscountAmount": 2000,
  "products": [],
  "expiry": "2025-12-31T23:59:59.999Z",
  "usageLimit": null
}
```

**Example 3: 0.5% off on ₹1,000+**
```json
POST /api/offers/create
{
  "code": "SMALL05",
  "description": "0.5% discount on purchases above ₹1,000",
  "discount": 0.5,
  "discountType": "percentage",
  "minPurchaseAmount": 1000,
  "maxDiscountAmount": 500,
  "products": [],
  "expiry": "2025-12-31T23:59:59.999Z",
  "usageLimit": null
}
```

---

## Integration with Order System

When a user places an order with an offer code, you should:

1. **Validate the offer** using the `/validate` endpoint
2. **Apply the discount** to the order
3. **Increment usage count** in your order creation logic:

```javascript
// In your order controller
const offer = await Offer.findOne({ code: offerCode.toUpperCase() });
if (offer && offer.isValid()) {
  // Apply discount
  const discountAmount = offer.calculateDiscount(totalAmount);
  
  // Increment usage count
  offer.usageCount += 1;
  await offer.save();
  
  // Create order with discount
  const order = new Order({
    // ... order details
    offerCode: offer.code,
    discountAmount,
    finalAmount: totalAmount - discountAmount
  });
  await order.save();
}
```

---

## Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Offer code already exists"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Offer not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Error message details"
}
```

---

## Setup Instructions

### 1. Install in your main app file (app.js or server.js):

```javascript
import offerRoutes from './routes/offer.routes.js';

// Register routes
app.use('/api/v1/offers', offerRoutes);
```

### 2. Ensure you have authentication middleware:

```javascript
// middleware/auth.middleware.js
export const authenticate = async (req, res, next) => {
  try {
    // Your JWT verification logic
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Should contain { id, role, ... }
    next();
  } catch (error) {
    next(createHttpError(401, 'Unauthorized'));
  }
};
```

### 3. User model should have a `role` field:

```javascript
role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
}
```

---

## Notes

- All admin routes require the user to have `role: 'admin'`
- Offer codes are automatically converted to uppercase
- Expired offers are automatically marked as 'expired' during save
- Usage count is tracked but must be incremented manually when orders are placed
- Product-specific offers only apply to cart items containing those products
- General offers (empty products array) apply to all items in cart


I'll help you create a comprehensive offer controller and routes file for your Node.js Express project with admin-only access and all the features you mentioned.Now let me create the routes file:Now let me update the Offer model to include the additional fields needed:Now let me create a comprehensive documentation file with usage examples:Perfect! I've created a comprehensive offer management system for you. Here's what I've provided:

## 📦 Files Created:

1. **offer.controller.js** - Complete controller with all features including:
   - Admin-only access control
   - CRUD operations for offers
   - Tiered discount system (configurable by admin)
   - Offer validation and application
   - Detailed usage statistics
   - Bulk operations

2. **offer.routes.js** - Routes file with:
   - Public routes (active offers, validation)
   - Admin-protected routes (create, update, delete, stats)
   - Proper authentication and authorization middleware

3. **offer.model.js (Updated)** - Enhanced model with:
   - Minimum purchase amount field
   - Maximum discount cap
   - Usage tracking
   - Helper methods for validation and discount calculation
   - Automatic expiry status updates

4. **API Documentation** - Complete guide with:
   - All endpoint details
   - Request/response examples
   - Setup instructions
   - Usage examples for tiered discounts

## 🎯 Key Features Implemented:

✅ **Admin-only access** for all management operations  
✅ **Tiered discount system** (₹10k→5%, ₹5k→2.5%, ₹1k→0.5%)  
✅ **Offer validation** with cart calculation  
✅ **Usage tracking** (which users, how many times)  
✅ **Product-specific** or general offers  
✅ **Expiry management** with automatic status updates  
✅ **Bulk operations** for efficiency  
✅ **Comprehensive statistics** dashboard  

## 🚀 Quick Setup:

1. Replace your existing files with the new ones
2. Install the offer routes in your main app:
```javascript
import offerRoutes from './routes/offer.routes.js';
app.use('/api/offers', offerRoutes);
```
3. Ensure your auth middleware sets `req.user` with `id` and `role` fields

The system is production-ready and follows best practices for security, validation, and error handling!