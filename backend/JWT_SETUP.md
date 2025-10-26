# JWT and Authentication Setup Guide

## Table of Contents
1. [JWT Secret Key Generation](#jwt-secret-key-generation)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Security Best Practices](#security-best-practices)
4. [Authentication Flow](#authentication-flow)
5. [API Key Management](#api-key-management)

## JWT Secret Key Generation

### Method 1: Using Node.js Crypto
```javascript
// Run this in Node.js terminal or script
const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
console.log('Your JWT Secret Key:', secretKey);
```

### Method 2: Using OpenSSL
```bash
# In terminal/command prompt
openssl rand -hex 64
```

### Method 3: Using UUID v4 with Additional Entropy
```javascript
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const generateStrongSecret = () => {
    const uuid = uuidv4();
    const timestamp = Date.now().toString();
    const random = crypto.randomBytes(32).toString('hex');
    return crypto.createHash('sha256')
                 .update(uuid + timestamp + random)
                 .digest('hex');
};
```

## Environment Variables Setup

1. Create a `.env` file in your project root:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/market-server-price

# JWT Configuration
JWT_SECRET=your_generated_secret_key_here
JWT_EXPIRES_IN=24h  # Token expiration time
JWT_REFRESH_SECRET=another_generated_secret_key_here
JWT_REFRESH_EXPIRES_IN=7d  # Refresh token expiration

# API Security
RATE_LIMIT_WINDOW=15  # Time window in minutes
RATE_LIMIT_MAX=100    # Maximum requests per window
```

2. Create a `.env.example` file (for team reference, without actual secrets):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=7d
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## Security Best Practices

### 1. JWT Secret Key Requirements
- Minimum 64 characters long
- Mix of random characters (letters, numbers, special characters)
- Unique for each environment (development, staging, production)
- Regular rotation schedule (every 30-90 days)

### 2. Environment Isolation
```bash
# Development
.env.development

# Testing
.env.test

# Staging
.env.staging

# Production
.env.production
```

### 3. Secret Key Storage
- Never commit secrets to version control
- Use secure key vaults in production (AWS Secrets Manager, Azure Key Vault)
- Use environment variables for local development

### 4. Key Rotation Process
1. Generate new secret
2. Update environment variables
3. Implement grace period for old tokens
4. Monitor token usage
5. Remove old secret after grace period

## Authentication Flow

### 1. Implementation in auth.middleware.js
```javascript
const jwt = require('jsonwebtoken');

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

### 2. Token Generation in auth.controller.js
```javascript
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};
```

## API Key Management

### 1. Development Environment
```javascript
// config/development.js
module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '24h',
  mongodb: {
    uri: process.env.MONGODB_URI
  }
};
```

### 2. Production Environment
```javascript
// config/production.js
module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '12h', // Shorter expiration in production
  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true
    }
  }
};
```

## Quick Start Guide

1. Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with generated secret:
```env
JWT_SECRET=your_generated_secret
```

4. Test JWT:
```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign({ test: true }, process.env.JWT_SECRET);
console.log('Test token:', token);

// Verify token
jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  if (err) console.error('Token verification failed');
  else console.log('Token verified:', decoded);
});
```

## Troubleshooting

### Common Issues

1. "Invalid signature" error:
   - Check if JWT_SECRET matches between token generation and verification
   - Verify no whitespace in .env values

2. "Token expired" error:
   - Check JWT_EXPIRES_IN value
   - Verify server time synchronization

3. "No token provided" error:
   - Check Authorization header format
   - Verify token is being sent in requests

### Security Audit Checklist

- [ ] JWT secret meets minimum length requirement
- [ ] Environment variables properly configured
- [ ] No secrets in version control
- [ ] Token expiration configured
- [ ] Refresh token rotation implemented
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] SSL/TLS enabled for production

## Additional Resources

1. JWT Documentation: https://jwt.io/
2. Node.js Crypto Documentation: https://nodejs.org/api/crypto.html
3. Security Best Practices: https://auth0.com/blog/security-best-practices
4. Environment Variables Guide: https://12factor.net/config

Remember to never share your production JWT secrets and always use secure methods to transmit secrets to team members.