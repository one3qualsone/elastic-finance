'use client';

import { createContext, useState, useContext, useEffect } from 'react';

// Create context
const EducationalContentContext = createContext();

// Custom hook for using the context
export const useEducationalContent = () => {
  const context = useContext(EducationalContentContext);
  if (!context) {
    throw new Error('useEducationalContent must be used within an EducationalContentProvider');
  }
  return context;
};

// Provider component
export const EducationalContentProvider = ({ children }) => {
  const [educationalContent, setEducationalContent] = useState({});
  const [contentMap, setContentMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize content map
  useEffect(() => {
    setContentMap({
      'trading-fundamentals': 'trading-fundamentals.md',
      'trading-basics': 'trading-basics.md',
      'trading-intermediate': 'trading-intermediate.md',
      'bonds': 'bonds.md',
      'calculating-stock-value': 'calculating-stock-value.md',
    });
  }, []);

  // Get content by slug
  const getContent = async (slug) => {
    if (educationalContent[slug]) {
      return educationalContent[slug];
    }

    setLoading(true);
    setError(null);

    try {
      // Make API request to fetch content
      const url = `${process.env.NEXT_PUBLIC_API_URL}/educational-content/${slug}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }
      
      const content = await response.text();
      
      // Update state
      setEducationalContent(prev => ({
        ...prev,
        [slug]: content
      }));
      
      setLoading(false);
      return content;
    } catch (error) {
      console.error(`Error fetching educational content for ${slug}:`, error);
      setError(`Failed to fetch content for ${slug}`);
      setLoading(false);
      return null;
    }
  };

  // Get content list
  const getContentList = async () => {
    setLoading(true);
    setError(null);

    try {
      // Make API request to fetch content list
      const url = `${process.env.NEXT_PUBLIC_API_URL}/educational-content`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch content list: ${response.statusText}`);
      }
      
      const contentList = await response.json();
      
      setLoading(false);
      return contentList;
    } catch (error) {
      console.error('Error fetching educational content list:', error);
      setError('Failed to fetch content list');
      setLoading(false);
      return [];
    }
  };

  // Context value
  const value = {
    educationalContent,
    loading,
    error,
    getContent,
    getContentList,
    contentMap,
  };

  return (
    <EducationalContentContext.Provider value={value}>
      {children}
    </EducationalContentContext.Provider>
  );
};

export default EducationalContentContext;