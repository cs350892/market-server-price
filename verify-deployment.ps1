# 🚀 Market Server Price - Deployment Verification Script
# Run this after deploying to verify everything is working

param(
    [Parameter(Mandatory=$true)]
    [string]$BackendUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$FrontendUrl
)

Write-Host "🚀 Market Server Price - Deployment Verification" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Testing Backend: $BackendUrl" -ForegroundColor Yellow
Write-Host "Testing Frontend: $FrontendUrl" -ForegroundColor Yellow
Write-Host ""

# Test Backend Health
Write-Host "1️⃣  Testing Backend Health Endpoint..." -ForegroundColor White
try {
    $healthResponse = Invoke-WebRequest -Uri "$BackendUrl/api/v1/auth/health" -Method GET -UseBasicParsing -ErrorAction Stop
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "✅ Backend is running!" -ForegroundColor Green
        Write-Host "   Response: $($healthResponse.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Backend health check failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Frontend
Write-Host "2️⃣  Testing Frontend..." -ForegroundColor White
try {
    $frontendResponse = Invoke-WebRequest -Uri $FrontendUrl -Method GET -UseBasicParsing -ErrorAction Stop
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend is accessible!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend is not accessible!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Backend API Routes
Write-Host "3️⃣  Testing Backend API Routes..." -ForegroundColor White

# Test Products Route
try {
    $productsResponse = Invoke-WebRequest -Uri "$BackendUrl/api/v1/products" -Method GET -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Products API responding (Status: $($productsResponse.StatusCode))" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "✅ Products API responding (needs auth)" -ForegroundColor Green
    } else {
        Write-Host "❌ Products API not responding" -ForegroundColor Red
    }
}

# Test Categories Route
try {
    $categoriesResponse = Invoke-WebRequest -Uri "$BackendUrl/api/v1/categories" -Method GET -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Categories API responding (Status: $($categoriesResponse.StatusCode))" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "✅ Categories API responding (needs auth)" -ForegroundColor Green
    } else {
        Write-Host "❌ Categories API not responding" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "✨ Verification Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "If all tests passed, your deployment is successful! 🎉" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create admin user: node backend/setup-admin.js" -ForegroundColor White
Write-Host "2. Test login on: $FrontendUrl" -ForegroundColor White
Write-Host "3. Check backend logs on Render dashboard" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan

# Example usage comment
<#
Usage:
.\verify-deployment.ps1 -BackendUrl "https://your-backend.onrender.com" -FrontendUrl "https://your-frontend.onrender.com"
#>
