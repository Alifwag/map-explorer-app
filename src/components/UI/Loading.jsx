import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ message = 'Memuat...' }) => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        {/* Logo */}
        <motion.div
          className="loading-logo-container"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img 
            src="/logo512.png" 
            alt="MapExplorer Logo" 
            className="loading-logo"
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          className="loading-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="app-title">MapExplorer</h1>
          <p className="app-tagline">Navigate. Track. Explore.</p>
          <p className="loading-message">{message}</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="loading-progress-container">
          <motion.div
            className="loading-progress-bar"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </div>

        {/* Pulse Rings */}
        <div className="pulse-rings">
          <motion.div 
            className="pulse-ring"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="pulse-ring delay"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </div>
      </div>

      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-content {
          text-align: center;
          color: white;
          position: relative;
        }

        .loading-logo-container {
          margin-bottom: 32px;
          position: relative;
        }

        .loading-logo {
          width: 150px;
          height: 150px;
          filter: drop-shadow(0 0 30px rgba(0, 102, 255, 0.5));
        }

        .loading-text {
          margin: 24px 0;
        }

        .app-title {
          font-size: 42px;
          font-weight: 900;
          background: linear-gradient(135deg, #0066ff, #00d4ff, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
          letter-spacing: -1px;
        }

        .app-tagline {
          font-size: 18px;
          font-weight: 600;
          color: #aaa;
          letter-spacing: 1px;
          background: linear-gradient(90deg, #0066ff, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .loading-message {
          font-size: 14px;
          color: #666;
        }

        .loading-progress-container {
          width: 250px;
          height: 3px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
          margin: 32px auto;
        }

        .loading-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #0066ff, #764ba2, #00ff88);
          border-radius: 2px;
        }

        .pulse-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .pulse-ring {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 2px solid rgba(0, 102, 255, 0.3);
          top: -75px;
          left: -75px;
        }

        .pulse-ring.delay {
          animation-delay: 0.5s;
        }

        @media (max-width: 768px) {
          .loading-logo {
            width: 120px;
            height: 120px;
          }

          .app-title {
            font-size: 32px;
          }

          .app-tagline {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
