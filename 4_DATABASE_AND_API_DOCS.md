# AI for Farmers - Database Schema & API Documentation

## 1️⃣ FIRESTORE DATABASE SCHEMA

### Collection: `farmers`

Stores farmer profiles and basic information.

```javascript
{
  "farmerId": "string",  // Document ID (matches Firebase UID)
  "uid": "string",       // Firebase Authentication UID
  "name": "string",      // Farmer's full name
  "email": "string",     // Email address
  "phone": "string",     // Phone number (optional)
  "location": "string",  // City, State (e.g., "Nashik, Maharashtra")
  "coords": {
    "lat": "number",     // Latitude
    "lng": "number"      // Longitude
  },
  "soilType": "string",  // "black", "red", "alluvial", "laterite"
  "farmSize": "number",  // Size in acres
  "crops": ["string"],   // Array of crop names
  "language": "string",  // "hi", "en", "mr", "ta"
  "profileImageUrl": "string",  // Optional profile picture
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Indexes Required:**
- `farmerId` (Ascending)
- `location` (Ascending)
- `createdAt` (Descending)

---

### Collection: `advisories`

Stores AI-generated agricultural advisories.

```javascript
{
  "advisoryId": "string",        // Document ID
  "farmerId": "string",          // Reference to farmer
  "crop": "string",              // Current crop
  "advisory": "string",          // HTML formatted advisory
  "weatherSnapshot": {
    "temperature": "number",
    "humidity": "number",
    "rainfall": "number",
    "windSpeed": "number",
    "forecast": "array"
  },
  "recommendations": {
    "irrigation": {
      "required": "boolean",
      "schedule": "string",
      "quantity": "number"
    },
    "fertilizer": {
      "type": "string",
      "quantity": "number",
      "unit": "string"
    },
    "pestControl": {
      "pests": ["string"],
      "recommended": "string",
      "schedule": "string"
    },
    "market": {
      "currentPrice": "number",
      "expectedPrice": "number",
      "bestTimeToSell": "string"
    }
  },
  "model": "string",  // "claude-3-5-sonnet" or "fallback"
  "cached": "boolean",
  "generatedAt": "timestamp",
  "createdAt": "timestamp"
}
```

**Indexes Required:**
- `farmerId` (Ascending), `createdAt` (Descending)
- `createdAt` (Descending)

---

### Collection: `diseases`

Stores disease detection records.

```javascript
{
  "diseaseId": "string",
  "farmerId": "string",
  "crop": "string",
  "imageName": "string",     // Cloud Storage reference
  "detection": {
    "disease": "string",
    "confidence": "number",   // 0-100
    "severity": "string"      // "low", "medium", "high"
  },
  "treatment": {
    "method": "string",
    "products": ["string"],
    "cost": "number",
    "duration": "string"
  },
  "nearbyMandis": [
    {
      "name": "string",
      "price": "number",
      "distance": "number"
    }
  ],
  "daysToIntervene": "number",
  "videoLink": "string",
  "detectedAt": "timestamp",
  "createdAt": "timestamp"
}
```

---

### Collection: `schemes`

Stores government scheme information.

```javascript
{
  "schemeId": "string",
  "name": "string",          // e.g., "PM Kisan"
  "nameHindi": "string",
  "description": "string",
  "benefit": "number",       // Amount in rupees
  "eligibility": {
    "minLandSize": "number",
    "maxLandSize": "number",
    "maxIncome": "number",
    "crops": ["string"],
    "states": ["string"]
  },
  "applicationUrl": "string",
  "documentRequired": ["string"],
  "lastUpdated": "timestamp"
}
```

---

### Collection: `crops`

Reference data for crop information.

```javascript
{
  "cropId": "string",
  "name": "string",
  "nameHindi": "string",
  "season": "string",        // "Kharif" or "Rabi"
  "soilType": ["string"],
  "waterRequired": "number",
  "growthPeriod": "number",  // Days
  "expectedYield": "number", // Per acre
  "marketPrice": {
    "min": "number",
    "max": "number",
    "average": "number"
  },
  "commonDiseases": ["string"],
  "pestWarnings": ["string"],
  "bestRegions": ["string"]
}
```

---

## 2️⃣ API ENDPOINTS DOCUMENTATION

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new farmer account.

**Request:**
```json
{
  "email": "farmer@example.com",
  "password": "securePassword123",
  "name": "Rajesh Kumar",
  "phone": "+91-9876543210"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "uid": "firebase-uid",
    "email": "farmer@example.com",
    "name": "Rajesh Kumar",
    "token": "jwt-token"
  }
}
```

---

#### POST `/api/auth/login`
Login farmer.

**Request:**
```json
{
  "email": "farmer@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "uid": "firebase-uid",
    "token": "jwt-token",
    "farmer": { /* farmer profile */ }
  }
}
```

---

### Farmer Profile Endpoints

#### GET `/api/farmers/profile`
Get current farmer's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "farmerId": "farmer-id",
    "name": "Rajesh Kumar",
    "location": "Nashik, Maharashtra",
    "farmSize": 1.5,
    "crops": ["cotton"],
    "soilType": "black"
  }
}
```

