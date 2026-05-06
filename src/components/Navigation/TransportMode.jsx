import React from 'react';
import { motion } from 'framer-motion';
import { 
  Footprints, 
  Bike, 
  Car, 
  Bus, 
  Zap,
  Clock,
  DollarSign,
  Leaf
} from 'lucide-react';

const TransportMode = ({ selected, onSelect, distance, duration }) => {
  const transportModes = [
    {
      id: 'walking',
      icon: <Footprints size={24} />,
      label: 'Jalan Kaki',
      description: 'Ramah lingkungan',
      speed: '5 km/h',
      eco: '⭐⭐⭐⭐⭐',
      cost: 'Gratis',
      color: '#4caf50',
      gradient: 'linear-gradient(135deg, #4caf50, #45a049)'
    },
    {
      id: 'cycling',
      icon: <Bike size={24} />,
      label: 'Sepeda',
      description: 'Sehat & cepat',
      speed: '15 km/h',
      eco: '⭐⭐⭐⭐⭐',
      cost: 'Gratis',
      color: '#2196f3',
      gradient: 'linear-gradient(135deg, #2196f3, #1976d2)'
    },
    {
      id: 'motorcycle',
      icon: <Zap size={24} />,
      label: 'Motor',
      description: 'Cepat & efisien',
      speed: '35 km/h',
      eco: '⭐⭐⭐',
      cost: 'Ekonomis',
      color: '#9c27b0',
      gradient: 'linear-gradient(135deg, #9c27b0, #7b1fa2)'
    },
    {
      id: 'car',
      icon: <Car size={24} />,
      label: 'Mobil',
      description: 'Nyaman & aman',
      speed: '50 km/h',
      eco: '⭐⭐',
      cost: 'Standar',
      color: '#f44336',
      gradient: 'linear-gradient(135deg, #f44336, #d32f2f)'
    },
    {
      id: 'transit',
      icon: <Bus size={24} />,
      label: 'Transportasi Umum',
      description: 'Ekonomis & praktis',
      speed: '30 km/h',
      eco: '⭐⭐⭐⭐',
      cost: 'Murah',
      color: '#ff9800',
      gradient: 'linear-gradient(135deg, #ff9800, #f57c00)'
    }
  ];

  const getEstimatedTime = (mode) => {
    if (!distance) return '--';
    const speeds = { walking: 5, cycling: 15, motorcycle: 35, car: 50, transit: 30 };
    const speed = speeds[mode] || 30;
    const timeInHours = distance / speed;
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
    
    if (hours > 0) return `${hours}j ${minutes}m`;
    return `${minutes} menit`;
  };

  const getEstimatedCost = (mode) => {
    if (!distance) return '--';
    const costs = {
      walking: 0,
      cycling: 0,
      motorcycle: distance * 500,
      car: distance * 1500,
      transit: Math.min(distance * 1000, 3500)
    };
    const cost = costs[mode] || 0;
    if (cost === 0) return 'Gratis';
    return `Rp ${cost.toLocaleString('id-ID')}`;
  };

  const getCarbonFootprint = (mode) => {
    if (!distance) return '--';
    const emissions = {
      walking: 0,
      cycling: 0,
      motorcycle: distance * 0.1,
      car: distance * 0.2,
      transit: distance * 0.05
    };
    const emission = emissions[mode] || 0;
    return `${emission.toFixed(1)} kg CO2`;
  };

  return (
    <div className="transport-mode">
      <h3 className="mode-title">
        <Car size={20} />
        Pilih Mode Transportasi
      </h3>

      <div className="mode-list">
        {transportModes.map((mode) => (
          <motion.div
            key={mode.id}
            className={`mode-card ${selected === mode.id ? 'selected' : ''}`}
            onClick={() => onSelect?.(mode.id)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              borderColor: selected === mode.id ? mode.color : 'transparent',
              boxShadow: selected === mode.id 
                ? `0 8px 24px ${mode.color}40` 
                : '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <div className="mode-header">
              <div 
                className="mode-icon"
                style={{ background: mode.gradient }}
              >
                {mode.icon}
              </div>
              <div className="mode-info">
                <h4 className="mode-name">{mode.label}</h4>
                <p className="mode-description">{mode.description}</p>
              </div>
              {selected === mode.id && (
                <motion.div
                  className="selected-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  ✓
                </motion.div>
              )}
            </div>

            <div className="mode-stats">
              <div className="stat-row">
                <div className="stat-item">
                  <Clock size={14} />
                  <span className="stat-label">Estimasi</span>
                  <span className="stat-value">{getEstimatedTime(mode.id)}</span>
                </div>
                
                <div className="stat-item">
                  <DollarSign size={14} />
                  <span className="stat-label">Biaya</span>
                  <span className="stat-value">{getEstimatedCost(mode.id)}</span>
                </div>
              </div>

              <div className="stat-row">
                <div className="stat-item">
                  <Leaf size={14} />
                  <span className="stat-label">Emisi</span>
                  <span className="stat-value">{getCarbonFootprint(mode.id)}</span>
                </div>
                
                <div className="stat-item">
                  <span className="eco-rating">{mode.eco}</span>
                  <span className="stat-label">Eco Rating</span>
                  <span className="stat-value" style={{ color: mode.color }}>
                    {mode.speed}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bar untuk menunjukkan kecepatan relatif */}
            <div className="speed-bar">
              <div 
                className="speed-fill"
                style={{ 
                  width: `${(parseInt(mode.speed) / 60) * 100}%`,
                  background: mode.gradient
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tips berdasarkan mode terpilih */}
      {selected && (
        <motion.div
          className="mode-tip"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="tip-icon">💡</div>
          <p className="tip-text">
            {getModeTip(selected)}
          </p>
        </motion.div>
      )}

      <style jsx>{`
        .transport-mode {
          padding: 16px;
          background: var(--bg-primary);
          border-radius: 16px;
        }

        .mode-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .mode-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mode-card {
          padding: 16px;
          background: var(--bg-secondary);
          border: 2px solid transparent;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .mode-card:hover {
          transform: translateY(-2px);
        }

        .mode-card.selected {
          background: var(--bg-primary);
        }

        .mode-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .mode-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          color: white;
          flex-shrink: 0;
        }

        .mode-info {
          flex: 1;
        }

        .mode-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .mode-description {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .selected-badge {
          width: 28px;
          height: 28px;
          background: #00cc66;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
        }

        .mode-stats {
          margin-bottom: 8px;
        }

        .stat-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 8px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px;
          background: var(--bg-primary);
          border-radius: 8px;
        }

        .stat-label {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .stat-value {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
          margin-left: auto;
        }

        .eco-rating {
          font-size: 11px;
        }

        .speed-bar {
          height: 4px;
          background: var(--border-color);
          border-radius: 2px;
          overflow: hidden;
        }

        .speed-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.6s ease;
        }

        .mode-tip {
          display: flex;
          gap: 10px;
          padding: 12px;
          background: #e7f1ff;
          border-radius: 12px;
          margin-top: 12px;
          color: #0066ff;
        }

        .tip-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .tip-text {
          font-size: 12px;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .mode-card {
            padding: 12px;
          }

          .mode-icon {
            width: 40px;
            height: 40px;
            border-radius: 12px;
          }

          .stat-item {
            padding: 6px;
          }
        }
      `}</style>
    </div>
  );
};

const getModeTip = (mode) => {
  const tips = {
    walking: 'Berjalan kaki 30 menit sehari dapat membakar hingga 150 kalori dan mengurangi risiko penyakit jantung!',
    cycling: 'Bersepeda dapat menghemat biaya transportasi hingga Rp 500.000/bulan dan baik untuk kesehatan jantung.',
    motorcycle: 'Gunakan jaket dan helm yang sesuai standar. Pastikan motor dalam kondisi prima sebelum berangkat.',
    car: 'Patuhi aturan lalu lintas dan gunakan sabuk pengaman. Cek kondisi kendaraan sebelum perjalanan jauh.',
    transit: 'Transportasi umum lebih efisien untuk perjalanan di jam sibuk. Siapkan uang pas atau kartu elektronik.'
  };
  return tips[mode] || 'Pilih mode transportasi yang sesuai dengan kebutuhan Anda.';
};

export default TransportMode;