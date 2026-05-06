import { useState, useCallback } from 'react';
import { placesService } from '../services/placesService';
import { searchCache } from '../utils/cache';
import { debounce } from '../utils/debounce';

export const usePlacesSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const search = useCallback(
    debounce(async (searchQuery, category = null) => {
      if (!searchQuery || searchQuery.length < 2) {
        setResults([]);
        return;
      }

      const cacheKey = `${searchQuery}_${category || 'all'}`;
      const cached = searchCache.get(cacheKey);
      
      if (cached) {
        setResults(cached);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const data = await placesService.searchPlaces(searchQuery, category);
        setResults(data);
        searchCache.set(cacheKey, data);
        
        // Save to history
        const historyItem = {
          id: Date.now(),
          query: searchQuery,
          category: category,
          timestamp: new Date().toISOString()
        };
        
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        history.unshift(historyItem);
        localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 50)));
        
      } catch (err) {
        setError('Gagal mencari tempat. Silakan coba lagi.');
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
    search(newQuery, selectedCategory);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (query) {
      search(query, category);
    } else {
      search('*', category);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
  };

  return {
    query,
    setQuery: handleQueryChange,
    results,
    isSearching,
    error,
    selectedCategory,
    setSelectedCategory: handleCategorySelect,
    clearSearch
  };
};