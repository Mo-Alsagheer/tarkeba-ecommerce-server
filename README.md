<p align="center">
  <img src="https://res.cloudinary.com/drvgczmup/image/upload/v1762892241/tarkeba-logo_ptqtkv.jpg" width="150" alt="tarkeba-logo" />
</p>
<p align="center">Tarkeba is an e-commerce platform for selling perfumes 🛍️🌸</p>

# Tarkeba E-Commerce Platform

Tarkeba is an e-commerce application designed for selling perfumes. Built with NestJS, TypeScript, and MongoDB. This platform features advanced authentication with token rotation, OAuth integration, payment processing, asynchronous job queuing, and comprehensive admin analytics.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Architecture](#project-architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Deployment](#deployment)

## Overview

Tarkeba is a fully-featured e-commerce backend system designed. The platform uses a modular architecture organized into logical domain boundaries, making it easy to understand, extend, and maintain.

## Features

### 🔐 Authentication & Authorization

- **JWT-based Authentication** with access & refresh tokens
- **Token Rotation Mechanism**: Automatic refresh token rotation with reuse detection
- **OTP Email Verification** for registration and password reset
- **OAuth 2.0 Integration**: Google social login
- **Role-based Access Control (RBAC)**: Customer and Admin roles
- **Secure Password Reset** with OTP validation via email
- **Session Management**: Track user sessions with device and IP information
- **Automatic Token Revocation**: Detects token reuse and revokes all user sessions

### 👤 User Management

- Complete user profile management (view & update)
- Order history tracking with pagination
- Secure password change functionality
- OAuth account linking (Google)
- Email verification system
- User activity tracking

### 📦 Product Management

- Full CRUD operations for products
- Product categories with hierarchical structure (parent-child relationships)
- Advanced product search and filtering
  - Filter by category with ObjectId support
  - Search by name, description, and tags
  - Price range filtering
  - Active/featured product filtering
- **Variant-based Product System**:
  - Multiple variants per product (size, price, stock)
  - Compare price support for discounts
  - Variant-specific stock tracking
- Stock management and inventory tracking
  - Automatic stock validation at checkout
  - Atomic stock reduction with MongoDB transactions
  - Low stock warnings
- Featured products highlighting
- Product slug generation for SEO-friendly URLs
- Product images support with Cloudinary integration
- Product reviews and ratings system
- Average rating calculation

### 🛒 Shopping Cart

- Add/remove products from cart
- Update product quantities
- Cart persistence for authenticated users
- Automatic price calculation
- Stock validation
- Coupon application at cart level

### 📋 Order Management

- Complete order lifecycle management
- **Smart Checkout Process**:
  - Cart validation with product and price verification
  - Stock availability checking before order creation
  - Payment method selection (COD or Wallet)
  - Automatic order creation with items snapshot
  - Conditional stock reduction based on payment method
- Order status tracking (pending, processing, shipped, delivered, cancelled)
- Payment status tracking (pending, paid, failed, refunded)
- Shipping address management
- Order history for customers with pagination
- Admin order management dashboard
- Order cancellation workflow
- Email notifications for order status changes
- Order items stored separately with product snapshot

### 💳 Payment Processing

- **Paymob Payment Gateway Integration**
- **Multiple Payment Methods**:
  - Mobile Wallet (Paymob integration)
  - Cash on Delivery (COD)
- **Payment Methods API**: Endpoint to retrieve available payment methods
- **Smart Checkout Flow**:
  - COD: Immediate order completion with stock reduction
  - Wallet: Payment initiation with redirect URL, stock reduced after confirmation
- Secure payment initiation and processing
- Payment transaction tracking
- Webhook handling for real-time payment status updates
- HMAC signature verification for webhooks
- Automatic stock reduction after successful wallet payment
- Refund processing capability
- Idempotency for payment operations

### 🎟️ Coupon System

- Flexible coupon creation and management
- Multiple discount types:
  - Percentage discounts
  - Fixed amount discounts
- Usage limits (per coupon and per user)
- Expiration date support
- Minimum purchase amount requirements
- Coupon code validation
- Automatic coupon application at checkout

### 🔄 Returns & Refunds

- Product return request system
- Return status management (requested, approved, rejected, completed)
- Return reason tracking
- Admin approval workflow
- Integration with payment refunds
- Email notifications for return status

### ⭐ Product Reviews

- Customer product reviews and ratings (1-5 stars)
- Review submission for purchased products only
- Review moderation by admins
- Helpful/not helpful voting system
- Average rating aggregation
- Review listing and filtering

### 📊 Admin Dashboard

- **Comprehensive Analytics Dashboard**:
  - Total sales revenue and order count
  - User growth statistics
  - Order status breakdown with visualizations
  - Top selling products analysis
  - Recent user registrations
  - Daily/weekly/monthly sales trends
  - Revenue analytics
- **User Management**: View all users, delete users
- **Product Management**: Full control over product catalog
- **Order Management**: Track and update order statuses
- **Coupon Management**: Create and manage discount coupons
- **Review Moderation**: Approve or reject product reviews
- **Return Management**: Process return requests

### 📧 Email System

- **Asynchronous Email Processing** with BullMQ and Redis
- Email job queue with retry mechanism
- Template-based emails using Handlebars
- Email types:
  - Welcome emails
  - Email verification with OTP
  - Password reset with OTP
  - Order confirmation
  - Order status updates
  - Return request notifications
- Failed email retry logic
- Email delivery tracking

### 🛡️ Global Infrastructure

- **Exception Handling**: Global HTTP exception filter with standardized error responses
- **Logging**: Request/response logging interceptor for debugging
- **Validation**: Comprehensive DTO validation using class-validator
- **Security Middleware**: Helmet for HTTP headers, CORS configuration
- **Timeout Protection**: Request timeout interceptor
- **Rate Limiting**: Protection against brute-force attacks
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Type Safety**: Full TypeScript support with strict typing

## Project Architecture

Tarkeba follows a **modular monolithic architecture** with clear domain boundaries. The system is organized into aggregator modules that group related features, making the codebase scalable, maintainable, and easy to understand.

### Design Principles

1. **Domain-Driven Design (DDD)**: Features are organized by business domain
2. **Separation of Concerns**: Each module has a single, well-defined responsibility
3. **Dependency Injection**: Loose coupling through NestJS's DI container
4. **SOLID Principles**: Clean, maintainable, and testable code
5. **Repository Pattern**: Data access abstraction through Mongoose models
6. **Service Layer Pattern**: Business logic encapsulation in services

### Directory Structure

```
src/
├── common/                          # Shared utilities & infrastructure
│   ├── constants/                   # Application-wide constants
│   ├── enums/                       # TypeScript enumerations
│   ├── filters/                     # Exception filters
│   ├── helpers/                     # Helper functions
│   ├── interceptors/                # Request/response interceptors
│   ├── interfaces/                  # TypeScript interfaces
│   ├── types/                       # Type definitions
│   └── utils/                       # Utility functions
│
├── config/                          # Configuration modules
│   ├── app/                         # Application config
│   ├── database/                    # Database config
│   ├── mail/                        # Email config
│   ├── jwt.config.ts                # JWT configuration
│   ├── oauth.config.ts              # OAuth configuration
│   ├── paymob.config.ts             # Payment config
│   └── queue.config.ts              # Queue configuration
│
├── modules/                         # Feature modules
│   │
│   ├── identity/                    # Identity domain aggregator
│   │   ├── auth/                    # Authentication module
│   │   │   ├── dto/                 # Data transfer objects
│   │   │   ├── entities/            # Mongoose schemas
│   │   │   ├── guards/              # Auth guards
│   │   │   ├── helpers/             # Auth helpers
│   │   │   ├── passport/            # Passport strategies
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── users/                   # User management module
│   │   │   ├── entities/            # User schema
│   │   │   ├── dto/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   │
│   │   └── identity.module.ts       # Aggregator module
│   │
│   ├── commerce/                    # Commerce domain aggregator
│   │   │
│   │   ├── catalog/                 # Catalog subdomain
│   │   │   ├── products/            # Products module
│   │   │   ├── categories/          # Categories module
│   │   │   ├── reviews/             # Reviews module
│   │   │   └── catalog.module.ts
│   │   │
│   │   ├── sales/                   # Sales subdomain
│   │   │   ├── cart/                # Shopping cart
│   │   │   ├── coupons/             # Discount coupons
│   │   │   ├── orders/              # Order management
│   │   │   ├── payments/            # Payment processing
│   │   │   └── sales.module.ts
│   │   │
│   │   ├── returns/                 # Returns module
│   │   │
│   │   └── commerce.module.ts       # Aggregator module
│   │
│   ├── messaging/                   # Messaging infrastructure
│   │   ├── queue/                   # BullMQ queue module
│   │   │   ├── producers/           # Job producers
│   │   │   ├── consumers/           # Job consumers
│   │   │   └── queue.module.ts
│   │   │
│   │   ├── mail/                    # Email service
│   │   │   ├── templates/           # Handlebars templates
│   │   │   ├── mail.service.ts
│   │   │   └── mail.module.ts
│   │   │
│   │   └── messaging.module.ts      # Aggregator module
│   │
│   └── admin/                       # Admin dashboard module
│       ├── admin.controller.ts
│       ├── admin.service.ts
│       └── admin.module.ts
│
├── app.module.ts                    # Root application module
└── main.ts                          # Application entry point
```

### Layered Architecture

The application follows a clean layered architecture:

**1. Presentation Layer (Controllers)**
- Handle HTTP requests and responses
- Input validation via DTOs
- Route definitions with decorators
- Swagger documentation

**2. Application Layer (Services)**
- Business logic implementation
- Transaction orchestration
- External service integration
- Domain rules enforcement

**3. Domain Layer (Entities/Schemas)**
- Mongoose schemas and models
- Domain entities and value objects
- Database validation rules

**4. Infrastructure Layer**
- Database connections
- Email queue system
- External API clients (Paymob)
- Redis configuration

### Key Architectural Patterns

**Aggregator Module Pattern**
- Top-level modules (Identity, Commerce, Messaging) aggregate related sub-modules
- Provides clear domain boundaries
- Simplifies dependency management

**Repository Pattern**
- Mongoose models act as repositories
- Data access abstraction
- Centralized query logic

**Service Layer Pattern**
- Business logic isolated in services
- Reusable across controllers
- Easier to test and maintain

**DTO Pattern**
- Input validation with class-validator
- Type safety with TypeScript
- Automatic transformation with class-transformer

**Dependency Injection**
- NestJS built-in DI container
- Loose coupling between components
- Easy mocking for tests

## Tech Stack

### Core Technologies

- **Framework**: NestJS 11.x - Progressive Node.js framework
- **Language**: TypeScript 5.x - Type-safe JavaScript
- **Runtime**: Node.js 18+ - JavaScript runtime
- **Database**: MongoDB 6+ - NoSQL document database
- **ODM**: Mongoose 8.x - MongoDB object modeling

### Authentication & Security

- **JWT**: @nestjs/jwt - JSON Web Token implementation
- **Passport**: Passport.js - Authentication middleware
  - passport-jwt - JWT strategy
  - passport-local - Local username/password strategy
  - passport-google-oauth20 - Google OAuth 2.0
- **Hashing**: bcryptjs - Password hashing
- **Security**: Helmet - HTTP headers security
- **CORS**: Built-in CORS support

### Queue & Background Jobs

- **Queue**: BullMQ 5.x - Redis-based job queue
- **Redis Client**: ioredis - Redis client for Node.js
- **Integration**: @nestjs/bullmq - NestJS BullMQ integration

### Email & Notifications

- **Email Client**: Nodemailer - Email sending
- **Templates**: Handlebars - Email templating engine
- **Queue Integration**: BullMQ for async email processing

### API & Documentation

- **API Docs**: @nestjs/swagger - OpenAPI/Swagger integration
- **Validation**: class-validator - DTO validation decorators
- **Transformation**: class-transformer - Object transformation
- **Rate Limiting**: @nestjs/throttler - Request rate limiting

### Payment Processing

- **Gateway**: Paymob - Payment gateway integration
- **HTTP Client**: @nestjs/axios - HTTP requests to Paymob API

### Development Tools

- **Linting**: ESLint - Code quality and style
- **Formatting**: Prettier - Code formatter
- **Build**: TypeScript Compiler - Build tool

### DevOps

- **Containerization**: Docker support with Dockerfile
- **Orchestration**: Docker Compose for local development
- **Environment**: dotenv - Environment variable management

## 📊 Module Hierarchy

Tarkeba uses an **aggregator module pattern** to organize features into logical domain boundaries. This creates a clean, scalable architecture where related modules are grouped together.

### Module Structure

```
AppModule (Root)
│
├── MessagingModule
│   ├── QueueModule
│   └── MailModule
│
├── IdentityModule
│   ├── AuthModule
│   └── UsersModule
│
├── CommerceModule
│   │
│   ├── CatalogModule
│   │   ├── ProductsModule
│   │   ├── CategoriesModule
│   │   └── ReviewsModule
│   │
│   ├── SalesModule
│   │   ├── CartModule
│   │   ├── CouponsModule
│   │   ├── OrdersModule
│   │   └── PaymentsModule
│   │
│   └── ReturnsModule
│
└── AdminModule
```

### Module Responsibilities

| Module | Responsibility | Key Features |
|--------|---------------|--------------|
| **MessagingModule** | Asynchronous communication infrastructure | Email queue, background jobs, notifications |
| **IdentityModule** | User identity and access management | Authentication, authorization, profiles |
| **CommerceModule** | Core e-commerce business logic | Products, orders, payments, returns |
| **CatalogModule** | Product browsing and discovery | Products, categories, reviews |
| **SalesModule** | Purchase and transaction flow | Cart, checkout, orders, payments |
| **AdminModule** | Administrative operations | Analytics, user management, reports |

### Benefits of This Architecture

1. **Clear Separation of Concerns**: Each module has a single, well-defined purpose
2. **Scalability**: Easy to add new features within existing domain modules
3. **Maintainability**: Related code is grouped together
4. **Testability**: Modules can be tested independently
5. **Clean Dependencies**: Clear hierarchy prevents circular dependencies
6. **Readable AppModule**: Only 5 top-level imports instead of 14+

##  Installation

### Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x
- npm or yarn

### Steps

1. **Clone the repository:**
```bash
git clone <repository-url>
cd tarkeba-ecommerce-project
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

4. **Configure your `.env` file** (see Environment Variables section below)

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

The API will be available at `http://localhost:3000`

## API Documentation

### Swagger Documentation

Once the application is running, access the interactive API documentation:

**URL:** `http://localhost:3000/api/docs`

### Main API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-otp` - Verify email with OTP
- `POST /api/auth/resend-verification-otp` - Resend OTP
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password-otp` - Reset password with OTP
- `GET /api/auth/google` - Google OAuth

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/orders` - Get order history

#### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (Admin)
- `PATCH /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/tree` - Get category tree
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin)
- `PATCH /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

#### Orders
- `GET /api/orders` - Get user orders with filters
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/:id/items` - Get order items
- `POST /api/orders` - Create order
- `POST /api/orders/checkout` - Checkout with payment method selection
  - Returns order and payment instructions
  - For wallet: includes nextStep with payment endpoint details
  - For COD: immediate order completion
