
const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

/**
 * @route GET /api/finance/search
 * @desc Search for a company by symbol or name
 */
router.get('/search', financeController.searchCompany);

/**
 * @route GET /api/finance/quote/:symbol
 * @desc Get current quote for a stock symbol
 */
router.get('/quote/:symbol', financeController.getQuote);

/**
 * @route GET /api/finance/overview/:symbol
 * @desc Get company overview for a stock symbol
 */
router.get('/overview/:symbol', financeController.getCompanyOverview);

/**
 * @route GET /api/finance/historical/:symbol
 * @desc Get historical price data for a stock symbol
 */
router.get('/historical/:symbol', financeController.getHistoricalData);

/**
 * @route GET /api/finance/financials/:symbol
 * @desc Get financial statements for a stock symbol
 */
router.get('/financials/:symbol', financeController.getFinancials);

/**
 * @route GET /api/finance/value-analysis/:symbol
 * @desc Get value investing analysis for a stock
 */
router.get('/value-analysis/:symbol', financeController.getValueAnalysis);


/**
 * @route GET /api/finance/sentiment/:symbol
 * @desc Get AI sentiment analysis for a stock
 */
router.get('/sentiment/:symbol', financeController.getAISentiment);


/**
 * @route GET /api/finance/enhanced-analysis/:symbol
 * @desc Get enhanced value investing analysis for a stock
 */
router.get('/enhanced-analysis/:symbol', financeController.getEnhancedValueAnalysis);

module.exports = router;