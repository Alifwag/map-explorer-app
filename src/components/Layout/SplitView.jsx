import React from 'react';
import { motion } from 'framer-motion';
import LocationDetails from '../Location/LocationDetails';
import RoutePlanner from '../Navigation/RoutePlanner';

const SplitView = ({ selectedPlace, userLocation }) => {
  return (
    <motion.div
      className="split-view"
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="split-content">
        <div className="split-section">
          <h3>Detail Lokasi</h3>
          {selectedPlace ? (
            <LocationDetails place={selectedPlace} />
          ) : (
            <div className="empty-section">
              <p>Pilih tempat untuk melihat detail</p>
            </div>
          )}
        </div>

        <div className="split-divider" />

        <div className="split-section">
          <h3>Rute & Navigasi</h3>
          {selectedPlace && userLocation ? (
            <RoutePlanner 
              destination={selectedPlace} 
              userLocation={userLocation} 
            />
          ) : (
            <div className="empty-section">
              <p>Pilih tujuan untuk melihat rute</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .split-view {
          width: 400px;
          background: var(--bg-primary);
          border-left: 1px solid var(--border-color);
          overflow-y: auto;
        }

        .split-content {
          padding: 20px;
        }

        .split-section {
          margin-bottom: 24px;
        }

        .split-section h3 {
          font-size: 16px;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .split-divider {
          height: 1px;
          background: var(--border-color);
          margin: 20px 0;
        }

        .empty-section {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .split-view {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            max-height: 50vh;
            border-radius: 20px 20px 0 0;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default SplitView;