# PhonePe Payment Gateway Integration Guide

## Overview
This project now includes PhonePe Payment Gateway integration for secure online payments. Users can choose between PhonePe online payment or Cash on Delivery (COD) when placing orders.

## Features
✅ PhonePe payment integration for online orders
✅ Cash on Delivery (COD) option
✅ Payment status verification
✅ Automatic order confirmation on successful payment
✅ Payment callback handling
✅ Refund support for admin
✅ Secure checksum validation

---

## Backend Setup

### 1. Install Required Dependencies
The project already includes all necessary dependencies. No additional packages needed.

### 2. Environment Variables
Add these PhonePe credentials to your `backend/.env` file:

```env
# PhonePe Configuration
PHONEPE_MERCHANT_ID=your_merchant_id_here
PHONEPE_SALT_KEY=your_salt_key_here
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox

# For Production (after testing)
# PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes
```

### 3. Get PhonePe Credentials

**For Testing (Sandbox):**
1. Go to PhonePe Developer Portal: https://developer.phonepe.com/
2. Sign up / Login
3. Create a test merchant account
4. Get your Merchant ID and Salt Key from dashboard
5. Use sandbox URL: `https://api-preprod.phonepe.com/apis/pg-sandbox`

**For Production:**
1. Complete KYC and business verification
2. Get production credentials
3. Use production URL: `https://api.phonepe.com/apis/hermes`

---

## API Endpoints

### 1. Initiate Payment
**POST** `/api/v1/payment/initiate`
- **Access:** Protected (User must be logged in)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "orderId": "order_id_from_database",
  "amount": 1500.50,
  "userPhone": "9876543210",
  "userName": "John Doe"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "redirectUrl": "https://phonepe.com/payment-page",
    "transactionId": "TXN_order123_1234567890"
  }
}
```

### 2. Payment Callback
**POST** `/api/v1/payment/callback`
- **Access:** Public (PhonePe server calls this)
- **Body:** PhonePe sends encrypted response
- **Response:**
```json
{
  "success": true,
  "message": "Payment callback processed",
  "paymentStatus": "paid"
}
```

### 3. Check Payment Status
**GET** `/api/v1/payment/status/:transactionId`
- **Access:** Protected (User must be logged in)
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "paymentStatus": "paid",
  "orderStatus": "confirmed",
  "data": {
    "transactionId": "PE_TXN_123",
    "state": "COMPLETED",
    "amount": 150050
  }
}
```

