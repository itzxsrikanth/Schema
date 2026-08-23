<div align="center">

# 🌾 AI for Farmers

### AI-Powered Agricultural Advisory Platform for Indian Smallholder Farmers

*Bridging the gap between cutting-edge AI and India's 110 million farmers*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Firebase](https://img.shields.io/badge/Firebase-10.7-orange.svg)](https://firebase.google.com/)

[Problem](#-the-problem) •
[Solution](#-our-solution) •
[Features](#-key-features) •
[Tech Stack](#-tech-stack) •
[Getting Started](#-getting-started) •
[API Docs](#-api-documentation) •
[Deployment](#-deployment) •
[Demo](#-demo)

</div>

---

## 📖 Overview

**AI for Farmers** is an AI-powered agricultural advisory platform built to close the information gap faced by India's small and marginal farmers. It combines crop recommendation, plant disease detection, weather intelligence, government scheme matching, and LLM-generated advisories into one accessible, multilingual application — built for the **"AI for Public Good"** hackathon track.

> Built for: OOSC 4.0 Hackathon — Problem Statement 5: *AI for Public Good*

---

## 🎯 The Problem

- India has **~110 million agricultural holdings**, of which **86% are small/marginal farms** (< 2 hectares).
- Farmers routinely lose **20–30% of crop yield** annually to disease, pests, and poor timing decisions.
- Government schemes worth thousands of crores (PM Kisan, PMFBY) go **unclaimed** due to bureaucratic complexity.
- Existing agri-tech solutions are fragmented, English-first, or enterprise-focused — leaving smallholder farmers underserved.

## 💡 Our Solution

A single platform that gives every farmer — regardless of literacy level or connectivity — access to:

1. **Personalized crop recommendations** based on soil, location, and season
2. **Instant plant disease detection** from a photo of a leaf
3. **AI-generated, multilingual advisories** (Hindi + English) covering irrigation, fertilizer, and pest management
4. **Government scheme eligibility matching** (PM Kisan, PMFBY, and more)
5. **Localized weather intelligence** with actionable alerts

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🌱 **Crop Recommendation Engine** | Suggests optimal crops using location, soil type, season, and farm size, with expected yield & income projections |
| 🔍 **Disease Detection** | Upload a leaf photo → get instant diagnosis, severity, and treatment plan using a trained ML model |
| 🤖 **AI Advisory Generation** | Claude-powered, weather-aware 7-day advisory in Hindi & English |
| 💰 **Government Scheme Matcher** | Matches farmer profile to eligible schemes (PM Kisan, PMFBY, NABARD) with estimated benefit value |
| 🌦️ **Weather Intelligence** | 5-day forecasts and proactive alerts (e.g., "delay spraying, rain expected") |
| 🌐 **Multilingual Support** | Hindi-first UI with English fallback |
| 📱 **Mobile-Responsive** | Optimized for low-end Android devices |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                        │
│                 (Vercel Deployment)                       │
└────────────────┬───────────────────────────────────────┘
                  │  Axios + REST API (JWT Auth)
                  ▼
┌─────────────────────────────────────────────────────────┐
│                 BACKEND (choose one)                      │
│     ┌─────────────────────┬─────────────────────┐         │
│     │  Express.js (Node)  │  Spring Boot (Java)  │         │
│     └─────────────────────┴─────────────────────┘         │
│                (Render.com Deployment)                     │
└────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┴──────────┬───────────────┐
        ▼                    ▼               ▼
  ┌───────────┐       ┌────────────┐   ┌────────────┐
  │ Firebase  │       │  Claude AI │   │ OpenWeather │
  │ Firestore │       │    API     │   │     API     │
  └───────────┘       └────────────┘   └────────────┘
```

---

## 🛠️ Tech Stack

**Frontend**
- React 18 (Hooks + Context API)
- React Router, Axios, Bootstrap 5
- Firebase Authentication
- i18next (multilingual support)

**Backend** — pick one:
- **Node.js / Express** — fastest to build, ideal for hackathon timelines
- **Spring Boot 3.2 (Java 17)** — enterprise-grade, layered architecture, JWT security

**Database & Storage**
- Firebase Firestore (NoSQL) or PostgreSQL (Java backend)
- Firebase Cloud Storage (images)

**External APIs**
- [Claude API](https://console.anthropic.com) — advisory generation
- [OpenWeatherMap](https://openweathermap.org/api) — weather forecasts
- eNAM / Agmarknet — mandi price data
- ICAR — crop & disease reference data

**Deployment**
- Frontend → [Vercel](https://vercel.com)
- Backend → [Render.com](https://render.com)

---

## 📁 Project Structure

```
farmers-ai/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # UI components (auth, dashboard, features)
│   │   ├── services/         # API service layer
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # Global state (Auth, Farmer)
│   │   └── utils/            # Helpers, validators, translations
│   └── package.json
│
├── backend/                  # Node.js/Express API (Option 1)
│   ├── config/                # Firebase, env, constants
│   ├── controllers/           # Route handlers
│   ├── services/              # Business logic + Claude/Weather integration
│   ├── middleware/            # Auth, validation, error handling
│   └── server.js
│
├── backend-java/              # Spring Boot API (Option 2 — recommended)
│   ├── src/main/java/com/farmers/ai/
│   │   ├── config/             # Security, Firebase, CORS
│   │   ├── domain/             # Entities, DTOs, enums, exceptions
│   │   ├── repository/         # JPA repositories
│   │   ├── service/            # Business logic
│   │   ├── controller/         # REST controllers
│   │   └── security/           # JWT provider & filters
│   └── pom.xml
│
├── docs/                      # Additional documentation
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/) and npm, **or** Java 17+ and Maven
- A [Firebase](https://firebase.google.com) project (Firestore + Authentication enabled)
- [OpenWeatherMap API key](https://openweathermap.org/api) (free tier)
- [Claude API key](https://console.anthropic.com)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/farmers-ai.git
cd farmers-ai
```

### 2. Backend setup

<details>
<summary><strong>Option A — Node.js / Express</strong></summary>

```bash
cd backend
npm install
cp .env.example .env
# Fill in Firebase, OpenWeatherMap, and Claude credentials in .env

npm run dev
# ✅ Server running on port 5000
```
</details>

<details>
<summary><strong>Option B — Spring Boot (Java)</strong></summary>

```bash
cd backend-java
# Add your firebase-service-account.json to src/main/resources/
# Set env vars for JWT_SECRET, OPENWEATHER_API_KEY, CLAUDE_API_KEY

mvn spring-boot:run
# ✅ Server running on port 8080
```
</details>

Verify the backend is running:

```bash
curl http://localhost:5000/health   # Node.js
curl http://localhost:8080/actuator/health   # Spring Boot
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Fill in REACT_APP_API_URL and Firebase Web SDK credentials

npm start
# Opens http://localhost:3000
```

### 4. Test the app

1. Open `http://localhost:3000`
2. Sign up with a test account
3. Complete the farmer profile
4. Try crop recommendation, disease detection, advisory, and schemes features

---

## 🔑 Environment Variables

**Backend (`.env`)**
```env
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_DATABASE_URL=

OPENWEATHER_API_KEY=
CLAUDE_API_KEY=

NODE_ENV=development
PORT=5000
JWT_SECRET=
FRONTEND_URL=http://localhost:3000
```

**Frontend (`.env.local`)**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

> ⚠️ Never commit `.env` files. Use `.env.example` as a template only.

---

## 📚 API Documentation

Full endpoint reference is available in [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md). Summary below:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new farmer |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/farmers/profile` | Get current farmer profile |
| `POST` | `/api/farmers/profile` | Create/update farmer profile |
| `POST` | `/api/crops/recommend` | Get ranked crop recommendations |
| `POST` | `/api/disease/detect` | Upload image for disease diagnosis |
| `POST` | `/api/advisory/generate` | Generate AI-powered advisory |
| `GET` | `/api/advisory/history` | Get past advisories |
| `POST` | `/api/schemes/eligible` | Get eligible government schemes |
| `POST` | `/api/weather/get` | Get weather forecast for a location |

All authenticated endpoints require:
```
Authorization: Bearer <firebase-jwt-token>
```

### Example request

```bash
curl -X POST http://localhost:5000/api/crops/recommend \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Nashik, Maharashtra",
    "soilType": "black",
    "farmSize": 1.5,
    "season": "Kharif"
  }'
```

---

## 🗄️ Database Schema

Data is stored in Firebase Firestore across four core collections: `farmers`, `advisories`, `diseases`, and `schemes`. Full schema definitions are in [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md).

---

## ☁️ Deployment

| Component | Platform | Notes |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Auto-deploys from `main` branch |
| Backend | [Render.com](https://render.com) | Free tier web service |
| Database | Firebase Firestore | No separate hosting needed |

Full step-by-step deployment instructions (including environment variable setup and CORS configuration) are in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

**Quick deploy:**
```bash
# Backend (Render) — connect repo, set env vars, deploy
git push origin main

# Frontend (Vercel)
vercel --prod
```

---

## 🎬 Demo

**Live demo:** `https://farmers-ai-frontend.vercel.app` *(update with your deployed URL)*
**API base:** `https://farmers-ai-backend.onrender.com/api` *(update with your deployed URL)*

### Demo flow
1. Sign up → complete farmer profile (location, soil type, crops)
2. Get crop recommendations with expected yield & income
3. Upload a leaf image → receive disease diagnosis + treatment
4. Generate an AI advisory (Hindi + English)
5. Check eligible government schemes
6. View localized weather forecast & alerts

---

## 🔐 Security

- Firebase Authentication with JWT-based API access
- Environment-variable-only secrets (never committed)
- Server-side input validation on all endpoints
- Rate limiting (100 req/15min per IP)
- Image upload validation (type, size ≤ 5MB)
- HTTPS enforced in production

---

## 🗺️ Roadmap

- [ ] Voice-based advisory input for low-literacy users
- [ ] Offline-first PWA support
- [ ] Mandi price alerts via SMS
- [ ] Expand disease detection model to more crops
- [ ] Regional language expansion (Marathi, Tamil, Telugu)
- [ ] Partnership pilots with state agriculture departments

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- Built for **OOSC 4.0 Hackathon** — Problem Statement 5: *AI for Public Good*
- Crop and disease reference data: [ICAR](https://icar.org.in)
- Weather data: [OpenWeatherMap](https://openweathermap.org)
- Advisory generation: [Claude API by Anthropic](https://www.anthropic.com)
- Market data: [eNAM](https://enam.gov.in) / Agmarknet

---

<div align="center">

**Built with ❤️ for India's farmers**

</div>
