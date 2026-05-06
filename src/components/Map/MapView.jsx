import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useSpeedTracker } from '../../hooks/useSpeedTracker';
import TrafficLayer from './TrafficLayer';
import MarkerCluster from './MarkerCluster';
import 'leaflet/dist/leaflet.css';

const UserMarker = ({ position, speed, activity }) => {
  const icon = L.divIcon({
    className: 'user-marker',
    html: `<div class="pulse-marker ${activity}">
      <div class="speed-badge">${Math.round(speed)} km/h</div>
    </div>`,
    iconSize: [30, 30]
  });

  return position ? (
    <Marker position={[position.lat, position.lng]} icon={icon}>
      <Popup>
        <div>
          <h3>Posisi Anda</h3>
          <p>Kecepatan: {Math.round(speed)} km/h</p>
          <p>Aktivitas: {activity}</p>
        </div>
      </Popup>
    </Marker>
  ) : null;
};

const MapView = () => {
  const { location, error } = useGeolocation({ enableHighAccuracy: true });
  const { currentSpeed, activityType, isTracking, startTracking, stopTracking } = 
    useSpeedTracker(location);

  const defaultCenter = location ? [location.lat, location.lng] : [-6.2088, 106.8456];
  
  return (
    <div className="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        <TrafficLayer />
        <MarkerCluster />
        
        <UserMarker 
          position={location} 
          speed={currentSpeed} 
          activity={activityType} 
        />
        
        <MapControls 
          isTracking={isTracking}
          onStartTracking={startTracking}
          onStopTracking={stopTracking}
        />
      </MapContainer>
      
      <SpeedPanel 
        speed={currentSpeed} 
        avgSpeed={0} 
        distance={0}
        activity={activityType}
      />
    </div>
  );
};

const SpeedPanel = ({ speed, avgSpeed, distance, activity }) => (
  <div className="speed-panel">
    <div className="speed-display">
      <span className="current-speed">{Math.round(speed)}</span>
      <span className="speed-unit">km/h</span>
    </div>
    <div className="activity-badge">{activity}</div>
    <div className="stats-row">
      <div>Avg: {Math.round(avgSpeed)} km/h</div>
      <div>Distance: {distance.toFixed(2)} km</div>
    </div>
  </div>
);

const MapControls = ({ isTracking, onStartTracking, onStopTracking }) => (
  <div className="map-controls">
    <button 
      className={`track-btn ${isTracking ? 'stop' : 'start'}`}
      onClick={isTracking ? onStopTracking : onStartTracking}
    >
      {isTracking ? '⏹ Stop' : '▶ Start'} Tracking
    </button>
  </div>
);

export default MapView;