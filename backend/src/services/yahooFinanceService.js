// backend/src/services/yahooFinanceService.js
const yahooFinance = require('yahoo-finance2').default;
const NodeCache = require('node-cache');
const config = require('../config');

// Setup cache with configurable TTL (time to live)
const cache = new NodeCache({ stdTTL: config.cacheTtl });

/**
 * Search for companies by symbol or name
 * @param {string} query - Search query
 * @returns {Promise<Array>} List of matching companies
 */
const searchCompany = async (query) => {
  const cacheKey = `search_${query}`;
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const results = await yahooFinance.search(query);
    
    if (results && results.quotes) {
      const formattedResults = results.quotes.map(quote => ({
        symbol: quote.symbol,
        name: quote.shortname || quote.longname || '',
        type: quote.quoteType || '',
        exchange: quote.exchange || ''
      }));
      
      // Cache results
      cache.set(cacheKey, formattedResults);
      
      return formattedResults;
    }
    
    return [];
  } catch (error) {
    console.error('Error searching for company:', error);
    throw new Error('Failed to search for company');
  }
};

/**
 * Get current stock quote
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Quote data
 */
const getQuote = async (symbol) => {
  const cacheKey = `quote_${symbol}`;
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const quote = await yahooFinance.quote(symbol);
    
    // Format the data to match our API structure
    const formattedQuote = {
      symbol: quote.symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      open: quote.regularMarketOpen || 0,
      high: quote.regularMarketDayHigh || 0,
      low: quote.regularMarketDayLow || 0,
      volume: quote.regularMarketVolume || 0,
      latestTradingDay: quote.regularMarketTime ? new Date(quote.regularMarketTime * 1000).toISOString() : null,
      previousClose: quote.regularMarketPreviousClose || 0
    };
    
    // Cache results
    cache.set(cacheKey, formattedQuote);
    
    return formattedQuote;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw new Error(`Failed to fetch quote for ${symbol}`);
  }
};

/**
 * Get company overview
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Company overview data
 */
