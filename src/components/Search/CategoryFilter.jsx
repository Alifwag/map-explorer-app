import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  Star, 
  TrendingUp,
  Clock,
  Filter,
  X
} from 'lucide-react';

const CategoryFilter = ({ onFilterChange, onSortChange, selectedCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSort, setActiveSort] = useState('distance');
  const [filters, setFilters] = useState({
    distance: { min: 0, max: 50 },
    rating: 0,
    priceLevel: 'all',
    openNow: false
  });

  const categories = [
    { id: 'restaurant', label: 'Restoran', icon: '🍽️', color: '#ff6b6b' },
    { id: 'hospital', label: 'Rumah Sakit', icon: '🏥', color: '#ff4757' },
    { id: 'atm', label: 'ATM/Bank', icon: '💳', color: '#2ed573' },
    { id: 'tourism', label: 'Wisata', icon: '🎯', color: '#ffa502' },
    { id: 'gas_station', label: 'SPBU', icon: '⛽', color: '#5352ed' },
    { id: 'supermarket', label: 'Supermarket', icon: '🛒', color: '#7bed9f' },
    { id: 'hotel', label: 'Hotel', icon: '🏨', color: '#eccc68' },
    { id: 'transport', label: 'Transportasi', icon: '🚌', color: '#1e90ff' },
    { id: 'pharmacy', label: 'Apotek', icon: '💊', color: '#ff6348' },
    { id: 'school', label: 'Sekolah', icon: '🏫', color: '#a4b0be' },
    { id: 'parking', label: 'Parkir', icon: '🅿️', color: '#747d8c' },
    { id: 'gym', label: 'Gym', icon: '💪', color: '#ff9ff3' }
  ];

  const sortOptions = [
    { id: 'distance', label: 'Jarak Terdekat', icon: <ArrowUpDown size={14} /> },
    { id: 'rating', label: 'Rating Tertinggi', icon: <Star size={14} /> },
    { id: 'popularity', label: 'Terpopuler', icon: <TrendingUp size={14} /> },
    { id: 'newest', label: 'Terbaru', icon: <Clock size={14} /> }
  ];

  const handleSortChange = (sortId) => {
    setActiveSort(sortId);
    onSortChange?.(sortId);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="category-filter">
      {/* Sort & Filter Header */}
      <div className="filter-header">
        <div className="sort-scroll">
          {sortOptions.map(option => (
            <motion.button
              key={option.id}
              className={`sort-chip ${activeSort === option.id ? 'active' : ''}`}
              onClick={() => handleSortChange(option.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.icon}
              <span>{option.label}</span>
            </motion.button>
          ))}
        </div>
        
        <motion.button
          className="filter-toggle"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter size={16} />
          <span>Filter</span>
          <SlidersHorizontal size={14} />
        </motion.button>
      </div>

      {/* Categories Grid */}
      <div className="categories-scroll">
        <div className="categories-grid">
          {categories.map(cat => (
            <motion.button
              key={cat.id}
              className={`category-chip ${selectedCategory === cat.id ? 'selected' : ''}`}
              onClick={() => onFilterChange?.({ category: cat.id })}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                '--category-color': cat.color,
                background: selectedCategory === cat.id ? cat.color + '20' : 'var(--bg-secondary)',
                borderColor: selectedCategory === cat.id ? cat.color : 'transparent'
              }}
            >
              <span className="category-emoji">{cat.icon}</span>
              <span className="category-name">{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="filters-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="filters-content">
              <div className="filter-header-row">
                <h4>Filter Lanjutan</h4>
                <button className="close-btn" onClick={() => setIsOpen(false)}>
                  <X size={16} />
                </button>
              </div>

              {/* Distance Range */}
              <div className="filter-group">
                <label>Jarak Maksimal: {filters.distance.max} km</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={filters.distance.max}
                  onChange={(e) => handleFilterChange('distance', { 
                    ...filters.distance, 
                    max: parseInt(e.target.value) 
                  })}
                  className="range-slider"
                />
                <div className="range-labels">
                  <span>1 km</span>
                  <span>50 km</span>
                  <span>100 km</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="filter-group">
                <label>Rating Minimal: {filters.rating} ⭐</label>
                <div className="rating-buttons">
                  {[0, 3, 3.5, 4, 4.5, 5].map(rating => (
                    <motion.button
                      key={rating}
                      className={`rating-btn ${filters.rating === rating ? 'active' : ''}`}
                      onClick={() => handleFilterChange('rating', rating)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {rating === 0 ? 'Semua' : `${rating}+`}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Price Level */}
              <div className="filter-group">
                <label>Level Harga</label>
                <div className="price-buttons">
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'cheap', label: '💰 Murah' },
                    { id: 'moderate', label: '💰💰 Sedang' },
                    { id: 'expensive', label: '💰💰💰 Mahal' }
                  ].map(price => (
                    <motion.button
                      key={price.id}
                      className={`price-btn ${filters.priceLevel === price.id ? 'active' : ''}`}
                      onClick={() => handleFilterChange('priceLevel', price.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {price.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Open Now Toggle */}
              <div className="filter-group">
                <label className="toggle-label">
                  <span>Buka Sekarang</span>
                  <motion.button
                    className={`toggle-switch ${filters.openNow ? 'on' : 'off'}`}
                    onClick={() => handleFilterChange('openNow', !filters.openNow)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="toggle-thumb"
                      animate={{ x: filters.openNow ? 20 : 0 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    />
                  </motion.button>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="filter-actions">
                <button 
                  className="reset-btn"
                  onClick={() => {
                    setFilters({
                      distance: { min: 0, max: 50 },
                      rating: 0,
                      priceLevel: 'all',
                      openNow: false
                    });
                    onFilterChange?.({
                      distance: { min: 0, max: 50 },
                      rating: 0,
                      priceLevel: 'all',
                      openNow: false
                    });
                  }}
                >
                  Reset Filter
                </button>
                <button 
                  className="apply-btn"
                  onClick={() => {
                    onFilterChange?.(filters);
                    setIsOpen(false);
                  }}
                >
                  Terapkan
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Indicators */}
      <AnimatePresence>
        {(filters.rating > 0 || filters.priceLevel !== 'all' || filters.openNow) && (
          <motion.div
            className="active-filters"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className="active-label">Filter Aktif:</span>
            {filters.rating > 0 && (
              <span className="filter-badge">
                ⭐ {filters.rating}+
                <X size={12} onClick={() => handleFilterChange('rating', 0)} />
              </span>
            )}
            {filters.priceLevel !== 'all' && (
              <span className="filter-badge">
                {filters.priceLevel === 'cheap' ? '💰' : filters.priceLevel === 'moderate' ? '💰💰' : '💰💰💰'}
                <X size={12} onClick={() => handleFilterChange('priceLevel', 'all')} />
              </span>
            )}
            {filters.openNow && (
              <span className="filter-badge">
                🟢 Buka
                <X size={12} onClick={() => handleFilterChange('openNow', false)} />
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .category-filter {
          padding: 12px 0;
          position: relative;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          gap: 8px;
        }

        .sort-scroll {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          flex: 1;
          padding-bottom: 4px;
        }

        .sort-scroll::-webkit-scrollbar {
          height: 0;
        }

        .sort-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          font-size: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s;
        }

        .sort-chip.active {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          font-size: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s;
        }

        .filter-toggle:hover {
          border-color: var(--accent-color);
          color: var(--accent-color);
        }

        .categories-scroll {
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 8px;
        }

        .categories-scroll::-webkit-scrollbar {
          height: 4px;
        }

        .categories-scroll::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 2px;
        }

        .categories-grid {
          display: flex;
          gap: 8px;
          padding: 4px 0;
        }

        .category-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 14px;
          background: var(--bg-secondary);
          border: 2px solid transparent;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 80px;
          flex-shrink: 0;
        }

        .category-chip.selected {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .category-emoji {
          font-size: 24px;
        }

        .category-name {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .filters-panel {
          overflow: hidden;
          margin-top: 8px;
        }

        .filters-content {
          background: var(--bg-secondary);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid var(--border-color);
        }

        .filter-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .filter-header-row h4 {
          font-size: 16px;
          color: var(--text-primary);
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
        }

        .close-btn:hover {
          background: var(--bg-primary);
        }

        .filter-group {
          margin-bottom: 20px;
        }

        .filter-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .range-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: var(--border-color);
          appearance: none;
          outline: none;
        }

        .range-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent-color);
          cursor: pointer;
        }

        .range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-secondary);
          margin-top: 6px;
        }

        .rating-buttons,
        .price-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .rating-btn,
        .price-btn {
          padding: 6px 12px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s;
        }

        .rating-btn.active,
        .price-btn.active {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
        }

        .toggle-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .toggle-switch {
          width: 48px;
          height: 24px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          padding: 2px;
          position: relative;
          transition: background 0.3s;
        }

        .toggle-switch.on {
          background: #0066ff;
        }

        .toggle-switch.off {
          background: #ccc;
        }

        .toggle-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .filter-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .reset-btn {
          flex: 1;
          padding: 10px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-secondary);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .reset-btn:hover {
          background: #ffe7e7;
          color: #ff4757;
          border-color: #ff4757;
        }

        .apply-btn {
          flex: 2;
          padding: 10px;
          background: var(--accent-color);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .apply-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        .active-filters {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          flex-wrap: wrap;
        }

        .active-label {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .filter-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: #e7f1ff;
          color: #0066ff;
          border-radius: 16px;
          font-size: 11px;
          font-weight: 500;
        }

        .filter-badge svg {
          cursor: pointer;
          opacity: 0.6;
        }

        .filter-badge svg:hover {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .sort-scroll {
            gap: 4px;
          }

          .sort-chip {
            padding: 6px 10px;
            font-size: 11px;
          }

          .category-chip {
            min-width: 70px;
            padding: 8px 10px;
          }

          .category-emoji {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryFilter;