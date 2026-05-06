import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, MapPin, Star, Navigation } from 'lucide-react';

const Favorites = ({ onNavigate }) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  };

  const removeFavorite = (id) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const clearAll = () => {
    if (window.confirm('Hapus semua favorit?')) {
      setFavorites([]);
      localStorage.removeItem('favorites');
    }
  };

  const filteredFavorites = selectedFilter === 'all' 
    ? favorites 
    : favorites.filter(f => f.category === selectedFilter);

  const categories = ['all', ...new Set(favorites.map(f => f.category))];

  return (
    <div className="favorites-panel">
      <div className="favorites-header">
        <h3>
          <Heart size={20} fill="#ff4757" color="#ff4757" />
          Favorit Saya
        </h3>
        {favorites.length > 0 && (
          <button className="clear-btn" onClick={clearAll}>
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <Heart size={48} />
          <p>Belum ada tempat favorit</p>
          <span>Klik ikon hati untuk menyimpan tempat</span>
        </div>
      ) : (
        <>
          {/* Category Filter */}
          <div className="filter-scroll">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-chip ${selectedFilter === cat ? 'active' : ''}`}
                onClick={() => setSelectedFilter(cat)}
              >
                {cat === 'all' ? 'Semua' : getCategoryLabel(cat)}
              </button>
            ))}
          </div>

          {/* Favorites List */}
          <div className="favorites-list">
            <AnimatePresence>
              {filteredFavorites.map((place, index) => (
                <motion.div
                  key={place.id}
                  className="favorite-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="item-header">
                    <div className="place-image">
                      {getCategoryEmoji(place.category)}
                    </div>
                    <div className="place-info">
                      <h4>{place.name}</h4>
                      <div className="place-meta">
                        <div className="rating">
                          <Star size={14} fill="#ffa502" color="#ffa502" />
                          <span>{place.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div className="distance">
                          <MapPin size={14} />
                          <span>{place.distance?.toFixed(1)} km</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="item-actions">
                    <button 
                      className="nav-btn"
                      onClick={() => onNavigate?.(place)}
                      title="Navigasi"
                    >
                      <Navigation size={16} />
                    </button>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFavorite(place.id)}
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="favorites-count">
            {filteredFavorites.length} tempat tersimpan
          </div>
        </>
      )}

      <style jsx>{`
        .favorites-panel {
          padding: 16px;
          background: var(--bg-primary);
          border-radius: 16px;
          max-height: 500px;
          overflow-y: auto;
        }

        .favorites-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .favorites-header h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          color: var(--text-primary);
        }

        .clear-btn {
          background: none;
          border: none;
          color: #ff4757;
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
        }

        .empty-state svg {
          margin-bottom: 16px;
          opacity: 0.3;
        }

        .filter-scroll {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .filter-chip {
          padding: 6px 12px;
          border: 1px solid var(--border-color);
          border-radius: 20px;
          background: transparent;
          color: var(--text-secondary);
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s;
        }

        .filter-chip.active {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
        }

        .favorite-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: var(--bg-secondary);
          border-radius: 12px;
          margin-bottom: 8px;
        }

        .item-header {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .place-image {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .place-info h4 {
          font-size: 14px;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .place-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .rating, .distance {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .item-actions {
          display: flex;
          gap: 8px;
        }

        .item-actions button {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .nav-btn {
          background: #e7f1ff;
          color: #0066ff;
        }

        .remove-btn {
          background: #ffe7e7;
          color: #ff4757;
        }

        .favorites-count {
          text-align: center;
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
};

const getCategoryLabel = (category) => {
  const labels = {
    restaurant: 'Restoran',
    hospital: 'RS',
    atm: 'ATM',
    tourism: 'Wisata',
    gas_station: 'SPBU',
    supermarket: 'Supermarket',
    hotel: 'Hotel',
    transport: 'Transportasi'
  };
  return labels[category] || category;
};

const getCategoryEmoji = (category) => {
  const emojis = {
    restaurant: '🍽️',
    hospital: '🏥',
    atm: '💳',
    tourism: '🎯',
    gas_station: '⛽',
    supermarket: '🛒',
    hotel: '🏨',
    transport: '🚌'
  };
  return emojis[category] || '📍';
};

export default Favorites;