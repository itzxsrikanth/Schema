const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const featureControllers = require('../controllers/featureControllers');
const authMiddleware = require('../middleware/auth');

// Auth routes
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);

// Farmer profile routes
router.get('/farmer/profile', authMiddleware, authController.getProfile);
router.put('/farmer/profile', authMiddleware, authController.updateProfile);

// Crop recommendation
router.post('/crop/recommend', featureControllers.recommendCrops);

// Weather
router.get('/weather/forecast', featureControllers.getWeather);

// Disease detection
router.post('/disease/detect', featureControllers.detectDisease);

// AI Advisory
router.post('/advisory/generate', authMiddleware, featureControllers.generateAdvisory);

// Schemes matcher
router.post('/schemes/match', featureControllers.matchSchemes);

module.exports = router;
