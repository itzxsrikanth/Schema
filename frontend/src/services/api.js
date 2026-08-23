import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kisan_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  getProfile: () => api.get('/farmer/profile'),
  updateProfile: (data) => api.put('/farmer/profile', data)
};

export const cropAPI = {
  recommend: (data) => api.post('/crop/recommend', data)
};

export const weatherAPI = {
  getForecast: (location) => api.get('/weather/forecast', { params: { location } })
};

export const diseaseAPI = {
  detect: (data) => api.post('/disease/detect', data)
};

export const advisoryAPI = {
  generate: (data) => api.post('/advisory/generate', data)
};

export const schemeAPI = {
  match: (data) => api.post('/schemes/match', data)
};

export default api;
