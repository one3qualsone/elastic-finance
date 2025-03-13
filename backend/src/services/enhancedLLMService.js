// backend/src/services/enhancedLLMService.js
const axios = require('axios');

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Generate comprehensive stock analysis using LLM
 * @param {Object} stockData - Combined stock data
 * @returns {Promise<Object>} Detailed stock analysis
 */
const generateStockAnalysis = async (stockData) => {
  try {
    const { symbol, overview, financials, valueAnalysis } = stockData;
    
    // Format the raw API data into a structured JSON string
    const rawDataString = JSON.stringify({
      overview: overview,
      income: financials.income?.annualReports?.slice(0, 3) || [], // Last 3 years of income statements
      balance: financials.balance?.annualReports?.slice(0, 3) || [], // Last 3 years of balance sheets
      cashflow: financials.cashflow?.annualReports?.slice(0, 3) || [], // Last 3 years of cash flow statements
      valueAnalysis: valueAnalysis
    }, null, 2);
    
    // Create a simplified metrics summary for easier reference
    const metrics = {
      price: valueAnalysis?.currentPrice ? valueAnalysis.currentPrice.toFixed(2) : 'N/A', // Fix: Ensure price has 2 decimal places
      marketCap: formatCurrency(overview?.MarketCapitalization || 0),
      sector: overview?.Sector || 'N/A',
      industry: overview?.Industry || 'N/A'
    };
    
    // Create the LLM prompt with both the summary and raw data
    const prompt = `
    Analyze ${symbol} (${overview?.Name || symbol}) as a value investor using Warren Buffett's principles.
    
    BUFFETT'S PRINCIPLES:
    1. Stable, understandable business
    2. Long-term prospects
    3. Vigilant leadership
    4. Undervalued (margin of safety)
    
    ANALYZE THESE AREAS:
    1. BUSINESS OVERVIEW - What they do, moat, stability
    2. FINANCIAL STRENGTH - Debt position, capital allocation
    3. MANAGEMENT QUALITY - Leadership track record, shareholder-friendly practices
    4. PROFITABILITY - Revenue trends, margins, ROE (Buffett wants >15%)
    5. VALUATION - P/E (<15), P/B (<1.5), Combined Ratio (P/E×P/B <22.5), intrinsic value
    6. COMPETITIVE ANALYSIS - Industry position, threats, opportunities
    7. INVESTMENT CONCLUSION - Buy/Sell/Hold recommendation, fair value, upside/downside %
    
    REQUIRED SCORES:
    - Risk score (1-10, 1=minimal risk, 10=extreme risk)
    - Bullish/bearish score (1-10, 1=extremely bearish, 10=extremely bullish)
    
    BASIC INFO:
    - Symbol: ${symbol}
    - Current Price: $${metrics.price} (IMPORTANT: This price includes decimal points - for example, $165.10 means one hundred sixty-five dollars and ten cents, NOT one thousand six hundred fifty-one dollars)
    - Market Cap: ${metrics.marketCap}
    - Sector: ${metrics.sector}
    - Industry: ${metrics.industry}
    
    Provide specific numbers from financial data to support your analysis. Calculate the combined ratio (P/E×P/B) and state if it meets Buffett's criteria of <22.5.
    
    ALWAYS maintain decimal point accuracy in your calculations. For example, if a stock price is $165.10, the P/E ratio should be calculated using exactly $165.10, not $1651.
    `;
    
    // Make request to OpenAI API with the comprehensive data
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo-16k", // Use the 16k context version to handle all the raw data
        messages: [
          { role: "system", content: "You are an expert financial analyst specializing in value investing. You analyze financial data thoroughly and provide clear, data-driven insights. Always maintain numerical precision, especially with decimal points in financial figures." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 4000  // Increased for more detailed analysis
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    // Extract the LLM response
    const analysisText = response.data.choices[0].message.content;
    
    // Parse sections from the analysis
    const sections = extractSectionsFromAnalysis(analysisText);
    
    // Create a structured response with ALL the new fields
    const bullishScore = extractBullishScore(analysisText);
    const riskScore = extractRiskScore(analysisText);
    const fairValueEstimate = extractFairValue(analysisText, metrics.price);
    const recommendation = extractRecommendation(analysisText);
    const comprehensiveScore = calculateComprehensiveScore(stockData, bullishScore, riskScore, analysisText);

    return {
      summary: sections.find(s => s.title.includes("BUSINESS OVERVIEW"))?.content || 
              sections[0]?.content || 
              "Analysis summary not available.",
      sections: sections,
      fullAnalysis: analysisText,
      metrics: {
        bullishScore,
        riskScore,
        fairValueEstimate
      },
      overallRating: {
        score: comprehensiveScore,
        label: getBullishLabel(comprehensiveScore),
        recommendation: extractRecommendation(analysisText)
      },
      chartData: createChartData(stockData)
    };
  } catch (error) {
    console.error('Error generating stock analysis:', error);
    return {
      summary: `Unable to generate in-depth analysis for ${stockData?.symbol} at this time. Error: ${error.message}`,
      sections: [],
      fullAnalysis: "The analysis service is currently unavailable. Please try again later."
    };
  }
};

// Helper function to format currency values
function formatCurrency(value) {
  if (!value) return 'N/A';
  
  const num = parseFloat(value);
  if (isNaN(num)) return 'N/A';
  
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)}B`;
  } else if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  } else {
    return `$${num.toLocaleString()}`;
  }
}

// Extract fair value estimate - updated to handle decimal points correctly
function extractFairValue(text, currentPrice) {
  // Try different patterns to find the fair value
  const patterns = [
    /fair value[:\s]*\$([0-9]+\.[0-9]+)/i, // Requiring decimal point
    /intrinsic value[:\s]*\$([0-9]+\.[0-9]+)/i,
    /target price[:\s]*\$([0-9]+\.[0-9]+)/i,
    /price target[:\s]*\$([0-9]+\.[0-9]+)/i,
    /value of \$([0-9]+\.[0-9]+)/i,
    /estimate of \$([0-9]+\.[0-9]+)/i,
    /worth \$([0-9]+\.[0-9]+)/i,
    /valuation of \$([0-9]+\.[0-9]+)/i,
    /fair value.*?\$([0-9]+\.[0-9]+)/i,
    /\$([0-9]+\.[0-9]+) per share/i,
    /valued at \$([0-9]+\.[0-9]+)/i,
    // Fallback patterns for whole numbers
    /fair value[:\s]*\$([0-9]+)/i,
    /intrinsic value[:\s]*\$([0-9]+)/i,
    /target price[:\s]*\$([0-9]+)/i
  ];
  
  // Parse current price to ensure it's a number
  const currentPriceNum = parseFloat(currentPrice);
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      // More strict validation to catch unreasonable values
      if (value > 0 && value < currentPriceNum * 3 && value > currentPriceNum * 0.3) {
        return value;
      }
    }
  }
  
  return null;
}

/* Rest of your existing functions... */

function extractSectionsFromAnalysis(text) {
  // Define section titles and possible variations
  const sectionMappings = {
    'BUSINESS OVERVIEW': ['BUSINESS OVERVIEW', 'COMPANY OVERVIEW', 'OVERVIEW', 'BUSINESS DESCRIPTION'],
    'FINANCIAL STRENGTH ANALYSIS': ['FINANCIAL STRENGTH', 'FINANCIAL STRENGTH ANALYSIS', 'FINANCIAL HEALTH', 'BALANCE SHEET ANALYSIS'],
    'MANAGEMENT QUALITY': ['MANAGEMENT QUALITY', 'MANAGEMENT ASSESSMENT', 'LEADERSHIP', 'MANAGEMENT TEAM'],
    'PROFITABILITY & EARNINGS ANALYSIS': ['PROFITABILITY', 'EARNINGS ANALYSIS', 'PROFITABILITY ANALYSIS', 'EARNINGS & PROFITABILITY'],
    'VALUATION ASSESSMENT': ['VALUATION', 'VALUATION ASSESSMENT', 'INTRINSIC VALUE', 'STOCK VALUATION'],
    'COMPETITIVE ANALYSIS': ['COMPETITIVE ANALYSIS', 'COMPETITION', 'INDUSTRY ANALYSIS', 'COMPETITIVE POSITION'],
    'INVESTMENT CONCLUSION': ['INVESTMENT CONCLUSION', 'CONCLUSION', 'RECOMMENDATION', 'INVESTMENT RECOMMENDATION']
  };
  
  // Flatten section titles for detection
  const allSectionPatterns = Object.values(sectionMappings).flat();
  
  const sections = [];
  let currentTitle = null;
  let currentContent = [];
  
  // Split by lines and process each line
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip empty lines
    if (!line.trim()) continue;
    
    // Check if this line is a section title
    const isSectionHeader = allSectionPatterns.some(pattern => 
      line.toUpperCase().includes(pattern) || 
      line.match(new RegExp(`^\\d+\\.\\s*${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'))
    );
    
    if (isSectionHeader) {
      // Save the previous section if we have one
      if (currentTitle && currentContent.length > 0) {
        sections.push({
          title: currentTitle,
          content: currentContent.join('\n').trim()
        });
      }
      
      // Start a new section
      currentTitle = line.trim();
      currentContent = [];
    } else if (currentTitle) {
      // Add to current section
      currentContent.push(line);
    } else if (line.trim() && sections.length === 0) {
      // This is likely the summary if no sections have been found yet
      sections.push({
        title: "Summary",
        content: line.trim()
      });
    }
  }
  
  // Add the last section
  if (currentTitle && currentContent.length > 0) {
    sections.push({
      title: currentTitle,
      content: currentContent.join('\n').trim()
    });
  }
  
  // Map sections to standardized titles
  const standardizedSections = sections.map(section => {
    const title = section.title.toUpperCase();
    
    // Find which standard section this belongs to
    for (const [standardTitle, patterns] of Object.entries(sectionMappings)) {
      if (patterns.some(pattern => title.includes(pattern) || 
          title.match(new RegExp(`^\\d+\\.\\s*${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i')))) {
        return {
          title: standardTitle,
          content: section.content
        };
      }
    }
    
    // Return original if no match
    return section;
  });
  
  // Ensure all required sections exist, using a smarter approach to find similar content
  const requiredTitles = Object.keys(sectionMappings);
  for (const requiredTitle of requiredTitles) {
    if (!standardizedSections.some(section => section.title === requiredTitle)) {
      // Try to find content that might belong to this section
      const potentialContent = findPotentialSectionContent(text, requiredTitle);
      
      standardizedSections.push({
        title: requiredTitle,
        content: potentialContent || "Information not available for this section."
      });
    }
  }
  
  return standardizedSections;
}

function findPotentialSectionContent(text, sectionType) {
  // Keywords that might indicate content for each section type
  const sectionKeywords = {
    'BUSINESS OVERVIEW': ['business model', 'company operates', 'what they do', 'operations', 'products', 'services'],
    'FINANCIAL STRENGTH ANALYSIS': ['debt-to-equity', 'balance sheet', 'debt', 'liquidity', 'solvency', 'cash position'],
    'MANAGEMENT QUALITY': ['management team', 'CEO', 'leadership', 'executives', 'board', 'management decisions'],
    'PROFITABILITY & EARNINGS ANALYSIS': ['revenue', 'profit margin', 'earnings growth', 'EPS', 'income', 'profitability'],
    'VALUATION ASSESSMENT': ['intrinsic value', 'P/E ratio', 'P/B ratio', 'undervalued', 'overvalued', 'fair value'],
    'COMPETITIVE ANALYSIS': ['competitors', 'market share', 'industry position', 'competitive advantage', 'moat'],
    'INVESTMENT CONCLUSION': ['recommendation', 'buy', 'sell', 'hold', 'investment thesis', 'conclusion']
  };
  
  const keywords = sectionKeywords[sectionType] || [];
  
  // Try to find paragraphs containing these keywords
  for (const keyword of keywords) {
    const pattern = new RegExp(`[^.!?]*\\b${keyword}\\b[^.!?]*[.!?]`, 'gi');
    const matches = text.match(pattern);
    
    if (matches && matches.length > 0) {
      return matches.slice(0, 3).join(' ');
    }
  }
  
  return null;
}

function extractBullishScore(text) {
  // Try different patterns to find the score
  const patterns = [
    /bullish\/bearish score[:\s]*([0-9]|10)\/10/i,
    /bullish score[:\s]*([0-9]|10)\/10/i,
    /bullish rating[:\s]*([0-9]|10)\/10/i,
    /investment score[:\s]*([0-9]|10)\/10/i,
    /score of ([0-9]|10) out of 10/i,
    /([0-9]|10)\/10 on the bullish/i,
    /I would rate this stock a ([0-9]|10)\/10/i,
    /score.*?([0-9]|10)\/10/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }
  
  return null;
}

function extractRiskScore(text) {
  // Try different patterns to find the risk score
  const patterns = [
    /risk score[:\s]*([0-9]|10)\/10/i,
    /risk assessment[:\s]*([0-9]|10)\/10/i,
    /risk rating[:\s]*([0-9]|10)\/10/i,
    /risk level[:\s]*([0-9]|10)\/10/i,
    /risk.*?([0-9]|10)\/10/i,
    /([0-9]|10)\/10 on the risk/i,
    /I would rate the risk as ([0-9]|10)\/10/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }
  
  // Look for a section with "RISK ASSESSMENT" and try to find a score there
  const riskSection = text.match(/RISK ASSESSMENT.*?(\d+)\.?\s/i);
  if (riskSection && riskSection[1]) {
    const score = parseInt(riskSection[1]);
    if (score >= 1 && score <= 10) {
      return score;
    }
  }
  
  // Look for a section with "INVESTMENT CONCLUSION" and try to find a score there
  const conclusionSection = text.match(/INVESTMENT CONCLUSION.*?(\d+)\.?\s/i);
  if (conclusionSection && conclusionSection[1]) {
    const score = parseInt(conclusionSection[1]);
    if (score >= 1 && score <= 10) {
      return score;
    }
  }
  
  return null;
}

function getBullishLabel(score) {
  if (!score) return "Neutral";
  if (score >= 8) return "Strongly Bullish";
  if (score >= 6) return "Moderately Bullish";
  if (score === 5) return "Neutral";
  if (score >= 3) return "Moderately Bearish";
  return "Strongly Bearish";
}

function extractRecommendation(text) {
  // Check first if the LLM expresses uncertainty about making a recommendation
  const uncertaintyPatterns = [
    /difficult to provide.*recommendation/i,
    /cannot make.*definitive recommendation/i,
    /insufficient.*to make.*recommendation/i,
    /without.*metrics.*difficult to/i,
    /would need more.*to provide/i,
    /cannot determine.*recommendation/i
  ];
  
  for (const pattern of uncertaintyPatterns) {
    if (pattern.test(text)) {
      // If uncertainty is expressed, return "Neutral" instead of guessing
      return "Neutral";
    }
  }
  
  // If no uncertainty expressed, proceed with normal recommendation extraction
  const buyPattern = /\b(buy|strong buy|accumulate)\b/i;
  const sellPattern = /\b(sell|strong sell|reduce)\b/i;
  const holdPattern = /\b(hold|neutral|maintain)\b/i;
  
  // Look in the conclusion section for recommendations
  const conclusionSection = text.match(/INVESTMENT CONCLUSION.*?\n\n/is);
  if (conclusionSection) {
    const conclusionText = conclusionSection[0];
    
    if (buyPattern.test(conclusionText)) return "Buy";
    if (sellPattern.test(conclusionText)) return "Sell";
    if (holdPattern.test(conclusionText)) return "Hold";
  }
  
  // Look in the entire text if not found in conclusion
  if (buyPattern.test(text)) return "Buy";
  if (sellPattern.test(text)) return "Sell";
  if (holdPattern.test(text)) return "Hold";
  
  // Default based on bullish score if no explicit recommendation
  const bullishScore = extractBullishScore(text);
  if (bullishScore >= 7) return "Buy";
  if (bullishScore <= 3) return "Sell";
  return "Hold";
}

function calculateComprehensiveScore(stockData, bullishScore, riskScore, analysisText) {
  // Check for uncertainty in the analysis text
  const uncertaintyPatterns = [
    /difficult to provide.*recommendation/i,
    /cannot make.*definitive recommendation/i,
    /insufficient.*to make.*recommendation/i,
    /without.*metrics.*difficult to/i,
    /would need more.*to provide/i,
    /cannot determine.*recommendation/i,
    /difficult to assess/i
  ];
  
  // If uncertainty is expressed and no bullish score provided, default to neutral (5)
  for (const pattern of uncertaintyPatterns) {
    if (pattern.test(analysisText) && !bullishScore) {
      return 5; // Neutral score when uncertain
    }
  }
  
  // Default to the bullish score if provided and no uncertainty
  if (bullishScore) {
    return bullishScore;
  }
  
  // If no bullish score, calculate based on metrics
  if (!stockData || !stockData.valueAnalysis || !stockData.valueAnalysis.metrics) {
    return 5; // Default to neutral if no data
  }
  
  const metrics = stockData.valueAnalysis.metrics;
  let score = 5; // Start neutral
  
  // PE ratio (lower is better)
  if (metrics.pe) {
    if (metrics.pe < 10) score += 1;
    else if (metrics.pe < 15) score += 0.5;
    else if (metrics.pe > 25) score -= 1;
  }
  
  // P/B ratio (lower is better)
  if (metrics.pb) {
    if (metrics.pb < 1) score += 1;
    else if (metrics.pb < 1.5) score += 0.5;
    else if (metrics.pb > 3) score -= 1;
  }
  
  // ROE (higher is better)
  if (metrics.roe) {
    if (metrics.roe > 0.2) score += 1;
    else if (metrics.roe > 0.15) score += 0.5;
    else if (metrics.roe < 0.05) score -= 0.5;
  }
  
  // Debt to Equity (lower is better)
  if (metrics.debtToEquity) {
    if (metrics.debtToEquity < 0.3) score += 1;
    else if (metrics.debtToEquity < 0.5) score += 0.5;
    else if (metrics.debtToEquity > 1.5) score -= 1;
  }
  
  // Undervalued or overvalued based on intrinsic value
  if (stockData.valueAnalysis.currentPrice && stockData.valueAnalysis.intrinsicValue) {
    const ratio = stockData.valueAnalysis.currentPrice / stockData.valueAnalysis.intrinsicValue;
    if (ratio < 0.8) score += 1.5; // Significantly undervalued
    else if (ratio < 0.9) score += 1; // Moderately undervalued
    else if (ratio > 1.2) score -= 1.5; // Significantly overvalued
    else if (ratio > 1.1) score -= 1; // Moderately overvalued
  }
  
  // Risk score adjustment (invert risk - higher risk = lower score)
  if (riskScore) {
    score -= (riskScore - 5) * 0.2; // Adjust score down for high risk
  }
  
  // Ensure score stays within bounds
  return Math.min(Math.max(Math.round(score * 10) / 10, 1), 10);
}

function createChartData(stockData) {
  const charts = [];
  
  // 1. Value Metrics Chart (for radar or bar chart)
  if (stockData.valueAnalysis && stockData.valueAnalysis.metrics) {
    const metrics = stockData.valueAnalysis.metrics;
    
    // Calculate combined P/E * P/B (Graham-Buffett ratio)
    const combinedRatio = metrics.pe && metrics.pb ? 
      (metrics.pe * metrics.pb).toFixed(1) : null;
    
    charts.push({
      type: 'ValueMetrics',
      title: 'Value Investing Metrics',
      description: 'Key metrics compared to Buffett\'s criteria',
      data: [
        { 
          name: 'P/E Ratio', 
          value: metrics.pe || 0, 
          benchmark: 15, 
          status: metrics.pe < 15 ? 'good' : metrics.pe < 25 ? 'neutral' : 'poor'
        },
        { 
          name: 'P/B Ratio', 
          value: metrics.pb || 0, 
          benchmark: 1.5, 
          status: metrics.pb < 1.5 ? 'good' : metrics.pb < 3 ? 'neutral' : 'poor'
        },
        { 
          name: 'ROE (%)', 
          value: metrics.roe ? (metrics.roe * 100).toFixed(1) : 0, 
          benchmark: 15, 
          status: metrics.roe > 0.15 ? 'good' : metrics.roe > 0.10 ? 'neutral' : 'poor'
        },
        { 
          name: 'Debt/Equity', 
          value: metrics.debtToEquity || 0, 
          benchmark: 0.5, 
          status: metrics.debtToEquity < 0.5 ? 'good' : metrics.debtToEquity < 1 ? 'neutral' : 'poor'
        },
        { 
          name: 'P/E × P/B', 
          value: combinedRatio || 0, 
          benchmark: 22.5, 
          status: combinedRatio < 22.5 ? 'good' : combinedRatio < 30 ? 'neutral' : 'poor'
        }
      ]
    });
  }
  
  // 2. Financial Performance Chart (for line or bar chart)
  if (stockData.financials && stockData.financials.income && 
      stockData.financials.income.annualReports && 
      stockData.financials.income.annualReports.length > 0) {
    
    // Get up to 5 years of income reports, in chronological order
    const incomeReports = stockData.financials.income.annualReports
      .slice(0, 5)
      .sort((a, b) => new Date(a.fiscalDateEnding) - new Date(b.fiscalDateEnding));
    
    const labels = incomeReports.map(report => {
      const date = new Date(report.fiscalDateEnding);
      return date.getFullYear().toString();
    });
    
    // Convert to millions and handle parsing errors
    const revenueData = incomeReports.map(report => {
      const val = parseFloat(report.totalRevenue || 0);
      return isNaN(val) ? 0 : (val / 1000000).toFixed(1);
    });
    
    const netIncomeData = incomeReports.map(report => {
      const val = parseFloat(report.netIncome || 0);
      return isNaN(val) ? 0 : (val / 1000000).toFixed(1);
    });
    
    charts.push({
      type: 'FinancialPerformance',
      title: 'Financial Performance (Millions $)',
      labels: labels,
      datasets: [
        { name: 'Revenue', data: revenueData, color: '#4299e1' },
        { name: 'Net Income', data: netIncomeData, color: '#48bb78' }
      ]
    });
  }
  
  // 3. Intrinsic Value vs Current Price (for gauge or comparison chart)
  if (stockData.valueAnalysis) {
    const currentPrice = stockData.valueAnalysis.currentPrice || 0;
    const intrinsicValue = stockData.valueAnalysis.intrinsicValue || 0;
    
    if (currentPrice && intrinsicValue) {
      const margin = ((intrinsicValue - currentPrice) / currentPrice * 100).toFixed(1);
      const status = margin > 20 ? 'undervalued' : 
                    margin < -20 ? 'overvalued' : 'fair-value';
      
      charts.push({
        type: 'ValueComparison',
        title: 'Price vs Intrinsic Value',
        data: {
          currentPrice,
          intrinsicValue,
          marginOfSafety: margin,
          status
        }
      });
    }
  }
  
  return charts;
}

// Make sure to export the function!
module.exports = {
  generateStockAnalysis
};