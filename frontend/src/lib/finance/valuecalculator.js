/**
 * Finance utility functions for value investing calculations
 */

/**
 * Calculate Price-to-Earnings (P/E) ratio
 * @param {number} price - Current stock price
 * @param {number} eps - Earnings per share
 * @returns {number} P/E ratio
 */
export const calculatePE = (price, eps) => {
    if (!price || !eps || eps <= 0) return null;
    return price / eps;
  };
  
  /**
   * Calculate Price-to-Book (P/B) ratio
   * @param {number} price - Current stock price
   * @param {number} bookValue - Book value per share
   * @returns {number} P/B ratio
   */
  export const calculatePB = (price, bookValue) => {
    if (!price || !bookValue || bookValue <= 0) return null;
    return price / bookValue;
  };
  
  /**
   * Calculate Return on Equity (ROE)
   * @param {number} netIncome - Net income
   * @param {number} shareholderEquity - Shareholder equity
   * @returns {number} ROE as a decimal (e.g., 0.15 for 15%)
   */
  export const calculateROE = (netIncome, shareholderEquity) => {
    if (!netIncome || !shareholderEquity || shareholderEquity <= 0) return null;
    return netIncome / shareholderEquity;
  };
  
  /**
   * Calculate Debt-to-Equity ratio
   * @param {number} totalDebt - Total debt
   * @param {number} shareholderEquity - Shareholder equity
   * @returns {number} Debt-to-Equity ratio
   */
  export const calculateDebtToEquity = (totalDebt, shareholderEquity) => {
    if (!totalDebt || !shareholderEquity || shareholderEquity <= 0) return null;
    return totalDebt / shareholderEquity;
  };
  
  /**
   * Calculate intrinsic value using the Graham formula
   * @param {number} eps - Earnings per share
   * @param {number} growthRate - Expected growth rate (decimal)
   * @returns {number} Intrinsic value
   */
  export const calculateGrahamValue = (eps, growthRate) => {
    if (!eps || eps <= 0 || growthRate === undefined) return null;
    return eps * (8.5 + 2 * (growthRate * 100));
  };
  
  /**
   * Calculate intrinsic value using Discounted Cash Flow (DCF)
   * @param {number} freeCashFlow - Free cash flow per share
   * @param {number} growthRate - Expected growth rate (decimal)
   * @param {number} discountRate - Discount rate (decimal)
   * @param {number} terminalGrowthRate - Terminal growth rate (decimal)
   * @param {number} years - Number of years to project
   * @returns {number} Intrinsic value
   */
  export const calculateDCF = (
    freeCashFlow,
    growthRate,
    discountRate,
    terminalGrowthRate,
    years = 10
  ) => {
    if (!freeCashFlow || freeCashFlow <= 0 || !growthRate || !discountRate) return null;
    
    let presentValue = 0;
    
    // Calculate the present value of future cash flows
    for (let i = 1; i <= years; i++) {
      const cashFlow = freeCashFlow * Math.pow(1 + growthRate, i);
      presentValue += cashFlow / Math.pow(1 + discountRate, i);
    }
    
    // Calculate terminal value
    const terminalValue = (freeCashFlow * Math.pow(1 + growthRate, years) * (1 + terminalGrowthRate)) / 
                          (discountRate - terminalGrowthRate);
    
    // Calculate the present value of the terminal value
    const presentTerminalValue = terminalValue / Math.pow(1 + discountRate, years);
    
    // Total intrinsic value is the sum of the present value of cash flows and terminal value
    return presentValue + presentTerminalValue;
  };
  
  /**
   * Calculate value score (from 1-10) based on Warren Buffett's principles
   * @param {number} pe - Price-to-Earnings ratio
   * @param {number} pb - Price-to-Book ratio
   * @param {number} roe - Return on Equity (decimal)
   * @param {number} debtToEquity - Debt-to-Equity ratio
   * @returns {number} Value score from 1-10
   */
  export const calculateValueScore = (pe, pb, roe, debtToEquity) => {
    // Initialize score components
    let peScore = 0;
    let pbScore = 0;
    let roeScore = 0;
    let debtScore = 0;
    
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
    
    // Calculate total score (0-10 scale)
    const totalScore = peScore + pbScore + roeScore + debtScore;
    
    // Scale to 1-10 and round to nearest integer
    return Math.min(Math.max(Math.round(totalScore * 10 / 10), 1), 10);
  };
  
  /**
   * Generate analysis text based on metrics
   * @param {number} valueScore - Value score (1-10)
   * @param {number} currentPrice - Current stock price
   * @param {number} intrinsicValue - Estimated intrinsic value
   * @param {number} pe - Price-to-Earnings ratio
   * @param {number} pb - Price-to-Book ratio
   * @param {number} roe - Return on Equity (decimal)
   * @param {number} debtToEquity - Debt-to-Equity ratio
   * @returns {string} Analysis text
   */
  export const generateAnalysis = (
    valueScore,
    currentPrice,
    intrinsicValue,
    pe,
    pb,
    roe,
    debtToEquity
  ) => {
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
      analysis += `Trading significantly below estimated intrinsic value ($${intrinsicValue.toFixed(2)}). `;
    } else if (intrinsicValue && currentPrice < intrinsicValue) {
      analysis += `Trading below estimated intrinsic value ($${intrinsicValue.toFixed(2)}). `;
    } else if (intrinsicValue && currentPrice < intrinsicValue * 1.2) {
      analysis += `Trading near estimated intrinsic value ($${intrinsicValue.toFixed(2)}). `;
    } else if (intrinsicValue) {
      analysis += `Trading above estimated intrinsic value ($${intrinsicValue.toFixed(2)}). `;
    }
    
    // Add PE analysis
    if (!pe || pe <= 0) {
      analysis += "Negative earnings. ";
    } else if (pe < 10) {
      analysis += "PE ratio indicates potential undervaluation. ";
    } else if (pe > 25) {
      analysis += "PE ratio indicates potential overvaluation. ";
    } else {
      analysis += "PE ratio is within reasonable range. ";
    }
    
    // Add Debt analysis
    if (debtToEquity !== undefined) {
      if (debtToEquity < 0.5) {
        analysis += "Debt levels are conservative, which Warren Buffett prefers. ";
      } else if (debtToEquity < 1) {
        analysis += "Debt levels are moderate. ";
      } else {
        analysis += "Debt levels are relatively high, which increases risk. ";
      }
    }
    
    // Add ROE analysis
    if (!roe || roe <= 0) {
      analysis += "Negative return on equity is concerning.";
    } else if (roe > 0.15) {
      analysis += "Strong return on equity indicates effective management.";
    } else if (roe > 0.10) {
      analysis += "Decent return on equity.";
    } else {
      analysis += "Below-average return on equity.";
    }
    
    return analysis;
  };
  
  export default {
    calculatePE,
    calculatePB,
    calculateROE,
    calculateDebtToEquity,
    calculateGrahamValue,
    calculateDCF,
    calculateValueScore,
    generateAnalysis
  };