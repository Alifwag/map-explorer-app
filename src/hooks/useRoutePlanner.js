import { useState, useCallback } from 'react';
import { routeCache } from '../utils/cache';
import { haversineDistance } from '../utils/haversine';

export const useRoutePlanner = () => {
  const [routeData, setRouteData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);
  const [transportMode, setTransportMode] = useState('car');

  const calculateRoute = useCallback(async (origin, destination, mode = transportMode) => {
    if (!origin || !destination) return;

    const cacheKey = `route_${origin.lat}_${origin.lng}_${destination.lat}_${destination.lng}_${mode}`;
    const cached = routeCache.get(cacheKey);

    if (cached) {
      setRouteData(cached);
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      const OSRM_API = `https://router.project-osrm.org/route/v1/${mode}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
      
      const response = await fetch(`${OSRM_API}?overview=full&geometries=geojson&steps=true&alternatives=true`);
      const data = await response.json();

      if (data.code !== 'Ok') {
        throw new Error('Rute tidak ditemukan');
      }

      const route = data.routes[0];
      const distance = route.distance / 1000; // km
      const duration = route.duration / 60; // minutes

      const routeInfo = {
        distance: distance.toFixed(2),
        time: Math.round(duration),
        coordinates: route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
        instructions: route.legs[0].steps.map(step => ({
          text: step.maneuver.instruction || 'Lanjutkan',
          distance: step.distance,
          type: step.maneuver.type
        })),
        alternatives: data.routes.slice(1).map(alt => ({
          distance: (alt.distance / 1000).toFixed(2),
          time: Math.round(alt.duration / 60),
          traffic: ['lancar', 'sedang', 'macet'][Math.floor(Math.random() * 3)]
        })),
        traffic: ['lancar', 'sedang', 'macet'][Math.floor(Math.random() * 3)]
      };

      setRouteData(routeInfo);
      routeCache.set(cacheKey, routeInfo);

    } catch (err) {
      setError('Gagal menghitung rute. Silakan coba lagi.');
      console.error('Route calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  }, [transportMode]);

  const clearRoute = useCallback(() => {
    setRouteData(null);
    setError(null);
  }, []);

  return {
    routeData,
    isCalculating,
    error,
    transportMode,
    setTransportMode,
    calculateRoute,
    clearRoute
  };
};