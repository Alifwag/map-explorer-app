import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { placesService } from '../../services/placesService';

const MarkerCluster = ({ category = null }) => {
  const map = useMap();
  const clusterGroup = useRef(null);

  useEffect(() => {
    if (!clusterGroup.current) {
      clusterGroup.current = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          let size = 'small';
          if (count > 50) size = 'large';
          else if (count > 20) size = 'medium';
          
          return L.divIcon({
            html: `<div class="cluster-icon ${size}"><span>${count}</span></div>`,
            className: 'custom-cluster',
            iconSize: L.point(40, 40)
          });
        }
      });
      map.addLayer(clusterGroup.current);
    }

    const fetchPlaces = async () => {
      try {
        const bounds = map.getBounds();
        const center = bounds.getCenter();
        const places = await placesService.searchNearby(
          center.lat, 
          center.lng, 
          category
        );
        
        clusterGroup.current.clearLayers();
        
        places.forEach(place => {
          const marker = L.marker([place.lat, place.lng], {
            icon: createPlaceIcon(place.category)
          });
          
          marker.bindPopup(createPopupContent(place));
          clusterGroup.current.addLayer(marker);
        });
        
      } catch (error) {
        console.error('Error fetching places for cluster:', error);
      }
    };

    fetchPlaces();

    return () => {
      if (clusterGroup.current) {
        map.removeLayer(clusterGroup.current);
      }
    };
  }, [map, category]);

  const createPlaceIcon = (category) => {
    const colors = {
      restaurant: '#ff6b6b',
      hospital: '#ff4757',
      atm: '#2ed573',
      tourism: '#ffa502',
      gas_station: '#5352ed',
      supermarket: '#7bed9f',
      hotel: '#eccc68',
      transport: '#1e90ff'
    };

    return L.divIcon({
      html: `<div class="place-marker" style="background: ${colors[category] || '#0066ff'}">
              ${getCategoryIcon(category)}
            </div>`,
      className: 'custom-marker',
      iconSize: [30, 30]
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      restaurant: '🍽️',
      hospital: '🏥',
      atm: '💳',
      tourism: '🎯',
      gas_station: '⛽',
      supermarket: '🛒',
      hotel: '🏨',
      transport: '🚌'
    };
    return icons[category] || '📍';
  };

  const createPopupContent = (place) => `
    <div class="place-popup">
      <h3>${place.name}</h3>
      <div class="rating">⭐ ${place.rating?.toFixed(1) || 'N/A'}</div>
      <p>${place.address || ''}</p>
      <div class="status ${place.open ? 'open' : 'closed'}">
        ${place.open ? '🟢 Buka' : '🔴 Tutup'}
      </div>
      <button onclick="navigateTo(${place.lat}, ${place.lng})" class="nav-btn">
        🧭 Navigasi
      </button>
    </div>
  `;

  return null;
};

export default MarkerCluster;