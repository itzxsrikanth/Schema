# AI for Farmers - Complete Professional Project Structure

## 📁 Full Directory Layout

```
farmers-ai/
├── frontend/                          # React.js application
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── ErrorBoundary.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── SignupForm.jsx
│   │   │   │   └── FarmerProfileSetup.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── WeatherWidget.jsx
│   │   │   │   ├── AdvisoryCard.jsx
│   │   │   │   └── SchemesSummary.jsx
│   │   │   │
│   │   │   ├── features/
│   │   │   │   ├── CropRecommendation/
│   │   │   │   │   ├── CropForm.jsx
│   │   │   │   │   ├── CropResults.jsx
│   │   │   │   │   └── CropCard.jsx
│   │   │   │   │
│   │   │   │   ├── DiseaseDetection/
│   │   │   │   │   ├── ImageUpload.jsx
│   │   │   │   │   ├── DiseaseResult.jsx
│   │   │   │   │   └── TreatmentGuide.jsx
│   │   │   │   │
│   │   │   │   ├── Advisory/
│   │   │   │   │   ├── AdvisoryGenerator.jsx
│   │   │   │   │   ├── AdvisoryDisplay.jsx
│   │   │   │   │   └── AdvisoryHistory.jsx
│   │   │   │   │
│   │   │   │   └── SchemesMatcher/
│   │   │   │       ├── SchemesForm.jsx
│   │   │   │       ├── SchemesList.jsx
│   │   │   │       └── SchemeDetails.jsx
│   │   │   │
│   │   │   └── layout/
│   │   │       ├── MainLayout.jsx
│   │   │       └── AuthLayout.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                 # Axios configuration
│   │   │   ├── authService.js
│   │   │   ├── farmerService.js
│   │   │   ├── cropService.js
│   │   │   ├── weatherService.js
│   │   │   ├── diseaseService.js
│   │   │   ├── advisoryService.js
│   │   │   └── schemeService.js
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useFarmer.js
│   │   │   ├── useWeather.js
│   │   │   └── useForm.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── FarmerContext.jsx
│   │   │   └── AppContext.jsx
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   ├── translations.js           # Multilingual support
│   │   │   └── helpers.js
│   │   │
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── variables.css
│   │   │   ├── components.css
│   │   │   └── responsive.css
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── backend/                           # Node.js/Express API
│   ├── config/
│   │   ├── firebase.js
│   │   ├── database.js
│   │   ├── env.js
│   │   └── constants.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── farmerController.js
│   │   ├── cropController.js
│   │   ├── weatherController.js
│   │   ├── diseaseController.js
│   │   ├── advisoryController.js
│   │   └── schemeController.js
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.js
│   │   ├── farmer.js
│   │   ├── crop.js
│   │   ├── weather.js
│   │   ├── disease.js
│   │   ├── advisory.js
│   │   └── scheme.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── validation.js
│   │   ├── rateLimit.js
│   │   └── cors.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── farmerService.js
│   │   ├── cropService.js
│   │   ├── weatherService.js
│   │   ├── diseaseService.js
│   │   ├── advisoryService.js
│   │   ├── schemeService.js
│   │   └── mlService.js                # ML model integration
│   │
│   ├── models/
│   │   ├── farmer.model.js
│   │   ├── advisory.model.js
│   │   ├── scheme.model.js
│   │   └── disease.model.js
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   ├── validators.js
│   │   ├── responses.js
│   │   ├── cache.js
│   │   └── helpers.js
│   │
│   ├── ml_models/
│   │   ├── disease_detection.py
│   │   ├── crop_recommendation.py
│   │   └── requirements.txt
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── server.js
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── SETUP_GUIDE.md
│   ├── DEPLOYMENT.md
│   └── TROUBLESHOOTING.md
│
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml
│       └── deploy-backend.yml
│
├── docker-compose.yml                 # (Optional) For local development
├── README.md
├── LICENSE
└── .gitignore

```

---

## 📊 Technology Stack

### Frontend
- **Framework**: React 18+ with Hooks
- **Styling**: Bootstrap 5 + Custom CSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Forms**: React Hook Form + Validation
- **Maps**: React Leaflet
- **Multilingual**: i18next
- **Build**: Create React App / Vite

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Joi
- **ML Integration**: Python (Flask/FastAPI)
- **Deployment**: Render.com / Railway.app

