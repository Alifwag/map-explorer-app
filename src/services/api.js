import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      console.error('No response from server');
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  places: {
    search: (params) => apiClient.get('/places/search', { params }),
    getDetails: (id) => apiClient.get(`/places/${id}`),
    getReviews: (id) => apiClient.get(`/places/${id}/reviews`),
    addReview: (id, data) => apiClient.post(`/places/${id}/reviews`, data)
  },
  
  navigation: {
    getRoute: (origin, destination, mode) => 
      apiClient.get('/navigation/route', { params: { origin, destination, mode } }),
    getTraffic: (bbox) => 
      apiClient.get('/navigation/traffic', { params: { bbox } })
  },
  
  user: {
    getProfile: () => apiClient.get('/user/profile'),
    updateProfile: (data) => apiClient.put('/user/profile', data),
    getTrips: () => apiClient.get('/user/trips'),
    saveTrip: (data) => apiClient.post('/user/trips', data)
  },
  
  environmental: {
    getAirQuality: (lat, lng) => 
      apiClient.get('/environmental/air-quality', { params: { lat, lng } }),
    getWildfireData: (bbox) => 
      apiClient.get('/environmental/wildfire', { params: { bbox } })
  }
};

export default apiClient;