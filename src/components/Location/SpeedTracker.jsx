import React from 'react';
import { motion } from 'framer-motion';
import { 
  Gauge, 
  Timer, 
  Route, 
  TrendingUp,
  Activity,
  Flame
} from 'lucide-react';

const SpeedTracker = ({ 
  currentSpeed, 
  averageSpeed, 
  maxSpeed,
  totalDistance, 
  activityType,
  elapsedTime,
  calories
}) => {
  const getActivityIcon = () => {
    const icons = {
      walking: '🚶',
      running: '🏃',
      cycling: '🚴',
      motorcycling: '🏍️',
      driving: '🚗',
      idle: '📍'
    };
    return icons[activityType] || '📍';
  };

  const getActivityColor = () => {
    const colors = {
      walking: '#4caf50',
      running: '#ff9800',
      cycling: '#2196f3',
      motorcycling: '#9c27b0',
      driving: '#f44336',
      idle: '#607d8b'
    };
    return colors[activityType] || '#607d8b';
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="speed-tracker"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Main Speed Display */}
      <div className="speed-main" style={{ borderColor: getActivityColor() }}>
        <motion.div 
          className="speed-value"
          key={Math.round(currentSpeed)}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {Math.round(currentSpeed)}
        </motion.div>
        <div className="speed-unit">km/h</div>
        
        <div className="activity-indicator" style={{ backgroundColor: getActivityColor() }}>
          <span className="activity-icon">{getActivityIcon()}</span>
          <span className="activity-label">
            {activityType === 'idle' ? 'Diam' : activityType}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <Timer size={20} />
          <div className="stat-content">
            <div className="stat-label">Waktu</div>
            <div className="stat-value">{formatTime(elapsedTime)}</div>
          </div>
        </div>

        <div className="stat-card">
          <Route size={20} />
          <div className="stat-content">
            <div className="stat-label">Jarak</div>
            <div className="stat-value">{totalDistance.toFixed(2)} km</div>
          </div>
        </div>

        <div className="stat-card">
          <TrendingUp size={20} />
          <div className="stat-content">
            <div className="stat-label">Rata-rata</div>
            <div className="stat-value">{Math.round(averageSpeed)} km/h</div>
          </div>
        </div>

        <div className="stat-card">
          <Gauge size={20} />
          <div className="stat-content">
            <div className="stat-label">Maks</div>
            <div className="stat-value">{Math.round(maxSpeed)} km/h</div>
          </div>
        </div>

        <div className="stat-card">
          <Flame size={20} />
          <div className="stat-content">
            <div className="stat-label">Kalori</div>
            <div className="stat-value">{Math.round(calories)} kcal</div>
          </div>
        </div>
      </div>

      {/* Speed Graph */}
      <div className="speed-graph">
        <div className="graph-title">Grafik Kecepatan</div>
        <div className="graph-container">
          {/* Graph implementation would go here */}
          <div className="graph-placeholder">
            <Activity size={32} />
            <span>Grafik realtime tersedia saat tracking</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .speed-tracker {
          background: linear-gradient(145deg, #1a1a2e, #16213e);
          color: white;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .speed-main {
          text-align: center;
          padding: 30px;
          border: 3px solid #0066ff;
          border-radius: 20px;
          margin-bottom: 20px;
          position: relative;
          background: rgba(0,102,255,0.05);
        }

        .speed-value {
          font-size: 72px;
          font-weight: 800;
          line-height: 1;
          background: linear-gradient(135deg, #00ff88, #00cc66);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .speed-unit {
          font-size: 18px;
          color: #ccc;
          margin-top: 8px;
        }

        .activity-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          margin-top: 12px;
        }

        .activity-icon {
          font-size: 24px;
        }

        .activity-label {
          font-weight: 600;
          text-transform: capitalize;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .stat-label {
          font-size: 11px;
          color: #aaa;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
        }

        .speed-graph {
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 16px;
        }

        .graph-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #ccc;
        }

        .graph-container {
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .graph-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 13px;
        }
      `}</style>
    </motion.div>
  );
};

export default SpeedTracker;