'use client';

import { useState } from 'react';

export default function ValueSearchCard({ onAnalyze, isLoading }) {
  const [ticker, setTicker] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!ticker) {
      setError('Please enter a ticker symbol');
      return;
    }
    
    setError('');
    
    try {
      onAnalyze(ticker.toUpperCase());
    } catch (err) {
      setError('Error analyzing ticker');
      console.error(err);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Value Analysis</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Enter a ticker symbol to get a value investing analysis based on Warren Buffett's principles.
      </p>
      
      <form onSubmit={handleAnalyze}>
        <div className="mb-4">
          <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Enter Ticker Symbol
          </label>
          <input
            type="text"
            id="ticker"
            className="input"
            placeholder="e.g. AAPL, MSFT, TSLA"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze'
          )}
        </button>
      </form>
    </div>
  );
}