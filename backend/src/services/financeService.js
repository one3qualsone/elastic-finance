const axios = require('axios');

// Configure API client
const apiClient = axios.create({
  baseURL: process.env.FINANCE_API_URL || 'https://www.alphavantage.co/query',
  timeout: 10000,
  params: {
    apikey: process.env.FINANCE_API_KEY
  }
});

/**
 * Search for companies by symbol or name
 */
exports.searchCompany = async (query) => {
  try {
    const response = await apiClient.get('', {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: query
      }
    });
    
    if (response.data.bestMatches) {
      return response.data.bestMatches;
    }
    
    return [];
  } catch (error) {
    console.error('Error searching for company:', error);
    throw new Error('Failed to search for company');
  }
};

/**
 * Get current stock quote
 */
exports.getQuote = async (symbol) => {
  try {
    const response = await apiClient.get('', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol
      }
    });
    
    if (response.data['Global Quote']) {
      return response.data['Global Quote'];
    }
    
    throw new Error('Quote data not found');
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw new Error(`Failed to fetch quote for ${symbol}`);
  }
};

/**
 * Get company overview
 */
exports.getCompanyOverview = async (symbol) => {
  try {
    const response = await apiClient.get('', {
      params: {
        function: 'OVERVIEW',
        symbol
      }
    });
    
    if (response.data && response.data.Symbol) {
      return response.data;
    }
    
    throw new Error('Company overview not found');
  } catch (error) {
    console.error(`Error fetching overview for ${symbol}:`, error);
    throw new Error(`Failed to fetch overview for ${symbol}`);
  }
};

/**
 * Get financial statements
 */
exports.getFinancials = async (symbol, type = 'income') => {
  let functionName;
  
  switch (type) {
    case 'income':
      functionName = 'INCOME_STATEMENT';
      break;
    case 'balance':
      functionName = 'BALANCE_SHEET';
      break;
    case 'cashflow':
      functionName = 'CASH_FLOW';
      break;
    default:
      functionName = 'INCOME_STATEMENT';
  }
  
  try {
    const response = await apiClient.get('', {
      params: {
        function: functionName,
        symbol
      }
    });
    
    if (response.data && (response.data.annualReports || response.data.quarterlyReports)) {
      return response.data;
    }
    
    throw new Error('Financial data not found');
  } catch (error) {
    console.error(`Error fetching ${type} statement for ${symbol}:`, error);
    throw new Error(`Failed to fetch ${type} statement for ${symbol}`);
  }
};

/**
 * Calculate value investing metrics and provide analysis
 */
exports.getValueAnalysis = async (symbol) => {
  try {
    // Get necessary data for analysis
    const [overview, incomeStatement, balanceSheet] = await Promise.all([
      this.getCompanyOverview(symbol),
      this.getFinancials(symbol, 'income'),
      this.getFinancials(symbol, 'balance')
    ]);
    
    // Extract key metrics
    const currentPrice = parseFloat(overview.Price);
    const eps = parseFloat(overview.EPS);
    const bookValue = parseFloat(overview.BookValue);
    const pe = parseFloat(overview.PERatio);
    const pb = parseFloat(overview.PriceToBookRatio);
    const roe = parseFloat(overview.ReturnOnEquityTTM);
    
    // Calculate value metrics
    const valueScore = calculateValueScore(currentPrice, eps, bookValue, pe, pb, roe);
    const intrinsicValue = calculateIntrinsicValue(eps, bookValue, roe);
    
    // Generate analysis text
    const analysis = generateAnalysis(valueScore, currentPrice, intrinsicValue, pe, pb, roe);
    
    return {
      symbol,
      currentPrice,
      intrinsicValue,
      valueScore,
      metrics: {
        eps,
        bookValue,
        pe,
        pb,
        roe
      },
      analysis
    };
  } catch (error) {
    console.error(`Error performing value analysis for ${symbol}:`, error);
    throw new Error(`Failed to perform value analysis for ${symbol}`);
  }
};

/**
 * Calculate a value score (1-10) based on value investing principles
 */