- `PUT /api/orders/:id` - Update order status (Admin)

#### Coupons
- `GET /api/coupons` - Get all coupons (Admin)
- `POST /api/coupons` - Create coupon (Admin)
- `POST /api/coupons/apply` - Apply coupon to cart
- `PATCH /api/coupons/:id` - Update coupon (Admin)
- `DELETE /api/coupons/:id` - Delete coupon (Admin)

#### Payments
- `GET /api/payments/methods` - Get available payment methods
- `POST /api/payments` - Create payment (initiates wallet payment or records COD)
- `GET /api/payments` - Get all payments (Admin)
- `GET /api/payments/my-payments` - Get user's payments
- `GET /api/payments/stats` - Get payment statistics (Admin)
- `GET /api/payments/order/:orderId` - Get payments for specific order
- `GET /api/payments/:id` - Get payment by ID
- `PATCH /api/payments/:id` - Update payment (Admin)
- `POST /api/payments/:id/refund` - Refund payment (Admin)
- `POST /api/payments/webhook/paymob` - Paymob webhook handler

#### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard analytics
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/analytics/sales` - Get sales analytics
- `GET /api/admin/analytics/top-products` - Get top products
- `GET /api/admin/analytics/user-growth` - Get user growth
- `GET /api/admin/analytics/order-status` - Get order status breakdown

#### Reviews
- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review
- `PATCH /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `PATCH /api/reviews/:id/moderate` - Moderate review (Admin)