const getCompanyOverview = async (symbol) => {
  const cacheKey = `overview_${symbol}`;
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // Get quote for basic info
    const quote = await yahooFinance.quote(symbol);
    
    // Get more detailed data
    const quoteSummary = await yahooFinance.quoteSummary(symbol, {
      modules: ['summaryProfile', 'summaryDetail', 'financialData', 'defaultKeyStatistics']
    });
    
    // Extract data from different modules (safely)
    const summaryProfile = quoteSummary.summaryProfile || {};
    const summaryDetail = quoteSummary.summaryDetail || {};
    const financialData = quoteSummary.financialData || {};
    const defaultKeyStatistics = quoteSummary.defaultKeyStatistics || {};
    
    // Format the data to match our API structure
    const formattedOverview = {
      Symbol: quote.symbol || '',
      AssetType: quote.quoteType || '',
      Name: quote.shortname || quote.longname || '',
      Description: summaryProfile.longBusinessSummary || '',
      Exchange: quote.exchange || '',
      Currency: quote.currency || 'USD',
      Country: summaryProfile.country || '',
      Sector: summaryProfile.sector || '',
      Industry: summaryProfile.industry || '',
      FiscalYearEnd: defaultKeyStatistics.lastFiscalYearEnd 
        ? new Date(defaultKeyStatistics.lastFiscalYearEnd * 1000).toLocaleDateString('en-US', { month: 'long' }) 
        : 'December',
      LatestQuarter: defaultKeyStatistics.mostRecentQuarter 
        ? new Date(defaultKeyStatistics.mostRecentQuarter * 1000).toISOString().split('T')[0] 
        : '',
      MarketCapitalization: quote.marketCap || 0,
      EBITDA: financialData.ebitda || 0,
      PERatio: quote.trailingPE || summaryDetail.trailingPE || null,
      PEGRatio: defaultKeyStatistics.pegRatio || null,
      BookValue: defaultKeyStatistics.bookValue || null,
      DividendPerShare: defaultKeyStatistics.lastDividendValue || 0,
      DividendYield: summaryDetail.dividendYield ? summaryDetail.dividendYield : 0,
      EPS: defaultKeyStatistics.trailingEps || null,
      RevenuePerShareTTM: defaultKeyStatistics.revenuePerShare || null,
      ProfitMargin: financialData.profitMargins || null,
      OperatingMarginTTM: financialData.operatingMargins || null,
      ReturnOnAssetsTTM: financialData.returnOnAssets || null,
      ReturnOnEquityTTM: financialData.returnOnEquity || null,
      RevenueTTM: financialData.totalRevenue || null,
      GrossProfitTTM: financialData.grossProfits || null,
      DilutedEPSTTM: defaultKeyStatistics.trailingEps || null,
      QuarterlyEarningsGrowthYOY: defaultKeyStatistics.earningsQuarterlyGrowth || null,
      QuarterlyRevenueGrowthYOY: defaultKeyStatistics.revenueQuarterlyGrowth || null,
      AnalystTargetPrice: financialData.targetMeanPrice || null,
      TrailingPE: quote.trailingPE || summaryDetail.trailingPE || null,
      ForwardPE: quote.forwardPE || summaryDetail.forwardPE || null,
      PriceToSalesRatioTTM: summaryDetail.priceToSalesTrailing12Months || null,
      PriceToBookRatio: defaultKeyStatistics.priceToBook || null,
      EVToRevenue: defaultKeyStatistics.enterpriseToRevenue || null,
      EVToEBITDA: defaultKeyStatistics.enterpriseToEbitda || null,
      Beta: defaultKeyStatistics.beta || null,
      // Fix for 52WeekHigh issue - safely extract these values
      "52WeekHigh": quote.fiftyTwoWeekHigh || null,
      "52WeekLow": quote.fiftyTwoWeekLow || null,
      "50DayMovingAverage": defaultKeyStatistics.fiftyDayAverage || null,
      "200DayMovingAverage": defaultKeyStatistics.twoHundredDayAverage || null,
      SharesOutstanding: defaultKeyStatistics.sharesOutstanding || null,
      DividendDate: summaryDetail.exDividendDate 
        ? new Date(summaryDetail.exDividendDate * 1000).toISOString().split('T')[0] 
        : null,
      ExDividendDate: summaryDetail.exDividendDate 
        ? new Date(summaryDetail.exDividendDate * 1000).toISOString().split('T')[0] 
        : null,
      Price: quote.regularMarketPrice || 0,
    };
    
    // Cache results
    cache.set(cacheKey, formattedOverview);
    
    return formattedOverview;
  } catch (error) {
    console.error(`Error fetching overview for ${symbol}:`, error);
    throw new Error(`Failed to fetch overview for ${symbol}`);
  }
};

/**
 * Get historical price data
 * @param {string} symbol - Stock symbol
 * @param {string} period - Time period (1d, 1wk, 1mo)
 * @param {string} range - Date range (1d, 5d, 1mo, 3mo, 6mo, 1y, 5y, max)
 * @returns {Promise<Object>} Historical price data
 */
const getHistoricalData = async (symbol, period = '1d', range = '1y') => {
  const cacheKey = `historical_${symbol}_${period}_${range}`;
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // Use chart() API instead of historical()
    const result = await yahooFinance.chart(symbol, {
      period: period,
      range: range,
      interval: period // Add interval parameter
    });
    
    // Format the data based on chart() response structure
    const formattedData = result.quotes.map(item => ({
      date: new Date(item.timestamp * 1000).toISOString().split('T')[0],
      open: item.open || 0,
      high: item.high || 0,
      low: item.low || 0,
      close: item.close || 0,
      adjClose: item.adjclose || 0,
      volume: item.volume || 0
    }));
    
    // Cache results
    cache.set(cacheKey, formattedData);
    
    return formattedData;
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    
    // Return mock data as fallback
    return generateMockHistoricalData(symbol);
  }
};

