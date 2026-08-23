import React, { useState, useEffect, useRef, useMemo } from 'react';
import { advisoryAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage, INDIAN_STATES } from '../../../context/LanguageContext';
import { 
  Sparkles, 
  MapPin, 
  Navigation, 
  Layers, 
  Droplets, 
  Sprout, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Thermometer, 
  Wind, 
  Compass,
  Search,
  Maximize2,
  Home
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// State-wise agricultural district hubs with coordinates
const STATE_DISTRICTS_MAP = {
  'Maharashtra': [
    { name: 'Nashik, Maharashtra', lat: 19.9975, lng: 73.7898, tag: 'Grape & Onion Hub' },
    { name: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567, tag: 'Sugarcane & Floriculture' },
    { name: 'Nagpur, Maharashtra', lat: 21.1458, lng: 79.0882, tag: 'Orange & Cotton Belt' },
    { name: 'Latur, Maharashtra', lat: 18.4088, lng: 76.5604, tag: 'Soybean & Pulses Trading' },
    { name: 'Solapur, Maharashtra', lat: 17.6599, lng: 75.9064, tag: 'Pomegranate & Jowar' },
    { name: 'Kolhapur, Maharashtra', lat: 16.7050, lng: 74.2433, tag: 'Sugarcane & Jaggery' },
    { name: 'Jalgaon, Maharashtra', lat: 21.0077, lng: 75.5626, tag: 'Banana Capital' }
  ],
  'Punjab': [
    { name: 'Ludhiana, Punjab', lat: 30.9010, lng: 75.8573, tag: 'Wheat & Rice Granary' },
    { name: 'Bathinda, Punjab', lat: 30.2110, lng: 74.9455, tag: 'Cotton & Wheat Belt' },
    { name: 'Amritsar, Punjab', lat: 31.6340, lng: 74.8723, tag: 'Basmati Paddy Zone' },
    { name: 'Jalandhar, Punjab', lat: 31.3260, lng: 75.5762, tag: 'Potato Seed Hub' },
    { name: 'Patiala, Punjab', lat: 30.3398, lng: 76.3869, tag: 'Cereal Farming' },
    { name: 'Sangrur, Punjab', lat: 30.2458, lng: 75.8420, tag: 'High-Yield Paddy' }
  ],
  'Haryana': [
    { name: 'Karnal, Haryana', lat: 29.6857, lng: 76.9905, tag: 'Basmati Rice Bowl & Dairy' },
    { name: 'Hisar, Haryana', lat: 29.1492, lng: 75.7217, tag: 'Cotton & Mustard Hub' },
    { name: 'Sirsa, Haryana', lat: 29.5349, lng: 75.0296, tag: 'Wheat & Cotton Zone' },
    { name: 'Kurukshetra, Haryana', lat: 29.9695, lng: 76.8783, tag: 'Paddy & Sugarcane' },
    { name: 'Ambala, Haryana', lat: 30.3782, lng: 76.7767, tag: 'Mixed Grain Cultivation' }
  ],
  'Uttar Pradesh': [
    { name: 'Varanasi, Uttar Pradesh', lat: 25.3176, lng: 82.9739, tag: 'Vegetable & Rice Belt' },
    { name: 'Agra, Uttar Pradesh', lat: 27.1767, lng: 78.0081, tag: 'Potato Capital of India' },
    { name: 'Muzaffarnagar, Uttar Pradesh', lat: 29.4727, lng: 77.7085, tag: 'Sugarcane & Jaggery Hub' },
    { name: 'Farrukhabad, Uttar Pradesh', lat: 27.3826, lng: 79.5847, tag: 'Potato & Tobacco' },
    { name: 'Kanpur, Uttar Pradesh', lat: 26.4499, lng: 80.3319, tag: 'Alluvial Farming' },
    { name: 'Prayagraj, Uttar Pradesh', lat: 25.4358, lng: 81.8463, tag: 'Guava & Wheat Belt' }
  ],
  'Madhya Pradesh': [
    { name: 'Indore, Madhya Pradesh', lat: 22.7196, lng: 75.8577, tag: 'Soybean & Wheat Plateau' },
    { name: 'Ujjain, Madhya Pradesh', lat: 23.1765, lng: 75.7885, tag: 'Soybean & Gram Mandi' },
    { name: 'Neemuch, Madhya Pradesh', lat: 24.4754, lng: 74.8719, tag: 'Medicinal Herbs & Spices' },
    { name: 'Mandsaur, Madhya Pradesh', lat: 24.0722, lng: 75.0683, tag: 'Garlic & Opium/Spices' },
    { name: 'Bhopal, Madhya Pradesh', lat: 23.2599, lng: 77.4126, tag: 'Central Black Soil Zone' },
    { name: 'Jabalpur, Madhya Pradesh', lat: 23.1815, lng: 79.9864, tag: 'Narmada Valley Pulses' }
  ],
  'Gujarat': [
    { name: 'Rajkot, Gujarat', lat: 22.3039, lng: 70.8022, tag: 'Cotton & Groundnut Zone' },
    { name: 'Unjha, Gujarat', lat: 23.8055, lng: 72.3929, tag: 'Asia Spices Capital (Cumin/Fennel)' },
    { name: 'Gondal, Gujarat', lat: 21.9619, lng: 70.7923, tag: 'Onion & Chili APMC' },
    { name: 'Junagadh, Gujarat', lat: 21.5222, lng: 70.4579, tag: 'Kesar Mango & Groundnut' },
    { name: 'Surat, Gujarat', lat: 21.1702, lng: 72.8311, tag: 'Sugarcane & Banana Belt' },
    { name: 'Ahmedabad, Gujarat', lat: 23.0225, lng: 72.5714, tag: 'Cotton & Castor' }
  ],
  'Andhra Pradesh': [
    { name: 'Guntur, Andhra Pradesh', lat: 16.3067, lng: 80.4365, tag: 'Asia Largest Chili Market' },
    { name: 'Kurnool, Andhra Pradesh', lat: 15.8281, lng: 78.0373, tag: 'Groundnut & Sunflower' },
    { name: 'Vijayawada, Andhra Pradesh', lat: 16.5062, lng: 80.6480, tag: 'Krishna Delta Paddy & Mango' },
    { name: 'Kakinada, Andhra Pradesh', lat: 16.9891, lng: 82.2475, tag: 'Godavari Rice Bowl' },
    { name: 'Tirupati, Andhra Pradesh', lat: 13.6288, lng: 79.4192, tag: 'Groundnut & Horticulture' }
  ],
  'Telangana': [
    { name: 'Warangal, Telangana', lat: 17.9689, lng: 79.5941, tag: 'Cotton & Chili Hub' },
    { name: 'Nizamabad, Telangana', lat: 18.6725, lng: 78.0941, tag: 'Turmeric & Paddy APMC' },
    { name: 'Khammam, Telangana', lat: 17.2473, lng: 80.1514, tag: 'Chili & Mango Zone' },
    { name: 'Karimnagar, Telangana', lat: 18.4386, lng: 79.1288, tag: 'Rice Granary' }
  ],
  'Tamil Nadu': [
    { name: 'Erode, Tamil Nadu', lat: 11.3410, lng: 77.7172, tag: 'Turmeric City & Textiles' },
    { name: 'Coimbatore, Tamil Nadu', lat: 11.0168, lng: 76.9558, tag: 'Cotton, Coconut & Millets' },
    { name: 'Madurai, Tamil Nadu', lat: 9.9252, lng: 78.1198, tag: 'Jasmine & Pulses Zone' },
    { name: 'Thanjavur, Tamil Nadu', lat: 10.7870, lng: 79.1378, tag: 'Cauvery Delta Rice Bowl' },
    { name: 'Salem, Tamil Nadu', lat: 11.6643, lng: 78.1460, tag: 'Mango & Sago/Tapioca' }
  ],
  'Karnataka': [
    { name: 'Kolar, Karnataka', lat: 13.1367, lng: 78.1291, tag: 'Major Tomato & Vegetable Market' },
    { name: 'Byadgi, Karnataka', lat: 14.6806, lng: 75.4856, tag: 'Famous Byadgi Chili Market' },
    { name: 'Hubli, Karnataka', lat: 15.3647, lng: 75.1240, tag: 'Cotton & Groundnut Zone' },
    { name: 'Belgaum, Karnataka', lat: 15.8497, lng: 74.4977, tag: 'Sugarcane & Vegetables' },
    { name: 'Shimoga, Karnataka', lat: 13.9299, lng: 75.5681, tag: 'Arecanut & Paddy' },
    { name: 'Chikkamagaluru, Karnataka', lat: 13.3161, lng: 75.7720, tag: 'Coffee Country' }
  ],
  'Kerala': [
    { name: 'Wayanad, Kerala', lat: 11.6854, lng: 76.1320, tag: 'Spices, Tea & Coffee Hills' },
    { name: 'Palakkad, Kerala', lat: 10.7867, lng: 76.6548, tag: 'Paddy Granary of Kerala' },
    { name: 'Kottayam, Kerala', lat: 9.5916, lng: 76.5222, tag: 'Natural Rubber & Spices' },
    { name: 'Idukki, Kerala', lat: 9.8494, lng: 76.9804, tag: 'Cardamom & Tea Hills' }
  ],
  'Himachal Pradesh': [
    { name: 'Shimla, Himachal Pradesh', lat: 31.1048, lng: 77.1734, tag: 'Apple & Temperate Orchards' },
    { name: 'Solan, Himachal Pradesh', lat: 30.9045, lng: 77.0967, tag: 'Mushroom City & Tomato' },
    { name: 'Kullu, Himachal Pradesh', lat: 31.9579, lng: 77.1095, tag: 'Apples, Pears & Pomegranate' }
  ],
  'Rajasthan': [
    { name: 'Kota, Rajasthan', lat: 25.2138, lng: 75.8648, tag: 'Soybean, Mustard & Wheat' },
    { name: 'Bikaner, Rajasthan', lat: 28.0229, lng: 73.3119, tag: 'Moth Bean & Gram' },
    { name: 'Sri Ganganagar, Rajasthan', lat: 29.9038, lng: 73.8772, tag: 'Canal Irrigated Wheat & Cotton' },
    { name: 'Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873, tag: 'Mustard & Pearl Millet' }
  ],
  'West Bengal': [
    { name: 'Burdwan, West Bengal', lat: 23.2324, lng: 87.8615, tag: 'Rice Bowl of Bengal' },
    { name: 'Hooghly, West Bengal', lat: 22.9039, lng: 88.3968, tag: 'Potato & Jute Hub' },
    { name: 'Siliguri, West Bengal', lat: 26.7271, lng: 88.3953, tag: 'Darjeeling Tea & Pineapple' }
  ],
  'Bihar': [
    { name: 'Purnia, Bihar', lat: 25.7771, lng: 87.4753, tag: 'Gulabbagh Maize Hub' },
    { name: 'Muzaffarpur, Bihar', lat: 26.1209, lng: 85.3647, tag: 'Shahi Litchi & Vegetables' },
    { name: 'Patna, Bihar', lat: 25.5941, lng: 85.1376, tag: 'Gangetic Alluvial Crops' }
  ]
};

const availableCrops = [
  { id: 'wheat', key: 'wheat' },
  { id: 'rice', key: 'rice' },
  { id: 'tomato', key: 'tomato' },
  { id: 'cotton', key: 'cotton' },
  { id: 'sugarcane', key: 'sugarcane' },
  { id: 'maize', key: 'maize' },
  { id: 'potato', key: 'potato' },
  { id: 'soybean', key: 'soybean' },
  { id: 'mustard', key: 'mustard' },
  { id: 'chana', key: 'chana' },
  { id: 'groundnut', key: 'groundnut' },
  { id: 'onion', key: 'onion' },
  { id: 'chili', key: 'chili' },
  { id: 'apple', key: 'apple' },
  { id: 'mango', key: 'mango' },
  { id: 'banana', key: 'banana' },
  { id: 'citrus', key: 'citrus' },
  { id: 'turmeric', key: 'turmeric' },
  { id: 'tea', key: 'tea' },
  { id: 'coffee', key: 'coffee' },
  { id: 'jute', key: 'jute' },
  { id: 'barley', key: 'barley' },
  { id: 'bajra', key: 'bajra' },
  { id: 'jowar', key: 'jowar' },
  { id: 'ragi', key: 'ragi' }
];

const AdvisoryGenerator = () => {
  const { user } = useAuth();
  const { lang, t, getCropName, supportedLanguages } = useLanguage();
  const [crop, setCrop] = useState(user?.crops?.[0]?.toLowerCase() || 'wheat');
  const [location, setLocation] = useState(user?.location || 'Nashik, Maharashtra');
  const [coords, setCoords] = useState(user?.coords || { lat: 19.9975, lng: 73.7898 });
  const [showMap, setShowMap] = useState(true);
  const [geocoding, setGeocoding] = useState(false);
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const currentLangObj = supportedLanguages.find(l => l.code === lang) || supportedLanguages[0];

  // Resolve active user state
  const userState = useMemo(() => {
    if (user?.state) return user.state;
    if (location && location.includes(',')) {
      return location.split(',')[1].trim();
    }
    return 'Maharashtra';
  }, [user?.state, location]);

  // Generate dynamic location presets tailored to user's location & state
  const dynamicLocationPresets = useMemo(() => {
    const list = [];

    // 1. First button is always the User's Own Farm Location from Profile
    if (user?.location) {
      list.push({
        name: user.location,
        lat: user.coords?.lat || coords.lat,
        lng: user.coords?.lng || coords.lng,
        isMyFarm: true,
        tag: `My Farm (${user.name || 'Profile'})`
      });
    }

    // 2. Add districts from user's current state
    const stateDistricts = STATE_DISTRICTS_MAP[userState] || STATE_DISTRICTS_MAP['Maharashtra'];
    stateDistricts.forEach(d => {
      // Avoid duplicate of user's farm
      if (!list.some(item => item.name.toLowerCase() === d.name.toLowerCase())) {
        list.push(d);
      }
    });

    return list;
  }, [user?.location, user?.coords, user?.name, userState, coords.lat, coords.lng]);

  // Sync with user profile on mount
  useEffect(() => {
    if (user?.location && user.location !== location) {
      setLocation(user.location);
    }
  }, [user?.location]);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [coords.lat, coords.lng],
        zoom: 11,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Custom Farm Pin Marker
      const farmPinIcon = L.divIcon({
        className: 'farm-leaflet-pin',
        html: `
          <div style="
            background: linear-gradient(135deg, #10b981 0%, #047857 100%);
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 14px rgba(16, 185, 129, 0.6);
          ">
            <span style="transform: rotate(45deg); font-size: 16px;">🌾</span>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const marker = L.marker([coords.lat, coords.lng], {
        icon: farmPinIcon,
        draggable: true
      }).addTo(map);

      marker.bindPopup(`<strong>📍 Farm Location</strong><br/>${location}`).openPopup();

      // On Marker Drag
      marker.on('dragend', async (e) => {
        const newPos = e.target.getLatLng();
        setCoords({ lat: newPos.lat, lng: newPos.lng });
        await reverseGeocode(newPos.lat, newPos.lng);
      });

      // On Map Click to move pin
      map.on('click', async (e) => {
        marker.setLatLng(e.latlng);
        setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        map.panTo(e.latlng);
        await reverseGeocode(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      // Map cleanup on unmount handled gracefully
    };
  }, []);

  // Update map view when coords change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([coords.lat, coords.lng], 12);
      markerRef.current.setLatLng([coords.lat, coords.lng]);
      markerRef.current.setPopupContent(`<strong>📍 Farm Location</strong><br/>${location}`);
    }
  }, [coords.lat, coords.lng]);

  // Reverse Geocoding with Open-Meteo & Nominatim
  const reverseGeocode = async (lat, lng) => {
    setGeocoding(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`);
      if (res.ok) {
        const data = await res.json();
        const address = data.address || {};
        const district = address.state_district || address.county || address.city || address.town || address.village || 'Farm Zone';
        const state = address.state || 'India';
        const resolvedName = `${district}, ${state}`;
        setLocation(resolvedName);
      }
    } catch (e) {
      console.warn('Reverse geocode note:', e.message);
    } finally {
      setGeocoding(false);
    }
  };

  // Forward Geocoding when user types or clicks search
  const handleLocationSearch = async (locName) => {
    const query = locName || location;
    if (!query) return;
    setGeocoding(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.split(',')[0].trim())}&count=1&language=en&format=json`);
      if (res.ok) {
        const data = await res.json();
        if (data.results?.[0]) {
          const item = data.results[0];
          const newLat = item.latitude;
          const newLng = item.longitude;
          const fullName = `${item.name}${item.admin1 ? ', ' + item.admin1 : ''}`;
          setCoords({ lat: newLat, lng: newLng });
          setLocation(fullName);
        }
      }
    } catch (e) {
      console.warn('Geocoding search note:', e.message);
    } finally {
      setGeocoding(false);
    }
  };

  // GPS Locate Me Feature
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });
        await reverseGeocode(lat, lng);
        setGeocoding(false);
      },
      (err) => {
        console.warn('GPS location error:', err.message);
        setGeocoding(false);
        alert('Could not retrieve GPS location. Please select on the map or type district.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Select Preset Region
  const handlePresetSelect = (preset) => {
    setLocation(preset.name);
    setCoords({ lat: preset.lat, lng: preset.lng });
  };

  // Generate Advisory API Call
  const handleGenerate = async () => {
    setLoading(true);
    try {
      let currentLat = coords.lat;
      let currentLng = coords.lng;
      let targetLocation = location;

      // Ensure fresh geocoding for user-typed location
      if (location && location.trim()) {
        try {
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location.split(',')[0].trim())}&count=1&language=en&format=json`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.results?.[0]) {
              currentLat = geoData.results[0].latitude;
              currentLng = geoData.results[0].longitude;
              targetLocation = `${geoData.results[0].name}${geoData.results[0].admin1 ? ', ' + geoData.results[0].admin1 : ''}`;
              setCoords({ lat: currentLat, lng: currentLng });
              setLocation(targetLocation);
            }
          }
        } catch (e) {
          // fallback to current coords
        }
      }

      const res = await advisoryAPI.generate({
        crop,
        location: targetLocation,
        lat: currentLat,
        lng: currentLng,
        language: lang,
        soilType: user?.soilType || 'black'
      });
      if (res.data.success) {
        setAdvisory(res.data.data);
      }
    } catch (err) {
      console.error('Advisory generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>✨ {t('advisory')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('advisoryDesc')}</p>
      </div>

      <div className="grid-2">
        {/* Controls & Map Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{t('quickTools')}</h3>
            <span style={{ fontSize: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>
              📍 Location Synced ({userState})
            </span>
          </div>

          {/* Target Crop Selector */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontWeight: '600' }}>{t('targetCrop')}</label>
            <select 
              className="form-select" 
              value={crop} 
              onChange={e => setCrop(e.target.value)}
              style={{ fontSize: '15px', fontWeight: '600' }}
            >
              {availableCrops.map(c => (
                <option key={c.id} value={c.id}>
                  {getCropName(c.key)} ({c.id.charAt(0).toUpperCase() + c.id.slice(1)})
                </option>
              ))}
            </select>
          </div>

          {/* Location & Map Locate Slot */}
          <div className="form-group" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ fontWeight: '600', margin: 0 }}>
                {t('location')} & Map Locate Slot
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleLocateMe}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderColor: '#38bdf8' }}
                  title="Use device GPS"
                >
                  <Navigation size={13} />
                  GPS Locate
                </button>
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Layers size={13} />
                  {showMap ? 'Hide Map' : 'Show Map'}
                </button>
              </div>
            </div>

            {/* Input with Search trigger */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="text" 
                className="form-control" 
                value={location} 
                onChange={e => setLocation(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLocationSearch()}
                placeholder="Enter city or district (e.g. Nashik, Ludhiana, Guntur)..."
                required 
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => handleLocationSearch()}
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px'
                }}
                title="Search on Map"
              >
                <Search size={18} />
              </button>
            </div>

            {/* Interactive Map Slot Container */}
            {showMap && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div 
                  style={{ 
                    position: 'relative', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    border: '1px solid var(--glass-border)', 
                    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.25)' 
                  }}
                >
                  <div 
                    ref={mapContainerRef} 
                    style={{ height: '220px', width: '100%', background: '#0f172a', zIndex: 1 }} 
                  />
                  {geocoding && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(15, 23, 42, 0.65)',
                      backdropFilter: 'blur(2px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      color: '#34d399',
                      fontWeight: '600',
                      zIndex: 10
                    }}>
                      <Navigation size={18} className="animate-spin" /> Resolving Location...
                    </div>
                  )}

                  {/* Coordinates & Instruction Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    right: '8px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(6px)',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#94a3b8',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 5,
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <span>📍 Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)}</span>
                    <span style={{ color: '#34d399' }}>Click/drag pin to relocate</span>
                  </div>
                </div>

                {/* Location Presets generated according to User Location & State */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                      📍 Quick Hubs for {userState} & Your Farm:
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#38bdf8' }}>
                      Tailored to your location
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {dynamicLocationPresets.map((preset) => {
                      const isSelected = location.toLowerCase().includes(preset.name.split(',')[0].toLowerCase());
                      const isMyFarm = preset.isMyFarm;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handlePresetSelect(preset)}
                          style={{
                            background: isSelected
                              ? (isMyFarm ? 'rgba(56, 189, 248, 0.3)' : 'rgba(16, 185, 129, 0.25)')
                              : (isMyFarm ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.05)'),
                            border: isSelected
                              ? (isMyFarm ? '1px solid #38bdf8' : '1px solid #10b981')
                              : (isMyFarm ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid var(--glass-border)'),
                            color: isSelected
                              ? (isMyFarm ? '#38bdf8' : '#34d399')
                              : (isMyFarm ? '#7dd3fc' : 'var(--text-secondary)'),
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '11.5px',
                            fontWeight: isMyFarm || isSelected ? '700' : '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title={preset.tag}
                        >
                          {isMyFarm && <span>🏠</span>}
                          <span>{isMyFarm ? `My Farm (${preset.name.split(',')[0]})` : preset.name.split(',')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button 
            onClick={handleGenerate} 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '6px', padding: '14px', fontSize: '15px' }}
            disabled={loading}
          >
            <Sparkles size={18} />
            {loading ? t('scanningBtn') : t('generateAdvisory')}
          </button>
        </div>

        {/* Advisory Display Card */}
        <div>
          {advisory ? (
            <div className="glass-card" style={{ borderTop: '4px solid #10b981', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Header with live weather integration */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge-green">✨ Live Weather & AI Integrated</span>
                  <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>
                    {advisory.crop} • {advisory.location}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> {new Date(advisory.generatedAt).toLocaleTimeString()}
                </span>
              </div>

              {/* Weather Snapshot Badges */}
              {advisory.weatherSnapshot && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Thermometer size={18} color="#f59e0b" />
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Temp</div>
                      <strong style={{ fontSize: '13px' }}>{advisory.weatherSnapshot.temperature}°C</strong>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Droplets size={18} color="#38bdf8" />
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Humidity</div>
                      <strong style={{ fontSize: '13px' }}>{advisory.weatherSnapshot.humidity}%</strong>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CloudSun size={18} color="#60a5fa" />
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Rain</div>
                      <strong style={{ fontSize: '13px' }}>{advisory.weatherSnapshot.rainfall} mm</strong>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wind size={18} color="#a78bfa" />
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Sky</div>
                      <strong style={{ fontSize: '13px' }}>{advisory.weatherSnapshot.condition}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Main AI Rich HTML Content */}
              <div 
                dangerouslySetInnerHTML={{ __html: advisory.advisoryHtml }} 
                style={{ lineHeight: '1.7', fontSize: '14.5px' }}
              />

              {/* Structured Metric Action Cards */}
              {advisory.recommendations && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                  {/* Irrigation Card */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', borderLeft: '3px solid #38bdf8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#38bdf8', fontWeight: '700', marginBottom: '4px' }}>
                      <Droplets size={14} /> Irrigation Schedule
                    </div>
                    <strong style={{ color: '#f1f5f9', fontSize: '13px', display: 'block' }}>
                      {advisory.recommendations.irrigation.schedule}
                    </strong>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      Vol: ~{advisory.recommendations.irrigation.quantityLitersPerAcre} L/acre
                    </span>
                  </div>

                  {/* Fertilizer Card */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', borderLeft: '3px solid #34d399' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#34d399', fontWeight: '700', marginBottom: '4px' }}>
                      <Sprout size={14} /> Fertilizer Dose
                    </div>
                    <strong style={{ color: '#f1f5f9', fontSize: '13px', display: 'block' }}>
                      {advisory.recommendations.fertilizer.quantityKg} {advisory.recommendations.fertilizer.unit}
                    </strong>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      {advisory.recommendations.fertilizer.type}
                    </span>
                  </div>

                  {/* Pest Threat Card */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', borderLeft: '3px solid #f87171', gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#f87171', fontWeight: '700', marginBottom: '4px' }}>
                      <ShieldAlert size={14} /> Pest & Disease Vulnerability ({advisory.crop})
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#f1f5f9', marginBottom: '2px' }}>
                      <strong>Threat:</strong> {advisory.recommendations.pestControl.threat}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <strong>Remedy:</strong> {advisory.recommendations.pestControl.recommended}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ height: '100%', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px' }}>
              <Sparkles size={48} color="#10b981" style={{ marginBottom: '16px', opacity: 0.85 }} />
              <h3 style={{ fontSize: '19px', fontWeight: '700', marginBottom: '8px' }}>AI Farm Advisory Engine Ready</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '340px', lineHeight: '1.6' }}>
                Select your target crop, pin your farm location on the interactive map, and click <strong>"{t('generateAdvisory')}"</strong> to receive specific agronomic guidance in {currentLangObj.native}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple cloud sun component fallback if not in lucide
const CloudSun = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="M20 12h2" />
    <path d="m19.07 4.93-1.41 1.41" />
    <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
    <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
  </svg>
);

export default AdvisoryGenerator;
