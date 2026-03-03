# 🎨 Imagify - AI Image Generation SaaS

A full-stack AI-powered image generation platform built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### **One Command Setup**
```bash
npm run setup
npm run dev
```

### **Or Use Platform Scripts**
- **Windows**: Double-click `start.bat` or run `npm run dev`
- **Mac/Linux**: Run `./start.sh` or `npm run dev`

That's it! Both frontend and backend will start automatically.

---

## 📋 Features

### ✨ **Core Features**
- 🤖 AI-powered image generation from text prompts
- 🎨 Multiple image formats (PNG, JPG, WebP)
- 📏 Various resolutions (720p, 1080p, 4K)
- ✏️ Built-in image editor with text overlay
- 📚 Image history and management
- 💳 Credit system with payment integration
- 🔐 User authentication and profiles

### 🛠️ **Technical Features**
- ⚡ Concurrent development servers
- 🔄 Hot reload for both frontend and backend
- 📱 Responsive design
- 🔒 Secure authentication
- 💾 MongoDB database
- 🎯 RESTful API

---

## 🏗️ Architecture

```
imagify/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── assets/        # Static assets
│   └── package.json
├── server/                 # Node.js Backend
│   ├── controllers/       # API controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middlewares/      # Express middlewares
│   └── package.json
├── package.json           # Root package.json
├── start.bat             # Windows startup script
├── start.sh              # Unix startup script
└── README.md
```

---

## 🛠️ Installation

### **Prerequisites**
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or cloud)

### **Automatic Setup**
```bash
# Clone the repository
git clone <repository-url>
cd imagify

# Run automatic setup
npm run setup
```

### **Manual Setup**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

---

## ⚙️ Environment Configuration

### **1. Root Directory (.env)**
```env
NODE_ENV=development
```

### **2. Server Directory (server/.env)**
```env
MONGODB_URI=your_mongodb_connection_string
CLIPDROP_API=your_clipdrop_api_key
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### **3. Client Directory (client/.env)**
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 🎯 Available Scripts

### **Development**
```bash
npm run dev              # Start both frontend and backend
npm run dev:windows      # Windows-specific development
npm run dev:unix         # Unix-specific development
npm run server           # Start only backend
npm run client           # Start only frontend
```

### **Production**
```bash
npm run build            # Build frontend for production
npm run start            # Start both servers in production
```

### **Setup & Maintenance**
```bash
npm run setup            # Complete project setup
npm run install-all      # Install all dependencies
npm run clean            # Clean all node_modules
npm run reset            # Clean and reinstall everything
```

---

## 🌐 Access Points

After running `npm run dev`:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api

---

## 🔧 Troubleshooting

### **Common Issues**

#### **Port Already in Use**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:4000 | xargs kill -9
```

#### **MongoDB Connection Issues**
1. Ensure MongoDB is running
2. Check your connection string
3. Verify network access

#### **API Key Issues**
1. Ensure all API keys are properly set
2. Check environment variable names
3. Verify API key permissions

#### **Dependency Issues**
```bash
# Clean and reinstall
npm run reset
```

---

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### **Heroku**
1. Create Heroku app
2. Set environment variables
3. Deploy using Git

### **Railway**
1. Connect repository
2. Set environment variables
3. Deploy automatically

### **Manual Deployment**
```bash
# Build for production
npm run build

# Start production servers
npm start
```

---

## 📱 Platform Support

### **Windows**
- Use `start.bat` or `npm run dev`
- PowerShell/Command Prompt compatible

### **Mac/Linux**
- Use `start.sh` or `npm run dev`
- Terminal compatible

### **Docker** (Coming Soon)
- Containerized deployment
- Easy scaling

---

## 🔄 Development Workflow

1. **Start development**: `npm run dev`
2. **Make changes** to frontend or backend
3. **Auto-reload**: Both servers restart automatically
4. **Test**: Visit http://localhost:5173
5. **Commit changes**: Git workflow

---

## 📊 API Endpoints

### **Authentication**
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/credits` - Get user credits

### **Image Generation**
- `POST /api/image/generate-image` - Generate image
- `POST /api/image/download-image` - Download image
- `GET /api/image/history` - Get image history
- `DELETE /api/image/history/:id` - Delete image

### **Profile Management**
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/change-password` - Change password
- `DELETE /api/user/account` - Delete account

### **Payments**
- `POST /api/user/pay-razor` - Razorpay payment
- `POST /api/user/pay-stripe` - Stripe payment

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

- **Documentation**: Check `START_PROJECT.md`
- **Issues**: Create GitHub issue
- **Email**: your-email@example.com

---

## 🎉 Success Indicators

When everything is working correctly:

✅ Frontend: React dev server on port 5173  
✅ Backend: Express server on port 4000  
✅ MongoDB: Connected successfully  
✅ Console: No error messages  

---

**Happy Coding! 🎨✨** 