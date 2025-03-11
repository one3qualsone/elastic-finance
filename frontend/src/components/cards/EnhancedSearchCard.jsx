// frontend/src/components/cards/EnhancedSearchCard.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { searchCompany } from '@/lib/api/financeApi';

export default function EnhancedSearchCard({ onSelectStock, isLoading }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search function
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery && searchQuery.length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery || searchQuery.length < 2) {
      setError('Please enter at least 2 characters');
      return;
    }
    
    setError('');
    setIsSearching(true);
    
    try {
      const results = await searchCompany(searchQuery);
      setSearchResults(results || []);
      setShowResults(true);
    } catch (err) {
      console.error('Error searching for stocks:', err);
      setError('Error searching for stocks. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectStock = (stock) => {
    setSearchQuery(`${stock.symbol} - ${stock.name}`);
    onSelectStock(stock);
    setShowResults(false);
  };

  return (
    <div className="card" ref={searchRef}>
      <h2 className="text-xl font-semibold mb-4">Search Stock</h2>
      <div className="relative">
        <div className="mb-4">
          <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search by Company Name or Ticker
          </label>
          <div className="relative">
            <input
              type="text"
              id="searchQuery"
              className="input pr-10"
              placeholder="e.g. Apple, AAPL, Microsoft"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
            <ul className="py-1">
              {searchResults.map((result) => (
                <li 
                  key={result.symbol}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                  onClick={() => handleSelectStock(result)}
                >
                  <div>
                    <span className="font-semibold">{result.symbol}</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{result.name}</p>
                  </div>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                    {result.exchange}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {showResults && searchResults.length === 0 && !isSearching && searchQuery.length >= 2 && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">No results found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}