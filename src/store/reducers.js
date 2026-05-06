export const initialState = {
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
  errors: [],
  speedData: {
    current: 0,
    average: 0,
    max: 0,
    distance: 0,
    activity: 'idle'
  },
  tripData: [],
  notifications: []
};

export const actionTypes = {
  SET_USER_LOCATION: 'SET_USER_LOCATION',
  SET_SELECTED_PLACE: 'SET_SELECTED_PLACE',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_SEARCHING: 'SET_SEARCHING',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  LOAD_FAVORITES: 'LOAD_FAVORITES',
  ADD_HISTORY: 'ADD_HISTORY',
  REMOVE_HISTORY: 'REMOVE_HISTORY',
  CLEAR_HISTORY: 'CLEAR_HISTORY',
  LOAD_HISTORY: 'LOAD_HISTORY',
  SET_TRACKING: 'SET_TRACKING',
  SET_ROUTE: 'SET_ROUTE',
  TOGGLE_LAYER: 'TOGGLE_LAYER',
  SET_DARK_MODE: 'SET_DARK_MODE',
  SET_SPLIT_MODE: 'SET_SPLIT_MODE',
  SET_SIDEBAR: 'SET_SIDEBAR',
  SET_TRANSPORT_MODE: 'SET_TRANSPORT_MODE',
  UPDATE_SPEED_DATA: 'UPDATE_SPEED_DATA',
  ADD_TRIP: 'ADD_TRIP',
  ADD_ERROR: 'ADD_ERROR',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION'
};

export const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_LOCATION:
      return {
        ...state,
        userLocation: action.payload
      };

    case actionTypes.SET_SELECTED_PLACE:
      return {
        ...state,
        selectedPlace: action.payload
      };

    case actionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      };

    case actionTypes.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
        isSearching: false
      };

    case actionTypes.SET_SEARCHING:
      return {
        ...state,
        isSearching: action.payload
      };

    case actionTypes.ADD_FAVORITE:
      const newFavorites = [...state.favorites, action.payload];
      localStorage.setItem('map_explorer_favorites', JSON.stringify(newFavorites));
      return {
        ...state,
        favorites: newFavorites
      };

    case actionTypes.REMOVE_FAVORITE:
      const filteredFavorites = state.favorites.filter(f => f.id !== action.payload);
      localStorage.setItem('map_explorer_favorites', JSON.stringify(filteredFavorites));
      return {
        ...state,
        favorites: filteredFavorites
      };

    case actionTypes.LOAD_FAVORITES:
      return {
        ...state,
        favorites: action.payload
      };

    case actionTypes.ADD_HISTORY:
      const newHistory = [action.payload, ...state.history.slice(0, 49)];
      localStorage.setItem('map_explorer_history', JSON.stringify(newHistory));
      return {
        ...state,
        history: newHistory
      };

    case actionTypes.REMOVE_HISTORY:
      const filteredHistory = state.history.filter(h => h.id !== action.payload);
      localStorage.setItem('map_explorer_history', JSON.stringify(filteredHistory));
      return {
        ...state,
        history: filteredHistory
      };

    case actionTypes.CLEAR_HISTORY:
      localStorage.removeItem('map_explorer_history');
      return {
        ...state,
        history: []
      };

    case actionTypes.LOAD_HISTORY:
      return {
        ...state,
        history: action.payload
      };

    case actionTypes.SET_TRACKING:
      return {
        ...state,
        isTracking: action.payload
      };

    case actionTypes.SET_ROUTE:
      return {
        ...state,
        currentRoute: action.payload
      };

    case actionTypes.TOGGLE_LAYER:
      return {
        ...state,
        activeLayers: {
          ...state.activeLayers,
          [action.payload]: !state.activeLayers[action.payload]
        }
      };

    case actionTypes.SET_DARK_MODE:
      localStorage.setItem('map_explorer_theme', action.payload ? 'dark' : 'light');
      return {
        ...state,
        darkMode: action.payload
      };

    case actionTypes.SET_SPLIT_MODE:
      return {
        ...state,
        splitMode: action.payload
      };

    case actionTypes.SET_SIDEBAR:
      return {
        ...state,
        sidebarOpen: action.payload
      };

    case actionTypes.SET_TRANSPORT_MODE:
      return {
        ...state,
        transportMode: action.payload
      };

    case actionTypes.UPDATE_SPEED_DATA:
      return {
        ...state,
        speedData: {
          ...state.speedData,
          ...action.payload
        }
      };

    case actionTypes.ADD_TRIP:
      const trips = [...state.tripData, action.payload];
      localStorage.setItem('map_explorer_trips', JSON.stringify(trips));
      return {
        ...state,
        tripData: trips
      };

    case actionTypes.ADD_ERROR:
      return {
        ...state,
        errors: [...state.errors, {
          id: Date.now(),
          ...action.payload
        }]
      };

    case actionTypes.CLEAR_ERRORS:
      return {
        ...state,
        errors: []
      };

    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          ...action.payload
        }]
      };

    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };

    default:
      return state;
  }
};

