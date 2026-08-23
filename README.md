# 🌾 KisanAI — Smart Agricultural Intelligence & Decision Platform

> An enterprise-grade, multilingual agricultural operating system empowering Indian farmers with precision agronomy, leaf disease diagnostics, hyperlocal weather advisories, and direct benefit government scheme matching.

---

## 🌟 Key Features & Modules

### 1. 🌱 Crop Suitability & NPK Optimizer
- Calculates soil Nitrogen (N), Phosphorus (P), Potassium (K), soil pH, rainfall, and agro-climatic conditions.
- Recommends top high-yielding crops ranked by suitability percentage, expected yield per acre, and APMC market price estimates.
- Calibrated across **25+ Indian crops** (Wheat, Rice, Cotton, Sugarcane, Tomato, Mustard, Soybean, Chili, Groundnut, etc.).

### 2. 🩺 Plant Pathology & Leaf Disease Diagnosis
- Image analysis for crop leaf disease detection across major Indian staple and horticulture crops.
- Provides scientific pathogen identification, disease severity staging, organic bio-control remedies, and chemical spray protocols aligned with **ICAR (Indian Council of Agricultural Research)** standards.
- Recommends nearby pesticide and fertilizer mandis.

### 3. 📍 Map-Integrated Daily Agronomy Advisory
- Interactive **Leaflet GPS Map Canvas** with click-to-pin, drag-to-pin, device geolocation, and real-time reverse geocoding.
- Delivers crop-specific, location-calibrated daily agronomic schedules for irrigation volumes (liters/acre), fertilizer application timings, pest vulnerability warnings, and local APMC mandi market rates.
- Dynamically adapts location presets based on the farmer's state and active farm location.

### 4. 🏛️ Government Schemes & Subsidies Matcher
- Evaluates farmer eligibility for Central and State agricultural schemes:
  - **PM-KISAN Samman Nidhi** (₹6,000 annual income support)
  - **Pradhan Mantri Fasal Bima Yojana (PMFBY)** (Comprehensive crop insurance)
  - **Kisan Credit Card (KCC)** (Subsidized 4% agricultural credit up to ₹3,00,000)
  - **Sub-Mission on Agricultural Mechanization (SMAM)** (40–50% farm machinery subsidy)
  - **Soil Health Card Scheme** (Free nutrient testing reports)
- Provides required documentation checklists and direct links to official government application portals.

### 5. 🧑‍🌾 Comprehensive Multilingual Farmer Profile
- Centralized management of land holding (Acres), farmer category (*Marginal, Small, Semi-Medium, Large*), state & district, annual income, land ownership type, Aadhaar linkage, and KCC status.
- **100% Native Multi-Lingual Support across 11 Indian Languages**:
  - English (`en`), हिंदी (`hi`), मराठी (`mr`), தமிழ் (`ta`), తెలుగు (`te`), বাংলা (`bn`), ગુજરાતી (`gu`), ಕನ್ನಡ (`kn`), മലയാളം (`ml`), ਪੰਜਾਬੀ (`pa`), ଓଡ଼ିଆ (`or`).
- Profile details automatically synchronize into Government Schemes matching and AI advisories.

### 6. ⛅ Hyperlocal Agromet Weather Station
- Real-time weather parameters: Temperature (°C), Humidity (%), Precipitation (mm), and Wind Speed (km/h).
- **Agricultural Spray Window Advisory**: Informs farmers if weather conditions are optimal for spraying or irrigation.
- 4-Day micro-climate forecast with rain probability.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Vanilla CSS / Modern Glassmorphism, Leaflet, Lucide React |
| **Backend** | Node.js, Express.js, RESTful API architecture |
| **APIs & Services** | Open-Meteo Weather API, Nominatim Geocoding, Google Gemini / Claude AI Integration |
| **Internationalization** | Custom Multi-Dialect Localization Context (11 Indian Languages) |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/itzxsrikanth/Schema.git
cd Schema
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # (Optional) Add API keys if available
npm start
```
*Backend server runs on: `http://localhost:5000`*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend web application runs on: `http://localhost:3000`*

---

## 📂 Project Structure

```
Schema/
├── backend/
│   ├── config/              # Constants, crops dataset, schemes database
│   ├── controllers/         # Feature and auth controllers
│   ├── middleware/          # JWT auth, CORS, error handling
│   ├── routes/              # Express API route endpoints
│   ├── services/            # Agronomy, weather, crop, scheme, disease engines
│   └── server.js            # Express app entry point
├── frontend/
│   ├── public/              # Static assets and agritech images
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # Login and Signup forms (with 1-click demo access)
│   │   │   ├── dashboard/   # Executive farm overview & Agromet weather station
│   │   │   ├── features/    # Advisory, CropRec, DiseaseDetection, Schemes, Profile
│   │   │   └── layout/      # Navbar, Footer, Main & Auth Layouts
│   │   ├── context/         # AuthContext & LanguageContext (11 Languages)
│   │   ├── services/        # Axios API client
│   │   └── index.css        # Agritech design system & color tokens
│   └── vite.config.js       # Vite configuration
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Backend health check |
| `POST` | `/api/auth/login` | Farmer authentication |
| `POST` | `/api/auth/signup` | Register new farmer profile |
| `GET` | `/api/farmer/profile` | Retrieve farmer details |
| `PUT` | `/api/farmer/profile` | Update land, state, income & crop parameters |
| `POST` | `/api/crop/recommend` | NPK & climate-based crop suitability calculation |
| `POST` | `/api/disease/detect` | Leaf pathology diagnostic analysis |
| `POST` | `/api/advisory/generate` | Location & crop specific agronomy advisory |
| `POST` | `/api/schemes/match` | Central & State subsidy eligibility evaluation |
| `GET` | `/api/weather/forecast` | Hyperlocal agromet weather & spray window forecast |

---

## 🧑‍🌾 Preloaded Demo Accounts

For instant platform testing, use any of the preloaded farmer profiles available directly on the login screen:

- **Srikanth / Ramesh Patel**: `srikanth@agrimail.in` | Password: `password123` (Coimbatore / Nashik • 4.5 Acres)
- **Gurpreet Singh**: `gurpreet.singh@agrimail.in` | Password: `password123` (Ludhiana, Punjab • 6.0 Acres)

---

## 📄 License
This project is licensed under the MIT License.
