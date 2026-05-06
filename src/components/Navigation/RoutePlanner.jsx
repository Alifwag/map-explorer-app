import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { motion } from 'framer-motion';
import { 
  Navigation, 
  Footprints, 
  Bike, 
  Car, 
  Bus,
  Clock,
  Route
} from 'lucide-react';

const RoutePlanner = ({ destination, userLocation, onRouteCalculated }) => {
  const map = useMap();
  const [transportMode, setTransportMode] = useState('car');
  const [routeInfo, setRouteInfo] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [routingControl, setRoutingControl] = useState(null);

  const transportModes = [
    { id: 'walking', icon: <Footprints size={20} />, label: 'Jalan Kaki', speed: 5 },
    { id: 'cycling', icon: <Bike size={20} />, label: 'Sepeda', speed: 15 },
    { id: 'motorcycle', icon: <span>🏍️</span>, label: 'Motor', speed: 35 },
    { id: 'car', icon: <Car size={20} />, label: 'Mobil', speed: 50 },
    { id: 'transit', icon: <Bus size={20} />, label: 'Transportasi Umum', speed: 30 }
  ];

  useEffect(() => {
    if (!destination || !userLocation) return;

    setIsCalculating(true);

    // Hapus rute sebelumnya
    if (routingControl) {
      map.removeControl(routingControl);
    }

    // Buat rute baru
    const control = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(destination.lat, destination.lng)
      ],
      routeWhileDragging: true,
      showAlternatives: true,
      lineOptions: {
        styles: [{ color: '#0066ff', weight: 6, opacity: 0.8 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: getRoutingProfile(transportMode)
      })
    });

    control.on('routesfound', (e) => {
      const routes = e.routes;
      if (routes.length > 0) {
        const bestRoute = routes[0];
        const info = {
          distance: (bestRoute.summary.totalDistance / 1000).toFixed(2),
          time: Math.round(bestRoute.summary.totalTime / 60),
          instructions: bestRoute.instructions,
          coordinates: bestRoute.coordinates
        };
        setRouteInfo(info);
        onRouteCalculated?.(info);
        
        // Fit map to route
        const bounds = L.latLngBounds(
          bestRoute.coordinates.map(c => [c.lat, c.lng])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    });

    control.addTo(map);
    setRoutingControl(control);
    setIsCalculating(false);

    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [destination, userLocation, transportMode]);

  const getRoutingProfile = (mode) => {
    const profiles = {
      walking: 'foot',
      cycling: 'bike',
      motorcycle: 'car', // OSRM doesn't have motorcycle profile
      car: 'car',
      transit: 'car' // Fallback for transit
    };
    return profiles[mode] || 'car';
  };

  return (
    <div className="route-planner">
      {/* Transport Mode Selection */}
      <div className="transport-modes">
        {transportModes.map(mode => (
          <motion.button
            key={mode.id}
            className={`mode-button ${transportMode === mode.id ? 'active' : ''}`}
            onClick={() => setTransportMode(mode.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {mode.icon}
            <span className="mode-label">{mode.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Route Information */}
      {isCalculating && (
        <div className="calculating">
          <div className="spinner" />
          <span>Menghitung rute...</span>
        </div>
      )}

      {routeInfo && !isCalculating && (
        <motion.div 
          className="route-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="info-grid">
            <div className="info-item">
              <Route size={18} />
              <div>
                <div className="info-label">Jarak</div>
                <div className="info-value">{routeInfo.distance} km</div>
              </div>
            </div>
            
            <div className="info-item">
              <Clock size={18} />
              <div>
                <div className="info-label">Estimasi Waktu</div>
                <div className="info-value">{routeInfo.time} menit</div>
              </div>
            </div>

            <div className="info-item">
              <Navigation size={18} />
              <div>
                <div className="info-label">Mode</div>
                <div className="info-value">
                  {transportModes.find(m => m.id === transportMode)?.label}
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Status */}
          <div className="traffic-status">
            <div className={`status-indicator ${getTrafficStatus(routeInfo.time)}`}>
              <div className="status-dot" />
              <span>{getTrafficLabel(routeInfo.time)}</span>
            </div>
            {routeInfo.time > 30 && (
              <div className="delay-warning">
                ⚠️ Delay: +{Math.round(routeInfo.time * 0.1)} menit
              </div>
            )}
          </div>
        </motion.div>
      )}

      <style jsx>{`
        .route-planner {
          background: var(--bg-primary);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .transport-modes {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .mode-button {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          background: var(--bg-secondary);
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 70px;
        }

        .mode-button.active {
          background: #e7f1ff;
          border-color: #0066ff;
          color: #0066ff;
        }

        .mode-label {
          font-size: 11px;
          font-weight: 500;
        }

        .calculating {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          color: var(--text-secondary);
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid var(--border-color);
          border-top-color: #0066ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .route-info {
          margin-top: 12px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg-secondary);
          border-radius: 12px;
        }

        .info-label {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .info-value {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .traffic-status {
          padding: 12px;
          background: #f0f7ff;
          border-radius: 8px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          font-size: 13px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-indicator.lancar .status-dot {
          background: #00cc44;
        }

        .status-indicator.sedang .status-dot {
          background: #ffaa00;
        }

        .status-indicator.macet .status-dot {
          background: #ff3333;
        }

        .delay-warning {
          margin-top: 8px;
          padding: 8px;
          background: #fff3cd;
          border-radius: 6px;
          font-size: 12px;
          color: #856404;
        }
      `}</style>
    </div>
  );
};

const getTrafficStatus = (time) => {
  if (time < 20) return 'lancar';
  if (time < 40) return 'sedang';
  return 'macet';
};

const getTrafficLabel = (time) => {
  if (time < 20) return 'Lancar ✅';
  if (time < 40) return 'Sedang ⚡';
  return 'Macet 🔴';
};

export default RoutePlanner;