// Action creators
export const actions = {
  setUserLocation: (location) => ({
    type: actionTypes.SET_USER_LOCATION,
    payload: location
  }),

  setSelectedPlace: (place) => ({
    type: actionTypes.SET_SELECTED_PLACE,
    payload: place
  }),

  setSearchQuery: (query) => ({
    type: actionTypes.SET_SEARCH_QUERY,
    payload: query
  }),

  setSearchResults: (results) => ({
    type: actionTypes.SET_SEARCH_RESULTS,
    payload: results
  }),

  setSearching: (isSearching) => ({
    type: actionTypes.SET_SEARCHING,
    payload: isSearching
  }),

  addFavorite: (place) => ({
    type: actionTypes.ADD_FAVORITE,
    payload: place
  }),

  removeFavorite: (placeId) => ({
    type: actionTypes.REMOVE_FAVORITE,
    payload: placeId
  }),

  addHistory: (item) => ({
    type: actionTypes.ADD_HISTORY,
    payload: item
  }),

  removeHistory: (id) => ({
    type: actionTypes.REMOVE_HISTORY,
    payload: id
  }),

  clearHistory: () => ({
    type: actionTypes.CLEAR_HISTORY
  }),

  setTracking: (isTracking) => ({
    type: actionTypes.SET_TRACKING,
    payload: isTracking
  }),

  setRoute: (route) => ({
    type: actionTypes.SET_ROUTE,
    payload: route
  }),

  toggleLayer: (layerName) => ({
    type: actionTypes.TOGGLE_LAYER,
    payload: layerName
  }),

  setDarkMode: (darkMode) => ({
    type: actionTypes.SET_DARK_MODE,
    payload: darkMode
  }),

  setSplitMode: (splitMode) => ({
    type: actionTypes.SET_SPLIT_MODE,
    payload: splitMode
  }),

  setSidebar: (isOpen) => ({
    type: actionTypes.SET_SIDEBAR,
    payload: isOpen
  }),

  setTransportMode: (mode) => ({
    type: actionTypes.SET_TRANSPORT_MODE,
    payload: mode
  }),

  updateSpeedData: (data) => ({
    type: actionTypes.UPDATE_SPEED_DATA,
    payload: data
  }),

  addTrip: (trip) => ({
    type: actionTypes.ADD_TRIP,
    payload: trip
  }),

  addError: (error) => ({
    type: actionTypes.ADD_ERROR,
    payload: error
  }),

  clearErrors: () => ({
    type: actionTypes.CLEAR_ERRORS
  }),

  addNotification: (notification) => ({
    type: actionTypes.ADD_NOTIFICATION,
    payload: notification
  }),

  removeNotification: (id) => ({
    type: actionTypes.REMOVE_NOTIFICATION,
    payload: id
  })
};