// Helper function to generate fallback data
const generateMockHistoricalData = (symbol) => {
  const data = [];
  const today = new Date();
  let basePrice = 100;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const change = (Math.random() - 0.48) * 3;
    basePrice += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: basePrice - Math.random(),
      high: basePrice + Math.random() * 2,
      low: basePrice - Math.random() * 2,
      close: basePrice,
      adjClose: basePrice,
      volume: Math.floor(Math.random() * 10000000) + 2000000
    });
  }
  
  return data;
};

/**
 * Get financial statements
 * This is a bit tricky with Yahoo Finance, as we don't have direct access to full statements
 * We'll combine various data points to approximate an income statement, balance sheet, etc.
 * @param {string} symbol - Stock symbol
 * @param {string} type - Statement type (income, balance, cashflow)
 * @returns {Promise<Object>} Financial statement data
 */
const getFinancials = async (symbol, type = 'income') => {
  const cacheKey = `financials_${symbol}_${type}`;
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // Get financial data
    const modules = [
      'incomeStatementHistory', 
      'balanceSheetHistory', 
      'cashflowStatementHistory',
      'incomeStatementHistoryQuarterly',
      'balanceSheetHistoryQuarterly',
      'cashflowStatementHistoryQuarterly'
    ];
    
    const quoteSummary = await yahooFinance.quoteSummary(symbol, { modules });
    
    let result = {
      symbol: symbol,
      annualReports: [],
      quarterlyReports: []
    };
    
    // Process based on the type of statement requested
    switch (type) {
      case 'income':
        if (quoteSummary.incomeStatementHistory?.incomeStatementHistory) {
          result.annualReports = processIncomeStatements(quoteSummary.incomeStatementHistory.incomeStatementHistory);
        }
        if (quoteSummary.incomeStatementHistoryQuarterly?.incomeStatementHistory) {
          result.quarterlyReports = processIncomeStatements(quoteSummary.incomeStatementHistoryQuarterly.incomeStatementHistory);
        }
        break;
        
      case 'balance':
        if (quoteSummary.balanceSheetHistory?.balanceSheetStatements) {
          result.annualReports = processBalanceSheets(quoteSummary.balanceSheetHistory.balanceSheetStatements);
        }
        if (quoteSummary.balanceSheetHistoryQuarterly?.balanceSheetStatements) {
          result.quarterlyReports = processBalanceSheets(quoteSummary.balanceSheetHistoryQuarterly.balanceSheetStatements);
        }
        break;
        
      case 'cashflow':
        if (quoteSummary.cashflowStatementHistory?.cashflowStatements) {
          result.annualReports = processCashFlows(quoteSummary.cashflowStatementHistory.cashflowStatements);
        }
        if (quoteSummary.cashflowStatementHistoryQuarterly?.cashflowStatements) {
          result.quarterlyReports = processCashFlows(quoteSummary.cashflowStatementHistoryQuarterly.cashflowStatements);
        }
        break;
        
      default:
        throw new Error(`Invalid statement type: ${type}`);
    }
    
    // Cache results
    cache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error(`Error fetching ${type} statement for ${symbol}:`, error);
    throw new Error(`Failed to fetch ${type} statement for ${symbol}`);
  }
};

/**
 * Process income statements from Yahoo Finance data
 * @param {Array} statements - Raw income statements from Yahoo Finance
 * @returns {Array} Processed income statements
 */
