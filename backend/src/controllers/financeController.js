const yahooFinanceService = require('../services/yahooFinanceService');
const enhancedLLMService = require('../services/enhancedLLMService');

// Add to backend/src/controllers/financeController.js
const llmService = require('../services/llmService');


/**
 * Get enhanced value investing analysis for a stock
 */
exports.getEnhancedValueAnalysis = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }
    
    // Fetch all necessary data in parallel
    const [overview, valueAnalysis, incomeStatement, balanceSheet, cashflowStatement] = await Promise.all([
      yahooFinanceService.getCompanyOverview(symbol),
      yahooFinanceService.getValueAnalysis(symbol),
      yahooFinanceService.getFinancials(symbol, 'income'),
      yahooFinanceService.getFinancials(symbol, 'balance'),
      yahooFinanceService.getFinancials(symbol, 'cashflow')
    ]);
    
    // Combine all data for the LLM service
    const stockData = {
      symbol,
      overview,
      valueAnalysis,
      financials: {
        income: incomeStatement,
        balance: balanceSheet,
        cashflow: cashflowStatement
      }
    };
    
    // Generate enhanced analysis
    const enhancedAnalysis = await enhancedLLMService.generateStockAnalysis(stockData);
    
    // Return combined result
    res.json({
      symbol,
      basicAnalysis: valueAnalysis,
      enhancedAnalysis
    });
  } catch (error) {
    console.error(`Error performing enhanced analysis for ${req.params.symbol}:`, error);
    next(error);
  }
};


/**
 * Get AI sentiment analysis for a stock
 */
exports.getAISentiment = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }
    
    // Get recent news articles (you'll need a news API here)
    // This is a placeholder - you'd use a real API like Alpha Vantage News API
    const newsItems = [
      { title: `${symbol} Reports Strong Quarterly Earnings`, date: new Date().toISOString() },
      { title: `Analysts Raise Price Target for ${symbol}`, date: new Date().toISOString() }
    ];
    
    const sentimentAnalysis = await llmService.analyzeNewsSentiment(symbol, newsItems);
    res.json(sentimentAnalysis);
  } catch (error) {
    next(error);
  }
};


/**
 * Search for companies by symbol or name
 */
exports.searchCompany = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const results = await yahooFinanceService.searchCompany(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current quote for a stock symbol
 */
exports.getQuote = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }
    
    const quote = await yahooFinanceService.getQuote(symbol);
    res.json(quote);
  } catch (error) {
    next(error);
  }
};

/**
 * Get company overview for a stock symbol
 */
exports.getCompanyOverview = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }
    
    const overview = await yahooFinanceService.getCompanyOverview(symbol);
    res.json(overview);
  } catch (error) {
    next(error);
  }
};

/**
 * Get historical price data for a stock symbol
 */
exports.getHistoricalData = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { period, range } = req.query;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }
    
    const data = await yahooFinanceService.getHistoricalData(symbol, period, range);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get financial statements for a stock symbol
 */
exports.getFinancials = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { type } = req.query || 'income';
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }
    
    const financials = await yahooFinanceService.getFinancials(symbol, type);
    res.json(financials);
  } catch (error) {
    next(error);
  }
};

/**
 * Get value investing analysis for a stock
 */
exports.getValueAnalysis = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }
    
    const analysis = await yahooFinanceService.getValueAnalysis(symbol);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
};