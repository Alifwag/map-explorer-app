import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Coffee, 
  Building2, 
  Fuel, 
  ShoppingBag, 
  Banknote,
  Hotel,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const QuickAccess = ({ onCategorySelect }) => {
  const [showAll, setShowAll] = useState(false);

  const primaryCategories = [
    { id: 'gas_station', icon: <Fuel size={24} />, label: 'SPBU', color: '#ff6b6b' },
    { id: 'restaurant', icon: <Coffee size={24} />, label: 'Restoran', color: '#ffa502' },
    { id: 'hotel', icon: <Hotel size={24} />, label: 'Hotel', color: '#5352ed' },
    { id: 'supermarket', icon: <ShoppingBag size={24} />, label: 'Supermarket', color: '#2ed573' },
    { id: 'atm', icon: <Banknote size={24} />, label: 'ATM', color: '#1e90ff' }
  ];

  const secondaryCategories = [
    { id: 'hospital', icon: <Building2 size={24} />, label: 'Rumah Sakit', color: '#ff4757' },
    { id: 'tourism', icon: <span>🎯</span>, label: 'Wisata', color: '#ff6348' },
    { id: 'transport', icon: <span>🚌</span>, label: 'Transportasi', color: '#7bed9f' },
    { id: 'pharmacy', icon: <span>💊</span>, label: 'Apotek', color: '#eccc68' },
    { id: 'parking', icon: <span>🅿️</span>, label: 'Parkir', color: '#a4b0be' },
    { id: 'gym', icon: <span>💪</span>, label: 'Gym', color: '#ff9ff3' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="quick-access">
      <h3 className="quick-access-title">Akses Cepat</h3>
      
      <motion.div 
        className="categories-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {primaryCategories.map((cat) => (
          <motion.button
            key={cat.id}
            className="category-button"
            onClick={() => onCategorySelect?.(cat.id)}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{ '--category-color': cat.color }}
          >
            <div className="category-icon" style={{ backgroundColor: cat.color + '20' }}>
              {cat.icon}
            </div>
            <span className="category-label">{cat.label}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.button
        className="show-more-btn"
        onClick={() => setShowAll(!showAll)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {showAll ? (
          <>
            <ChevronUp size={16} />
            <span>Sembunyikan</span>
          </>
        ) : (
          <>
            <ChevronDown size={16} />
            <span>Lainnya</span>
          </>
        )}
      </motion.button>

      <motion.div
        className="secondary-categories"
        initial={false}
        animate={{
          height: showAll ? 'auto' : 0,
          opacity: showAll ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <div className="categories-grid">
          {secondaryCategories.map((cat) => (
            <motion.button
              key={cat.id}
              className="category-button"
              onClick={() => onCategorySelect?.(cat.id)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{ '--category-color': cat.color }}
            >
              <div className="category-icon" style={{ backgroundColor: cat.color + '20' }}>
                {cat.icon}
              </div>
              <span className="category-label">{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <style jsx>{`
        .quick-access {
          padding: 16px;
          background: var(--bg-primary);
          border-radius: 16px;
          margin: 12px 0;
        }

        .quick-access-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .category-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 8px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .category-button:hover {
          border-color: var(--category-color);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .category-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-label {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .show-more-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px;
          margin-top: 12px;
          background: var(--bg-secondary);
          border: none;
          border-radius: 8px;
          color: var(--accent-color);
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
          }

          .category-button {
            padding: 8px 4px;
          }

          .category-icon {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default QuickAccess;