---

#### POST `/api/farmers/profile`
Create or update farmer profile.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Rajesh Kumar",
  "location": "Nashik, Maharashtra",
  "farmSize": 1.5,
  "soilType": "black",
  "crops": ["cotton", "sugarcane"],
  "language": "hi"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated profile */ }
}
```

---

### Crop Recommendation Endpoints

#### POST `/api/crops/recommend`
Get crop recommendations.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "location": "Nashik, Maharashtra",
  "soilType": "black",
  "farmSize": 1.5,
  "season": "Kharif"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Recommendations retrieved",
  "data": {
    "recommendations": [
      {
        "rank": 1,
        "crop": "Cotton",
        "confidence": 0.92,
        "expectedYield": 18,
        "expectedIncome": 99000,
        "reason": "Black soil in Kharif perfect for cotton",
        "riskLevel": "low",
        "insuranceAvailable": true
      },
      {
        "rank": 2,
        "crop": "Soybean",
        "confidence": 0.85,
        "expectedYield": 15,
        "expectedIncome": 75000,
        "reason": "Good alternative with better margins",
        "riskLevel": "medium"
      }
    ]
  }
}
```

---

### Disease Detection Endpoints

#### POST `/api/disease/detect`
Detect disease from image.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request:**
```
image: <file>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Disease detected",
  "data": {
    "disease": "Spider Mites",
    "confidence": 87,
    "severity": "Moderate (40% leaf damage)",
    "daysToIntervene": 3,
    "treatment": {
      "method": "Spray Neem oil + Abamectin",
      "ratio": "1:3",
      "cost": 350,
      "timing": "Early morning or evening"
    },
    "products": [
      {
        "name": "Neem Oil",
        "quantity": "1L",
        "price": 180,
        "shop": "Local Mandi"
      }
    ],
    "videoLink": "https://youtube.com/...",
    "preventiveMeasures": ["Maintain humidity", "Proper spacing"]
  }
}
```

---

### Advisory Endpoints

