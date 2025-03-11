// frontend/src/lib/finance/scoreCalculator.js

/**
 * Calculate a bullish/bearish score (1-10) based on financial metrics and news sentiment
 * 
 * This combines value investing principles with sentiment analysis to provide
 * an overall score where:
 * - 7-10: Bullish (Buy)
 * - 4-6: Neutral (Hold)
 * - 1-3: Bearish (Sell)
 */

/**
 * Calculate a comprehensive stock score combining value metrics and news sentiment
 * @param {Object} metrics - Financial metrics
 * @param {number} metrics.pe - Price to Earnings ratio
 * @param {number} metrics.pb - Price to Book ratio
 * @param {number} metrics.roe - Return on Equity (as decimal)
 * @param {number} metrics.debtToEquity - Debt to Equity ratio
 * @param {number} metrics.currentPrice - Current stock price
 * @param {number} metrics.intrinsicValue - Estimated intrinsic value
 * @param {number} newsSentiment - News sentiment score (1-10)
 * @returns {number} Overall bullish/bearish score (1-10)
 */
export const calculateOverallScore = (metrics, newsSentiment = 5) => {
    // Calculate value metrics score
    const valueScore = calculateValueScore(
      metrics.pe,
      metrics.pb,
      metrics.roe,
      metrics.debtToEquity,
      metrics.currentPrice,
      metrics.intrinsicValue
    );
    
    // Weight distribution (adjust as needed)
    const valueWeight = 0.7;  // Value metrics: 70%
    const newsWeight = 0.3;   // News sentiment: 30%
    
    // Calculate weighted score
    const weightedScore = (valueScore * valueWeight) + (newsSentiment * newsWeight);
    
    // Ensure score is between 1-10 and rounded to nearest decimal
    return Math.min(Math.max(Number(weightedScore.toFixed(1)), 1), 10);
  };
  
  /**
   * Calculate a value score based on Warren Buffett's principles
   * @param {number} pe - Price to Earnings ratio
   * @param {number} pb - Price to Book ratio
   * @param {number} roe - Return on Equity (as decimal)
   * @param {number} debtToEquity - Debt to Equity ratio
   * @param {number} currentPrice - Current stock price
   * @param {number} intrinsicValue - Estimated intrinsic value
   * @returns {number} Value score (1-10)
   */
  export const calculateValueScore = (pe, pb, roe, debtToEquity, currentPrice, intrinsicValue) => {
    // Initialize component scores
    let peScore = 0;
    let pbScore = 0;
    let roeScore = 0;
    let debtScore = 0;
    let valueGapScore = 0;
    
    // PE ratio scoring (lower is better for value investing)
    if (!pe || pe <= 0) {
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
    if (!pb || pb <= 0) {
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
    if (!roe || roe <= 0) {
      roeScore = 0; // Negative ROE
    } else if (roe > 0.20) {
      roeScore = 2; // Excellent ROE
    } else if (roe > 0.15) {
      roeScore = 1.5; // Good ROE
    } else if (roe > 0.10) {
      roeScore = 1; // Average ROE
    } else {
      roeScore = 0.5; // Below average ROE
    }
    
    // Debt-to-Equity scoring (lower is better)
    if (!debtToEquity && debtToEquity !== 0) {
      debtScore = 0; // Missing data
    } else if (debtToEquity < 0.3) {
      debtScore = 2; // Excellent debt level
    } else if (debtToEquity < 0.5) {
      debtScore = 1.5; // Good debt level
    } else if (debtToEquity < 1) {
      debtScore = 1; // Average debt level
    } else if (debtToEquity < 2) {
      debtScore = 0.5; // High debt level
    } else {
      debtScore = 0; // Very high debt level
    }
    
    // Price vs. Intrinsic Value scoring
    if (currentPrice && intrinsicValue && intrinsicValue > 0) {
      const valueRatio = currentPrice / intrinsicValue;
      
      if (valueRatio < 0.7) {
        valueGapScore = 2; // Significantly undervalued
      } else if (valueRatio < 0.9) {
        valueGapScore = 1.5; // Moderately undervalued
      } else if (valueRatio < 1.1) {
        valueGapScore = 1; // Fair value
      } else if (valueRatio < 1.3) {
        valueGapScore = 0.5; // Moderately overvalued
      } else {
        valueGapScore = 0; // Significantly overvalued
      }
    }
    
    // Calculate total score (sum of components)
    const totalScore = peScore + pbScore + roeScore + debtScore + valueGapScore;
    
    // Scale to 1-10 (max possible score is 14, min is 0)
    return Math.min(Math.max(Math.round((totalScore / 14) * 10), 1), 10);
  };
  
  /**
   * Calculate a news sentiment score based on positive/negative mentions
   * @param {Array} newsItems - Array of news items with sentiment data
   * @returns {number} News sentiment score (1-10)
   */
  export const calculateNewsSentiment = (newsItems) => {
    // This would typically connect to a sentiment analysis API
    // For a placeholder, we'll return a mock value
    return 5; // Neutral sentiment
  };
  
  /**
   * Generate analysis text based on the overall score and metrics
   * @param {number} overallScore - Overall bullish/bearish score (1-10)
   * @param {Object} metrics - Financial metrics
   * @returns {string} Analysis text explaining the score
   */
  export const generateAnalysisText = (overallScore, metrics) => {
    let analysis = "";
    
    // Interpret overall score
    if (overallScore >= 8) {
      analysis += "Strong bullish signal. This stock shows excellent value characteristics and positive sentiment. ";
    } else if (overallScore >= 6.5) {
      analysis += "Moderately bullish. The stock displays good value metrics and generally positive sentiment. ";
    } else if (overallScore >= 5) {
      analysis += "Neutral outlook. The stock shows mixed value indicators and sentiment. ";
    } else if (overallScore >= 3.5) {
      analysis += "Moderately bearish. The stock may be overvalued or has concerning metrics. ";
    } else {
      analysis += "Strong bearish signal. The stock appears significantly overvalued or has poor fundamental metrics. ";
    }
    
    // Add value gap analysis
    if (metrics.currentPrice && metrics.intrinsicValue) {
      const valueGap = (metrics.intrinsicValue - metrics.currentPrice) / metrics.currentPrice * 100;
      
      if (valueGap > 30) {
        analysis += `The current price is significantly below our estimated intrinsic value (${valueGap.toFixed(0)}% discount), suggesting potential for appreciation. `;
      } else if (valueGap > 10) {
        analysis += `The current price is below our estimated intrinsic value (${valueGap.toFixed(0)}% discount), suggesting the stock may be undervalued. `;
      } else if (valueGap > -10) {
        analysis += "The stock is trading close to our estimated intrinsic value, suggesting fair pricing. ";
      } else if (valueGap > -30) {
        analysis += `The current price is above our estimated intrinsic value (${Math.abs(valueGap).toFixed(0)}% premium), suggesting the stock may be overvalued. `;
      } else {
        analysis += `The current price is significantly above our estimated intrinsic value (${Math.abs(valueGap).toFixed(0)}% premium), suggesting caution. `;
      }
    }
    
    // Highlight key metrics
    const metricAnalysis = [];
    
    if (metrics.pe) {
      if (metrics.pe < 15) {
        metricAnalysis.push("favorable P/E ratio");
      } else if (metrics.pe > 25) {
        metricAnalysis.push("high P/E ratio");
      }
    }
    
    if (metrics.roe) {
      if (metrics.roe > 0.15) {
        metricAnalysis.push("strong return on equity");
      } else if (metrics.roe < 0.1) {
        metricAnalysis.push("weak return on equity");
      }
    }
    
    if (metrics.debtToEquity) {
      if (metrics.debtToEquity < 0.5) {
        metricAnalysis.push("low debt levels");
      } else if (metrics.debtToEquity > 1) {
        metricAnalysis.push("high debt levels");
      }
    }
    
    if (metricAnalysis.length > 0) {
      analysis += `Key factors in this assessment include ${metricAnalysis.join(", ")}.`;
    }
    
    return analysis;
  };
  
  export default {
    calculateOverallScore,
    calculateValueScore,
    calculateNewsSentiment,
    generateAnalysisText
  };