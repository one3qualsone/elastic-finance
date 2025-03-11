// frontend/src/components/dashboard/StockDashboard.jsx
'use client';

import { useState, useEffect } from 'react';
import EnhancedSearchCard from '@/components/cards/EnhancedSearchCard';
import TimeChart from '@/components/charts/TimeChart';
import AIAnalyst from '@/components/analysis/AIAnalyst';
import EnhancedAIAnalyst from '@/components/analysis/EnhancedAIAnalyst';
import { getQuote, getCompanyOverview, getValueAnalysis, getHistoricalData, getFinancials } from '@/lib/api/financeApi';

export default function StockDashboard() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockQuote, setStockQuote] = useState(null);
  const [companyOverview, setCompanyOverview] = useState(null);
  const [valueAnalysis, setValueAnalysis] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [financials, setFinancials] = useState({
    income: null,
    balance: null,
    cashflow: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedStock && selectedStock.symbol) {
      fetchStockData(selectedStock.symbol);
    }
  }, [selectedStock]);

  const fetchStockData = async (symbol) => {
    if (!symbol) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all required data in parallel
      const results = await Promise.all([
        getQuote(symbol).catch(err => {
          console.error(`Error fetching quote: ${err.message}`);
          return null;
        }),
        getCompanyOverview(symbol).catch(err => {
          console.error(`Error fetching overview: ${err.message}`);
          return null;
        }),
        getValueAnalysis(symbol).catch(err => {
          console.error(`Error fetching value analysis: ${err.message}`);
          return null;
        }),
        getHistoricalData(symbol, '1d', '1mo').catch(err => {
          console.error(`Error fetching historical data: ${err.message}`);
          return null;
        }),
        getFinancials(symbol, 'income').catch(err => {
          console.error(`Error fetching income statement: ${err.message}`);
          return null;
        }),
        getFinancials(symbol, 'balance').catch(err => {
          console.error(`Error fetching balance sheet: ${err.message}`);
          return null;
        }),
        getFinancials(symbol, 'cashflow').catch(err => {
          console.error(`Error fetching cash flow: ${err.message}`);
          return null;
        })
      ]);
      
      const [quoteData, overviewData, analysisData, historical, incomeData, balanceData, cashflowData] = results;
      
      setStockQuote(quoteData);
      setCompanyOverview(overviewData);
      setValueAnalysis(analysisData);
      setHistoricalData(historical);
      setFinancials({
        income: incomeData,
        balance: balanceData,
        cashflow: cashflowData
      });
      
      // Mock news data (in a real app, you would fetch this from a news API)
      setNewsData({
        articles: [
          { title: `Latest news about ${symbol}`, date: new Date().toISOString() }
        ]
      });
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to fetch stock data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectStock = (stock) => {
    if (stock && typeof stock === 'object') {
      setSelectedStock(stock);
    } else {
      console.error('Invalid stock data provided to handleSelectStock');
    }
  };

  return (
    <div className="space-y-6">
      {/* Understanding Value Investing Box - Improved Positioning and Design */}
      <section className="card max-w-full mx-auto mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-l-4 border-blue-500 dark:border-blue-700">
        <h2 className="text-2xl font-semibold mb-4">Understanding Value Investing</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <p className="mb-4">
              Value investing is an investment strategy focused on buying securities that appear underpriced compared to their intrinsic value.
              This approach, pioneered by Benjamin Graham and practiced successfully by Warren Buffett, emphasizes fundamental analysis
              and maintaining a margin of safety.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700 dark:text-gray-300">
              "Price is what you pay. Value is what you get." - Warren Buffett
            </blockquote>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Key Value Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold mb-1">P/E Ratio</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Buffett looks for P/E &lt; 15, indicating potential undervaluation
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">P/B Ratio</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  P/B &lt; 1.5 is attractive, suggesting possible discount to book value
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Return on Equity</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Buffett seeks ROE &gt; 15%, showing effective use of capital
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Debt to Equity</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Buffett prefers D/E &lt; 0.5, indicating financial stability
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <EnhancedSearchCard
            onSelectStock={handleSelectStock}
            isLoading={isLoading}
          />
        </div>
        
        <div className="md:col-span-2">
          {isLoading ? (
            <div className="card h-full flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : selectedStock && stockQuote ? (
            <div className="card h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedStock.symbol}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedStock.name || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">${stockQuote.price.toFixed(2)}</div>
                  <div className={`text-lg ${stockQuote.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stockQuote.change >= 0 ? '+' : ''}{stockQuote.change.toFixed(2)} ({stockQuote.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
              
              <div className="h-64 mb-4">
                <TimeChart symbol={selectedStock.symbol} data={historicalData} />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Open</p>
                  <p className="font-semibold">${stockQuote.open?.toFixed(2) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Previous Close</p>
                  <p className="font-semibold">${stockQuote.previousClose?.toFixed(2) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Day's Range</p>
                  <p className="font-semibold">
                    {stockQuote.low && stockQuote.high 
                      ? `$${stockQuote.low.toFixed(2)} - $${stockQuote.high.toFixed(2)}`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
                  <p className="font-semibold">{stockQuote.volume?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center p-12">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Search and select a stock to view detailed information
              </p>
            </div>
          )}
        </div>
      </div>
      
      {selectedStock && companyOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Company Overview</h3>
            
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                {companyOverview.Description || 'No company description available.'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sector</p>
                <p className="font-semibold">{companyOverview.Sector || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Industry</p>
                <p className="font-semibold">{companyOverview.Industry || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
                <p className="font-semibold">
                  {companyOverview.MarketCapitalization 
                    ? `$${(companyOverview.MarketCapitalization / 1000000000).toFixed(2)}B` 
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">P/E Ratio</p>
                <p className="font-semibold">{companyOverview.PERatio || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">EPS</p>
                <p className="font-semibold">
                  {companyOverview.EPS ? `$${companyOverview.EPS}` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dividend Yield</p>
                <p className="font-semibold">
                  {companyOverview.DividendYield 
                    ? `${(companyOverview.DividendYield * 100).toFixed(2)}%` 
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">52 Week High</p>
                <p className="font-semibold">
                  {companyOverview['52WeekHigh'] ? `$${companyOverview['52WeekHigh']}` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">52 Week Low</p>
                <p className="font-semibold">
                  {companyOverview['52WeekLow'] ? `$${companyOverview['52WeekLow']}` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Value Investment Metrics</h3>
            
            {valueAnalysis ? (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Value Score</span>
                    <span className={`font-bold text-lg ${
                      valueAnalysis.valueScore >= 7 ? 'text-green-600 dark:text-green-400' : 
                      valueAnalysis.valueScore >= 4 ? 'text-yellow-600 dark:text-yellow-400' : 
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {valueAnalysis.valueScore}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        valueAnalysis.valueScore >= 7 ? 'bg-green-600' : 
                        valueAnalysis.valueScore >= 4 ? 'bg-yellow-500' : 'bg-red-600'
                      }`}
                      style={{ width: `${valueAnalysis.valueScore * 10}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-right text-sm text-gray-600 dark:text-gray-400">
                    {valueAnalysis.valueScore >= 7 ? 'Bullish' : 
                     valueAnalysis.valueScore >= 4 ? 'Neutral' : 'Bearish'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                    <p className="font-semibold">
                      {valueAnalysis.currentPrice 
                        ? `$${valueAnalysis.currentPrice.toFixed(2)}` 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Intrinsic Value</p>
                    <p className="font-semibold">
                      {valueAnalysis.intrinsicValue 
                        ? `$${valueAnalysis.intrinsicValue.toFixed(2)}` 
                        : 'N/A'}
                    </p>
                  </div>
                  
                  {valueAnalysis.metrics && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">P/E Ratio</p>
                        <p className={`font-semibold ${
                          valueAnalysis.metrics.pe < 15 ? 'text-green-600 dark:text-green-400' :
                          valueAnalysis.metrics.pe < 25 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {valueAnalysis.metrics.pe?.toFixed(2) || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">P/B Ratio</p>
                        <p className={`font-semibold ${
                          valueAnalysis.metrics.pb < 1.5 ? 'text-green-600 dark:text-green-400' :
                          valueAnalysis.metrics.pb < 3 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {valueAnalysis.metrics.pb?.toFixed(2) || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Return on Equity</p>
                        <p className={`font-semibold ${
                          valueAnalysis.metrics.roe > 0.15 ? 'text-green-600 dark:text-green-400' :
                          valueAnalysis.metrics.roe > 0.10 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {valueAnalysis.metrics.roe 
                            ? `${(valueAnalysis.metrics.roe * 100).toFixed(2)}%` 
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Debt to Equity</p>
                        <p className={`font-semibold ${
                          valueAnalysis.metrics.debtToEquity < 0.5 ? 'text-green-600 dark:text-green-400' :
                          valueAnalysis.metrics.debtToEquity < 1 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {valueAnalysis.metrics.debtToEquity?.toFixed(2) || 'N/A'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Value analysis data not available
              </p>
            )}
          </div>
        </div>
      )}
      
      {selectedStock && (
        <>
          <AIAnalyst 
            stockData={selectedStock}
            newsData={newsData}
            valueAnalysis={valueAnalysis}
          />
          
          <EnhancedAIAnalyst 
            stockData={selectedStock}
            companyOverview={companyOverview}
            financials={financials}
            valueAnalysis={valueAnalysis}
          />
        </>
      )}
    </div>
  );
}