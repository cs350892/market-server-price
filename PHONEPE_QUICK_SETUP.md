# PhonePe Integration - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Update Environment Variables
Add these to your `backend/.env` file:

```env
# PhonePe Sandbox (for testing)
PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_SALT_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
```

### Step 3: Restart Backend
```bash
cd backend
npm run dev
```

### Step 4: Test Payment Flow
1. Start frontend: `cd frontend && npm run dev`
2. Browse products and add to cart
3. Go to checkout
4. Select **PhonePe** payment method
5. Fill delivery address
6. Click **"Proceed to Payment"**
7. On PhonePe sandbox page, use test credentials:
   - Test UPI: `success@ybl` (for successful payment)
   - Test UPI: `failure@ybl` (for failed payment)
8. Complete payment
9. You'll be redirected to payment callback page
10. Order status will be automatically updated

---

## 🎯 What's Changed

### Backend Files Created/Updated:
1. ✅ `backend/src/controllers/payment.controller.js` - PhonePe payment logic
2. ✅ `backend/src/routes/payment.routes.js` - Payment API routes
3. ✅ `backend/src/config/index.js` - Added PhonePe config
4. ✅ `backend/src/models/order.model.js` - Added PhonePe fields
5. ✅ `backend/src/app.js` - Registered payment routes

### Frontend Files Created/Updated:
1. ✅ `frontend/src/pages/PaymentCallback.jsx` - Payment verification page
2. ✅ `frontend/src/pages/Checkout.jsx` - Added payment method selection
3. ✅ `frontend/src/App.jsx` - Added payment callback route

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/payment/initiate` | Initialize PhonePe payment |
| POST | `/api/v1/payment/callback` | PhonePe payment callback |
| GET | `/api/v1/payment/status/:txnId` | Check payment status |
| POST | `/api/v1/payment/refund` | Refund payment (Admin) |

---

## 📱 User Flow

```
1. User adds products to cart
2. User goes to checkout
3. User selects "PhonePe" payment method
4. User fills delivery address
5. User clicks "Proceed to Payment"
   ↓
6. Backend creates order (status: pending)
7. Backend initiates PhonePe payment
8. User redirected to PhonePe payment page
9. User completes payment (UPI/Card/Wallet)
   ↓
10. PhonePe processes payment
11. PhonePe sends callback to backend
12. Backend updates order (status: confirmed, payment: paid)
13. User redirected to /payment/callback
14. Frontend verifies payment status
15. Success message shown
16. Redirected to orders page
```

---

## 🧪 Testing

### Sandbox Test Credentials (PhonePe Provided)

**For Successful Payments:**
- UPI ID: `success@ybl`
- Card Number: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: Any future date

**For Failed Payments:**
- UPI ID: `failure@ybl`

### Test Scenarios

1. **Successful Payment:**
   - Use `success@ybl` UPI
   - Order status should change to "confirmed"
   - Payment status should be "paid"

2. **Failed Payment:**
   - Use `failure@ybl` UPI
   - Order status remains "pending"
   - Payment status should be "failed"

3. **COD (Cash on Delivery):**
   - Select "Cash on Delivery"
   - Order created immediately
   - No payment gateway involved

---

## 🔐 Security Features

✅ SHA256 checksum validation
✅ JWT authentication required
✅ Order ownership verification
✅ Secure salt key storage
✅ Environment-based configuration

---

## 📊 Payment Status Flow

| Order Status | Payment Status | Description |
|--------------|----------------|-------------|
| pending | pending | Order created, payment not yet done |
| pending | failed | Payment failed, user can retry |
| confirmed | paid | Payment successful, order confirmed |
| cancelled | refunded | Order cancelled, payment refunded |

---

## 🛠️ Production Setup

Before going to production:

1. **Get Production Credentials:**
   - Sign up at https://business.phonepe.com/
   - Complete KYC verification
   - Get production Merchant ID and Salt Key

2. **Update Environment:**
```env
PHONEPE_MERCHANT_ID=your_production_merchant_id
PHONEPE_SALT_KEY=your_production_salt_key
PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes
```

3. **Enable HTTPS:**
   - PhonePe requires HTTPS in production
   - Update CLIENT_URL to your domain

4. **Test First:**
   - Test with small amounts
   - Verify callback URL is accessible
   - Check payment flow end-to-end

---

## ❓ Troubleshooting

**Issue: "Payment initiation failed"**
- Check MERCHANT_ID and SALT_KEY
- Verify backend is running
- Check network connectivity

**Issue: "Invalid checksum"**
- Verify SALT_KEY is correct
- Check SALT_INDEX (should be "1")

**Issue: "Callback not working"**
- For local development, use ngrok
- Ensure callback URL is publicly accessible
- Check backend logs

**Issue: "Order not found"**
- Verify order was created before payment
- Check order ID in database

---

## 📞 Support

- PhonePe Docs: https://developer.phonepe.com/docs
- PhonePe Support: phonepe-merchants@phonepe.com
- Sandbox Dashboard: https://developer.phonepe.com/

---

## ✨ Features

✅ **Multiple Payment Options** - PhonePe & COD
✅ **Real-time Payment Verification** - Instant order confirmation
✅ **Automatic Status Updates** - Backend handles everything
✅ **Refund Support** - Admin can refund orders
✅ **Secure Transactions** - SHA256 checksum validation
✅ **User-Friendly UI** - Clean payment selection interface

---

## 🎉 You're Done!

Your marketplace now supports PhonePe payments. Users can pay securely using UPI, Cards, or Wallets through PhonePe gateway.

**Next Steps:**
1. Test the complete flow
2. Customize payment UI if needed
3. Add payment analytics
4. Set up production credentials when ready
