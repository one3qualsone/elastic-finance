// frontend/src/components/cards/EnhancedSearchCard.jsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { searchCompany } from '@/lib/api/financeApi';

export default function EnhancedSearchCard({ onSelectStock, isLoading }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [serverWakingUp, setServerWakingUp] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const searchRef = useRef(null);
  const maxRetries = 3; // Maximum number of retry attempts
  const retryDelay = 2000; // Delay between retries in ms

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

  // Debounce search query
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  // Use debounced search query to fetch results
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length >= 2) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  const handleSearch = async () => {
    if (!debouncedSearchQuery || debouncedSearchQuery.length < 2) {
      setError('Please enter at least 2 characters');
      return;
    }
    
    setError('');
    setIsSearching(true);
    setRetryCount(0);
    setServerWakingUp(false);
    
    try {
      await searchWithRetry(debouncedSearchQuery);
    } catch (err) {
      console.error('Error searching for stocks:', err);
      setError('Error searching for stocks. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      setServerWakingUp(false);
    }
  };

  // Function to search with retry logic
  const searchWithRetry = async (query, currentRetry = 0) => {
    try {
      // Attempt to search
      const results = await searchCompany(query);
      setSearchResults(results || []);
      setShowResults(true);
      setServerWakingUp(false);
      return results;
    } catch (err) {
      // Check if we should retry
      if (currentRetry < maxRetries) {
        console.log(`Search attempt ${currentRetry + 1} failed, retrying in ${retryDelay}ms...`);
        
        // Set server waking up message after first failure
        if (currentRetry === 0) {
          setServerWakingUp(true);
          setError('Server may be waking up. Please wait a moment...');
        }
        
        setRetryCount(currentRetry + 1);
        
        // Wait and retry
        return new Promise(resolve => {
          setTimeout(async () => {
            try {
              const results = await searchWithRetry(query, currentRetry + 1);
              resolve(results);
            } catch (retryErr) {
              resolve([]); // Resolve with empty array on final failure
            }
          }, retryDelay);
        });
      } else {
        // Max retries reached
        setServerWakingUp(false);
        throw err;
      }
    }
  };

  const handleSelectStock = (stock) => {
    setSearchQuery(`${stock.symbol} - ${stock.name}`);
    onSelectStock(stock);
    setShowResults(false);
  };

  // Function to render appropriate loading/waking-up message
  const renderLoadingMessage = () => {
    if (serverWakingUp) {
      return (
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Server is waking up (attempt {retryCount}/{maxRetries})...</span>
        </div>
      );
    }
    
    if (isSearching) {
      return (
        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    
    return null;
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
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {renderLoadingMessage()}
            </div>
          </div>
          {error && (
            <p className={`mt-1 text-sm ${serverWakingUp ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
              {error}
            </p>
          )}
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
        
        {showResults && searchResults.length === 0 && !isSearching && !serverWakingUp && searchQuery.length >= 2 && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">No results found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}