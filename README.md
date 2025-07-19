# 🏋️ FitFlow - Gym Membership Management System

A comprehensive full-stack web application for managing gym memberships, member visits, and token-based tracking system. Built with React, Node.js, Express, and MongoDB.

## 🌟 Features

### 🔐 Authentication System

- JWT-based authentication with role-based access control
- Three user types: Members, Gyms, and Admins
- Secure password hashing with bcrypt
- Member registration flow with email validation

### 💰 Subscription & Token System

- **Weekly Pass**: 7 tokens - $29.99
- **Monthly Pass**: 30 tokens - $99.99 (Popular)
- **Yearly Pass**: 365 tokens - $999.99
- 1 token = unlimited visits to one gym per day
- Mock payment system with instant confirmation
- Automatic token balance updates

### 🏃‍♂️ Member Features

- Dashboard with token balance and subscription status
- Check-in to gyms using tokens or gym codes
- Visit history and statistics tracking
- Multiple subscription plan options
- Real-time progress tracking

### 🏢 Gym Dashboard

- Real-time visit tracking (daily, weekly, monthly, yearly)
- Member visit reports and analytics
- Export functionality (CSV/JSON)
- Today's visitor list with member details
- Gym profile and facility management

### 👤 Admin Panel

- Complete CRUD operations for gyms and members
- Auto-generate gym login credentials
- Mock email system for credential delivery
- Global analytics and reporting
- User management (activate/deactivate)
- Platform-wide statistics

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **React Router** for navigation
- **React Hook Form** with Zod validation

### Backend

- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email functionality
- **Express Rate Limiting** for security

### Database

- **MongoDB** with comprehensive schemas
- **Mongoose** for object modeling
- Indexed collections for optimal performance
- Data validation and relationships

## 🚀 Complete Setup Guide

### Prerequisites

