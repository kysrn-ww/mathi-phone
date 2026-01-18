import React from 'react';

const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="search-bar" data-testid="search-bar">
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Buscar por modelo, color, chip..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
          data-testid="search-input"
        />
        {searchQuery && (
          <button 
            className="search-clear" 
            onClick={() => onSearchChange('')}
            data-testid="search-clear-btn"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;