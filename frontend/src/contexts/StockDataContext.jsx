'use client';

import { createContext, useState, useContext } from 'react';

// Create context
const StockDataContext = createContext();

// Custom hook for using the context
export const useStockData = () => {
  const context = useContext(StockDataContext);
  if (!context) {
    throw new Error('useStockData must be used within a StockDataProvider');
  }
  return context;
};

// Provider component
export const StockDataProvider = ({ children }) => {
  const [stockData, setStockData] = useState(null);
  const [quote, setQuote] = useState(null);
  const [companyOverview, setCompanyOverview] = useState(null);
  const [financials, setFinancials] = useState({
    income: null,
    balance: null,
    cashflow: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset all data
  const resetData = () => {
    setStockData(null);
    setQuote(null);
    setCompanyOverview(null);
    setFinancials({
      income: null,
      balance: null,
      cashflow: null,
    });
    setError(null);
  };

  // Set basic stock data
  const setStock = (data) => {
    setStockData(data);
  };

  // Update quote data
  const updateQuote = (data) => {
    setQuote(data);
  };

  // Update company overview
  const updateCompanyOverview = (data) => {
    setCompanyOverview(data);
  };

  // Update financial statements
  const updateFinancials = (type, data) => {
    setFinancials(prev => ({
      ...prev,
      [type]: data
    }));
  };

  // Set loading state
  const setLoadingState = (isLoading) => {
    setLoading(isLoading);
  };

  // Set error state
  const setErrorState = (errorMessage) => {
    setError(errorMessage);
  };

  // Context value
  const value = {
    stockData,
    quote,
    companyOverview,
    financials,
    loading,
    error,
    setStock,
    updateQuote,
    updateCompanyOverview,
    updateFinancials,
    setLoadingState,
    setErrorState,
    resetData,
  };

  return (
    <StockDataContext.Provider value={value}>
      {children}
    </StockDataContext.Provider>
  );
};

export default StockDataContext;