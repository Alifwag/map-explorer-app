class GeolocationService {
  constructor() {
    this.watchId = null;
    this.currentPosition = null;
    this.listeners = new Set();
  }

  async requestPermission() {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state;
    } catch (error) {
      console.error('Permission check failed:', error);
      return 'prompt';
    }
  }

  getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation tidak didukung di browser ini'));
        return;
      }

      const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          };
          
          this.currentPosition = location;
          resolve(location);
        },
        (error) => {
          let message = 'Gagal mendapatkan lokasi';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Izin lokasi ditolak';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Informasi lokasi tidak tersedia';
              break;
            case error.TIMEOUT:
              message = 'Waktu permintaan lokasi habis';
              break;
          }
          reject(new Error(message));
        },
        { ...defaultOptions, ...options }
      );
    });
  }

  startWatching(callback, options = {}) {
    if (!navigator.geolocation) {
      throw new Error('Geolocation tidak didukung');
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        };

        this.currentPosition = location;
        this.listeners.forEach(listener => listener(location));
        callback?.(location);
      },
      (error) => {
        console.error('Watch position error:', error);
        callback?.(null, error);
      },
      { ...defaultOptions, ...options }
    );

    return this.watchId;
  }

  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  addListener(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  removeListener(listener) {
    this.listeners.delete(listener);
  }

  getLastPosition() {
    return this.currentPosition;
  }

  isGeolocationAvailable() {
    return 'geolocation' in navigator;
  }
}

export const geolocationService = new GeolocationService();
export default geolocationService;