#### Returns
- `GET /api/returns` - Get returns
- `POST /api/returns` - Create return request
- `PATCH /api/returns/:id` - Update return status (Admin)

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
1. Set `NODE_ENV=production` in your environment
2. Configure production database URL
3. Set secure JWT secrets
4. Configure production SMTP settings
5. Set up production OAuth credentials

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

### Recommended Services
- **Database:** MongoDB Atlas
- **Email:** SendGrid, AWS SES, or Gmail
- **Hosting:** AWS, GCP, Azure, or Heroku
- **Payment:** Paymob (configured)
- **Image Storage:** Cloudinary
- **Cache/Queue:** Redis (for BullMQ)

## 🛒 Checkout Flow

### Payment Methods

Retrieve available payment methods:
```bash
GET /api/payments/methods
```

Response:
```json
[
  {
    "value": "wallet",
    "label": "Wallet",
    "provider": "paymob"
  },
  {
    "value": "cash_on_delivery",
    "label": "Cash on delivery",
    "provider": "internal"
  }
]
```

### Cash on Delivery Flow

1. **Checkout Request**:
```bash
POST /api/orders/checkout
```
```json
{
  "cartItems": [...],
  "shippingAddress": {...},
  "paymentMethod": "cash_on_delivery"
}
```

2. **Immediate Response**:
```json
{
  "success": true,
  "order": {...},
  "paymentRequired": false,
  "paymentMethod": "cash_on_delivery",
  "message": "Order placed successfully. Payment will be collected on delivery."
}
```

