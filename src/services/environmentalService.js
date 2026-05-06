import axios from 'axios';

class EnvironmentalService {
  constructor() {
    this.AIR_QUALITY_API = 'https://api.openweathermap.org/data/2.5';
    this.API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
  }

  async getAirQuality(lat, lng) {
    try {
      const response = await axios.get(`${this.AIR_QUALITY_API}/air_pollution`, {
        params: {
          lat,
          lon: lng,
          appid: this.API_KEY
        }
      });

      const data = response.data.list[0];
      const aqi = data.main.aqi;
      
      return {
        index: aqi,
        level: this.getAQILevel(aqi),
        color: this.getAQIColor(aqi),
        components: data.components,
        pm2_5: data.components.pm2_5,
        pm10: data.components.pm10,
        no2: data.components.no2,
        o3: data.components.o3,
        timestamp: data.dt
      };
    } catch (error) {
      console.error('Error fetching air quality:', error);
      return this.getDefaultAirQuality();
    }
  }

  getAQILevel(aqi) {
    const levels = {
      1: 'Baik',
      2: 'Sedang',
      3: 'Tidak Sehat untuk Kelompok Sensitif',
      4: 'Tidak Sehat',
      5: 'Sangat Tidak Sehat'
    };
    return levels[aqi] || 'Tidak Diketahui';
  }

  getAQIColor(aqi) {
    const colors = {
      1: '#00e400', // Hijau
      2: '#ffff00', // Kuning
      3: '#ff7e00', // Orange
      4: '#ff0000', // Merah
      5: '#8f3f97'  // Ungu
    };
    return colors[aqi] || '#808080';
  }

  getDefaultAirQuality() {
    return {
      index: 1,
      level: 'Data tidak tersedia',
      color: '#808080',
      components: {},
      pm2_5: 0,
      pm10: 0,
      no2: 0,
      o3: 0
    };
  }

  async getWeatherData(lat, lng) {
    try {
      const response = await axios.get(`${this.AIR_QUALITY_API}/weather`, {
        params: {
          lat,
          lon: lng,
          appid: this.API_KEY,
          units: 'metric',
          lang: 'id'
        }
      });

      return {
        temperature: Math.round(response.data.main.temp),
        feelsLike: Math.round(response.data.main.feels_like),
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        windSpeed: response.data.wind.speed,
        windDirection: response.data.wind.deg,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        visibility: response.data.visibility,
        clouds: response.data.clouds.all
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }

  async getWildfireData(bounds) {
    // Simulasi data kebakaran hutan
    // Dalam implementasi sebenarnya, gunakan API dari NASA FIRMS atau MODIS
    
    const wildfires = [];
    const center = bounds.getCenter();
    
    for (let i = 0; i < 5; i++) {
      const lat = center.lat + (Math.random() - 0.5) * 0.1;
      const lng = center.lng + (Math.random() - 0.5) * 0.1;
      
      wildfires.push({
        id: i,
        location: { lat, lng },
        intensity: Math.random(),
        confidence: Math.random() * 100,
        acq_date: new Date().toISOString().split('T')[0],
        acq_time: Math.floor(Math.random() * 2400).toString().padStart(4, '0'),
        satellite: Math.random() > 0.5 ? 'Terra' : 'Aqua',
        frp: (Math.random() * 100).toFixed(1) // Fire Radiative Power
      });
    }
    
    return wildfires;
  }

  calculateUVIndex(lat, lng, date = new Date()) {
    // Kalkulasi sederhana UV Index berdasarkan latitude dan waktu
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const latitude = Math.abs(lat);
    
    let uvIndex = 0;
    
    if (latitude < 30) {
      uvIndex = 10; // Tropis
    } else if (latitude < 50) {
      uvIndex = 7;  // Subtropis
    } else {
      uvIndex = 4;  // Temperate
    }
    
    // Sesuaikan dengan musim
    if (dayOfYear > 80 && dayOfYear < 265) {
      uvIndex += 2; // Musim panas
    } else {
      uvIndex -= 2; // Musim dingin
    }
    
    return Math.max(0, Math.min(11, uvIndex));
  }
}

export const environmentalService = new EnvironmentalService();
export default environmentalService;