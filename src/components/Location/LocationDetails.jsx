import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Globe, 
  Navigation,
  Heart,
  Share2,
  Camera,
  ChevronDown,
  ChevronUp,
  Users,
  DollarSign,
  Wifi,
  Car,
  Info
} from 'lucide-react';

const LocationDetails = ({ place, onNavigate, onFavorite, isFavorite }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  if (!place) {
    return (
      <div className="location-empty">
        <MapPin size={48} />
        <p>Pilih tempat untuk melihat detail</p>
      </div>
    );
  }

  const tabs = [
    { id: 'info', label: 'Info', icon: <Info size={16} /> },
    { id: 'photos', label: 'Foto', icon: <Camera size={16} /> },
    { id: 'reviews', label: 'Ulasan', icon: <Star size={16} /> }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return '#00cc44';
      case 'closed': return '#ff3333';
      default: return '#ffaa00';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'open': return 'Buka';
      case 'closed': return 'Tutup';
      default: return 'Tidak Diketahui';
    }
  };

  const operationalHours = [
    { day: 'Senin', hours: '08:00 - 22:00' },
    { day: 'Selasa', hours: '08:00 - 22:00' },
    { day: 'Rabu', hours: '08:00 - 22:00' },
    { day: 'Kamis', hours: '08:00 - 22:00' },
    { day: 'Jumat', hours: '08:00 - 23:00' },
    { day: 'Sabtu', hours: '09:00 - 23:00' },
    { day: 'Minggu', hours: '09:00 - 21:00' }
  ];

  return (
    <motion.div 
      className="location-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Image */}
      <div className="hero-section">
        <div className="hero-image">
          {place.photos?.[0] ? (
            <img src={place.photos[0]} alt={place.name} />
          ) : (
            <div className="hero-placeholder">
              <MapPin size={48} />
              <span>{place.category || 'Tempat'}</span>
            </div>
          )}
          <div className="hero-overlay">
            <h2 className="place-name">{place.name}</h2>
            <p className="place-category">{place.category}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div 
          className="status-badge"
          style={{ background: getStatusColor(place.open ? 'open' : 'closed') }}
        >
          <span className="status-dot" />
          {getStatusLabel(place.open ? 'open' : 'closed')}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <motion.button
            className="action-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onFavorite?.(place)}
          >
            <Heart 
              size={20} 
              fill={isFavorite ? '#ff4757' : 'none'}
              color={isFavorite ? '#ff4757' : 'white'}
            />
          </motion.button>

          <motion.button
            className="action-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate?.(place)}
          >
            <Navigation size={20} />
          </motion.button>

          <motion.button
            className="action-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Share2 size={20} />
          </motion.button>
        </div>
      </div>

      {/* Rating & Distance */}
      <div className="rating-distance">
        <div className="rating">
          <Star size={20} fill="#ffa502" color="#ffa502" />
          <span className="rating-value">{place.rating?.toFixed(1) || '4.5'}</span>
          <span className="review-count">({place.reviews || 128} ulasan)</span>
        </div>
        <div className="distance">
          <MapPin size={16} />
          <span>{place.distance?.toFixed(1) || '0.5'} km</span>
        </div>
      </div>

      {/* Price & Popularity */}
      <div className="price-popularity">
        <div className="price-level">
          <DollarSign size={16} />
          <span>{place.priceLevel || '💰💰'}</span>
        </div>
        <div className="popularity">
          <Users size={16} />
          <span>Populer</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'info' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Description */}
            <div className="info-section">
              <h4>Deskripsi</h4>
              <p className={`description ${!showFullDescription ? 'truncated' : ''}`}>
                {place.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
              </p>
              <button 
                className="show-more"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? (
                  <><ChevronUp size={14} /> Sembunyikan</>
                ) : (
                  <><ChevronDown size={14} /> Selengkapnya</>
                )}
              </button>
            </div>

            {/* Contact Info */}
            <div className="info-section">
              <h4>Kontak</h4>
              <div className="contact-list">
                {place.phone && (
                  <div className="contact-item">
                    <Phone size={16} />
                    <span>{place.phone}</span>
                  </div>
                )}
                {place.website && (
                  <div className="contact-item">
                    <Globe size={16} />
                    <a href={place.website} target="_blank" rel="noopener noreferrer">
                      {place.website}
                    </a>
                  </div>
                )}
                {place.address && (
                  <div className="contact-item">
                    <MapPin size={16} />
                    <span>{place.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Operational Hours */}
            <div className="info-section">
              <h4>
                <Clock size={16} />
                Jam Operasional
              </h4>
              <div className="hours-list">
                {operationalHours.map((schedule, index) => (
                  <div key={index} className="hours-item">
                    <span className="day">{schedule.day}</span>
                    <span className="hours">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div className="info-section">
              <h4>Fasilitas</h4>
              <div className="facilities-grid">
                <div className="facility-item">
                  <Wifi size={16} />
                  <span>WiFi Gratis</span>
                </div>
                <div className="facility-item">
                  <Car size={16} />
                  <span>Parkir</span>
                </div>
                <div className="facility-item">
                  <DollarSign size={16} />
                  <span>Kartu Kredit</span>
                </div>
                <div className="facility-item">
                  <Users size={16} />
                  <span>Reservasi</span>
                </div>
              </div>
            </div>

            {/* Coordinates */}
            <div className="info-section">
              <h4>Koordinat</h4>
              <div className="coordinates">
                <code>{place.lat?.toFixed(6)}, {place.lng?.toFixed(6)}</code>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'photos' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="photos-section"
          >
            <div className="photos-grid">
              {[1, 2, 3, 4, 5, 6].map((photo) => (
                <div key={photo} className="photo-item">
                  <div className="photo-placeholder">
                    <Camera size={24} />
                    <span>Foto {photo}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="reviews-section"
          >
            {/* Review akan dirender dari komponen Reviews */}
            <p className="no-reviews">Ulasan akan ditampilkan di sini</p>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .location-details {
          background: var(--bg-primary);
          border-radius: 16px;
          overflow: hidden;
        }

        .hero-section {
          position: relative;
          height: 250px;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .hero-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          color: white;
        }

        .place-name {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .place-category {
          font-size: 13px;
          opacity: 0.9;
          text-transform: capitalize;
        }

        .status-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        .quick-actions {
          position: absolute;
          top: 16px;
          left: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          background: rgba(0,0,0,0.5);
          border: none;
          border-radius: 12px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s;
        }

        .action-btn:hover {
          background: rgba(0,0,0,0.7);
        }

        .rating-distance {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rating-value {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .review-count {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .distance {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: var(--accent-color);
        }

        .price-popularity {
          display: flex;
          gap: 16px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .price-level,
        .popularity {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
        }

        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--text-secondary);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tab.active {
          color: var(--accent-color);
          border-bottom-color: var(--accent-color);
        }

        .tab-content {
          padding: 16px;
        }

        .info-section {
          margin-bottom: 20px;
        }

        .info-section h4 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .description {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .description.truncated {
          max-height: 80px;
          overflow: hidden;
          position: relative;
        }

        .description.truncated::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(transparent, var(--bg-primary));
        }

        .show-more {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: var(--accent-color);
          font-size: 12px;
          cursor: pointer;
          margin-top: 8px;
          padding: 0;
        }

        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .contact-item a {
          color: var(--accent-color);
          text-decoration: none;
        }

        .hours-list {
          background: var(--bg-secondary);
          border-radius: 8px;
          overflow: hidden;
        }

        .hours-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          font-size: 12px;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
        }

        .hours-item:last-child {
          border-bottom: none;
        }

        .hours {
          font-weight: 600;
        }

        .facilities-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .facility-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: var(--bg-secondary);
          border-radius: 8px;
          font-size: 12px;
          color: var(--text-primary);
        }

        .coordinates code {
          display: block;
          padding: 8px;
          background: var(--bg-secondary);
          border-radius: 6px;
          font-size: 12px;
          color: var(--accent-color);
        }

        .photos-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .photo-item {
          aspect-ratio: 1;
          background: var(--bg-secondary);
          border-radius: 8px;
          overflow: hidden;
        }

        .photo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .no-reviews {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }
      `}</style>
    </motion.div>
  );
};

export default LocationDetails;