export const CATEGORIES = {
  restaurant: {
    label: 'Restoran',
    icon: '🍽️',
    color: '#ff6b6b',
    nominatimTag: 'restaurant'
  },
  hospital: {
    label: 'Rumah Sakit',
    icon: '🏥',
    color: '#ff4757',
    nominatimTag: 'hospital'
  },
  atm: {
    label: 'ATM / Bank',
    icon: '💳',
    color: '#2ed573',
    nominatimTag: 'atm'
  },
  tourism: {
    label: 'Tempat Wisata',
    icon: '🎯',
    color: '#ffa502',
    nominatimTag: 'tourism'
  },
  gas_station: {
    label: 'SPBU',
    icon: '⛽',
    color: '#5352ed',
    nominatimTag: 'fuel'
  },
  supermarket: {
    label: 'Supermarket',
    icon: '🛒',
    color: '#7bed9f',
    nominatimTag: 'supermarket'
  },
  hotel: {
    label: 'Hotel',
    icon: '🏨',
    color: '#eccc68',
    nominatimTag: 'hotel'
  },
  transport: {
    label: 'Transportasi',
    icon: '🚌',
    color: '#1e90ff',
    nominatimTag: 'station'
  }
};

export const TRANSPORT_MODES = {
  walking: {
    label: 'Jalan Kaki',
    icon: '🚶',
    speed: 5,
    color: '#4caf50'
  },
  cycling: {
    label: 'Sepeda',
    icon: '🚴',
    speed: 15,
    color: '#2196f3'
  },
  motorcycle: {
    label: 'Motor',
    icon: '🏍️',
    speed: 35,
    color: '#9c27b0'
  },
  car: {
    label: 'Mobil',
    icon: '🚗',
    speed: 50,
    color: '#f44336'
  },
  transit: {
    label: 'Transportasi Umum',
    icon: '🚌',
    speed: 30,
    color: '#ff9800'
  }
};

export const ACTIVITY_THRESHOLDS = {
  idle: { min: 0, max: 1, label: 'Diam' },
  walking: { min: 1, max: 6, label: 'Jalan Kaki' },
  running: { min: 6, max: 12, label: 'Lari' },
  cycling: { min: 12, max: 20, label: 'Sepeda' },
  motorcycling: { min: 20, max: 60, label: 'Motor' },
  driving: { min: 60, max: Infinity, label: 'Mobil' }
};

export const MAP_CONFIG = {
  defaultCenter: [-6.2088, 106.8456], // Jakarta
  defaultZoom: 13,
  maxZoom: 18,
  minZoom: 3,
  tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

export const API_ENDPOINTS = {
  nominatim: 'https://nominatim.openstreetmap.org',
  osrm: 'https://router.project-osrm.org',
  overpass: 'https://overpass-api.de/api',
  openWeatherMap: 'https://api.openweathermap.org/data/2.5'
};

export const STORAGE_KEYS = {
  favorites: 'map_explorer_favorites',
  history: 'map_explorer_history',
  trips: 'map_explorer_trips',
  settings: 'map_explorer_settings',
  theme: 'map_explorer_theme'
};