# 🚀 Imagify SaaS App - Server Setup Guide

## 📋 Prerequisites

Before running the app, make sure you have installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **Git** (for cloning the repository)

## 🛠️ Installation Steps

### 1. Clone and Setup Project

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd imagify

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

#### Server Environment (.env)
Create `server/.env` file:

```bash
cd server
cp env.example .env
```

Edit `server/.env` with your actual values:

```env
# Server Configuration
PORT=4000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/imagify

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Clipdrop API Key (get from https://clipdrop.co/apis)
CLIPDROP_API=your_clipdrop_api_key_here

# Payment Gateway Keys (optional for testing)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_SECRET_KEY=your_stripe_secret_key

# Currency
CURRENCY=INR
```

#### Client Environment (.env)
Create `client/.env` file:

```bash
cd client
cp env.example .env
```

Edit `client/.env`:

```env
# Backend URL
VITE_BACKEND_URL=http://localhost:4000

# Payment Gateway Keys (optional for testing)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB service
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `MONGODB_URI` in server/.env with your Atlas connection string

### 4. API Keys Setup

#### Clipdrop API Key
1. Visit [Clipdrop APIs](https://clipdrop.co/apis)
2. Sign up for a free account
3. Get your API key
4. Add it to `server/.env` as `CLIPDROP_API`

#### Payment Gateway Keys (Optional)
- **Razorpay**: Get from [Razorpay Dashboard](https://dashboard.razorpay.com/)
- **Stripe**: Get from [Stripe Dashboard](https://dashboard.stripe.com/)

## 🚀 Running the Application

### Development Mode

#### Terminal 1 - Start Server
```bash
cd server
npm run server
```

#### Terminal 2 - Start Client
```bash
cd client
npm run dev
```

### Production Mode

#### Build Client
```bash
cd client
npm run build
```

#### Start Server (Production)
```bash
cd server
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173 (development) or http://localhost:4000 (production)
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/

## 📱 Testing the Features

### 1. User Registration/Login
- Visit the app
- Click "Login" to register or sign in
- New users get 5 free credits

### 2. Image Generation
- Go to `/result` page
- Enter a prompt or use suggestions
- Select format and resolution
- Generate image

### 3. Image History
- Click "History" in navbar
- View all generated images
- Download in different formats

### 4. Prompt Templates
- Use curated suggestions
- Save custom templates
- Toggle favorites

### 5. Image Editor
- Generate an image
- Click "Edit Image"
- Use rotation, scaling, text overlay

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod
```

#### 2. Port Already in Use
```bash
# Check what's using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>
```

#### 3. Sharp Installation Issues
```bash
# Reinstall sharp
cd server
npm uninstall sharp
npm install sharp
```

#### 4. Environment Variables Not Loading
```bash
# Make sure .env files are in correct locations
ls -la server/.env
ls -la client/.env
```

### Logs and Debugging

#### Server Logs
```bash
cd server
npm run server
# Watch console for errors
```

#### Client Logs
```bash
cd client
npm run dev
# Check browser console for errors
```

## 🚀 Deployment Options

### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy server
cd server
vercel

# Deploy client
cd client
vercel
```

### 2. Heroku
```bash
# Install Heroku CLI
# Create Procfile in server directory
echo "web: node server.js" > server/Procfile

# Deploy
heroku create your-app-name
git push heroku main
```

### 3. DigitalOcean/AWS
- Use PM2 for process management
- Set up reverse proxy with Nginx
- Configure SSL certificates

## 📊 Monitoring

### Health Check Endpoints
- `GET /` - API health
- `GET /api/user/credits` - User credits (authenticated)

### Database Monitoring
```bash
# Connect to MongoDB
mongo
use imagify
db.users.find()
db.imagehistories.find()
db.prompttemplates.find()
```

## 🔒 Security Considerations

1. **JWT Secret**: Use a strong, random string
2. **API Keys**: Never commit to version control
3. **CORS**: Configure properly for production
4. **Rate Limiting**: Implement for API endpoints
5. **Input Validation**: Already implemented in controllers

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Check server and client logs
5. Verify API keys are valid

---

**Happy Coding! 🎉** 