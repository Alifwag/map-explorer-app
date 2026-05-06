import React, { useState } from 'react';
import { useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Compass,
  MapPin,
  Activity,
  Thermometer,
  Wind,
  Droplets
} from 'lucide-react';

const MapControls = ({ isTracking, onStartTracking, onStopTracking }) => {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    traffic: true,
    bike: false,
    transit: false,
    airQuality: false,
    wildfire: false
  });

  const toggleFullscreen = () => {
    const container = document.querySelector('.map-container');
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const centerOnUser = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      map.flyTo([position.coords.latitude, position.coords.longitude], 16, {
        duration: 2
      });
    });
  };

  const toggleLayer = (layerName) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  const layerButtons = [
    { id: 'traffic', icon: <Activity size={18} />, label: 'Lalu Lintas', color: '#ff4444' },
    { id: 'bike', icon: <Compass size={18} />, label: 'Jalur Sepeda', color: '#00cc66' },
    { id: 'transit', icon: <Navigation size={18} />, label: 'Transportasi', color: '#0066ff' },
    { id: 'airQuality', icon: <Wind size={18} />, label: 'Kualitas Udara', color: '#9933ff' },
    { id: 'wildfire', icon: <Thermometer size={18} />, label: 'Kebakaran Hutan', color: '#ff6600' }
  ];

  return (
    <div className="map-controls-overlay">
      {/* Layer Toggle Button */}
      <motion.button
        className="control-button"
        onClick={() => setShowLayers(!showLayers)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Toggle Layers"
      >
        <Layers size={20} />
      </motion.button>

      {/* Layer Panel */}
      <AnimatePresence>
        {showLayers && (
          <motion.div
            className="layers-panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h4>Layer Peta</h4>
            {layerButtons.map(layer => (
              <motion.button
                key={layer.id}
                className={`layer-toggle ${activeLayers[layer.id] ? 'active' : ''}`}
                onClick={() => toggleLayer(layer.id)}
                whileHover={{ x: 5 }}
                style={{
                  borderColor: activeLayers[layer.id] ? layer.color : 'transparent'
                }}
              >
                <span className="layer-icon" style={{ color: layer.color }}>
                  {layer.icon}
                </span>
                <span className="layer-label">{layer.label}</span>
                <div className="toggle-switch">
                  <div className={`toggle-thumb ${activeLayers[layer.id] ? 'on' : 'off'}`} />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="navigation-controls">
        <motion.button
          className="control-button"
          onClick={centerOnUser}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Pusatkan ke Lokasi"
        >
          <MapPin size={20} />
        </motion.button>

        <motion.button
          className="control-button"
          onClick={toggleFullscreen}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={isFullscreen ? "Keluar Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </motion.button>
      </div>

      {/* Tracking Control */}
      <motion.button
        className={`tracking-button ${isTracking ? 'tracking' : ''}`}
        onClick={isTracking ? onStopTracking : onStartTracking}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="tracking-indicator">
          <div className={`pulse ${isTracking ? 'active' : ''}`} />
          <span>{isTracking ? '⏹ Stop Tracking' : '▶ Mulai Tracking'}</span>
        </div>
      </motion.button>

      <style jsx>{`
        .map-controls-overlay {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .control-button {
          width: 44px;
          height: 44px;
          background: white;
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .control-button:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .layers-panel {
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          min-width: 250px;
          margin-bottom: 10px;
        }

        .layers-panel h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .layer-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: #f8f9fa;
          border: 2px solid transparent;
          border-radius: 10px;
          margin-bottom: 6px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .layer-toggle:hover {
          background: #e9ecef;
        }

        .layer-toggle.active {
          background: #e7f1ff;
        }

        .layer-icon {
          flex-shrink: 0;
        }

        .layer-label {
          flex: 1;
          text-align: left;
          font-size: 13px;
          font-weight: 500;
        }

        .toggle-switch {
          width: 36px;
          height: 20px;
          background: #ccc;
          border-radius: 10px;
          position: relative;
        }

        .toggle-thumb {
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          transition: all 0.3s;
        }

        .toggle-thumb.on {
          right: 2px;
          background: #0066ff;
        }

        .toggle-thumb.off {
          left: 2px;
        }

        .tracking-button {
          padding: 12px 20px;
          background: white;
          border: 2px solid #0066ff;
          border-radius: 25px;
          font-weight: 600;
          color: #0066ff;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        }

        .tracking-button.tracking {
          background: #ff4444;
          border-color: #ff4444;
          color: white;
          animation: pulse-border 2s infinite;
        }

        @keyframes pulse-border {
          0% { box-shadow: 0 0 0 0 rgba(255,68,68,0.4); }
          70% { box-shadow: 0 0 0 15px rgba(255,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,68,68,0); }
        }

        .tracking-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pulse {
          width: 10px;
          height: 10px;
          background: #ccc;
          border-radius: 50%;
        }

        .pulse.active {
          background: #ff4444;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MapControls;