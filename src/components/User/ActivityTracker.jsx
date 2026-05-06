import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Calendar, 
  TrendingUp, 
  Award,
  Clock,
  Zap
} from 'lucide-react';

const ActivityTracker = () => {
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({
    totalDistance: 0,
    totalTime: 0,
    totalTrips: 0,
    avgSpeed: 0
  });

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = () => {
    const stored = localStorage.getItem('trips');
    if (stored) {
      const tripData = JSON.parse(stored);
      setTrips(tripData);
      calculateStats(tripData);
    }
  };

  const calculateStats = (tripData) => {
    const totalDistance = tripData.reduce((sum, t) => sum + parseFloat(t.distance), 0);
    const totalTime = tripData.reduce((sum, t) => sum + t.duration, 0);
    const avgSpeed = tripData.reduce((sum, t) => sum + parseFloat(t.avgSpeed), 0) / tripData.length;

    setStats({
      totalDistance: totalDistance.toFixed(1),
      totalTime: Math.round(totalTime / 3600),
      totalTrips: tripData.length,
      avgSpeed: avgSpeed.toFixed(1)
    });
  };

  return (
    <div className="activity-tracker">
      <h3>
        <Activity size={20} />
        Aktivitas Perjalanan
      </h3>

      {/* Stats Overview */}
      <div className="stats-overview">
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.05 }}
        >
          <Zap size={24} />
          <div className="stat-value">{stats.totalTrips}</div>
          <div className="stat-label">Total Trip</div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.05 }}
        >
          <TrendingUp size={24} />
          <div className="stat-value">{stats.totalDistance}</div>
          <div className="stat-label">Total KM</div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.05 }}
        >
          <Clock size={24} />
          <div className="stat-value">{stats.totalTime}</div>
          <div className="stat-label">Jam</div>
        </motion.div>
      </div>

      {/* Recent Trips */}
      <div className="recent-trips">
        <h4>Perjalanan Terbaru</h4>
        {trips.length === 0 ? (
          <div className="empty-trips">
            <Calendar size={32} />
            <p>Belum ada perjalanan tercatat</p>
          </div>
        ) : (
          trips.slice(0, 5).map((trip, index) => (
            <motion.div
              key={index}
              className="trip-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="trip-date">
                {new Date(trip.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
              <div className="trip-details">
                <div>{trip.distance} km</div>
                <div className="trip-meta">
                  <span>Avg: {trip.avgSpeed} km/h</span>
                  <span>Durasi: {Math.round(trip.duration / 60)} menit</span>
                </div>
              </div>
              <Award size={16} className="trip-badge" />
            </motion.div>
          ))
        )}
      </div>

      <style jsx>{`
        .activity-tracker {
          padding: 16px;
          background: var(--bg-primary);
          border-radius: 16px;
        }

        h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .stat-card {
          padding: 16px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          color: white;
          text-align: center;
          cursor: pointer;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          margin: 8px 0;
        }

        .stat-label {
          font-size: 11px;
          opacity: 0.8;
        }

        .recent-trips {
          margin-top: 16px;
        }

        h4 {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        .empty-trips {
          text-align: center;
          padding: 24px;
          color: var(--text-secondary);
        }

        .trip-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg-secondary);
          border-radius: 10px;
          margin-bottom: 8px;
        }

        .trip-date {
          min-width: 48px;
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: var(--accent-color);
        }

        .trip-details {
          flex: 1;
          font-size: 14px;
          color: var(--text-primary);
        }

        .trip-meta {
          display: flex;
          gap: 12px;
          font-size: 11px;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .trip-badge {
          color: #ffa502;
        }
      `}</style>
    </div>
  );
};

export default ActivityTracker;