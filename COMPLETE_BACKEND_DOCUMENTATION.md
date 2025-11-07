# 📚 Complete Admin Panel Backend - Detailed Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Database Models](#database-models)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Frontend Integration Guide](#frontend-integration-guide)
7. [Error Handling](#error-handling)
8. [Testing Guide](#testing-guide)
9. [Deployment](#deployment)

---

## 🎯 Project Overview

Ye ek complete **Market Server Price** application ka backend hai jo admin panel ko support karta hai. Is system me 4 major components hain:

1. **Dashboard** - Real-time analytics aur sales data
2. **Order Management** - Orders ko track aur manage karna
3. **Payment & Reports** - Payout tracking aur sales reports
4. **Messages & Support** - Customer support system

### Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator

---

## 🏗️ Architecture

```
backend/
├── src/
│   ├── models/           # Database schemas
│   │   ├── order.model.js
│   │   ├── payout.model.js
│   │   ├── offer.model.js
│   │   ├── message.model.js
│   │   ├── product.model.js
│   │   ├── user.model.js
│   │   ├── brand.model.js
│   │   └── category.model.js
│   │
│   ├── controllers/      # Business logic
│   │   ├── analytics.controller.js
│   │   ├── order.controller.js
│   │   ├── payout.controller.js
│   │   ├── offer.controller.js
│   │   ├── message.controller.js
│   │   ├── product.controller.js
│   │   └── user.controller.js
│   │
│   ├── routes/          # API routes
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── orders.routes.js
│   │   └── products.routes.js
│   │
│   ├── middleware/      # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── validateRequest.js
│   │   └── globalErrorHandler.js
│   │
│   ├── config/          # Configuration
│   │   ├── db.js
│   │   └── index.js
│   │
│   ├── utils/           # Helper functions
│   │   └── generateToken.js
│   │
│   ├── app.js           # Express app setup
│   └── index.js         # Entry point
│
├── package.json
└── README.md
```

---

## 💾 Database Models

### 1. Order Model (`order.model.js`)

**Purpose:** Orders ko store aur manage karna with automatic invoice generation.

```javascript
{
  invoiceId: "INV000001",              // Auto-generated unique invoice
  user: ObjectId,                       // Reference to User
  items: [{
    product: ObjectId,                  // Reference to Product
    productId: String,                  // Custom product ID
    name: String,
    image: String,
    quantity: Number,
    packSize: {
      id: String,
      name: String,
      multiplier: Number
    },
    pricePerUnit: Number,
    totalUnits: Number,
    tierRange: String,
    subtotal: Number
  }],
  totalAmount: Number,
  status: String,                       // pending, confirmed, processing, shipped, delivered, cancelled
  deliveryType: String,                 // delivery, pickup
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    pincode: String,
    phone: String
  },
  pickupLocation: {
    name: String,
    address: String
  },
  paymentStatus: String,                // pending, paid, failed
  paymentMethod: String,                // cod, online, upi
  notes: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Key Features:**
- ✅ Automatic invoice ID generation (INV000001, INV000002, etc.)
- ✅ Multiple items per order support
- ✅ Flexible pricing tiers
- ✅ Delivery and pickup options
- ✅ Order status tracking
- ✅ Indexed for fast queries

**Invoice Generation Logic:**
```javascript
orderSchema.pre('save', async function(next) {
  if (!this.invoiceId && this.isNew) {
    const count = await this.constructor.countDocuments();
    const invoiceNumber = String(count + 1).padStart(6, '0');
    this.invoiceId = `INV${invoiceNumber}`;
  }
  next();
});
```

---

### 2. Payout Model (`payout.model.js`)

**Purpose:** Admin payments aur payouts ko track karna.

```javascript
{
  date: Date,                           // Payout date
  amount: Number,                       // Total amount
  status: String,                       // pending, processing, completed, failed
  orders: [ObjectId],                   // References to Orders
  invoiceIds: [String],                 // Invoice IDs for reference
  paymentMethod: String,                // bank_transfer, upi, cheque, cash
  transactionId: String,                // Payment gateway transaction ID
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String
  },
  notes: String,
  processedBy: ObjectId,                // Reference to Admin User
  processedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Use Cases:**
- ✅ Weekly/Monthly payouts track karna
- ✅ Multiple orders ko group karke payout banana
- ✅ Bank details aur transaction tracking
- ✅ Payout history maintain karna

---

### 3. Offer Model (`offer.model.js`)

**Purpose:** Discount codes aur promotional offers manage karna.

```javascript
{
  code: String,                         // Unique offer code (uppercase)
  description: String,
  discount: Number,                     // Discount value (0-100 for percentage)
  discountType: String,                 // percentage, fixed
  products: [ObjectId],                 // Applicable products
  status: String,                       // active, inactive, expired
  expiry: Date,                         // Offer expiry date
  usageLimit: Number,                   // Max number of uses (null = unlimited)
  usageCount: Number,                   // Current usage count
  createdBy: ObjectId,                  // Reference to Admin User
  createdAt: Date,
  updatedAt: Date
}
```

**Features:**
- ✅ Percentage ya fixed discount support
- ✅ Specific products par apply
- ✅ Usage limit set kar sakte ho
- ✅ Auto-expire on expiry date
- ✅ Usage tracking

**Auto-Expiry Logic:**
```javascript
offerSchema.pre('save', function(next) {
  if (this.expiry < Date.now() && this.status !== 'expired') {
    this.status = 'expired';
  }
  next();
});
```

---

### 4. Message Model (`message.model.js`)

**Purpose:** Customer support messages aur tickets manage karna.

```javascript
{
  from: String,                         // Sender email/name
  fromUser: ObjectId,                   // Reference to User (optional)
  subject: String,
  message: String,
  category: String,                     // product_query, order_issue, payment_issue, delivery_issue, feedback, complaint, general
  status: String,                       // unread, read, replied, resolved, closed
  priority: String,                     // low, medium, high, urgent
  relatedOrder: ObjectId,               // Reference to Order (optional)
  relatedProduct: ObjectId,             // Reference to Product (optional)
  replies: [{
    replyBy: ObjectId,                  // Admin who replied
    replyText: String,
    repliedAt: Date
  }],
  assignedTo: ObjectId,                 // Assigned admin
  readAt: Date,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Features:**
- ✅ Multiple categories support
- ✅ Priority-based sorting
- ✅ Reply system with admin tracking
- ✅ Order/Product linking
- ✅ Assignment to specific admin
- ✅ Status workflow (unread → read → replied → resolved)

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Header
```javascript
headers: {
  'Authorization': 'Bearer <your_jwt_token>',
  'Content-Type': 'application/json'
}
```

---

## 📊 Dashboard APIs

### 1. Get Dashboard Overview
```http
GET /api/admin/analytics
```

**Description:** Complete analytics with users, products, orders, revenue stats.

**Response:**
```json
{
  "success": true,
  "users": {
    "totalUsers": 150,
    "totalAdmins": 5,
    "newUsersLast30Days": 25
  },
  "products": {
    "totalProducts": 250,
    "totalBrands": 15,
    "totalCategories": 6,
    "lowStock": [
      {
        "id": "1",
        "name": "Product Name",
        "stock": 10,
        "brand": "Brand Name",
        "category": "Category Name"
      }
    ]
  },
  "orders": {
    "totalOrders": 500,
    "pendingOrders": 45,
    "processingOrders": 30,
    "deliveredOrders": 400,
    "cancelledOrders": 25,
    "recentOrdersLast30Days": 120
  },
  "revenue": {
    "totalRevenue": 250000.50,
    "monthlyRevenue": 45000.25
  },
  "topCategories": [...],
  "topBrands": [...],
  "latestOrders": [...]
}
```

**Use Case:** Admin dashboard ka main overview page.

---

### 2. Get Dashboard Stats (For Dashboard.jsx)
```http
GET /api/admin/dashboard/stats
```

**Description:** Dashboard ke 4 cards ke liye specific stats.

**Response:**
```json
{
  "success": true,
  "todaySales": 945.50,
  "totalRevenue": 12500.75,
  "totalOrders": 120,
  "pendingOrders": 15
}
```

**Use Case:** Dashboard component ke top 4 stat cards.

**Frontend Integration:**
```javascript
useEffect(() => {
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      setTodaySales(data.todaySales);
      setTotalRevenue(data.totalRevenue);
      setTotalOrders(data.totalOrders);
      setPendingOrders(data.pendingOrders);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  
  fetchDashboardStats();
}, []);
```

---

### 3. Get Last 7 Days Sales (For Chart)
```http
GET /api/admin/dashboard/sales/last7days
```

**Description:** Last 7 days ka daily sales data for chart.

**Response:**
```json
{
  "success": true,
  "salesData": [
    { "date": "2025-10-26", "sales": 120.50 },
    { "date": "2025-10-27", "sales": 150.75 },
    { "date": "2025-10-28", "sales": 100.00 },
    { "date": "2025-10-29", "sales": 200.25 },
    { "date": "2025-10-30", "sales": 180.00 },
    { "date": "2025-10-31", "sales": 90.50 },
    { "date": "2025-11-01", "sales": 94.50 }
  ]
}
```

**Use Case:** Dashboard ka sales chart (Recharts BarChart).

**Frontend Integration:**
```javascript
useEffect(() => {
  const fetchSalesData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/sales/last7days', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSalesData(data.salesData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };
  
  fetchSalesData();
}, []);
```

---

## 📦 Order Management APIs

### 1. Get All Orders
```http
GET /api/admin/orders?status=pending&limit=50&page=1
```

**Query Parameters:**
- `status` (optional): pending, confirmed, processing, shipped, delivered, cancelled
- `limit` (optional): Number of results per page (default: 50)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "count": 50,
  "totalOrders": 500,
  "page": 1,
  "totalPages": 10,
  "orders": [
    {
      "_id": "order_id",
      "invoiceId": "INV000001",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "items": [...],
      "totalAmount": 250.50,
      "status": "pending",
      "createdAt": "2025-11-01T10:30:00.000Z"
    }
  ]
}
```

**Frontend Integration:**
```javascript
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchOrders();
}, []);
```

---

### 2. Update Order Status
```http
PUT /api/admin/orders/:id/status
```

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456",
  "estimatedDelivery": "2025-11-05"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated",
  "order": {
    "_id": "order_id",
    "invoiceId": "INV000001",
    "status": "shipped",
    "trackingNumber": "TRACK123456"
  }
}
```

**Frontend Integration:**
```javascript
const handleStatusUpdate = async (orderId, newStatus) => {
  try {
    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      alert('Order status updated successfully!');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to update order status');
  }
};
```

---

### 3. Get Order Statistics
```http
GET /api/admin/orders/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalOrders": 500,
    "pendingOrders": 45,
    "deliveredOrders": 400,
    "totalRevenue": 250000.50
  },
  "recentOrders": [...]
}
```

---

## 💰 Payout Management APIs

### 1. Get All Payouts
```http
GET /api/admin/payouts?status=pending&page=1&limit=50
```

**Query Parameters:**
- `status` (optional): pending, processing, completed, failed
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response:**
```json
{
  "success": true,
  "count": 20,
  "totalPayouts": 100,
  "page": 1,
  "totalPages": 5,
  "payouts": [
    {
      "_id": "payout_id",
      "date": "2025-11-01",
      "amount": 5000.00,
      "status": "completed",
      "orders": [...],
      "invoiceIds": ["INV000001", "INV000002"],
      "transactionId": "TXN123456",
      "processedBy": {
        "name": "Admin Name"
      },
      "createdAt": "2025-11-01T10:00:00.000Z"
    }
  ]
}
```

**Frontend Integration:**
```javascript
useEffect(() => {
  const fetchPayouts = async () => {
    try {
      const response = await fetch('/api/admin/payouts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPayouts(data.payouts);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  fetchPayouts();
}, []);
```

---

### 2. Create New Payout
```http
POST /api/admin/payouts
```

**Request Body:**
```json
{
  "date": "2025-11-01",
  "amount": 5000.00,
  "orderIds": ["order_id_1", "order_id_2", "order_id_3"],
  "paymentMethod": "bank_transfer",
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "SBIN0001234",
    "bankName": "State Bank of India",
    "accountHolderName": "Vendor Name"
  },
  "notes": "Weekly payout for delivered orders"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payout created successfully",
  "payout": {
    "_id": "payout_id",
    "date": "2025-11-01",
    "amount": 5000.00,
    "status": "pending",
    "orders": [...],
    "invoiceIds": ["INV000001", "INV000002", "INV000003"]
  }
}
```

**Frontend Integration:**
```javascript
const handleCreatePayout = async (payoutData) => {
  try {
    const response = await fetch('/api/admin/payouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payoutData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Payout created successfully!');
      // Refresh payouts list
      fetchPayouts();
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to create payout');
  }
};
```

---

### 3. Update Payout Status
```http
PUT /api/admin/payouts/:id/status
```

**Request Body:**
```json
{
  "status": "completed",
  "transactionId": "TXN123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payout status updated",
  "payout": {
    "_id": "payout_id",
    "status": "completed",
    "transactionId": "TXN123456789",
    "processedAt": "2025-11-01T15:30:00.000Z"
  }
}
```

---

### 4. Delete Payout
```http
DELETE /api/admin/payouts/:id
```

**Note:** Only pending payouts can be deleted.

**Response:**
```json
{
  "success": true,
  "message": "Payout deleted successfully"
}
```

---

### 5. Get Payout Statistics
```http
GET /api/admin/payouts/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalPayouts": 100,
    "pendingPayouts": 15,
    "completedPayouts": 80,
    "totalPaidAmount": 450000.00,
    "totalPendingAmount": 50000.00
  }
}
```

---

## 🎁 Offer/Coupon Management APIs

### 1. Get All Offers
```http
GET /api/admin/offers?status=active&page=1&limit=50
```

**Query Parameters:**
- `status` (optional): active, inactive, expired
- `page`, `limit`: Pagination

**Response:**
```json
{
  "success": true,
  "count": 15,
  "totalOffers": 50,
  "offers": [
    {
      "_id": "offer_id",
      "code": "DIWALI10",
      "description": "Diwali Special Offer",
      "discount": 10,
      "discountType": "percentage",
      "products": [...],
      "status": "active",
      "expiry": "2025-11-05",
      "usageLimit": 100,
      "usageCount": 45,
      "createdAt": "2025-10-25T10:00:00.000Z"
    }
  ]
}
```

**Frontend Integration:**
```javascript
useEffect(() => {
  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/admin/offers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setOffers(data.offers);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  fetchOffers();
}, []);
```

---

### 2. Get Active Offers
```http
GET /api/admin/offers/active
```

**Description:** Sirf active aur non-expired offers.

**Response:**
```json
{
  "success": true,
  "count": 10,
  "offers": [...]
}
```

---

### 3. Create New Offer
```http
POST /api/admin/offers
```

**Request Body:**
```json
{
  "code": "DIWALI10",
  "description": "Diwali Special - 10% off",
  "discount": 10,
  "discountType": "percentage",
  "products": ["product_id_1", "product_id_2"],
  "expiry": "2025-11-05T23:59:59.000Z",
  "usageLimit": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Offer created successfully",
  "offer": {
    "_id": "offer_id",
    "code": "DIWALI10",
    "discount": 10,
    "status": "active",
    "usageCount": 0
  }
}
```

**Frontend Integration:**
```javascript
const handleCreateOffer = async (offerData) => {
  try {
    const response = await fetch('/api/admin/offers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(offerData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Offer created successfully!');
      fetchOffers(); // Refresh list
    } else {
      alert(data.message || 'Failed to create offer');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to create offer');
  }
};
```

---

### 4. Update Offer
```http
PUT /api/admin/offers/:id
```

**Request Body:**
```json
{
  "status": "inactive",
  "usageLimit": 200
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

### 5. Delete Offer
```http
DELETE /api/admin/offers/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Offer deleted successfully"
}
```

---

### 6. Get Offer Statistics
```http
GET /api/admin/offers/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalOffers": 50,
    "activeOffers": 15,
    "expiredOffers": 30,
    "mostUsedOffers": [
      {
        "code": "DIWALI10",
        "discount": 10,
        "usageCount": 250
      }
    ]
  }
}
```

---

## 💬 Message/Support Management APIs

### 1. Get All Messages
```http
GET /api/admin/messages?status=unread&category=order_issue&priority=high
```

**Query Parameters:**
- `status` (optional): unread, read, replied, resolved, closed
- `category` (optional): product_query, order_issue, payment_issue, delivery_issue, feedback, complaint, general
- `priority` (optional): low, medium, high, urgent
- `page`, `limit`: Pagination

**Response:**
```json
{
  "success": true,
  "count": 25,
  "totalMessages": 150,
  "messages": [
    {
      "_id": "message_id",
      "from": "customer@example.com",
      "fromUser": {
        "name": "Customer Name",
        "email": "customer@example.com"
      },
      "subject": "Order Delivery Issue",
      "message": "My order has not been delivered yet",
      "category": "order_issue",
      "status": "unread",
      "priority": "high",
      "relatedOrder": {
        "invoiceId": "INV000123",
        "totalAmount": 500.00
      },
      "replies": [],
      "createdAt": "2025-11-01T10:30:00.000Z"
    }
  ]
}
```

**Frontend Integration:**
```javascript
const [messages, setMessages] = useState([]);
const [filters, setFilters] = useState({
  status: '',
  category: '',
  priority: ''
});

useEffect(() => {
  const fetchMessages = async () => {
    const params = new URLSearchParams(filters);
    
    try {
      const response = await fetch(`/api/admin/messages?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  fetchMessages();
}, [filters]);
```

---

### 2. Get Single Message
```http
GET /api/admin/messages/:id
```

**Note:** Automatically marks as "read" if status is "unread".

**Response:**
```json
{
  "success": true,
  "message": {
    "_id": "message_id",
    "from": "customer@example.com",
    "subject": "Order Issue",
    "message": "Full message text...",
    "status": "read",
    "readAt": "2025-11-01T11:00:00.000Z",
    "replies": [...]
  }
}
```

---

### 3. Create New Message
```http
POST /api/admin/messages
```

**Request Body:**
```json
{
  "from": "customer@example.com",
  "subject": "Product Query",
  "message": "Is this product available in blue color?",
  "category": "product_query",
  "priority": "medium",
  "relatedProduct": "product_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "_id": "message_id",
    "from": "customer@example.com",
    "subject": "Product Query",
    "status": "unread"
  }
}
```

---

### 4. Reply to Message
```http
POST /api/admin/messages/:id/reply
```

**Request Body:**
```json
{
  "replyText": "Yes, this product is available in blue color. We have 50 units in stock."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reply sent successfully",
  "data": {
    "_id": "message_id",
    "status": "replied",
    "replies": [
      {
        "replyBy": {
          "name": "Admin Name"
        },
        "replyText": "Yes, this product is available...",
        "repliedAt": "2025-11-01T12:00:00.000Z"
      }
    ]
  }
}
```

**Frontend Integration:**
```javascript
const handleReply = async (messageId, replyText) => {
  try {
    const response = await fetch(`/api/admin/messages/${messageId}/reply`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ replyText })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Reply sent successfully!');
      // Update message in state
      setMessages(messages.map(msg => 
        msg._id === messageId ? data.data : msg
      ));
      setReplyText(''); // Clear input
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to send reply');
  }
};
```

---

### 5. Update Message Status
```http
PUT /api/admin/messages/:id/status
```

**Request Body:**
```json
{
  "status": "resolved"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message status updated",
  "data": {
    "_id": "message_id",
    "status": "resolved",
    "resolvedAt": "2025-11-01T15:00:00.000Z"
  }
}
```

---

### 6. Assign Message to Admin
```http
PUT /api/admin/messages/:id/assign
```

**Request Body:**
```json
{
  "assignedTo": "admin_user_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message assigned successfully",
  "data": {
    "_id": "message_id",
    "assignedTo": {
      "name": "Admin Name"
    }
  }
}
```

---

### 7. Update Message Priority
```http
PUT /api/admin/messages/:id/priority
```

**Request Body:**
```json
{
  "priority": "urgent"
}
```

---

### 8. Delete Message
```http
DELETE /api/admin/messages/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

