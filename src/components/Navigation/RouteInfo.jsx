import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Route, 
  Navigation, 
  AlertTriangle,
  Gauge,
  MapPin,
  TrendingUp,
  Timer
} from 'lucide-react';

const RouteInfo = ({ routeData, transportMode, traffic }) => {
  if (!routeData) {
    return (
      <div className="route-info-empty">
        <MapPin size={48} />
        <p>Pilih rute untuk melihat informasi</p>
      </div>
    );
  }

  const { distance, time, instructions, coordinates, alternatives } = routeData;

  const getTrafficColor = (congestion) => {
    switch(congestion) {
      case 'lancar': return '#00cc44';
      case 'sedang': return '#ffaa00';
      case 'macet': return '#ff3333';
      default: return '#0066ff';
    }
  };

  const getTrafficIcon = (congestion) => {
    switch(congestion) {
      case 'lancar': return '✅';
      case 'sedang': return '⚡';
      case 'macet': return '🔴';
      default: return '➡️';
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} jam ${mins} menit`;
  };

  const calculateFuelEstimate = (distance, mode) => {
    const consumption = {
      car: 0.1,      // 10 km/L
      motorcycle: 0.04, // 25 km/L
      cycling: 0,
      walking: 0,
      transit: 0
    };
    const liters = distance * (consumption[mode] || 0);
    return liters.toFixed(1);
  };

  const calculateCalories = (distance, mode) => {
    const caloriesPerKm = {
      walking: 60,
      cycling: 40,
      running: 80
    };
    return Math.round(distance * (caloriesPerKm[mode] || 0));
  };

  return (
    <motion.div 
      className="route-info"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Route Summary */}
      <div className="route-summary">
        <div className="time-distance">
          <div className="time-section">
            <Timer size={24} />
            <div>
              <div className="main-value">{formatTime(time)}</div>
              <div className="sub-label">Estimasi Waktu</div>
            </div>
          </div>
          
          <div className="divider-vertical" />
          
          <div className="distance-section">
            <Route size={24} />
            <div>
              <div className="main-value">{distance} km</div>
              <div className="sub-label">Total Jarak</div>
            </div>
          </div>
        </div>

        {/* Speed Info */}
        <div className="speed-info">
          <Gauge size={16} />
          <span>Kecepatan rata-rata: {Math.round((distance / (time/60)))} km/h</span>
        </div>
      </div>

      {/* Traffic Status */}
      <div className="traffic-status" style={{ borderColor: getTrafficColor(traffic) }}>
        <div className="traffic-header">
          <span className="traffic-icon">{getTrafficIcon(traffic)}</span>
          <span className="traffic-label">Status Lalu Lintas: {traffic}</span>
        </div>
        
        {traffic === 'macet' && (
          <motion.div 
            className="traffic-delay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertTriangle size={16} />
            <span>Delay +{Math.round(time * 0.2)} menit</span>
          </motion.div>
        )}
      </div>

      {/* Additional Info */}
      <div className="additional-info">
        {transportMode === 'car' && (
          <div className="info-item">
            <span className="info-icon">⛽</span>
            <div>
              <div className="info-value">{calculateFuelEstimate(distance, 'car')} Liter</div>
              <div className="info-label">Estimasi BBM</div>
            </div>
          </div>
        )}
        
        {(transportMode === 'walking' || transportMode === 'cycling') && (
          <div className="info-item">
            <span className="info-icon">🔥</span>
            <div>
              <div className="info-value">{calculateCalories(distance, transportMode)} kcal</div>
              <div className="info-label">Kalori Terbakar</div>
            </div>
          </div>
        )}

        <div className="info-item">
          <span className="info-icon">📍</span>
          <div>
            <div className="info-value">{coordinates?.length || 0} titik</div>
            <div className="info-label">Waypoints</div>
          </div>
        </div>
      </div>

      {/* Turn-by-Turn Directions */}
      <div className="directions">
        <h4>
          <Navigation size={16} />
          Petunjuk Arah
        </h4>
        
        <div className="directions-list">
          {instructions?.slice(0, 5).map((instruction, index) => (
            <motion.div
              key={index}
              className="direction-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="direction-number">{index + 1}</div>
              <div className="direction-content">
                <div className="direction-text">
                  {instruction.text || `Lanjutkan ${instruction.distance?.toFixed(0)}m`}
                </div>
                <div className="direction-distance">
                  {instruction.distance ? `${(instruction.distance / 1000).toFixed(1)} km` : ''}
                </div>
              </div>
              <div className="direction-icon">
                {getDirectionIcon(instruction.type)}
              </div>
            </motion.div>
          ))}
        </div>

        {instructions?.length > 5 && (
          <button className="show-all-btn">
            Lihat semua ({instructions.length}) petunjuk
          </button>
        )}
      </div>

      {/* Alternative Routes */}
      {alternatives && alternatives.length > 0 && (
        <div className="alternatives">
          <h4>Rute Alternatif</h4>
          {alternatives.map((alt, index) => (
            <motion.div
              key={index}
              className="alternative-item"
              whileHover={{ x: 5 }}
            >
              <div className="alt-route">
                <span className="alt-number">Rute {index + 2}</span>
                <span className="alt-distance">{alt.distance} km</span>
              </div>
              <div className="alt-time">
                <Clock size={12} />
                {formatTime(alt.time)}
              </div>
              <div className="alt-traffic" style={{ color: getTrafficColor(alt.traffic) }}>
                {getTrafficIcon(alt.traffic)} {alt.traffic}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <style jsx>{`
        .route-info {
          background: var(--bg-primary);
          border-radius: 16px;
          overflow: hidden;
        }

        .route-info-empty {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        .route-summary {
          padding: 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .time-distance {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 12px;
        }

        .time-section,
        .distance-section {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .main-value {
          font-size: 24px;
          font-weight: 700;
        }

        .sub-label {
          font-size: 11px;
          opacity: 0.8;
        }

        .divider-vertical {
          width: 1px;
          height: 50px;
          background: rgba(255,255,255,0.3);
        }

        .speed-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          opacity: 0.9;
        }

        .traffic-status {
          padding: 16px;
          margin: 12px;
          background: var(--bg-secondary);
          border-left: 4px solid #0066ff;
          border-radius: 8px;
        }

        .traffic-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .traffic-icon {
          font-size: 20px;
        }

        .traffic-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          text-transform: capitalize;
        }

        .traffic-delay {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          padding: 8px;
          background: #fff3cd;
          border-radius: 6px;
          font-size: 13px;
          color: #856404;
        }

        .additional-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 12px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: var(--bg-secondary);
          border-radius: 12px;
        }

        .info-icon {
          font-size: 24px;
        }

        .info-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .info-label {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .directions {
          padding: 16px;
        }

        .directions h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .direction-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          margin-bottom: 8px;
          background: var(--bg-secondary);
          border-radius: 10px;
        }

        .direction-number {
          width: 28px;
          height: 28px;
          background: var(--accent-color);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .direction-content {
          flex: 1;
        }

        .direction-text {
          font-size: 13px;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .direction-distance {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .direction-icon {
          font-size: 20px;
        }

        .show-all-btn {
          width: 100%;
          padding: 10px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--accent-color);
          font-size: 13px;
          cursor: pointer;
          margin-top: 8px;
          transition: all 0.3s;
        }

        .show-all-btn:hover {
          background: var(--accent-color);
          color: white;
        }

        .alternatives {
          padding: 16px;
          border-top: 1px solid var(--border-color);
        }

        .alternatives h4 {
          font-size: 14px;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .alternative-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          margin-bottom: 6px;
          background: var(--bg-secondary);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .alternative-item:hover {
          background: #e7f1ff;
        }

        .alt-number {
          font-weight: 600;
          color: var(--accent-color);
        }

        .alt-distance {
          font-size: 13px;
          color: var(--text-primary);
          margin-left: 8px;
        }

        .alt-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .alt-traffic {
          font-size: 12px;
          font-weight: 500;
        }
      `}</style>
    </motion.div>
  );
};

const getDirectionIcon = (type) => {
  const icons = {
    turn_left: '⬅️',
    turn_right: '➡️',
    straight: '⬆️',
    uturn: '↩️',
    roundabout: '🔄',
    arrive: '📍'
  };
  return icons[type] || '➡️';
};

export default RouteInfo;