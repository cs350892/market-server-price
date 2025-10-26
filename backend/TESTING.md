# Backend API Testing Documentation

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Authentication Testing](#authentication-testing)
- [Product API Testing](#product-api-testing)
- [Order API Testing](#order-api-testing)

## Prerequisites

- Node.js and npm installed
- MongoDB running locally or connection to MongoDB Atlas
- Postman or similar API testing tool
- Environment variables properly configured

## Environment Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/market-server-price
JWT_SECRET=your_jwt_secret_key_here
```


💻 API Routes:
➜ Auth:     http://localhost:5001/api/auth
➜ Products: http://localhost:5001/api/products
➜ Orders:   http://localhost:5001/api/orders
➜ Users:    http://localhost:5001/api/users

## Authentication Testing

### Admin Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "adminPassword123"
}
```

Expected Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

## Product API Testing

### 1. Create Product (Admin Only)

```http
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "id": "PROD001",
  "type": "high-margin",
  "name": "Test Product",
  "image": "product-image-url.jpg",
  "mrp": 100,
  "pricingTiers": [
    {
      "range": "1-10",
      "minQuantity": 1,
      "maxQuantity": 10,
      "price": 95,
      "margin": 5
    },
    {
      "range": "11-50",
      "minQuantity": 11,
      "maxQuantity": 50,
      "price": 90,
      "margin": 10
    },
    {
      "range": "51+",
      "minQuantity": 51,
      "maxQuantity": null,
      "price": 85,
      "margin": 15
    }
  ],
  "packSizes": [
    {
      "id": "SINGLE",
      "name": "Single Unit",
      "multiplier": 1
    },
    {
      "id": "PACK10",
      "name": "Pack of 10",
      "multiplier": 10
    }
  ],
  "description": "Test product description",
  "category": "Electronics",
  "brand": "TestBrand",
  "stock": 1000
}
```

Expected Response (201 Created):
```json
{
  "id": "PROD001",
  "name": "Test Product",
  "type": "high-margin",
  ...
}
```

### 2. Get All Products

```http
GET /api/products
```

Expected Response (200 OK):
```json
[
  {
    "id": "PROD001",
    "name": "Test Product",
    ...
  }
]
```

### 3. Get Product by ID

```http
GET /api/products/PROD001
```

Expected Response (200 OK):
```json
{
  "id": "PROD001",
  "name": "Test Product",
  ...
}
```

### 4. Calculate Product Price

```http
POST /api/products/calculate-price
Content-Type: application/json

{
  "productId": "PROD001",
  "packSizeId": "PACK10",
  "quantity": 5
}
```

Expected Response (200 OK):
```json
{
  "totalUnits": 50,
  "tier": "11-50",
  "pricePerUnit": 90,
  "totalPrice": "4500.00",
  "savingsPercentage": "10.00",
  "inStock": true
}
```

### 5. Update Product (Admin Only)

```http
PUT /api/products/PROD001
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "pricingTiers": [
    {
      "range": "1-10",
      "minQuantity": 1,
      "maxQuantity": 10,
      "price": 92,
      "margin": 8
    }
  ]
}
```

Expected Response (200 OK):
```json
{
  "id": "PROD001",
  "name": "Updated Product Name",
  ...
}
```

### 6. Delete Product (Admin Only)

```http
DELETE /api/products/PROD001
Authorization: Bearer <admin_token>
```

Expected Response (200 OK):
```json
{
  "message": "Product deleted"
}
```

## Error Testing Scenarios

### 1. Authentication Errors

- Try accessing admin routes without token
- Try accessing admin routes with invalid token
- Try accessing admin routes with non-admin user token

### 2. Product Creation Validation

- Missing required fields
- Invalid pricing tier structure
- Invalid pack size structure
- Duplicate product ID
- Invalid product type

### 3. Price Calculation Edge Cases

- Calculate price with invalid product ID
- Calculate price with invalid pack size
- Calculate price with quantity exceeding stock
- Calculate price with zero quantity
- Calculate price with negative quantity

## Load Testing Scenarios

1. Concurrent price calculations
2. Multiple product creations
3. Bulk product retrieval
4. High-frequency price updates

## Security Testing

1. SQL Injection prevention
2. NoSQL Injection prevention
3. XSS protection
4. CSRF protection
5. Rate limiting
6. Input validation
7. Token expiration
8. Password hashing

## Performance Metrics

Expected response times:
- Get all products: < 200ms
- Get single product: < 100ms
- Price calculation: < 150ms
- Product creation: < 300ms
- Product update: < 200ms
- Product deletion: < 200ms

## Testing Tools

1. Jest for unit testing
2. Supertest for API testing
3. Artillery for load testing
4. MongoDB Memory Server for testing with mock database

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- product.test.js

# Run tests with coverage
npm test -- --coverage
```

## Common Issues and Solutions

1. MongoDB Connection Issues
   - Check if MongoDB is running
   - Verify connection string
   - Check network connectivity

2. Authentication Issues
   - Verify JWT secret
   - Check token expiration
   - Verify user roles

3. Price Calculation Issues
   - Verify pricing tiers structure
   - Check pack size multipliers
   - Validate quantity inputs

## Reporting Bugs

When reporting bugs, include:
1. API endpoint
2. Request method
3. Request payload
4. Expected response
5. Actual response
6. Error message
7. Steps to reproduce

## Version Control

Current API Version: 1.0.0

## Contact

For testing related queries, contact:
- Backend Team Lead: [email]
- QA Team Lead: [email]