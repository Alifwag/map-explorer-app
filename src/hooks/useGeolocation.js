import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const requestLocation = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'denied') {
        throw new Error('Izin lokasi ditolak!');
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setIsTracking(true);
        },
        (err) => {
          setError(err.message);
          setIsTracking(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
          ...options
        }
      );
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return { location, error, isTracking, requestLocation };
};