**What Happens:**
- ✅ Order created
- ✅ Stock reduced immediately
- ✅ Order status: PENDING
- ✅ Payment status: PENDING
- ✅ Email confirmation sent

### Wallet Payment Flow

1. **Checkout Request**:
```bash
POST /api/orders/checkout
```
```json
{
  "cartItems": [...],
  "shippingAddress": {...},
  "paymentMethod": "wallet",
  "walletMsisdn": "01234567890"
}
```

2. **Response with Payment Instructions**:
```json
{
  "success": true,
  "order": {...},
  "paymentRequired": true,
  "paymentMethod": "wallet",
  "message": "Order created. Please complete payment to confirm your order.",
  "nextStep": {
    "action": "createPayment",
    "endpoint": "/api/payments",
    "method": "POST",
    "payload": {
      "orderID": "...",
      "amount": 299.99,
      "currency": "EGP",
      "paymentMethod": "wallet",
      "walletMsisdn": "01234567890"
    }
  }
}
```

**At this point:**
- ✅ Order created
- ⏳ Stock NOT reduced yet (reserved)
- ✅ Order status: PENDING
- ⏳ Payment status: PENDING

3. **Initiate Payment**:
```bash
POST /api/payments
```
```json
{
  "orderID": "...",
  "amount": 299.99,
  "currency": "EGP",
  "paymentMethod": "wallet",
  "walletMsisdn": "01234567890"
}
```