### 9. Get Message Statistics
```http
GET /api/admin/messages/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalMessages": 500,
    "unreadMessages": 45,
    "readMessages": 150,
    "repliedMessages": 200,
    "resolvedMessages": 100,
    "highPriorityMessages": 15,
    "messagesByCategory": [
      { "_id": "order_issue", "count": 150 },
      { "_id": "product_query", "count": 120 },
      { "_id": "payment_issue", "count": 80 }
    ]
  }
}
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure
```javascript
{
  id: "user_id",
  email: "admin@example.com",
  role: "admin",
  iat: 1698765432,
  exp: 1698851832
}
```

### Protected Routes
All `/api/admin/*` routes require:
1. **Valid JWT Token** in Authorization header
2. **Admin Role** verification

### Middleware Chain
```javascript
router.use(verifyToken, isAdmin);
```

### Frontend Token Management
```javascript
// Store token after login
localStorage.setItem('token', data.token);

// Use in API calls
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}

// Clear on logout
localStorage.removeItem('token');
```

---

## ⚠️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error message here",
  "statusCode": 400
}
```

### Common Status Codes
- **200** - Success
- **201** - Created
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (no token or invalid token)
- **403** - Forbidden (not admin)
- **404** - Not Found
- **500** - Internal Server Error

### Frontend Error Handling
```javascript
try {
  const response = await fetch(url, options);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  // Success handling
  console.log(data);
} catch (error) {
  console.error('Error:', error);
  alert(error.message);
}
```

---

## 🧪 Testing Guide

### Using Postman

#### 1. Setup Environment Variables
```
baseUrl: http://localhost:5000/api
token: <your_jwt_token>
```

#### 2. Login First
```
POST {{baseUrl}}/auth/login
Body:
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Save the token from response.

#### 3. Test Dashboard Stats
```
GET {{baseUrl}}/admin/dashboard/stats
Headers:
  Authorization: Bearer {{token}}
```

#### 4. Test Order Creation
```
POST {{baseUrl}}/orders
Headers:
  Authorization: Bearer {{token}}
Body: { order data }
```

#### 5. Test Payout Creation
```
POST {{baseUrl}}/admin/payouts
Headers:
  Authorization: Bearer {{token}}
Body: { payout data }
```

---

## 🚀 Deployment

### Environment Variables
Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/market-server-price
JWT_SECRET=your_secret_key_here
NODE_ENV=production
```

### Start Server
```bash
# Development
npm run dev

# Production
npm start
```

### Database Setup
```bash
# Connect to MongoDB
mongosh

# Create admin user
use market-server-price
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "$2a$10$hashed_password", // Use bcrypt
  role: "admin",
  createdAt: new Date()
})
```

---

## 📱 Frontend Integration Examples

### Complete Dashboard Component
```javascript
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    todaySales: 0,
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    
    try {
      // Fetch stats
      const statsRes = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch sales data
      const salesRes = await fetch('http://localhost:5000/api/admin/dashboard/sales/last7days', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const salesJson = await salesRes.json();
      setSalesData(salesJson.salesData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Today's Sales</h3>
          <p className="text-2xl">₹{stats.todaySales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Pending Orders</h3>
          <p className="text-2xl">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Last 7 Days Sales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
```

---

### Complete Order Management Component
```javascript
import React, { useState, useEffect } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        alert('Order status updated!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update order status');
    }
  };

  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Invoice ${order.invoiceId}</title></head>
        <body>
          <h1>Invoice ${order.invoiceId}</h1>
          <p>Customer: ${order.user.name}</p>
          <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
          <h2>Products</h2>
          <ul>
            ${order.items.map(item => 
              `<li>${item.name} - ${item.quantity} x ₹${item.pricePerUnit} = ₹${item.subtotal}</li>`
            ).join('')}
          </ul>
          <p><strong>Total: ₹${order.totalAmount.toFixed(2)}</strong></p>
          <p>Status: ${order.status}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Order Management</h2>
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Invoice ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Date</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-b">
                <td className="p-2">{order.invoiceId}</td>
                <td className="p-2">{order.user.name}</td>
                <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-2">₹{order.totalAmount.toFixed(2)}</td>
                <td className="p-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handlePrintInvoice(order)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Print Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
```

---

## 📚 Additional Resources

### API Testing
- Use Postman collection: `postman_collection_msp.json`
- Test all endpoints with proper authentication

### Database Indexing
All models have proper indexes for:
- Fast queries
- Efficient filtering
- Pagination support

### Best Practices
1. Always use try-catch blocks
2. Validate user input
3. Handle errors gracefully
4. Use loading states in frontend
5. Clear error messages for users

---

## 🎯 Quick Start Checklist

### Backend Setup
- [ ] Install dependencies: `npm install`
- [ ] Create `.env` file with MongoDB URI and JWT secret
- [ ] Start server: `npm run dev`
- [ ] Create admin user in database
- [ ] Test login endpoint

### Frontend Integration
- [ ] Replace all mockData imports with API calls
- [ ] Add Authorization headers to all requests
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test all CRUD operations

### Testing
- [ ] Test dashboard stats API
- [ ] Test order management APIs
- [ ] Test payout APIs
- [ ] Test offer APIs
- [ ] Test message APIs

---

## 🆘 Common Issues & Solutions

### Issue: 401 Unauthorized
**Solution:** Check if JWT token is valid and included in headers.

### Issue: 403 Forbidden
**Solution:** User is not admin. Check user role in database.

### Issue: CORS Error
**Solution:** Enable CORS in Express app:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue: MongoDB Connection Failed
**Solution:** Check MongoDB URI in `.env` and ensure MongoDB is running.

---

## 📞 Support

For any issues or questions:
1. Check this documentation first
2. Review the code comments
3. Test with Postman
4. Check server logs for errors

---

**🎉 Your complete admin panel backend is ready to use!**

Last Updated: November 1, 2025
