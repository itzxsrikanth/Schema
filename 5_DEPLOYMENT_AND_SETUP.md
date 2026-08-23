# AI for Farmers - Deployment & Complete Setup Guide

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. Required Accounts & API Keys

- [ ] **Firebase Account** (https://firebase.google.com)
  - [ ] Create Firestore database
  - [ ] Enable Authentication
  - [ ] Create service account key
  - [ ] Note project ID and credentials

- [ ] **OpenWeatherMap** (https://openweathermap.org/api)
  - [ ] Free tier account
  - [ ] Generate API key
  - [ ] Note key

- [ ] **Claude API (Anthropic)** (https://console.anthropic.com)
  - [ ] Request hackathon credits
  - [ ] Generate API key
  - [ ] Note key

- [ ] **Deployment Platforms**
  - [ ] Render.com account (Backend)
  - [ ] Vercel account (Frontend)
  - [ ] GitHub account with repo created

- [ ] **Domain (Optional)**
  - [ ] Domain name registered
  - [ ] DNS configured

---

## 🚀 LOCAL DEVELOPMENT SETUP

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/farmers-ai.git
cd farmers-ai
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your editor
```

**Fill in backend/.env:**
```
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-email@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# External APIs
OPENWEATHER_API_KEY=your-openweather-key
CLAUDE_API_KEY=your-claude-api-key

# Server
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-key-min-32-characters
FRONTEND_URL=http://localhost:3000
```

**Test backend:**
```bash
npm run dev

# Should show:
# ✅ Server running on port 5000
# 🌍 Firebase initialized: your-project-id

# In another terminal:
curl http://localhost:5000/health
# Should return: {"status":"OK",...}
```

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit with your credentials
nano .env.local
```

**Fill in frontend/.env.local:**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

**Get Firebase credentials from:**
1. Firebase Console → Project Settings
2. Copy Web API credentials

**Test frontend:**
```bash
npm start

# Should open http://localhost:3000 in browser
```

### Step 4: Test the Application

**Test Flow:**
1. Navigate to http://localhost:3000
2. Click "Sign Up"
3. Create account with test email
4. Fill farmer profile
5. Test crop recommendation feature
6. Test disease detection (use sample image)
7. Check weather widget
8. View advisory

---

## 🌐 DEPLOYMENT GUIDE

### BACKEND DEPLOYMENT (Render.com)

#### Step 1: Prepare Repository

```bash
# Make sure all code is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize GitHub access

#### Step 3: Create Backend Service

```
1. Dashboard → New → Web Service
2. Connect GitHub repo
3. Enter service name: farmers-ai-backend
4. Environment: Node
5. Build Command: npm install
6. Start Command: npm start
```

#### Step 4: Add Environment Variables

In Render dashboard:
```
Environment: Production

FIREBASE_PROJECT_ID = your-project-id
FIREBASE_PRIVATE_KEY = (paste from Firebase)
FIREBASE_CLIENT_EMAIL = your-email
FIREBASE_DATABASE_URL = your-database-url
OPENWEATHER_API_KEY = your-key
CLAUDE_API_KEY = your-key
NODE_ENV = production
JWT_SECRET = generate-long-random-string
FRONTEND_URL = https://your-frontend-domain.vercel.app
```

#### Step 5: Deploy

- Click "Create Web Service"
- Wait for deployment (2-3 minutes)
- Note the URL: `https://farmers-ai-backend-xxx.onrender.com`

**Verify:**
```bash
curl https://farmers-ai-backend-xxx.onrender.com/health
```

---

### FRONTEND DEPLOYMENT (Vercel)

#### Step 1: Connect GitHub

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository

#### Step 2: Configure Project

```
Project name: farmers-ai-frontend
Framework: Create React App
Root directory: ./frontend
```

#### Step 3: Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
REACT_APP_API_URL = https://farmers-ai-backend-xxx.onrender.com/api
REACT_APP_FIREBASE_API_KEY = your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID = your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = your-sender-id
REACT_APP_FIREBASE_APP_ID = your-app-id
```

#### Step 4: Deploy

- Click "Deploy"
- Wait for deployment (3-5 minutes)
- Note the URL: `https://farmers-ai-frontend-xxx.vercel.app`

**Verify:**
```
Open in browser: https://farmers-ai-frontend-xxx.vercel.app
Should load login page
```

---

## 🔧 POST-DEPLOYMENT CONFIGURATION

### Update Firebase Settings

1. Firebase Console → Authentication → Settings
2. Add authorized domains:
   - `your-frontend-domain.vercel.app`
   - `localhost:3000` (for testing)

### Update CORS in Backend

```bash
# SSH into Render backend
# Edit backend/middleware/cors.js
```

```javascript
const corsMiddleware = cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://farmers-ai-frontend-xxx.vercel.app',
      'https://yourdomain.com',
      'http://localhost:3000'  // for local testing
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
```

### Verify Deployment

```bash
# Test all endpoints from production

# 1. Health check
curl https://farmers-ai-backend-xxx.onrender.com/health

# 2. Signup via frontend
Open https://farmers-ai-frontend-xxx.vercel.app
Complete signup flow

# 3. Check Firestore
Firebase Console → Firestore → Should see data
```

---

## 🐛 TROUBLESHOOTING

### Issue: CORS Errors

**Symptom:** `Access to XMLHttpRequest from origin 'xxx' blocked by CORS`

**Solution:**
1. Check `allowedOrigins` in backend/middleware/cors.js
2. Ensure frontend URL is listed
3. Redeploy backend after changes

```bash
# In backend/middleware/cors.js
const allowedOrigins = [
  'https://your-vercel-domain.vercel.app',  // Must match exactly!
  'http://localhost:3000'
];
```

---

### Issue: Firebase Authentication Failed

**Symptom:** `Firebase initialization error`

**Solution:**
1. Check Firebase credentials in `.env`
2. Verify service account has proper permissions
3. Check Firebase console → IAM → Role is "Editor"

```bash
# Check if credentials are valid
echo $FIREBASE_PROJECT_ID
echo $FIREBASE_CLIENT_EMAIL
```

---

### Issue: API Calls Timing Out

**Symptom:** `Network timeout` or `504 Bad Gateway`

**Solution:**
1. Check Render backend is running: `curl https://your-backend/health`
2. Check database connection: Firebase Console → Firestore
3. Increase timeout in frontend/src/services/api.js:

```javascript
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,  // Increase from 10000 to 30000
  headers: {
    'Content-Type': 'application/json'
  }
});
```

---

### Issue: Images Not Uploading (Disease Detection)

**Symptom:** Upload fails with error

**Solution:**
1. Check image file size < 5MB
2. Check image format is JPG/PNG
3. Verify backend multipart handler works:

```bash
# Test file upload
curl -X POST https://your-backend/api/disease/detect \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

---

## 📊 MONITORING & MAINTENANCE

### Render Backend Logs

```
1. Render Dashboard → farmers-ai-backend
2. Click "Logs" tab
3. Monitor for errors in real-time
```

### Vercel Frontend Analytics

```
1. Vercel Dashboard → farmers-ai-frontend
2. Click "Analytics"
3. Monitor page load times, errors
```

### Firebase Metrics

```
1. Firebase Console → Firestore
2. Check database reads/writes
3. Monitor storage usage
```

### Set Up Alerts

**Render:**
```
1. Settings → Alerts
2. Create alerts for:
   - Deploy failures
   - Memory usage > 80%
   - CPU usage > 80%
   - Errors > 10 per minute
```

---

## 🔐 SECURITY CHECKLIST

Before going live:

- [ ] All API keys in environment variables only
- [ ] Never commit `.env` files
- [ ] HTTPS enabled on all endpoints
- [ ] Firebase security rules configured
- [ ] Rate limiting enabled
- [ ] CORS properly restricted
- [ ] JWT secrets are strong (32+ characters)
- [ ] Image upload validation enabled
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive info
- [ ] Database backups configured
- [ ] Monitoring and logging enabled

---

## 📈 PERFORMANCE OPTIMIZATION

### Frontend Optimization

```javascript
// frontend/package.json - Add build analyzer
"scripts": {
  "build": "react-scripts build",
  "analyze": "source-map-explorer 'build/static/js/*.js'"
}
```

Run: `npm run analyze` to find large bundles

### Backend Optimization

```javascript
// backend/utils/cache.js - Enable caching
const cache = require('./utils/cache');

// Cache crop recommendations for 1 hour
const cachedRecommendations = cache.get(`crops_${location}`);
if (cachedRecommendations) {
  return cachedRecommendations;
}

// ... generate recommendations ...
cache.set(`crops_${location}`, recommendations, 3600000);
```

---

## 📱 MOBILE TESTING

### Test on Mobile Devices

```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
hostname -I            # Linux
ipconfig                # Windows

# On mobile device, navigate to:
http://<YOUR_IP>:3000
```

### Progressive Web App (PWA)

Add PWA support:

```javascript
// frontend/public/manifest.json
{
  "name": "AI for Farmers",
  "short_name": "Kisan AI",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#28a745",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 🚦 CONTINUOUS DEPLOYMENT

### GitHub Actions (Auto-Deploy on Push)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
      
      - name: Notify Render
        run: |
          curl -X POST \
            https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }} \
            -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}"
```

---

## ✅ FINAL CHECKLIST BEFORE DEMO

- [ ] Backend running and accessible
- [ ] Frontend loads without errors
- [ ] Can complete signup/login
- [ ] Can view dashboard after login
- [ ] Crop recommendation works
- [ ] Disease detection with sample image works
- [ ] Advisory generates successfully
- [ ] Schemes matcher shows results
- [ ] Weather widget displays correctly
- [ ] All features work on mobile
- [ ] Error handling works (test with bad data)
- [ ] Performance is acceptable (< 2s load time)
- [ ] No console errors
- [ ] Responsive design verified
- [ ] Multilingual support working (switch to Hindi)

---

## 🎉 YOU'RE READY FOR DEMO DAY!

All systems are deployed and tested. Your AI for Farmers application is live and production-ready!

**Key URLs for Judges:**
- Frontend: `https://farmers-ai-frontend-xxx.vercel.app`
- Backend API: `https://farmers-ai-backend-xxx.onrender.com/api`
- API Docs: `https://farmers-ai-backend-xxx.onrender.com/api/docs`

**Demo Flow:**
1. Show signup/login
2. Fill farmer profile
3. Get crop recommendations
4. Upload disease image
5. View advisory
6. Check eligible schemes
7. Show weather integration
8. Demonstrate multilingual support
9. Show mobile responsiveness

---

**Happy coding and best of luck with your hackathon! 🚀🌾**
