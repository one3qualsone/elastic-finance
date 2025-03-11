
/**
 * Finance API client for making requests to the backend
 */
import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging, authentication, etc.
apiClient.interceptors.request.use(
  (config) => {
    // You could add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle API rate limits, authentication issues, etc.
    if (response && response.status === 429) {
      console.error('API rate limit exceeded');
    } else if (response && response.status === 401) {
      console.error('Authentication error');
    } else if (!response) {
      console.error('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);

/**
 * Get enhanced value investing analysis
 */
export const getEnhancedValueAnalysis = async (symbol) => {
  try {
    const response = await apiClient.get(`/finance/enhanced-analysis/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error performing enhanced analysis for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Search for companies by symbol or name
 */
export const searchCompany = async (query) => {
  try {
    const response = await apiClient.get('/finance/search', {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching for company:', error);
    throw error;
  }
};

/**
 * Get current stock quote
 */
export const getQuote = async (symbol) => {
  try {
    const response = await apiClient.get(`/finance/quote/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get company overview
 */
export const getCompanyOverview = async (symbol) => {
  try {
    const response = await apiClient.get(`/finance/overview/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching overview for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get historical price data
 */
export const getHistoricalData = async (symbol, period, range) => {
  try {
    const response = await apiClient.get(`/finance/historical/${symbol}`, {
      params: { period, range }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get financial statements
 */
export const getFinancials = async (symbol, type = 'income') => {
  try {
    const response = await apiClient.get(`/finance/financials/${symbol}`, {
      params: { type }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} statement for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get value investing analysis
 */
export const getValueAnalysis = async (symbol) => {
  try {
    const response = await apiClient.get(`/finance/value-analysis/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error performing value analysis for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get educational content
 */
export const getEducationalContent = async (slug) => {
  try {
    const response = await apiClient.get(`/educational-content/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching educational content for ${slug}:`, error);
    throw error;
  }
};

/**
 * Get educational content list
 */
export const getEducationalContentList = async () => {
  try {
    const response = await apiClient.get('/educational-content');
    return response.data;
  } catch (error) {
    console.error('Error fetching educational content list:', error);
    throw error;
  }
};

export default {
  searchCompany,
  getQuote,
  getCompanyOverview,
  getHistoricalData,
  getFinancials,
  getValueAnalysis,
  getEnhancedValueAnalysis,  
  getEducationalContent,
  getEducationalContentList
};