4. **Payment Response**:
```json
{
  "paymentId": "...",
  "paymobOrderId": "...",
  "paymentKey": "...",
  "redirectUrl": "https://accept.paymob.com/...",
  "expiresAt": "2026-01-19T03:00:00.000Z"
}
```

5. **Redirect User**: Frontend redirects user to `redirectUrl` to complete payment

6. **Payment Webhook** (Paymob → Server):
```bash
POST /api/payments/webhook/paymob
```

**On Successful Payment:**
- ✅ Payment status: COMPLETED
- ✅ Stock reduced atomically
- ✅ Order payment status: PAID
- ✅ Email confirmation sent

**On Failed Payment:**
- ❌ Payment status: FAILED
- ❌ Stock remains unreserved
- ❌ Order payment status: FAILED
- 📧 Failure notification email

### Stock Management

**Cash on Delivery:**
- Stock is reduced immediately at checkout
- Order is confirmed right away

**Wallet Payment:**
- Stock is validated but NOT reduced at checkout
- Stock is reduced only after successful payment via webhook
- Uses MongoDB transactions for atomic operations
- Prevents overselling during payment processing

### Error Handling

**Stock Validation Errors:**
```json
{
  "statusCode": 400,
  "message": "Insufficient stock for items: [...]",
  "error": "Bad Request"
}
```