function processIncomeStatements(statements) {
  return statements.map(statement => {
    const date = new Date(statement.endDate * 1000);
    
    const netIncome = statement.netIncome || 0;
    const incomeTaxExpense = statement.incomeTaxExpense || 0;
    const interestExpense = statement.interestExpense || 0;
    
    return {
      fiscalDateEnding: date.toISOString().split('T')[0],
      reportedCurrency: 'USD', // Yahoo Finance normalizes to USD
      grossProfit: (statement.grossProfit || 0).toString(),
      totalRevenue: (statement.totalRevenue || 0).toString(),
      costOfRevenue: (statement.costOfRevenue || 0).toString(),
      costofGoodsAndServicesSold: (statement.costOfRevenue || 0).toString(),
      operatingIncome: (statement.operatingIncome || 0).toString(),
      sellingGeneralAndAdministrative: (statement.sellingGeneralAndAdministrative || 0).toString(),
      researchAndDevelopment: (statement.researchDevelopment || 0).toString(),
      operatingExpenses: (statement.totalOperatingExpenses || 0).toString(),
      investmentIncomeNet: '0', // Not directly available
      netInterestIncome: (statement.interestExpense || 0).toString(),
      interestIncome: '0', // Not directly available
      interestExpense: (statement.interestExpense || 0).toString(),
      nonInterestIncome: '0', // Not directly available
      otherNonOperatingIncome: (statement.otherOperatingExpenses || 0).toString(),
      depreciation: '0', // Usually in cash flow statement
      depreciationAndAmortization: '0', // Usually in cash flow statement
      incomeBeforeTax: (statement.incomeBeforeTax || 0).toString(),
      incomeTaxExpense: (statement.incomeTaxExpense || 0).toString(),
      interestAndDebtExpense: (statement.interestExpense || 0).toString(),
      netIncomeFromContinuingOperations: (statement.netIncomeFromContinuingOps || 0).toString(),
      comprehensiveIncomeNetOfTax: (statement.netIncome || 0).toString(),
      ebit: (netIncome + incomeTaxExpense + interestExpense).toString(),
      ebitda: (netIncome + incomeTaxExpense + interestExpense).toString(), // Without depreciation
      netIncome: (statement.netIncome || 0).toString()
    };
  });
}

/**
 * Process balance sheets from Yahoo Finance data
 * @param {Array} statements - Raw balance sheets from Yahoo Finance
 * @returns {Array} Processed balance sheets
 */
function processBalanceSheets(statements) {
  return statements.map(statement => {
    const date = new Date(statement.endDate * 1000);
    
    const totalAssets = statement.totalAssets || 0;
    const totalCurrentAssets = statement.totalCurrentAssets || 0;
    const totalLiab = statement.totalLiab || 0;
    const totalCurrentLiabilities = statement.totalCurrentLiabilities || 0;
    
    return {
      fiscalDateEnding: date.toISOString().split('T')[0],
      reportedCurrency: 'USD', // Yahoo Finance normalizes to USD
      totalAssets: totalAssets.toString(),
      totalCurrentAssets: totalCurrentAssets.toString(),
      cashAndCashEquivalentsAtCarryingValue: (statement.cash || 0).toString(),
      cashAndShortTermInvestments: (statement.cash || 0).toString(),
      inventory: (statement.inventory || 0).toString(),
      currentNetReceivables: (statement.netReceivables || 0).toString(),
      totalNonCurrentAssets: (totalAssets - totalCurrentAssets).toString(),
      propertyPlantEquipment: (statement.propertyPlantEquipment || 0).toString(),
      accumulatedDepreciationAmortizationPPE: '0', // Not directly available
      intangibleAssets: (statement.intangibleAssets || 0).toString(),
      intangibleAssetsExcludingGoodwill: (statement.intangibleAssets || 0).toString(),
      goodwill: (statement.goodWill || 0).toString(),
      investments: (statement.longTermInvestments || 0).toString(),
      longTermInvestments: (statement.longTermInvestments || 0).toString(),
      shortTermInvestments: (statement.shortTermInvestments || 0).toString(),
      otherCurrentAssets: (statement.otherCurrentAssets || 0).toString(),
      otherNonCurrentAssets: (statement.otherAssets || 0).toString(),
      totalLiabilities: totalLiab.toString(),
      totalCurrentLiabilities: totalCurrentLiabilities.toString(),
      currentAccountsPayable: (statement.accountsPayable || 0).toString(),
      deferredRevenue: '0', // Not directly available
      currentDebt: (statement.shortLongTermDebt || 0).toString(),
      shortTermDebt: (statement.shortLongTermDebt || 0).toString(),
      totalNonCurrentLiabilities: (totalLiab - totalCurrentLiabilities).toString(),
      capitalLeaseObligations: '0', // Not directly available
      longTermDebt: (statement.longTermDebt || 0).toString(),
      currentLongTermDebt: (statement.currentLongTermDebt || 0).toString(),
      longTermDebtNoncurrent: (statement.longTermDebt || 0).toString(),
      shortLongTermDebtTotal: (statement.shortLongTermDebt || 0).toString(),
      otherCurrentLiabilities: (statement.otherCurrentLiab || 0).toString(),
      otherNonCurrentLiabilities: (statement.otherLiab || 0).toString(),
      totalShareholderEquity: (statement.totalStockholderEquity || 0).toString(),
      treasuryStock: (statement.treasuryStock || 0).toString(),
      retainedEarnings: (statement.retainedEarnings || 0).toString(),
      commonStock: (statement.commonStock || 0).toString(),
      commonStockSharesOutstanding: (statement.commonStock || 0).toString() // This is not accurate but needed for format
    };
  });
}

