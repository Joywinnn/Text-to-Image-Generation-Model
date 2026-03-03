# 🚀 Start Project Guide

## Quick Start (Recommended)

### 1. **One Command Setup**
```bash
npm run setup
```

### 2. **Start Both Servers**
```bash
npm run dev
```

That's it! Both frontend and backend will start automatically.

---

## 📋 Detailed Setup

### **Prerequisites**
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or cloud)

### **Environment Setup**

#### 1. **Root Directory (.env)**
Create `.env` in the root directory:
```env
NODE_ENV=development
```

#### 2. **Server Directory (server/.env)**
Create `server/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
CLIPDROP_API=your_clipdrop_api_key
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

#### 3. **Client Directory (client/.env)**
Create `client/.env`:
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### **Installation Steps**

#### **Option 1: Automatic Setup**
```bash
npm run setup
```

#### **Option 2: Manual Setup**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

---

## 🎯 Available Scripts

### **Development**
```bash
npm run dev          # Start both frontend and backend in development mode
npm run server       # Start only backend server
npm run client       # Start only frontend client
```

### **Production**
```bash
npm run build        # Build frontend for production
npm run start        # Start both servers in production mode
```

### **Setup & Maintenance**
```bash
npm run setup        # Complete project setup
npm run install-all  # Install all dependencies
```

---

## 🌐 Access Points

After running `npm run dev`:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api

---

## 🔧 Troubleshooting

### **Port Already in Use**
If you get "port already in use" errors:

1. **Kill existing processes:**
   ```bash
   # Windows
   netstat -ano | findstr :4000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:4000 | xargs kill -9
   ```

2. **Or change ports in .env files**

### **MongoDB Connection Issues**
1. Ensure MongoDB is running
2. Check your connection string
3. Verify network access

### **API Key Issues**
1. Ensure all API keys are properly set
2. Check environment variable names
3. Verify API key permissions

---

## 🚀 Deployment Ready

This setup is deployment-ready for:
- **Vercel** (Frontend + Backend)
- **Netlify** (Frontend) + **Railway** (Backend)
- **Heroku** (Full Stack)
- **DigitalOcean** (Full Stack)

### **For Deployment:**
1. Use `npm run build` to build frontend
2. Use `npm start` for production mode
3. Set environment variables in your hosting platform

---

## 📱 Platform-Specific Scripts

### **Windows (PowerShell)**
```powershell
# Start both servers
npm run dev

# Or use the Windows-specific script
npm run dev:windows
```

### **Mac/Linux**
```bash
# Start both servers
npm run dev

# Or use the Unix-specific script
npm run dev:unix
```

---

## 🎉 Success Indicators

When everything is working correctly, you should see:

1. **Frontend**: React dev server running on port 5173
2. **Backend**: Express server running on port 4000
3. **MongoDB**: Connected successfully
4. **Console**: No error messages

---

## 🔄 Development Workflow

1. **Start development**: `npm run dev`
2. **Make changes** to frontend or backend
3. **Auto-reload**: Both servers will restart automatically
4. **Test**: Visit http://localhost:5173

---

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Check network connectivity

---

**Happy Coding! 🎨✨** 