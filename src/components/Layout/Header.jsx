import React from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Columns, 
  Menu, 
  X,
  Github
} from 'lucide-react';

const Header = ({ 
  darkMode, 
  setDarkMode, 
  splitMode, 
  setSplitMode,
  sidebarOpen,
  setSidebarOpen 
}) => {
  return (
    <motion.header 
      className="app-header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="header-content">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="logo">
            <img src="/favicon-32x32.png" alt="MapExplorer" className="logo-img" />
            <div className="logo-text">
              <h1>MapExplorer</h1>
              <span className="logo-tagline">Navigate. Track. Explore.</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <motion.button
            className="icon-button"
            onClick={() => setSplitMode(!splitMode)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Split View"
          >
            <Columns size={20} />
          </motion.button>

          <motion.button
            className="icon-button"
            onClick={() => setDarkMode(!darkMode)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <motion.a
            href="https://github.com/Alifwag/map-explorer-app"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-button github-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="GitHub Repository"
          >
            <Github size={20} />
          </motion.a>
        </div>
      </div>

      <style jsx>{`
        .app-header {
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          padding: 12px 24px;
          z-index: 1100;
          backdrop-filter: blur(10px);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .menu-toggle {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          cursor: pointer;
          padding: 8px;
          border-radius: 10px;
          display: flex;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-img {
          width: 32px;
          height: 32px;
          border-radius: 8px;
        }

        .logo-text h1 {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #0066ff, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          line-height: 1.2;
        }

        .logo-tagline {
          font-size: 10px;
          color: var(--text-secondary);
          display: block;
          letter-spacing: 0.5px;
        }

        .header-right {
          display: flex;
          gap: 8px;
        }

        .icon-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
        }

        .icon-button:hover {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0 8px;
          }

          .logo-text h1 {
            font-size: 16px;
          }

          .logo-tagline {
            display: none;
          }
        }
      `}</style>
    </motion.header>
  );
};

export default Header;
