# Backend API Documentation for Admin Panel

## 🎯 Overview
Complete backend implementation ho gaya hai for all admin panel features.

## 📁 Files Created/Updated

### Models (MongoDB Schemas)
1. **order.model.js** - Updated with `invoiceId` field
2. **payout.model.js** - New model for payment tracking
3. **offer.model.js** - New model for discount coupons
4. **message.model.js** - New model for customer support

### Controllers
1. **analytics.controller.js** - Updated with dashboard stats
2. **payout.controller.js** - Complete CRUD for payouts
3. **offer.controller.js** - Complete CRUD for offers
4. **message.controller.js** - Complete CRUD for messages

### Routes
1. **admin.routes.js** - Updated with all new endpoints


## 🚀 API Endpoints

### 📊 Dashboard APIs

#### 1. Get Dashboard Stats
```
GET /api/v1/admin/dashboard/stats
```
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
#### 2. Get Last 7 Days Sales
```
GET /api/v1/admin/dashboard/sales/last7days
```
**Response:**
```json
{
  "success": true,
  "salesData": [
    { "date": "2025-10-02", "sales": 120 },
    { "date": "2025-10-03", "sales": 150 },
   
  ]
}
```

---

### 📦 Order Management APIs

#### 1. Create Order
```
POST /api/v1/orders
Authorization: Bearer <jwt_token>
Content-Type: application/json

Body:
{
  "items": [
    {
      "product": "product_id",
      "name": "Product Name",
      "quantity": 5,
      "price": 63
    }
  ],
  "totalAmount": 315,
  "paymentMethod": "cash",
  "deliveryType": "delivery",
  "shippingAddress": {
    "name": "Customer Name",
    "address": "123 Street",
    "city": "Delhi",
    "state": "DL",
    "postalCode": "110001",
    "country": "India"
  },
  "notes": "Order notes"
}
```

#### 2. Get All Orders (Admin)
```
GET /api/v1/admin/orders?status=pending&limit=50&page=1
```

#### 3. Update Order Status (Admin)
```
PUT /api/v1/admin/orders/:id/status
Body: { "status": "shipped", "trackingNumber": "TRACK123" }
```

#### 4. Get Order Stats (Admin)
```
GET /api/v1/admin/orders/stats
```

---

### 💰 Payout Management APIs

#### 1. Get All Payouts
```
GET /api/v1/admin/payouts?status=pending
```

#### 2. Create Payout
```
POST /api/v1/admin/payouts
Body: {
  "date": "2025-10-08",
  "amount": 5000,
  "orderIds": ["order_id_1", "order_id_2"],
  "paymentMethod": "bank_transfer",
  "notes": "Weekly payout"
}
```

#### 3. Update Payout Status
```
PUT /api/v1/admin/payouts/:id/status
Body: { "status": "completed", "transactionId": "TXN123456" }
```

#### 4. Get Payout Stats
```
GET /api/v1/admin/payouts/stats
```

#### 5. Delete Payout
```
DELETE /api/v1/admin/payouts/:id
```

---

### 🎁 Offer/Coupon Management APIs

#### 1. Get All Offers
```
GET /api/v1/admin/offers?status=active
```

#### 2. Get Active Offers
```
GET /api/v1/admin/offers/active
```

#### 3. Create Offer
```
POST /api/v1/admin/offers
Body: {
  "code": "DIWALI10",
  "description": "Diwali Special Offer",
  "discount": 10,
  "discountType": "percentage",
  "products": ["product_id_1", "product_id_2"],
  "expiry": "2025-11-01",
  "usageLimit": 100
}
```

#### 4. Update Offer
```
PUT /api/v1/admin/offers/:id
Body: { "status": "inactive" }
```

#### 5. Delete Offer
```
DELETE /api/v1/admin/offers/:id
```

#### 6. Get Offer Stats
```
GET /api/v1/admin/offers/stats
```

---

### 💬 Message/Support APIs

#### 1. Get All Messages
```
GET /api/v1/admin/messages?status=unread&category=order_issue
```

#### 2. Get Message by ID
```
GET /api/v1/admin/messages/:id
```

#### 3. Create Message
```
POST /api/v1/admin/messages
Body: {
  "from": "customer@example.com",
  "subject": "Order Issue",
  "message": "My order is delayed",
  "category": "order_issue",
  "priority": "high"
}
```

#### 4. Reply to Message
```
POST /api/v1/admin/messages/:id/reply
Body: { "replyText": "We are looking into your issue" }
```

#### 5. Update Message Status
```
PUT /api/v1/admin/messages/:id/status
Body: { "status": "resolved" }
```

#### 6. Assign Message
```
PUT /api/v1/admin/messages/:id/assign
Body: { "assignedTo": "admin_user_id" }
```

#### 7. Update Priority
```
PUT /api/v1/admin/messages/:id/priority
Body: { "priority": "urgent" }
```

#### 8. Delete Message
```
DELETE /api/v1/admin/messages/:id
```

#### 9. Get Message Stats
```
GET /api/v1/admin/messages/stats
```

---

## 🔐 Authentication
All admin routes require:
1. **JWT Token** in Authorization header
2. **Admin Role** verification

