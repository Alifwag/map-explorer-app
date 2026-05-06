import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { debounce } from '../../utils/debounce';

const TrafficLayer = ({ visible = true }) => {
  const map = useMap();
  const [trafficData, setTrafficData] = useState([]);
  const [trafficLayer, setTrafficLayer] = useState(null);

  useEffect(() => {
    if (!visible) {
      if (trafficLayer) map.removeLayer(trafficLayer);
      return;
    }

    const fetchTrafficData = async () => {
      try {
        const bounds = map.getBounds();
        const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
        
        // Simulasi data lalu lintas (ganti dengan API sebenarnya)
        const simulatedData = generateSimulatedTraffic(bounds);
        setTrafficData(simulatedData);
        
        // Render traffic lines
        const layer = L.layerGroup();
        
        simulatedData.forEach(segment => {
          const color = getTrafficColor(segment.congestion);
          const polyline = L.polyline(segment.coordinates, {
            color: color,
            weight: 5,
            opacity: 0.7,
            className: `traffic-line ${segment.congestion}`
          });
          
          polyline.bindPopup(`
            <div class="traffic-popup">
              <h4>Status: ${segment.congestion}</h4>
              <p>Kecepatan rata-rata: ${segment.avgSpeed} km/h</p>
              <p>Delay: ${segment.delay} menit</p>
            </div>
          `);
          
          layer.addLayer(polyline);
        });
        
        if (trafficLayer) map.removeLayer(trafficLayer);
        layer.addTo(map);
        setTrafficLayer(layer);
        
      } catch (error) {
        console.error('Error fetching traffic data:', error);
      }
    };

    const debouncedFetch = debounce(fetchTrafficData, 1000);
    
    map.on('moveend', debouncedFetch);
    fetchTrafficData();

    return () => {
      map.off('moveend', debouncedFetch);
      if (trafficLayer) map.removeLayer(trafficLayer);
    };
  }, [map, visible]);

  const generateSimulatedTraffic = (bounds) => {
    const segments = [];
    const center = bounds.getCenter();
    
    // Generate random road segments
    for (let i = 0; i < 10; i++) {
      const startLat = center.lat + (Math.random() - 0.5) * 0.05;
      const startLng = center.lng + (Math.random() - 0.5) * 0.05;
      const endLat = startLat + (Math.random() - 0.5) * 0.02;
      const endLng = startLng + (Math.random() - 0.5) * 0.02;
      
      const congestion = ['lancar', 'sedang', 'macet'][Math.floor(Math.random() * 3)];
      const avgSpeed = congestion === 'lancar' ? 50 + Math.random() * 30 :
                      congestion === 'sedang' ? 20 + Math.random() * 30 :
                      5 + Math.random() * 15;
      
      segments.push({
        id: i,
        coordinates: [[startLat, startLng], [endLat, endLng]],
        congestion,
        avgSpeed: Math.round(avgSpeed),
        delay: Math.round(Math.random() * 30)
      });
    }
    
    return segments;
  };

  const getTrafficColor = (congestion) => {
    switch(congestion) {
      case 'lancar': return '#00cc44';
      case 'sedang': return '#ffaa00';
      case 'macet': return '#ff3333';
      default: return '#0066ff';
    }
  };

  return null;
};

export default TrafficLayer;