const cropService = require('../services/cropService');
const weatherService = require('../services/weatherService');
const diseaseService = require('../services/diseaseService');
const advisoryService = require('../services/advisoryService');
const schemeService = require('../services/schemeService');

const recommendCrops = async (req, res, next) => {
  try {
    const result = await cropService.recommendCrops(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getWeather = async (req, res, next) => {
  try {
    const { location, lat, lng } = req.query;
    const result = await weatherService.getWeatherForecast(location, lat, lng);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const detectDisease = async (req, res, next) => {
  try {
    const { cropName, imageBase64, sampleId } = req.body;
    const result = await diseaseService.detectDisease({ cropName, imageBase64, sampleId });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const generateAdvisory = async (req, res, next) => {
  try {
    const { crop, location, lat, lng, language, soilType } = req.body;
    const farmerId = req.user?.uid;
    const result = await advisoryService.generateAdvisory({ farmerId, crop, location, lat, lng, language, soilType });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const matchSchemes = async (req, res, next) => {
  try {
    const { landSize, state, income, crops } = req.body;
    const result = await schemeService.matchSchemes({ landSize, state, income, crops });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  recommendCrops,
  getWeather,
  detectDisease,
  generateAdvisory,
  matchSchemes
};
