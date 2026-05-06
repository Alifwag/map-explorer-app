import { useState, useEffect, useRef } from 'react';
import { haversineDistance } from '../utils/haversine';

export const useSpeedTracker = (currentLocation) => {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [activityType, setActivityType] = useState('idle');
  const [tripData, setTripData] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const lastPositionRef = useRef(null);
  const lastTimeRef = useRef(null);

  const startTracking = () => setIsTracking(true);
  const stopTracking = () => {
    setIsTracking(false);
    saveTrip();
  };

  useEffect(() => {
    if (!currentLocation || !isTracking) return;

    if (lastPositionRef.current) {
      const distance = haversineDistance(
        lastPositionRef.current.lat,
        lastPositionRef.current.lng,
        currentLocation.lat,
        currentLocation.lng
      );

      const timeDiff = (Date.now() - lastTimeRef.current) / 3600000; // dalam jam
      const speed = distance / timeDiff; // km/h

      setCurrentSpeed(speed);
      setTotalDistance(prev => prev + distance);

      // Update average speed
      const speeds = tripData.map(p => p.speed);
      const avg = speeds.reduce((a, b) => a + b, speed) / (speeds.length + 1);
      setAverageSpeed(avg);

      // Deteksi aktivitas
      let activity = 'idle';
      if (speed <= 6) activity = 'walking';
      else if (speed <= 20) activity = 'cycling';
      else if (speed <= 60) activity = 'motorcycling';
      else activity = 'driving';
      setActivityType(activity);

      // Simpan data trip
      setTripData(prev => [...prev, {
        timestamp: Date.now(),
        location: currentLocation,
        speed,
        activity
      }]);
    }

    lastPositionRef.current = currentLocation;
    lastTimeRef.current = Date.now();
  }, [currentLocation, isTracking]);

  const saveTrip = () => {
    const trips = JSON.parse(localStorage.getItem('trips') || '[]');
    trips.push({
      date: new Date().toISOString(),
      distance: totalDistance.toFixed(2),
      avgSpeed: averageSpeed.toFixed(1),
      duration: (Date.now() - lastTimeRef.current) / 1000,
      data: tripData
    });
    localStorage.setItem('trips', JSON.stringify(trips));
  };

  return {
    currentSpeed,
    averageSpeed,
    totalDistance,
    activityType,
    isTracking,
    startTracking,
    stopTracking,
    tripData
  };
};