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
    
    // Format key metrics for the prompt
    const metrics = {
      price: valueAnalysis?.currentPrice || 'N/A',
      marketCap: overview?.MarketCapitalization ? 
        formatCurrency(overview.MarketCapitalization) : 'N/A',
      revenue: getFinancialMetric(financials, 'income', 'totalRevenue'),
      netIncome: getFinancialMetric(financials, 'income', 'netIncome'),
      operatingCashFlow: getFinancialMetric(financials, 'cashflow', 'operatingCashflow'),
      totalAssets: getFinancialMetric(financials, 'balance', 'totalAssets'),
      totalLiabilities: getFinancialMetric(financials, 'balance', 'totalLiabilities'),
      totalEquity: getFinancialMetric(financials, 'balance', 'totalShareholderEquity'),
      pe: valueAnalysis?.metrics?.pe?.toFixed(2) || 'N/A',
      pb: valueAnalysis?.metrics?.pb?.toFixed(2) || 'N/A',
      roe: valueAnalysis?.metrics?.roe ? 
        `${(valueAnalysis.metrics.roe * 100).toFixed(2)}%` : 'N/A',
      debtToEquity: valueAnalysis?.metrics?.debtToEquity?.toFixed(2) || 'N/A',
      eps: overview?.EPS || 'N/A',
      dividendYield: overview?.DividendYield ? 
        `${(overview.DividendYield * 100).toFixed(2)}%` : 'N/A',
      sector: overview?.Sector || 'N/A',
      industry: overview?.Industry || 'N/A'
    };
    
    // Create the LLM prompt using the example format
    const prompt = `
Please provide an in-depth value investing analysis of ${symbol} in the style of a financial analyst. 

Current financial information:
- Price: $${metrics.price}
- Market Cap: ${metrics.marketCap}
- P/E Ratio: ${metrics.pe}
- P/B Ratio: ${metrics.pb}
- Return on Equity: ${metrics.roe}
- Debt-to-Equity: ${metrics.debtToEquity}
- EPS: $${metrics.eps}
- Revenue: ${metrics.revenue}
- Net Income: ${metrics.netIncome}
- Sector: ${metrics.sector}
- Industry: ${metrics.industry}

Address the following in your analysis:
1. Current market position (price, market cap, enterprise value)
2. Balance sheet strength and debt position
3. Profitability metrics and earnings quality
4. Valuation assessment (whether the stock appears undervalued, fairly valued, or overvalued)
5. Key strengths and weaknesses from a value investing perspective
6. Future outlook and growth potential
7. Final assessment with a fair value estimate

Format your response to be approximately 400-500 words, similar to this example:
"Mongo DB reported earnings last week and the stock cratered 27%. Shares are now down 54% over the past year. At the recent price, Mongodb now has a market value of $15.9 billion. The company has a solid balance sheet with 2.3 billion of cash and no debt. So the enterprise value is 13.6 billion. Meanwhile, Mongodb has reported 2 billion of revenue over the past 12 months, 1.5 billion of gross profit and 115 million of free cash flow. However, the company is not yet gap profitable due to a large amount of stock based compensation."

Use specific figures from the provided financial data, and clearly explain the reasoning behind your assessment. Include key value investing metrics that Warren Buffett would focus on.
`;

    // Make request to OpenAI API
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4",  // Use the most advanced model available
        messages: [
          { role: "system", content: "You are an expert financial analyst specializing in value investing in the tradition of Warren Buffett and Benjamin Graham." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3, // Low temperature for more consistent, factual responses
        max_tokens: 1000  // Allow for detailed analysis
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    // Extract and format the response
    const analysisText = response.data.choices[0].message.content;
    
    // Split the analysis into sections based on paragraphs
    const paragraphs = analysisText.split('\n\n').filter(p => p.trim().length > 0);
    
    // Create a structured response
    return {
      summary: paragraphs[0],
      sections: paragraphs.map((paragraph, index) => {
        return {
          content: paragraph
        };
      }),
      fullAnalysis: analysisText
    };
  } catch (error) {
    console.error('Error generating stock analysis:', error);
    // Return a fallback analysis in case of API failure
    return {
      summary: `Unable to generate in-depth analysis for ${stockData.symbol} at this time.`,
      sections: [],
      fullAnalysis: "The analysis service is currently unavailable. Please try again later."
    };
  }
};

/**
 * Helper function to format currency values
 */
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

/**
 * Helper function to extract financial metrics
 */
function getFinancialMetric(financials, statementType, metricName) {
  if (!financials || !financials[statementType] || 
      !financials[statementType].annualReports || 
      financials[statementType].annualReports.length === 0) {
    return 'N/A';
  }
  
  // Get the most recent annual report
  const report = financials[statementType].annualReports[0];
  const value = report[metricName];
  
  if (!value) return 'N/A';
  
  return formatCurrency(value);
}

module.exports = {
  generateStockAnalysis
};