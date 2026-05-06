import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const AppContext = createContext();

const initialState = {
  userLocation: null,
  selectedPlace: null,
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  favorites: [],
  history: [],
  isTracking: false,
  currentRoute: null,
  activeLayers: {
    traffic: true,
    transit: false,
    bike: false,
    airQuality: false,
    wildfire: false
  },
  darkMode: false,
  splitMode: false,
  sidebarOpen: true,
  transportMode: 'car',
  errors: []
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER_LOCATION':
      return { ...state, userLocation: action.payload };
    
    case 'SET_SELECTED_PLACE':
      return { ...state, selectedPlace: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload, isSearching: false };
    
    case 'SET_SEARCHING':
      return { ...state, isSearching: action.payload };
    
    case 'ADD_FAVORITE':
      const newFavorites = [...state.favorites, action.payload];
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(newFavorites));
      return { ...state, favorites: newFavorites };
    
    case 'REMOVE_FAVORITE':
      const filteredFavorites = state.favorites.filter(f => f.id !== action.payload);
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(filteredFavorites));
      return { ...state, favorites: filteredFavorites };
    
    case 'LOAD_FAVORITES':
      return { ...state, favorites: action.payload };
    
    case 'ADD_HISTORY':
      const newHistory = [action.payload, ...state.history.slice(0, 49)];
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(newHistory));
      return { ...state, history: newHistory };
    
    case 'REMOVE_HISTORY':
      const filteredHistory = state.history.filter(h => h.id !== action.payload);
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(filteredHistory));
      return { ...state, history: filteredHistory };
    
    case 'CLEAR_HISTORY':
      localStorage.removeItem(STORAGE_KEYS.history);
      return { ...state, history: [] };
    
    case 'LOAD_HISTORY':
      return { ...state, history: action.payload };
    
    case 'SET_TRACKING':
      return { ...state, isTracking: action.payload };
    
    case 'SET_ROUTE':
      return { ...state, currentRoute: action.payload };
    
    case 'TOGGLE_LAYER':
      return {
        ...state,
        activeLayers: {
          ...state.activeLayers,
          [action.payload]: !state.activeLayers[action.payload]
        }
      };
    
    case 'SET_DARK_MODE':
      localStorage.setItem(STORAGE_KEYS.theme, action.payload ? 'dark' : 'light');
      return { ...state, darkMode: action.payload };
    
    case 'SET_SPLIT_MODE':
      return { ...state, splitMode: action.payload };
    
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    
    case 'SET_TRANSPORT_MODE':
      return { ...state, transportMode: action.payload };
    
    case 'ADD_ERROR':
      return { ...state, errors: [...state.errors, action.payload] };
    
    case 'CLEAR_ERRORS':
      return { ...state, errors: [] };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    // Load favorites
    const storedFavorites = localStorage.getItem(STORAGE_KEYS.favorites);
    if (storedFavorites) {
      dispatch({ 
        type: 'LOAD_FAVORITES', 
        payload: JSON.parse(storedFavorites) 
      });
    }

    // Load history
    const storedHistory = localStorage.getItem(STORAGE_KEYS.history);
    if (storedHistory) {
      dispatch({ 
        type: 'LOAD_HISTORY', 
        payload: JSON.parse(storedHistory) 
      });
    }

    // Load theme
    const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (storedTheme === 'dark') {
      dispatch({ type: 'SET_DARK_MODE', payload: true });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export default AppContext;