function calculateValueScore(price, eps, bookValue, pe, pb, roe) {
  // Initialize score components
  let peScore = 0;
  let pbScore = 0;
  let roeScore = 0;
  
  // PE ratio scoring (lower is better for value investing)
  if (pe <= 0) {
    peScore = 0; // Negative earnings
  } else if (pe < 10) {
    peScore = 4; // Excellent PE
  } else if (pe < 15) {
    peScore = 3; // Good PE
  } else if (pe < 20) {
    peScore = 2; // Average PE
  } else if (pe < 25) {
    peScore = 1; // Below average PE
  } else {
    peScore = 0; // Poor PE
  }
  
  // P/B ratio scoring (lower is better for value investing)
  if (pb <= 0) {
    pbScore = 0; // Invalid book value
  } else if (pb < 1) {
    pbScore = 4; // Excellent P/B
  } else if (pb < 2) {
    pbScore = 3; // Good P/B
  } else if (pb < 3) {
    pbScore = 2; // Average P/B
  } else if (pb < 4) {
    pbScore = 1; // Below average P/B
  } else {
    pbScore = 0; // Poor P/B
  }
  
  // ROE scoring (higher is better)
  if (roe <= 0) {
    roeScore = 0; // Negative ROE
  } else if (roe > 20) {
    roeScore = 2; // Excellent ROE
  } else if (roe > 15) {
    roeScore = 1.5; // Good ROE
  } else if (roe > 10) {
    roeScore = 1; // Average ROE
  } else {
    roeScore = 0.5; // Below average ROE
  }
  
  // Calculate total score (1-10 scale)
  const totalScore = peScore + pbScore + roeScore;
  
  // Scale to 1-10
  return Math.min(Math.max(Math.round(totalScore * 10 / 10), 1), 10);
}

/**
 * Calculate intrinsic value using a simplified model
 */
function calculateIntrinsicValue(eps, bookValue, roe) {
  if (eps <= 0 || bookValue <= 0 || roe <= 0) {
    return null; // Cannot calculate with negative/zero values
  }
  
  // Simple Graham formula for intrinsic value
  const growthRate = Math.min(roe * 0.5, 0.15); // Cap growth at 15%
  return (eps * (8.5 + 2 * growthRate * 100)).toFixed(2);
}

/**
 * Generate analysis text based on metrics
 */
function generateAnalysis(valueScore, currentPrice, intrinsicValue, pe, pb, roe) {
  let analysis = "";
  
  // Interpret value score
  if (valueScore >= 8) {
    analysis += "Strong value opportunity. ";
  } else if (valueScore >= 6) {
    analysis += "Moderate value opportunity. ";
  } else if (valueScore >= 4) {
    analysis += "Fair value. ";
  } else {
    analysis += "Weak value proposition. ";
  }
  
  // Add price vs intrinsic value analysis
  if (intrinsicValue && currentPrice < intrinsicValue * 0.8) {
    analysis += `Trading significantly below estimated intrinsic value ($${intrinsicValue}). `;
  } else if (intrinsicValue && currentPrice < intrinsicValue) {
    analysis += `Trading below estimated intrinsic value ($${intrinsicValue}). `;
  } else if (intrinsicValue && currentPrice < intrinsicValue * 1.2) {
    analysis += `Trading near estimated intrinsic value ($${intrinsicValue}). `;
  } else if (intrinsicValue) {
    analysis += `Trading above estimated intrinsic value ($${intrinsicValue}). `;
  }
  
  // Add PE analysis
  if (pe <= 0) {
    analysis += "Negative earnings. ";
  } else if (pe < 10) {
    analysis += "PE ratio indicates potential undervaluation. ";
  } else if (pe > 25) {
    analysis += "PE ratio indicates potential overvaluation. ";
  } else {
    analysis += "PE ratio is within reasonable range. ";
  }
  
  // Add ROE analysis
  if (roe > 15) {
    analysis += "Strong return on equity indicates effective management.";
  } else if (roe > 10) {
    analysis += "Decent return on equity.";
  } else if (roe > 0) {
    analysis += "Below-average return on equity.";
  } else {
    analysis += "Negative return on equity is concerning.";
  }
  
  return analysis;
}