#!/bin/bash

# PhonePe Integration - Installation Script
# This script will help you set up PhonePe payment gateway

echo "================================================"
echo "  PhonePe Payment Gateway - Installation"
echo "================================================"
echo ""

# Step 1: Install backend dependencies
echo "Step 1: Installing backend dependencies..."
cd backend
npm install axios
echo "✅ Backend dependencies installed"
echo ""

# Step 2: Check if .env exists
echo "Step 2: Checking environment configuration..."
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please update the following in backend/.env:"
    echo "   - MONGODB_URI"
    echo "   - JWT_SECRET"
    echo "   - PhonePe credentials (or use sandbox defaults)"
    echo ""
else
    echo "✅ .env file exists"
    echo ""
fi

# Step 3: Add PhonePe configuration to .env if not present
echo "Step 3: Checking PhonePe configuration..."
if ! grep -q "PHONEPE_MERCHANT_ID" .env; then
    echo "Adding PhonePe sandbox credentials to .env..."
    cat >> .env << 'EOF'

# PhonePe Payment Gateway (Sandbox)
PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_SALT_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
EOF
    echo "✅ PhonePe sandbox credentials added"
else
    echo "✅ PhonePe configuration already exists"
fi
echo ""

# Step 4: Return to root directory
cd ..

echo "================================================"
echo "  Installation Complete!"
echo "================================================"
echo ""
echo "Next Steps:"
echo "1. Update backend/.env with your MongoDB URI"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo "4. Test payment flow with PhonePe sandbox"
echo ""
echo "Test Credentials (Sandbox):"
echo "  Success: UPI ID 'success@ybl'"
echo "  Failure: UPI ID 'failure@ybl'"
echo ""
echo "Documentation:"
echo "  - PHONEPE_QUICK_SETUP.md - Quick start guide"
echo "  - PHONEPE_INTEGRATION_GUIDE.md - Complete docs"
echo "  - PHONEPE_INTEGRATION_SUMMARY.md - Overview"
echo ""
echo "Happy Selling! 🚀"