### External APIs
- **Weather**: OpenWeatherMap
- **Market Data**: eNAM / Agmarknet
- **LLM**: Claude API (Anthropic)
- **Translation**: Google Translate API
- **Geocoding**: Nominatim / Google Maps

### Development Tools
- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Environment**: dotenv

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FARMER (End User)                       │
└────────────────────┬──────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
    ┌────────────┐          ┌─────────────┐
    │  React App │◄────────►│ Express API │
    │ (Frontend) │          │ (Backend)   │
    └────────────┘          └─────────────┘
        │                         │
        │                   ┌─────┴─────┬────────┬─────────┐
        │                   ▼           ▼        ▼         ▼
        │            ┌──────────┐  ┌────────┐ ┌───┐  ┌────────┐
        │            │Firebase  │  │Python  │ │LLM│  │External│
        │            │Firestore │  │ML Svc  │ │API│  │APIs    │
        │            └──────────┘  └────────┘ └───┘  └────────┘
        │
        ▼
    ┌─────────────┐
    │Cache Layer  │
    │(Fallback)   │
    └─────────────┘
```

---

## 🔐 Security Considerations

1. **Authentication**: Firebase Auth (JWT tokens)
2. **API Keys**: Environment variables only (never committed)
3. **Rate Limiting**: Prevent API abuse
4. **Input Validation**: All inputs validated server-side
5. **CORS**: Properly configured for frontend domain
6. **Error Handling**: Never expose sensitive info in error messages
7. **Image Upload**: Validate file type/size before processing
8. **Data Privacy**: User data encrypted in transit (HTTPS only)

---

## 📦 Dependencies Summary

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "react-bootstrap": "^2.9.0",
    "react-leaflet": "^4.2.0",
    "i18next": "^23.7.0",
    "react-hook-form": "^7.48.0",
    "firebase": "^10.7.0"
  },
  "devDependencies": {
    "eslint": "^8.54.0",
    "prettier": "^3.1.0"
  }
}
```

### Backend (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "firebase-admin": "^12.0.0",
    "axios": "^1.6.0",
    "joi": "^17.11.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.0",
    "morgan": "^1.10.0",
    "multer": "^1.4.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "eslint": "^8.54.0",
    "jest": "^29.7.0"
  }
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Firebase account (free tier)
- OpenWeatherMap API key (free)
- Claude API key (request hackathon credits)

### Quick Setup

```bash
# Clone repository
git clone https://github.com/yourusername/farmers-ai.git
cd farmers-ai

# Frontend setup
cd frontend
npm install
cp .env.example .env.local
# Add your API keys in .env.local

# Backend setup
cd ../backend
npm install
cp .env.example .env
# Add your API keys in .env

# Run both (from root directory)
npm run dev  # if you have concurrently installed
```

---

## 📝 Key Files Explained

| File | Purpose |
|------|---------|
| `frontend/src/App.jsx` | Main app component with routing |
| `backend/server.js` | Express server entry point |
| `backend/config/firebase.js` | Firebase initialization |
| `frontend/services/api.js` | Axios instance with interceptors |
| `backend/middleware/auth.js` | JWT verification middleware |
| `frontend/context/AuthContext.jsx` | Global auth state |
| `backend/services/advisoryService.js` | Claude API integration |
| `frontend/components/features/*` | Feature components (modular) |

---

## 🔗 Next Steps

1. **Review**: Backend API structure (see API_DOCUMENTATION.md)
2. **Understand**: Database schema (see DATABASE_SCHEMA.md)
3. **Implement**: Start with authentication flow
4. **Build**: Feature by feature (crop recommendation first)
5. **Test**: Each feature locally before integration
6. **Deploy**: Push to Render + Vercel

---

This structure follows professional best practices:
- ✅ Separation of concerns (controllers, services, models)
- ✅ Modular components (reusable, testable)
- ✅ Security (environment variables, validation)
- ✅ Scalability (easy to add new features)
- ✅ Maintainability (clear folder organization)
