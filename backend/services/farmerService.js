// In-memory data store for fallback/demo
const farmersMap = new Map([
  ['farmer_demo_123', {
    farmerId: 'farmer_demo_123',
    uid: 'farmer_demo_123',
    name: 'Ramesh Patel',
    email: 'ramesh.patel@agrimail.in',
    phone: '+91 9876543210',
    location: 'Nashik, Maharashtra',
    coords: { lat: 19.9975, lng: 73.7898 },
    soilType: 'black',
    farmSize: 4.5,
    crops: ['Wheat', 'Sugarcane', 'Cotton'],
    language: 'hi',
    createdAt: new Date().toISOString()
  }]
]);

const registerFarmer = async (userData) => {
  const farmerId = 'farmer_' + Date.now();
  const farmerProfile = {
    farmerId,
    uid: farmerId,
    name: userData.name || 'New Farmer',
    email: userData.email,
    phone: userData.phone || '',
    location: userData.location || 'Nashik, Maharashtra',
    coords: userData.coords || { lat: 19.9975, lng: 73.7898 },
    soilType: userData.soilType || 'black',
    farmSize: userData.farmSize || 2.5,
    crops: userData.crops || ['Wheat'],
    language: userData.language || 'en',
    createdAt: new Date().toISOString()
  };

  farmersMap.set(farmerId, farmerProfile);
  return { farmer: farmerProfile, token: 'jwt_mock_token_' + farmerId };
};

const loginFarmer = async (email, password) => {
  let found = Array.from(farmersMap.values()).find(f => f.email === email);
  if (!found) {
    // Auto-create or return default profile for testing ease
    const demoId = 'farmer_' + Date.now();
    found = {
      farmerId: demoId,
      uid: demoId,
      name: email.split('@')[0],
      email: email,
      phone: '+91 9876543210',
      location: 'Pune, Maharashtra',
      coords: { lat: 18.5204, lng: 73.8567 },
      soilType: 'black',
      farmSize: 3.0,
      crops: ['Rice', 'Wheat'],
      language: 'en',
      createdAt: new Date().toISOString()
    };
    farmersMap.set(demoId, found);
  }
  return { farmer: found, token: 'jwt_mock_token_' + found.farmerId };
};

const getFarmerProfile = async (farmerId) => {
  return farmersMap.get(farmerId) || Array.from(farmersMap.values())[0];
};

const updateFarmerProfile = async (farmerId, updateData) => {
  const current = farmersMap.get(farmerId) || Array.from(farmersMap.values())[0];
  const updated = { ...current, ...updateData, updatedAt: new Date().toISOString() };
  farmersMap.set(current.farmerId, updated);
  return updated;
};

module.exports = {
  registerFarmer,
  loginFarmer,
  getFarmerProfile,
  updateFarmerProfile
};
