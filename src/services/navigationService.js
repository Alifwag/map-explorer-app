import { haversineDistance } from '../utils/haversine';

class NavigationService {
  constructor() {
    this.OSRM_BASE_URL = 'https://router.project-osrm.org';
    this.currentRoute = null;
    this.alternatives = [];
  }

  async getRoute(origin, destination, mode = 'driving') {
    const profiles = {
      walking: 'foot',
      cycling: 'bike',
      driving: 'car',
      transit: 'car'
    };

    const profile = profiles[mode] || 'car';
    const url = `${this.OSRM_BASE_URL}/route/v1/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;

    try {
      const response = await fetch(`${url}?overview=full&geometries=geojson&steps=true&alternatives=true&annotations=true`);
      const data = await response.json();

      if (data.code !== 'Ok') {
        throw new Error('Route not found');
      }

      const mainRoute = this.formatRoute(data.routes[0]);
      const alternatives = data.routes.slice(1).map(route => this.formatRoute(route));

      this.currentRoute = mainRoute;
      this.alternatives = alternatives;

      return {
        main: mainRoute,
        alternatives
      };
    } catch (error) {
      console.error('Error fetching route:', error);
      throw error;
    }
  }

  formatRoute(route) {
    const legs = route.legs[0];
    const steps = legs.steps.map(step => ({
      instruction: step.maneuver?.instruction || 'Lanjutkan',
      distance: step.distance,
      duration: step.duration,
      type: step.maneuver?.type || 'straight',
      modifier: step.maneuver?.modifier,
      location: {
        lat: step.maneuver?.location[1],
        lng: step.maneuver?.location[0]
      },
      intersections: step.intersections?.map(intersection => ({
        location: {
          lat: intersection.location[1],
          lng: intersection.location[0]
        },
        bearings: intersection.bearings,
        entry: intersection.entry
      }))
    }));

    return {
      distance: (legs.distance / 1000).toFixed(2),
      duration: Math.round(legs.duration / 60),
      steps,
      geometry: route.geometry,
      summary: legs.summary,
      startPoint: {
        lat: legs.steps[0]?.maneuver?.location[1],
        lng: legs.steps[0]?.maneuver?.location[0]
      },
      endPoint: {
        lat: legs.steps[legs.steps.length - 1]?.maneuver?.location[1],
        lng: legs.steps[legs.steps.length - 1]?.maneuver?.location[0]
      }
    };
  }

  async getTrafficData(bounds) {
    // Simulasi data lalu lintas
    const trafficSegments = [];
    const center = bounds.getCenter();
    
    for (let i = 0; i < 15; i++) {
      const startLat = center.lat + (Math.random() - 0.5) * 0.05;
      const startLng = center.lng + (Math.random() - 0.5) * 0.05;
      const endLat = startLat + (Math.random() - 0.5) * 0.03;
      const endLng = startLng + (Math.random() - 0.5) * 0.03;
      
      const congestion = Math.random();
      let status, color, speed;
      
      if (congestion > 0.7) {
        status = 'macet';
        color = '#ff3333';
        speed = Math.random() * 15 + 5;
      } else if (congestion > 0.3) {
        status = 'sedang';
        color = '#ffaa00';
        speed = Math.random() * 25 + 20;
      } else {
        status = 'lancar';
        color = '#00cc44';
        speed = Math.random() * 30 + 40;
      }

      trafficSegments.push({
        id: i,
        coordinates: [[startLat, startLng], [endLat, endLng]],
        status,
        color,
        avgSpeed: Math.round(speed),
        delay: status === 'macet' ? Math.round(Math.random() * 20) : 0
      });
    }

    return trafficSegments;
  }

  calculateDistance(point1, point2) {
    return haversineDistance(
      point1.lat, point1.lng,
      point2.lat, point2.lng
    );
  }

  calculateETA(distance, speed) {
    // distance in km, speed in km/h
    const timeInHours = distance / speed;
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
    return { hours, minutes };
  }

  async reverseGeocode(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Lokasi tidak diketahui';
    }
  }
}

export const navigationService = new NavigationService();
export default navigationService;