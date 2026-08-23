const farmerService = require('../services/farmerService');

const signup = async (req, res, next) => {
  try {
    const { name, email, password, phone, location, soilType, farmSize, crops, language } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }
    const result = await farmerService.registerFarmer({ name, email, password, phone, location, soilType, farmSize, crops, language });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }
    const result = await farmerService.loginFarmer(email, password);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const farmerId = req.user?.uid || req.params.farmerId;
    const profile = await farmerService.getFarmerProfile(farmerId);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const farmerId = req.user?.uid || req.params.farmerId;
    const updated = await farmerService.updateFarmerProfile(farmerId, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile
};