#### POST `/api/advisory/generate`
Generate AI advisory.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Advisory generated",
  "data": {
    "advisoryId": "advisory-id",
    "advisory": "🌾 आपके कपास के लिए 7-दिवसीय सलाह...",
    "recommendations": {
      "irrigation": { /* details */ },
      "fertilizer": { /* details */ },
      "pestControl": { /* details */ }
    },
    "generatedAt": "2025-08-22T10:30:00Z"
  }
}
```

---

#### GET `/api/advisory/history`
Get advisory history.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `limit`: 10 (default)
- `offset`: 0 (default)

**Response (200):**
```json
{
  "success": true,
  "message": "Advisory history retrieved",
  "data": [
    {
      "advisoryId": "id1",
      "generatedAt": "2025-08-22T10:30:00Z",
      "crop": "Cotton"
    }
  ]
}
```

---

### Schemes Endpoints

#### POST `/api/schemes/eligible`
Get eligible government schemes.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "farmSize": 1.5,
  "annualIncome": 150000,
  "crop": "cotton",
  "state": "Maharashtra"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Eligible schemes retrieved",
  "data": {
    "eligibleSchemes": [
      {
        "schemeId": "pm-kisan",
        "name": "PM Kisan Samman Nidhi",
        "benefit": 6000,
        "eligibilityStatus": "Eligible",
        "estimatedValue": "₹60,000 over 10 years",
        "applicationUrl": "pmkisan.gov.in",
        "requiredDocuments": ["Aadhaar", "Land Record"]
      },
      {
        "schemeId": "pmfby",
        "name": "PM Fasal Bima Yojana",
        "benefit": "100% coverage",
        "eligibilityStatus": "Eligible",
        "estimatedPremium": 400,
        "applicationUrl": "pmfby.gov.in"
      }
    ],
    "totalPotentialIncome": 100000
  }
}
```

---

### Weather Endpoints

#### POST `/api/weather/get`
Get weather data for location.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "location": "Nashik, Maharashtra"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Weather data retrieved",
  "data": {
    "location": "Nashik, Maharashtra",
    "current": {
      "temperature": 28.5,
      "humidity": 72,
      "rainfall": 0,
      "windSpeed": 4.5,
      "condition": "Partly cloudy"
    },
    "fiveDayForecast": [
      {
        "date": "2025-08-22",
        "high": 35,
        "low": 24,
        "rainfall": 2,
        "condition": "Sunny"
      }
    ],
    "alerts": [
      "⚠️ Rainfall expected Aug 23. Delay pesticide spray.",
      "💧 Low humidity coming. Increase irrigation frequency."
    ]
  }
}
```

---

## 3️⃣ ERROR RESPONSES

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "details": "Additional details if available",
  "timestamp": "2025-08-22T10:30:00Z"
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Server Error

---

## 4️⃣ AUTHENTICATION FLOW

```
User (Frontend)
    ↓
    1. Signup/Login with Firebase
    ↓
Firebase Auth
    ↓
    2. Get ID Token
    ↓
User adds token to Authorization header
    ↓
    3. Send requests with token
    ↓
Backend
    ↓
    4. Verify token
    ↓
    5. Get user info from decoded token
    ↓
    6. Process request & return data
```

---

## 5️⃣ RATE LIMITING

- **General endpoints**: 100 requests/15 minutes per IP
- **Upload endpoints**: 10 requests/hour per user
- **External API calls**: Cached for 5 minutes

---

## 6️⃣ DATA VALIDATION RULES

### Farmer Profile
```
name: 2-100 characters, required
location: Required
soilType: One of [black, red, alluvial, laterite]
farmSize: 0.1 - 1000 acres
crops: Array, at least 1 crop required
language: One of [hi, en, mr, ta]
```

### Crop Recommendation
```
location: Required
soilType: One of [black, red, alluvial, laterite]
farmSize: 0.1 - 1000
season: One of [Kharif, Rabi]
```

### Image Upload (Disease Detection)
```
File type: JPEG, PNG, WebP
Max size: 5MB
Min dimensions: 100x100px
```

---

**All endpoints require authentication except `/api/auth/signup` and `/api/auth/login`.**

---

## ✅ Quick API Testing

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"farmer@example.com","password":"password"}'

# Get profile (add token from login response)
curl -X GET http://localhost:5000/api/farmers/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get crop recommendations
curl -X POST http://localhost:5000/api/crops/recommend \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "location":"Nashik, Maharashtra",
    "soilType":"black",
    "farmSize":1.5,
    "season":"Kharif"
  }'
```

---

This database schema and API documentation is production-ready and fully documented!