Before starting, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- A **MongoDB Atlas** account (free) - [Sign up here](https://www.mongodb.com/atlas)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd fit-flow-token-tracker
```

### Step 2: Set Up MongoDB Atlas Database

#### 2.1 Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project (name it "FitFlow" or similar)

#### 2.2 Create a Database Cluster

1. Click "Build a Database"
2. Choose "M0 Sandbox" (FREE tier)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "FitFlowCluster")
5. Click "Create Cluster" (this takes 3-5 minutes)

#### 2.3 Create Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username (e.g., "fitflow-user")
5. Generate a secure password (save this!)
6. Set role to "Atlas Admin"
7. Click "Add User"

#### 2.4 Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For production, restrict to specific IPs
4. Click "Confirm"

#### 2.5 Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string (looks like):
   ```
   mongodb+srv://fitflow-user:<password>@fitflowcluster.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=FitFlowCluster
   ```
6. Replace `<password>` with your actual password
7. Add the database name at the end: `/gym_management`

**Final connection string example:**

```
mongodb+srv://fitflow-user:yourpassword123@fitflowcluster.xxxxx.mongodb.net/gym_management?retryWrites=true&w=majority&appName=FitFlowCluster
```

### Step 3: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 4: Configure Environment Variables

#### 4.1 Copy Environment Template

```bash
cp backend/.env.example.txt backend/.env
```

#### 4.2 Generate JWT Secret

```bash
# Generate a secure JWT secret
openssl rand -base64 64
```

#### 4.3 Edit Environment File

Open `backend/.env` in your text editor and update:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://fitflow-user:yourpassword123@fitflowcluster.xxxxx.mongodb.net/gym_management?retryWrites=true&w=majority&appName=FitFlowCluster

# JWT Configuration
JWT_SECRET=your_generated_jwt_secret_from_step_4.2
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5001
NODE_ENV=development

# Email Configuration (Mock for development)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Admin Configuration
ADMIN_EMAIL=admin@fitflow.com
ADMIN_PASSWORD=admin123456

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important Notes:**

- Replace `MONGODB_URI` with your actual MongoDB Atlas connection string
- Replace `JWT_SECRET` with the generated secret from step 4.2
- Email settings are optional for development (uses mock emails)

### Step 5: Seed Database with Sample Data

```bash
# Run database seeding script
npm run setup:seed
```

This will create:

- 1 Admin user
- 10 Sample gyms with facilities
- 25 Sample members
- 100+ Sample visits and transactions
- Various subscription data

### Step 6: Start the Application

```bash
# Start both frontend and backend servers
npm run start:dev
```

This command will:

- Start the backend server on `http://localhost:5001`
- Start the frontend server on `http://localhost:5173`
- Open your browser automatically

### Step 7: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

## 👥 Default Login Credentials

### Admin Dashboard

- **Email**: admin@fitflow.com
- **Password**: admin123456
- **Features**: Manage all gyms and members, view global reports

### Sample Gym Accounts

- **FitZone Downtown**: fitzone@example.com / temp123456
- **PowerHouse Gym**: powerhouse@example.com / temp123456
- **Elite Fitness**: elite@example.com / temp123456
- **Strength Studio**: strength@example.com / temp123456
- **Flex Gym**: flex@example.com / temp123456

### Sample Member Accounts

- **Alex Johnson**: alex@example.com / member123456
- **Sarah Wilson**: sarah@example.com / member123456
- **Mike Chen**: mike@example.com / member123456
- **Emma Davis**: emma@example.com / member123456
- **Tom Brown**: tom@example.com / member123456

## 🎯 Quick Testing Guide

### Test Member Registration & Purchase Flow

1. Go to http://localhost:5173
2. Click "Register as Member"
3. Complete the 3-step registration
4. Login with your new account
5. Go to "Subscription" tab
6. Select and purchase a subscription plan
7. Go to "Check In" tab and use gym code: `GYM001`

### Test Admin Features

1. Login as admin (admin@fitflow.com / admin123456)
2. View dashboard statistics
3. Add a new gym from the admin panel
4. View member and gym management sections

### Test Gym Features

1. Login as gym (fitzone@example.com / temp123456)
2. View gym dashboard and today's visits
3. Check visit reports and analytics

## 📋 Available Scripts

### Development

```bash
npm run start:dev     # Start both frontend and backend
npm run setup:seed    # Seed database with sample data
npm run dev          # Frontend only
npm run backend:dev  # Backend only
```

### Production

```bash
npm run build        # Build frontend for production
npm run backend:build # Build backend for production
npm run backend:start # Start production backend server
```

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error**: `MongooseServerSelectionError`

```bash
# Solutions:
1. Check your MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
2. Verify username/password in connection string
3. Ensure database user has proper permissions
4. Add `tls: true` if needed
```

**Error**: `Invalid connection string`

```bash
# Check:
1. Connection string format is correct
2. Password doesn't contain special characters (URL encode if needed)
3. Database name is included at the end
```

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5001`

```bash
# Kill processes using the ports
lsof -ti:5001 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Or change PORT in backend/.env
```

### Dependencies Issues

```bash
# Clear everything and reinstall
rm -rf node_modules backend/node_modules
rm package-lock.json backend/package-lock.json
npm install
cd backend && npm install && cd ..
```

### Frontend Build Issues

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Database Seeding Issues

```bash
# If seeding fails, try:
1. Ensure MongoDB connection is working
2. Drop existing data: use MongoDB Atlas UI to delete collections
3. Re-run: npm run setup:seed
```

## 📊 API Endpoints

### Authentication

```
POST /api/auth/login              # User login
POST /api/auth/register-member    # Member registration
GET  /api/auth/profile           # Get user profile
```

### Member Routes

```
GET  /api/member/dashboard            # Member dashboard data
GET  /api/member/subscription-plans   # Available plans
POST /api/member/purchase-subscription # Purchase subscription
POST /api/member/check-in            # Check into gym
GET  /api/member/visit-history       # Visit history
```

### Gym Routes

```
GET /api/gym/dashboard     # Gym dashboard
GET /api/gym/reports       # Visit reports
GET /api/gym/today-visits  # Today's visitors
```

### Admin Routes

```
GET  /api/admin/dashboard           # Admin dashboard
GET  /api/admin/members            # All members
GET  /api/admin/gyms               # All gyms
POST /api/admin/gyms               # Create gym
PUT  /api/admin/members/:id        # Update member
PUT  /api/admin/gyms/:id           # Update gym
PATCH /api/admin/users/:id/deactivate # Deactivate user
GET  /api/admin/reports            # Global reports
```

## 🗄️ Database Schema

### Collections Created

- **users**: Base collection for all user types (with discriminator)
- **visits**: Gym visit records
- **transactions**: Subscription purchase records

### Key Features

- **Discriminator Pattern**: Single users collection with role-specific fields
- **Indexed Collections**: Optimized for fast queries
- **Data Validation**: Mongoose schemas with validation rules
- **Relationships**: Proper references between collections

## 🚀 Deployment

### Environment Variables for Production

```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_production_jwt_secret
NODE_ENV=production
FRONTEND_URL=your_production_frontend_url
EMAIL_HOST=your_production_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_production_email
EMAIL_PASS=your_production_email_password
```

### Frontend Deployment (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist/` folder
3. Set environment variables in your hosting provider

### Backend Deployment (Railway/Render/Heroku)

1. Build the backend: `cd backend && npm run build`
2. Deploy with proper environment variables
3. Ensure MongoDB Atlas allows connections from your hosting provider
#   S m a r t - g y m  
 