### 4. Refund Payment
**POST** `/api/v1/payment/refund`
- **Access:** Protected (Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "orderId": "order_id_from_database"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Refund initiated successfully",
  "data": { }
}
```

---

## Frontend Integration

### User Flow

1. **Browse Products** → Add to cart
2. **Checkout Page** → Select payment method (PhonePe or COD)
3. **PhonePe Selected** → Click "Proceed to Payment"
4. **Order Created** → Backend creates order with pending payment
5. **Payment Initiated** → Backend calls PhonePe API
6. **Redirect to PhonePe** → User completes payment on PhonePe page
7. **Payment Callback** → PhonePe redirects to `/payment/callback`
8. **Verify Payment** → Frontend checks payment status
9. **Order Confirmed** → Payment successful → Order status updated
10. **Redirect to Orders** → User sees confirmed order

### Key Pages

**1. Checkout Page (`/checkout`)**
- Payment method selection (PhonePe / COD)
- Address collection
- Order placement

**2. Payment Callback Page (`/payment/callback`)**
- Verifies payment status
- Shows success/failure message
- Redirects to orders page

---

## Database Updates

### Order Model Updates
New fields added to Order schema:

```javascript
{
  paymentMethod: {
    type: String,
    enum: ['cod', 'online', 'upi', 'cash', 'phonepe']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded']
  },
  phonepeTransactionId: String,
  phonepePaymentId: String
}
```

---

## Testing

### Test Flow

1. **Start Backend:**
```bash
cd backend
npm run dev
```

2. **Start Frontend:**
```bash
cd frontend
npm run dev
```

3. **Test Payment:**
   - Browse products and add to cart
   - Go to checkout
   - Fill delivery address
   - Select "PhonePe" payment method
   - Click "Proceed to Payment"
   - Use PhonePe test credentials (provided in sandbox dashboard)
   - Complete payment
   - Verify order status

### PhonePe Sandbox Test Credentials
When using sandbox, PhonePe provides test cards and UPI IDs:
- Test UPI: `success@ybl` (for successful payments)
- Test UPI: `failure@ybl` (for failed payments)

---

## Security Features

✅ **Checksum Validation** - Every request/response verified with SHA256 hash
✅ **JWT Authentication** - User must be logged in
✅ **Order Ownership Check** - Users can only pay for their own orders
✅ **HTTPS Required** - Production must use SSL
✅ **Salt Key Protection** - Stored in environment variables

---

## Payment States

| State | Description |
|-------|-------------|
| `pending` | Payment initiated, awaiting completion |
| `paid` | Payment successful, order confirmed |
| `failed` | Payment failed, order remains pending |
| `refunded` | Payment refunded by admin |

---

## Admin Features

### Refund Process
Admins can refund orders from the admin panel:
1. Navigate to order details
2. Click "Refund Payment"
3. Confirm refund
4. System initiates PhonePe refund
5. Order status changes to "cancelled"
6. Payment status changes to "refunded"

---

## Error Handling

Common errors and solutions:

| Error | Solution |
|-------|----------|
| "Invalid checksum" | Verify SALT_KEY is correct |
| "Merchant not found" | Check MERCHANT_ID |
| "Payment initiation failed" | Check PhonePe API credentials |
| "Order not found" | Ensure order exists before payment |
| "Invalid phone number" | Use 10-digit Indian phone number |

---

## Production Checklist

Before going live:

- [ ] Get production PhonePe credentials
- [ ] Update `PHONEPE_BASE_URL` to production URL
- [ ] Enable HTTPS on your domain
- [ ] Update `CLIENT_URL` in .env to your domain
- [ ] Test with small amounts first
- [ ] Set up webhook monitoring
- [ ] Configure payment failure alerts
- [ ] Add payment analytics tracking
- [ ] Review refund policy
- [ ] Test callback URL is publicly accessible

---

## Webhook Configuration

PhonePe requires a publicly accessible callback URL. For local development:

1. **Use ngrok:**
```bash
ngrok http 5000
```

2. **Update callback URL in PhonePe dashboard:**
```
https://your-ngrok-url.ngrok.io/api/v1/payment/callback
```

3. **For production:**
```
https://yourdomain.com/api/v1/payment/callback
```

---

## Support

For PhonePe integration issues:
- PhonePe Docs: https://developer.phonepe.com/docs
- Support: phonepe-merchants@phonepe.com
- Developer Portal: https://developer.phonepe.com/

For project-specific issues:
- Check logs in backend console
- Verify environment variables
- Test with PhonePe sandbox first
- Review order and payment status in database

---

## Payment Flow Diagram

```
User Checkout
     ↓
Select PhonePe
     ↓
Enter Address
     ↓
Click "Proceed to Payment"
     ↓
Backend: Create Order (status: pending)
     ↓
Backend: Call PhonePe API
     ↓
PhonePe: Generate Payment Link
     ↓
User: Redirected to PhonePe Page
     ↓
User: Complete Payment (UPI/Card/Wallet)
     ↓
PhonePe: Process Payment
     ↓
PhonePe: Callback to Backend
     ↓
Backend: Verify Checksum
     ↓
Backend: Update Order (status: confirmed, paymentStatus: paid)
     ↓
Redirect to /payment/callback
     ↓
Frontend: Verify Payment Status
     ↓
Show Success → Redirect to Orders
```

---

## Notes

- PhonePe charges ~2% transaction fee (varies by plan)
- Settlement happens T+1 (next business day)
- Refunds take 5-7 business days
- Keep salt key secret and secure
- Use environment variables for all credentials
- Test thoroughly in sandbox before production
- Monitor failed payments and retry logic
