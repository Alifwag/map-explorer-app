import React, { useState, useCallback } from 'react';
import { placesService } from '../../services/placesService';
import { debounce } from '../../utils/debounce';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }
      
      setIsSearching(true);
      const places = await placesService.searchPlaces(searchQuery);
      setResults(places);
      setIsSearching(false);
    }, 500),
    []
  );

  const handleChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Cari tempat..."
          className="search-input"
        />
        {isSearching && <div className="search-spinner" />}
      </div>
      
      {results.length > 0 && (
        <div className="search-results">
          {results.map(place => (
            <div key={place.id} className="search-result-item">
              <div className="place-name">{place.name}</div>
              <div className="place-address">{place.fullAddress}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;