/**
 * Process cash flow statements from Yahoo Finance data
 * @param {Array} statements - Raw cash flow statements from Yahoo Finance
 * @returns {Array} Processed cash flow statements
 */
function processCashFlows(statements) {
  return statements.map(statement => {
    const date = new Date(statement.endDate * 1000);
    
    return {
      fiscalDateEnding: date.toISOString().split('T')[0],
      reportedCurrency: 'USD', // Yahoo Finance normalizes to USD
      operatingCashflow: (statement.totalCashFromOperatingActivities || 0).toString(),
      paymentsForOperatingActivities: '0', // Not directly available
      proceedsFromOperatingActivities: '0', // Not directly available
      changeInOperatingLiabilities: (statement.changeToLiabilities || 0).toString(),
      changeInOperatingAssets: (statement.changeToOperatingActivities || 0).toString(),
      depreciationDepletionAndAmortization: (statement.depreciation || 0).toString(),
      capitalExpenditures: (statement.capitalExpenditures || 0).toString(),
      changeInReceivables: (statement.changeToAccountReceivables || 0).toString(),
      changeInInventory: (statement.changeToInventory || 0).toString(),
      profitLoss: (statement.netIncome || 0).toString(),
      cashflowFromInvestment: (statement.totalCashflowsFromInvestingActivities || 0).toString(),
      cashflowFromFinancing: (statement.totalCashFromFinancingActivities || 0).toString(),
      proceedsFromRepaymentsOfShortTermDebt: '0', // Not directly available
      paymentsForRepurchaseOfCommonStock: (statement.repurchaseOfStock || 0).toString(),
      paymentsForRepurchaseOfEquity: (statement.repurchaseOfStock || 0).toString(),
      paymentsForRepurchaseOfPreferredStock: '0', // Not directly available
      dividendPayout: (statement.dividendsPaid || 0).toString(),
      dividendPayoutCommonStock: (statement.dividendsPaid || 0).toString(),
      dividendPayoutPreferredStock: '0', // Not directly available
      proceedsFromIssuanceOfCommonStock: (statement.issuanceOfStock || 0).toString(),
      proceedsFromIssuanceOfLongTermDebtAndCapitalSecuritiesNet: (statement.netBorrowings || 0).toString(),
      proceedsFromIssuanceOfPreferredStock: '0', // Not directly available
      proceedsFromRepurchaseOfEquity: (statement.repurchaseOfStock || 0).toString(),
      proceedsFromSaleOfTreasuryStock: '0', // Not directly available
      changeInCashAndCashEquivalents: (statement.changeInCash || 0).toString(),
      changeInExchangeRate: '0', // Not directly available
      netIncome: (statement.netIncome || 0).toString()
    };
  });
}


