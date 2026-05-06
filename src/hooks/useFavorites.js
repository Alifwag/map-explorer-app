import { useState, useEffect, useCallback } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem('map_explorer_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = (newFavorites) => {
    try {
      localStorage.setItem('map_explorer_favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addFavorite = useCallback((place) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === place.id);
      if (exists) return prev;
      
      const newFavorites = [...prev, {
        ...place,
        addedAt: new Date().toISOString()
      }];
      
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  const removeFavorite = useCallback((placeId) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(f => f.id !== placeId);
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((placeId) => {
    return favorites.some(f => f.id === placeId);
  }, [favorites]);

  const toggleFavorite = useCallback((place) => {
    if (isFavorite(place.id)) {
      removeFavorite(place.id);
    } else {
      addFavorite(place);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    localStorage.removeItem('map_explorer_favorites');
  }, []);

  const getFavoritesByCategory = useCallback((category) => {
    if (!category || category === 'all') return favorites;
    return favorites.filter(f => f.category === category);
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoritesByCategory
  };
};