**Payment Errors:**
```json
{
  "statusCode": 400,
  "message": "Payment already exists for this order",
  "error": "Bad Request"
}
```

**Wallet Phone Required:**
```json
{
  "statusCode": 400,
  "message": "Wallet phone number (walletMsisdn) is required for wallet payments",
  "error": "Bad Request"
}
```

## Security Features

### Authentication Security

- **Password Hashing**: bcryptjs with 12 salt rounds
- **JWT Token Rotation**: Automatic refresh token rotation on every use
- **Token Reuse Detection**: Detects and revokes all sessions if token reuse is detected
- **JTI (JWT ID)**: Unique identifier for each token, hashed with SHA-256 before storage
- **HttpOnly Cookies**: Refresh tokens stored in secure, HttpOnly cookies
- **Token Expiry**: Short-lived access tokens (15 min), longer refresh tokens (7 days)
- **Session Tracking**: Device and IP tracking for each session
- **Automatic Revocation**: All tokens revoked on password change or security breach

### API Security

- **Helmet Middleware**: Sets secure HTTP headers
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Rate Limiting**: @nestjs/throttler prevents brute-force attacks
- **Input Validation**: class-validator ensures all input is validated
- **DTO Sanitization**: class-transformer prevents injection attacks
- **Global Exception Filter**: Prevents information leakage through errors

### Data Security

- **OTP Security**: 
  - 6-digit codes with 10-minute expiration
  - Single-use only (marked as used after verification)
  - Hashed before storage
- **Email Queue**: Isolated email processing prevents blocking
- **MongoDB Transactions**: ACID compliance for critical operations
- **Mongoose Schema Validation**: Database-level validation

### Payment Security

- **HMAC Signature Verification**: All Paymob webhooks verified
- **Idempotency Keys**: Prevents duplicate payment processing
- **Secure Credentials**: Payment keys stored in environment variables
- **Transaction Logging**: All payment activities are logged

### Additional Measures

- **Role-based Authorization**: Guards enforce access control
- **Environment Variables**: Sensitive data never hardcoded
- **Secure Cookie Settings**: 
  - `httpOnly: true` - No JavaScript access
  - `secure: true` - HTTPS only (production)
  - `sameSite: 'strict'` - CSRF protection
- **JWT Audience & Issuer Validation**: Prevents token misuse across services

## 📝 Code Quality

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```