const getBalanceSheetData = async (symbol) => {
  try {
    const balanceData = await getFinancials(symbol, 'balance');
    if (balanceData && balanceData.annualReports && balanceData.annualReports.length > 0) {
      // Use the most recent annual report
      const latestReport = balanceData.annualReports[0];
      
      // Extract total liabilities and shareholder equity
      const totalLiabilities = parseFloat(latestReport.totalLiabilities) || 0;
      const totalEquity = parseFloat(latestReport.totalShareholderEquity) || 0;
      
      // Calculate debt to equity ratio
      return {
        totalLiabilities,
        totalEquity,
        debtToEquity: totalEquity !== 0 ? totalLiabilities / totalEquity : null
      };
    }
    return { totalLiabilities: 0, totalEquity: 0, debtToEquity: null };
  } catch (error) {
    console.error(`Error fetching balance sheet data for ${symbol}:`, error);
    return { totalLiabilities: 0, totalEquity: 0, debtToEquity: null };
  }
};


/**
 * Calculate value investing metrics and provide analysis
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Value analysis
 */
const getValueAnalysis = async (symbol) => {
  try {
    // Get necessary data for analysis
    const overview = await getCompanyOverview(symbol);
    const balanceSheetData = await getBalanceSheetData(symbol);
    
    // Extract key metrics
    const currentPrice = parseFloat(overview.Price) || 0;
    const eps = parseFloat(overview.EPS) || 0;
    const bookValue = parseFloat(overview.BookValue) || 0;
    const pe = parseFloat(overview.PERatio) || 0;
    const pb = parseFloat(overview.PriceToBookRatio) || 0;
    const roe = parseFloat(overview.ReturnOnEquityTTM) || 0;
    
    // Use the properly calculated debt to equity ratio
    const debtToEquity = balanceSheetData.debtToEquity;

    // Calculate value metrics
    let valueScore = 5; // Default middle value
    let intrinsicValue = null;
    
    // Calculate intrinsic value (simple Graham formula)
    if (eps > 0) {
      const growthRate = Math.min(roe || 0.10, 0.15); // Cap growth at 15%
      intrinsicValue = parseFloat((eps * (8.5 + 2 * growthRate * 100)).toFixed(2));
    }
    
    // Calculate value score if we have the necessary metrics
    if (pe && pb && roe) {
      // PE score (lower is better)
      let peScore = 0;
      if (pe <= 0) {
        peScore = 0;
      } else if (pe < 10) {
        peScore = 4;
      } else if (pe < 15) {
        peScore = 3;
      } else if (pe < 20) {
        peScore = 2;
      } else if (pe < 25) {
        peScore = 1;
      }
      
      // PB score (lower is better)
      let pbScore = 0;
      if (pb <= 0) {
        pbScore = 0;
      } else if (pb < 1) {
        pbScore = 4;
      } else if (pb < 2) {
        pbScore = 3;
      } else if (pb < 3) {
        pbScore = 2;
      } else if (pb < 4) {
        pbScore = 1;
      }
      
      // ROE score (higher is better)
      let roeScore = 0;
      if (roe <= 0) {
        roeScore = 0;
      } else if (roe > 0.20) {
        roeScore = 2;
      } else if (roe > 0.15) {
        roeScore = 1.5;
      } else if (roe > 0.10) {
        roeScore = 1;
      } else {
        roeScore = 0.5;
      }
      
      // Total score (max 10)
      const totalScore = peScore + pbScore + roeScore;
      valueScore = Math.min(Math.max(Math.round(totalScore * 10 / 10), 1), 10);
    }
    
    // Generate analysis text
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
    if (roe > 0.15) {
      analysis += "Strong return on equity indicates effective management.";
    } else if (roe > 0.10) {
      analysis += "Decent return on equity.";
    } else if (roe > 0) {
      analysis += "Below-average return on equity.";
    } else {
      analysis += "Negative return on equity is concerning.";
    }
    
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
        roe,
        debtToEquity
      },
      analysis
    };
  } catch (error) {
    console.error(`Error performing value analysis for ${symbol}:`, error);
    throw new Error(`Failed to perform value analysis for ${symbol}`);
  }
};

module.exports = {
  searchCompany,
  getQuote,
  getCompanyOverview,
  getHistoricalData,
  getFinancials,
  getValueAnalysis
};