```javascript
headers: {
  'Authorization': 'Bearer <your_jwt_token>'
}
```

---

## 📝 Model Schemas

### Order Model (Updated)
```javascript

{
  invoiceId: "INV000001", 
  user: ObjectId,
  items: [...],
  totalAmount: Number,
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
}

```

### Payout Model
```javascript


{
  date: Date,
  amount: Number,
  status: "pending" | "processing" | "completed" | "failed",
  orders: [ObjectId],
  invoiceIds: [String],
  paymentMethod: "bank_transfer" | "upi" | "cheque" | "cash",
  transactionId: String,
  bankDetails: {...},
  processedBy: ObjectId
}

```

### Offer Model
```javascript

{
  code: String (uppercase),
  discount: Number,
  discountType: "percentage" | "fixed",
  products: [ObjectId],
  status: "active" | "inactive" | "expired",
  expiry: Date,
  usageLimit: Number,
  usageCount: Number
}


```

### Message Model
```javascript

{
  from: String,
  fromUser: ObjectId,
  subject: String,
  message: String,
  category: "product_query" | "order_issue" | "payment_issue" | ...,
  status: "unread" | "read" | "replied" | "resolved" | "closed",
  priority: "low" | "medium" | "high" | "urgent",
  replies: [{
    replyBy: ObjectId,
    replyText: String,
    repliedAt: Date
  }],
  relatedOrder: ObjectId,
  relatedProduct: ObjectId
 }


 ```

 ---

 🎨 Frontend Integration

 ## Dashboard.jsx - Update karo ye:

 ```javascript
 // Replace mockData imports with API calls


 useEffect(() => {
  // Get dashboard stats
  fetch('/api/v1/admin/dashboard/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    setTodaySales(data.todaySales);
    setTotalRevenue(data.totalRevenue);
    setTotalOrders(data.totalOrders);
    setPendingOrders(data.pendingOrders);
  });


 // Get last 7 days sales
  fetch('/api/v1/admin/dashboard/sales/last7days', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => setSalesData(data.salesData));
 }, []);


  ```
 
  ### OrderManagement.jsx - Update:
  ```javascript

 useEffect(() => {
  fetch('/api/v1/admin/orders', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => setOrders(data.orders));
 }, []);

 const handleStatusUpdate = (id, status) => {
  fetch(`/api/v1/admin/orders/${id}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  })
  .then(res => res.json())
  .then(data => {

    // Update-UI

  });
 };



 ```

 ### PaymentsReports.jsx - Update:
 ```javascript
 useEffect(() => {
  fetch('/api/v1/admin/payouts', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => setPayouts(data.payouts));
 }, []);
 ```

 ### MessagesSupport.jsx - Update:
 ```javascript
 useEffect(() => {
  fetch('/api/v1/admin/messages', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => setMessages(data.messages));
 }, []);

 const handleReply = (id, replyText) => {
  fetch(`/api/v1/admin/messages/${id}/reply`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ replyText })
  })
  .then(res => res.json())
  .then(data => {
    // Update UI
  });
 };
 ```

 ### OffersCoupons.jsx - Update:
 ```javascript
 useEffect(() => {
  fetch('/api/v1/admin/offers', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => setOffers(data.offers));
 }, []);
 ```

---

## ✅ Testing Checklist.

### 1. Test Dashboard APIs
- [ ] GET /api/v1/admin/dashboard/stats
- [ ] GET /api/v1/admin/dashboard/sales/last7days

### 2. Test Order Management
- [ ] GET /api/v1/admin/orders
- [ ] PUT /api/v1/admin/orders/:id/status

### 3. Test Payout Management
- [ ] GET /api/v1/admin/payouts
- [ ] POST /api/v1/admin/payouts
- [ ] PUT /api/v1/admin/payouts/:id/status

### 4. Test Offers
- [ ] GET /api/v1/admin/offers
- [ ] POST /api/v1/admin/offers
- [ ] PUT /api/v1/admin/offers/:id
- [ ] DELETE /api/v1/admin/offers/:id

### 5. Test Messages
- [ ] GET /api/v1/admin/messages
- [ ] POST /api/v1/admin/messages/:id/reply
- [ ] PUT /api/v1/admin/messages/:id/status

---

## 🚀 How to Run.

1. **Start Backend Server:**
```bash
cd backend
npm install
npm start
```

2. **Test with Postman:**
- Import collection from `postman_collection_msp.json`
- Add new endpoints mentioned above

3. **Connect Frontend:**
- Update all mockData imports with API calls
- Add Authorization headers to all requests

---

## 📌 Notes

1. **InvoiceId Auto-Generation**: Har naye order ke liye automatically `INV000001`, `INV000002`, etc. generate hoga
2. **Authentication Required**: Saare admin routes JWT token + admin role check karte hain
3. **Pagination Support**: Most endpoints me `page` aur `limit` query params supported hain
4. **Error Handling**: Proper error messages with HTTP status codes


## 🎉 All Done.

Saare backend APIs ready hain. Ab frontend me mock data ko replace karo API calls se aur test karo! 🚀
