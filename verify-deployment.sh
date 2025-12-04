#!/bin/bash

echo "🚀 Market Server Price - Deployment Verification Script"
echo "========================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if URLs are provided
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "${YELLOW}Usage: ./verify-deployment.sh <backend-url> <frontend-url>${NC}"
    echo "Example: ./verify-deployment.sh https://backend.onrender.com https://frontend.onrender.com"
    exit 1
fi

BACKEND_URL=$1
FRONTEND_URL=$2

echo "Testing Backend: $BACKEND_URL"
echo "Testing Frontend: $FRONTEND_URL"
echo ""

# Test Backend Health
echo "1️⃣  Testing Backend Health Endpoint..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/v1/auth/health")

if [ "$HEALTH_RESPONSE" == "200" ]; then
    echo "${GREEN}✅ Backend is running!${NC}"
else
    echo "${RED}❌ Backend health check failed (Status: $HEALTH_RESPONSE)${NC}"
fi

echo ""

# Test Frontend
echo "2️⃣  Testing Frontend..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")

if [ "$FRONTEND_RESPONSE" == "200" ]; then
    echo "${GREEN}✅ Frontend is accessible!${NC}"
else
    echo "${RED}❌ Frontend is not accessible (Status: $FRONTEND_RESPONSE)${NC}"
fi

echo ""

# Test Backend API Routes
echo "3️⃣  Testing Backend API Routes..."

# Test Products Route
PRODUCTS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/v1/products")
if [ "$PRODUCTS_RESPONSE" == "200" ] || [ "$PRODUCTS_RESPONSE" == "401" ]; then
    echo "${GREEN}✅ Products API responding${NC}"
else
    echo "${RED}❌ Products API not responding (Status: $PRODUCTS_RESPONSE)${NC}"
fi

# Test Categories Route  
CATEGORIES_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/v1/categories")
if [ "$CATEGORIES_RESPONSE" == "200" ] || [ "$CATEGORIES_RESPONSE" == "401" ]; then
    echo "${GREEN}✅ Categories API responding${NC}"
else
    echo "${RED}❌ Categories API not responding (Status: $CATEGORIES_RESPONSE)${NC}"
fi

echo ""
echo "========================================================"
echo "✨ Verification Complete!"
echo ""
echo "If all tests passed, your deployment is successful! 🎉"
echo ""
echo "Next steps:"
echo "1. Create admin user: node backend/setup-admin.js"
echo "2. Test login on: $FRONTEND_URL"
echo "3. Check backend logs on Render dashboard"
echo "========================================================"
