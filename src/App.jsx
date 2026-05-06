import React, { useState, useEffect } from 'react';
import { AppProvider } from './store/AppContext';
import Header from './components/Layout/Header';
import MapView from './components/Map/MapView';
import Sidebar from './components/Layout/Sidebar';
import SearchBar from './components/Search/SearchBar';
import QuickAccess from './components/Search/QuickAccess';
import SplitView from './components/Layout/SplitView';
import ErrorBoundary from './components/UI/ErrorBoundary';
import Loading from './components/UI/Loading';
import './styles/global.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true); // Default dark
  const [splitMode, setSplitMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Loading screen with logo
    setTimeout(() => setIsLoading(false), 2500);
  }, []);

  if (isLoading) return <Loading message="Mempersiapkan peta..." />;

  return (
    <ErrorBoundary>
      <AppProvider>
        <div className={`app ${darkMode ? 'dark' : 'light'}`}>
          <Header 
            darkMode={darkMode} 
            setDarkMode={setDarkMode}
            splitMode={splitMode}
            setSplitMode={setSplitMode}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <div className="main-container">
            <Sidebar isOpen={sidebarOpen}>
              <div className="sidebar-brand">
                <img src="/logo192.png" alt="MapExplorer" className="sidebar-logo" />
                <span className="sidebar-tagline">Navigate. Track. Explore.</span>
              </div>
              <SearchBar />
              <QuickAccess />
            </Sidebar>
            <div className="map-area">
              <MapView />
            </div>
            {splitMode && <SplitView />}
          </div>
        </div>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
