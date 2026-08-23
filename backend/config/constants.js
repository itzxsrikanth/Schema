module.exports = {
  SOIL_TYPES: ['black', 'red', 'alluvial', 'laterite', 'clay', 'sandy', 'loamy'],
  
  INDIAN_STATES: [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 
    'Delhi (NCT)', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ],

  LANGUAGES: [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' }
  ],
  DEFAULT_LANGUAGE: 'en',
  
  CROPS_DATA: [
    { id: 'wheat', name: 'Wheat', nameHindi: 'गेहूं', optimalNPK: { n: 120, p: 60, k: 40 }, phRange: [6.0, 7.5], rainfall: [450, 650], tempRange: [15, 25], season: 'Rabi' },
    { id: 'rice', name: 'Rice / Paddy', nameHindi: 'चावल / धान', optimalNPK: { n: 100, p: 50, k: 50 }, phRange: [5.5, 6.8], rainfall: [1000, 1500], tempRange: [20, 35], season: 'Kharif' },
    { id: 'maize', name: 'Maize (Corn)', nameHindi: 'मक्का', optimalNPK: { n: 80, p: 40, k: 40 }, phRange: [5.8, 7.0], rainfall: [500, 800], tempRange: [18, 30], season: 'Kharif' },
    { id: 'cotton', name: 'Cotton', nameHindi: 'कपास', optimalNPK: { n: 90, p: 45, k: 45 }, phRange: [6.0, 8.0], rainfall: [600, 1000], tempRange: [21, 30], season: 'Kharif' },
    { id: 'sugarcane', name: 'Sugarcane', nameHindi: 'गन्ना', optimalNPK: { n: 150, p: 60, k: 60 }, phRange: [6.5, 7.5], rainfall: [1500, 2500], tempRange: [20, 38], season: 'Annual' },
    { id: 'mustard', name: 'Mustard', nameHindi: 'सरसों', optimalNPK: { n: 60, p: 30, k: 20 }, phRange: [6.0, 7.5], rainfall: [300, 500], tempRange: [10, 25], season: 'Rabi' },
    { id: 'chana', name: 'Gram / Chana', nameHindi: 'चना', optimalNPK: { n: 20, p: 40, k: 20 }, phRange: [6.0, 8.0], rainfall: [350, 500], tempRange: [15, 25], season: 'Rabi' },
    { id: 'soybean', name: 'Soybean', nameHindi: 'सोयाबीन', optimalNPK: { n: 30, p: 60, k: 40 }, phRange: [6.0, 7.0], rainfall: [600, 900], tempRange: [20, 32], season: 'Kharif' },
    { id: 'potato', name: 'Potato', nameHindi: 'आलू', optimalNPK: { n: 120, p: 80, k: 100 }, phRange: [5.0, 6.5], rainfall: [500, 700], tempRange: [15, 22], season: 'Rabi' },
    { id: 'tomato', name: 'Tomato', nameHindi: 'टमाटर', optimalNPK: { n: 100, p: 60, k: 60 }, phRange: [6.0, 7.0], rainfall: [400, 600], tempRange: [18, 28], season: 'Zaid/All' },
    { id: 'groundnut', name: 'Groundnut / Peanut', nameHindi: 'मूंगफली', optimalNPK: { n: 25, p: 50, k: 40 }, phRange: [6.0, 7.5], rainfall: [500, 750], tempRange: [22, 30], season: 'Kharif' },
    { id: 'onion', name: 'Onion', nameHindi: 'प्याज', optimalNPK: { n: 100, p: 50, k: 50 }, phRange: [6.0, 7.2], rainfall: [350, 550], tempRange: [15, 28], season: 'Rabi/Kharif' },
    { id: 'chili', name: 'Chili / Green Pepper', nameHindi: 'मिर्च', optimalNPK: { n: 120, p: 60, k: 60 }, phRange: [6.0, 7.0], rainfall: [600, 1000], tempRange: [20, 32], season: 'Annual' },
    { id: 'apple', name: 'Apple', nameHindi: 'सेब', optimalNPK: { n: 70, p: 35, k: 70 }, phRange: [5.8, 7.0], rainfall: [1000, 1250], tempRange: [10, 24], season: 'Perennial' },
    { id: 'mango', name: 'Mango', nameHindi: 'आम', optimalNPK: { n: 100, p: 50, k: 100 }, phRange: [5.5, 7.5], rainfall: [750, 2500], tempRange: [24, 35], season: 'Perennial' },
    { id: 'banana', name: 'Banana', nameHindi: 'केला', optimalNPK: { n: 200, p: 60, k: 300 }, phRange: [6.0, 7.5], rainfall: [1200, 2000], tempRange: [20, 35], season: 'Perennial' },
    { id: 'citrus', name: 'Citrus / Orange', nameHindi: 'संतरा / नींबू', optimalNPK: { n: 120, p: 60, k: 120 }, phRange: [5.5, 7.5], rainfall: [900, 1200], tempRange: [13, 37], season: 'Perennial' },
    { id: 'turmeric', name: 'Turmeric', nameHindi: 'हल्दी', optimalNPK: { n: 60, p: 50, k: 120 }, phRange: [5.5, 7.5], rainfall: [1500, 2200], tempRange: [20, 35], season: 'Kharif' },
    { id: 'tea', name: 'Tea', nameHindi: 'चाय', optimalNPK: { n: 140, p: 40, k: 80 }, phRange: [4.5, 5.5], rainfall: [1500, 3000], tempRange: [18, 30], season: 'Perennial' },
    { id: 'coffee', name: 'Coffee', nameHindi: 'कॉफी', optimalNPK: { n: 160, p: 60, k: 160 }, phRange: [5.2, 6.3], rainfall: [1500, 2500], tempRange: [15, 28], season: 'Perennial' },
    { id: 'jute', name: 'Jute', nameHindi: 'जूट / पटसन', optimalNPK: { n: 80, p: 40, k: 40 }, phRange: [6.0, 7.4], rainfall: [1500, 2000], tempRange: [24, 38], season: 'Kharif' },
    { id: 'barley', name: 'Barley', nameHindi: 'जौ', optimalNPK: { n: 60, p: 30, k: 30 }, phRange: [6.0, 8.0], rainfall: [400, 600], tempRange: [12, 22], season: 'Rabi' },
    { id: 'bajra', name: 'Bajra / Pearl Millet', nameHindi: 'बाजरा', optimalNPK: { n: 80, p: 40, k: 40 }, phRange: [6.5, 8.5], rainfall: [350, 500], tempRange: [25, 38], season: 'Kharif' },
    { id: 'jowar', name: 'Jowar / Sorghum', nameHindi: 'ज्वार', optimalNPK: { n: 80, p: 40, k: 40 }, phRange: [6.0, 8.5], rainfall: [400, 600], tempRange: [26, 36], season: 'Kharif' },
    { id: 'ragi', name: 'Ragi / Finger Millet', nameHindi: 'रागी', optimalNPK: { n: 60, p: 30, k: 30 }, phRange: [5.0, 8.2], rainfall: [500, 1000], tempRange: [20, 32], season: 'Kharif' }
  ],

  SCHEMES_DATABASE: [
    {
      schemeId: 'pm-kisan',
      name: 'PM-KISAN Samman Nidhi',
      nameHindi: 'पीएम-किसान सम्मान निधि',
      description: 'Income support of ₹6,000 per year in three equal installments to all landholding farmer families.',
      descriptionHindi: 'सभी भूमिधारक किसान परिवारों को तीन समान किस्तों में प्रति वर्ष ₹6,000 की आय सहायता।',
      benefit: 6000,
      eligibility: { minLandSize: 0.1, maxLandSize: 50, maxIncome: 1000000, states: ['All'] },
      applicationUrl: 'https://pmkisan.gov.in',
      documentsRequired: ['Aadhaar Card', 'Land Ownership Certificate', 'Bank Passbook']
    },
    {
      schemeId: 'pm-fasal-bima',
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      nameHindi: 'प्रधानमंत्री फसल बीमा योजना',
      description: 'Comprehensive crop insurance against yield losses due to non-preventable natural risks.',
      descriptionHindi: 'प्राकृतिक जोखिमों के कारण होने वाले फसल नुकसान के खिलाफ व्यापक बीमा सुरक्षा।',
      benefit: 50000,
      eligibility: { minLandSize: 0.1, maxLandSize: 100, maxIncome: 2000000, states: ['All'] },
      applicationUrl: 'https://pmfby.gov.in',
      documentsRequired: ['Aadhaar Card', 'Land Sowing Certificate', 'Bank Details']
    },
    {
      schemeId: 'kcc',
      name: 'Kisan Credit Card (KCC)',
      nameHindi: 'Kisan Credit Card (KCC)',
      description: 'Provides adequate and timely credit support for agricultural requirements at subsidized interest rates (4%).',
      descriptionHindi: 'रियायती ब्याज दरों (4%) पर कृषि आवश्यकताओं के लिए पर्याप्त और समय पर ऋण सहायता।',
      benefit: 300000,
      eligibility: { minLandSize: 0.2, maxLandSize: 100, maxIncome: 1500000, states: ['All'] },
      applicationUrl: 'https://www.myscheme.gov.in/schemes/kcc',
      documentsRequired: ['Identity Proof', 'Address Proof', 'Land Records']
    },
    {
      schemeId: 'soil-health-card',
      name: 'Soil Health Card Scheme',
      nameHindi: 'मृदा स्वास्थ्य कार्ड योजना',
      description: 'Free soil testing report with crop-wise nutrient recommendations to optimize fertilizer application.',
      descriptionHindi: 'उर्वरक उपयोग को अनुकूलित करने के लिए फसल-वार पोषक तत्वों की सिफारिशों के साथ मुफ्त मिट्टी परीक्षण रिपोर्ट।',
      benefit: 2000,
      eligibility: { minLandSize: 0, maxLandSize: 100, maxIncome: 5000000, states: ['All'] },
      applicationUrl: 'https://soilhealth.dac.gov.in',
      documentsRequired: ['Aadhaar Card', 'Land Record']
    },
    {
      schemeId: 'smam',
      name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
      nameHindi: 'कृषि यांत्रीकरण पर उप-मिशन',
      description: 'Subsidy up to 40-50% on agricultural machinery and equipment for farmers.',
      descriptionHindi: 'किसानों को कृषि मशीनरी और उपकरणों पर 40-50% तक की सब्सिडी।',
      benefit: 150000,
      eligibility: { minLandSize: 0.5, maxLandSize: 50, maxIncome: 1200000, states: ['All'] },
      applicationUrl: 'https://agrimachinery.nic.in',
      documentsRequired: ['Aadhaar Card', 'Bank Account', 'Land Registration']
    }
  ]
};
