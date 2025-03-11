'use client';

import { useEffect, useState } from 'react';

export default function HomePageResults({ stockData }) {
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!stockData) return;
      
      setLoading(true);
      
      try {
        // This would be replaced with actual API call in production
        // Mocked data for development
        const mockData = {
          symbol: stockData.symbol,
          price: 150.25,
          change: 2.35,
          changePercent: 1.58,
          open: 148.20,
          high: 151.45,
          low: 147.80,
          volume: 3547892,
          latestTradingDay: new Date().toISOString().split('T')[0],
          previousClose: 147.90
        };
        
        // Simulate API delay
        setTimeout(() => {
          setQuoteData(mockData);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching quote data:', err);
        setError('Failed to fetch stock data');
        setLoading(false);
      }
    };

    fetchData();
  }, [stockData]);

  if (loading) {
    return (
      <div className="card flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30">
        <h3 className="text-red-600 dark:text-red-400 text-lg font-semibold">Error</h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!quoteData) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{quoteData.symbol} Stock Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Stock Quote</h3>
          
          <div className="flex items-baseline mb-4">
            <span className="text-3xl font-bold">${quoteData.price.toFixed(2)}</span>
            <span className={`ml-2 text-lg ${quoteData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {quoteData.change >= 0 ? '+' : ''}{quoteData.change.toFixed(2)} ({quoteData.changePercent.toFixed(2)}%)
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Open</p>
              <p className="font-semibold">${quoteData.open.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Previous Close</p>
              <p className="font-semibold">${quoteData.previousClose.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Day's Range</p>
              <p className="font-semibold">${quoteData.low.toFixed(2)} - ${quoteData.high.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
              <p className="font-semibold">{quoteData.volume.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Price Chart</h3>
          <div className="h-64 flex items-center justify-center">
            <p>Chart would display here</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Value Analysis Summary</h3>
        <p className="mb-4">
          Get a detailed value investing analysis for {quoteData.symbol} by visiting our Value Analysis page.
        </p>
        <a href={`/value-analysis?symbol=${quoteData.symbol}`} className="btn btn-primary inline-block">
          View Value Analysis
        </a>
      </div>
    </div>
  );
}