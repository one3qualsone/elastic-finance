// frontend/src/components/analysis/EnhancedAIAnalyst.jsx
'use client';

import { useState } from 'react';

export default function EnhancedAIAnalyst({ stockData, companyOverview, financials, valueAnalysis }) {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deepAnalysis, setDeepAnalysis] = useState(null);

  const generateFullAnalysis = async () => {
    if (deepAnalysis) {
      setShowFullAnalysis(true);
      return;
    }

    setIsLoading(true);

    try {
      // In production, this would be an API call to your LLM service
      // For now, we'll simulate a response
      
      // Create a detailed prompt based on all the stock data
      const symbol = stockData.symbol;
      const name = stockData.name || companyOverview?.Name || symbol;
      
      // Collect financial metrics
      const metrics = {
        price: valueAnalysis?.currentPrice || 'N/A',
        marketCap: companyOverview?.MarketCapitalization ? 
          `$${(companyOverview.MarketCapitalization / 1000000000).toFixed(2)}B` : 'N/A',
        pe: valueAnalysis?.metrics?.pe?.toFixed(2) || 'N/A',
        eps: companyOverview?.EPS || 'N/A',
        revenue: financials?.income?.annualReports?.[0]?.totalRevenue || 'N/A',
        netIncome: financials?.income?.annualReports?.[0]?.netIncome || 'N/A',
        cash: companyOverview?.cash || 'N/A',
        debt: companyOverview?.debt || 'N/A',
        roe: valueAnalysis?.metrics?.roe ? 
          `${(valueAnalysis.metrics.roe * 100).toFixed(2)}%` : 'N/A',
        intrinsicValue: valueAnalysis?.intrinsicValue || 'N/A'
      };

      // Simulate API call delay
      setTimeout(() => {
        // This would be the response from your LLM API
        const mockAnalysis = generateMockAnalysis(symbol, name, metrics);
        setDeepAnalysis(mockAnalysis);
        setShowFullAnalysis(true);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating analysis:', error);
      setIsLoading(false);
    }
  };

  // Generate a detailed mock analysis (would be replaced by actual LLM call)
  const generateMockAnalysis = (symbol, name, metrics) => {
    // Create sections similar to the examples provided
    const sections = {
      overview: `${name} (${symbol}) is currently trading at $${metrics.price} with a market capitalization of ${metrics.marketCap}. The company has a P/E ratio of ${metrics.pe} and earnings per share of $${metrics.eps}.`,
      
      financials: `Over the trailing twelve months, ${symbol} has reported revenue of ${formatLargeNumber(metrics.revenue)} and net income of ${formatLargeNumber(metrics.netIncome)}. The company's balance sheet shows ${metrics.cash !== 'N/A' ? formatLargeNumber(metrics.cash) + ' of cash' : 'no reported cash'} and ${metrics.debt !== 'N/A' ? formatLargeNumber(metrics.debt) + ' of debt' : 'no reported debt'}.`,
      
      valuation: `At the current price of $${metrics.price}, ${symbol} ${metrics.intrinsicValue !== 'N/A' ? 
        (parseFloat(metrics.price) < parseFloat(metrics.intrinsicValue) ? 
          `appears undervalued compared to our estimated intrinsic value of $${metrics.intrinsicValue}.` : 
          `appears overvalued compared to our estimated intrinsic value of $${metrics.intrinsicValue}.`) : 
        'requires further analysis to determine its intrinsic value.'}`,
      
      trends: `${symbol}'s performance metrics indicate ${metrics.roe !== 'N/A' ? 
        (parseFloat(metrics.roe) > 15 ? 
          'strong returns on equity, which is a positive sign for value investors.' : 
          'moderate to low returns on equity, which may be a concern for value investors.') : 
        'insufficient data on return on equity to assess management effectiveness.'}`,
      
      outlook: `Looking forward, ${symbol} ${valueAnalysis?.valueScore >= 7 ? 
        'shows promising indicators for value investors, with strong fundamentals and reasonable valuation metrics.' : 
        valueAnalysis?.valueScore >= 4 ? 
          'presents a mixed picture for value investors, with some positive indicators offset by areas of concern.' : 
          'raises several red flags for value investors, with valuation metrics suggesting caution is warranted.'}`,
      
      conclusion: `Based on our value investing analysis, ${symbol} receives a ${valueAnalysis?.valueScore}/10 rating. ${
        valueAnalysis?.valueScore >= 7 ? 
          'This indicates a potentially attractive opportunity for value investors with a margin of safety.' : 
          valueAnalysis?.valueScore >= 4 ? 
            'This suggests a neutral stance is appropriate, with close monitoring of key metrics.' : 
            'This suggests caution is warranted from a value investing perspective.'
      }`
    };

    // Create a DCF section with more sophisticated analysis
    const dcfSection = `
A discounted cash flow (DCF) analysis for ${symbol} using conservative assumptions suggests a fair value range of $${(parseFloat(metrics.price) * 0.8).toFixed(2)} to $${(parseFloat(metrics.price) * 1.2).toFixed(2)} per share. This model assumes:

- Revenue growth rate of ${metrics.roe !== 'N/A' && parseFloat(metrics.roe) > 0.15 ? '12-15%' : '8-10%'} annually for the next 5 years
- Terminal growth rate of 2.5%
- Discount rate of ${metrics.roe !== 'N/A' && parseFloat(metrics.roe) > 0.15 ? '9%' : '11%'} reflecting the company's risk profile
- Gradual improvement in operating margins

${valueAnalysis?.valueScore >= 7 ? 
      'This model suggests the current market price offers a margin of safety for long-term investors.' : 
      valueAnalysis?.valueScore >= 4 ? 
        'The current market price is within our fair value range, suggesting neither significant undervaluation nor overvaluation.' : 
        'The current market price exceeds our estimated fair value range, suggesting limited margin of safety.'
    }`;

    // Combine all sections
    return {
      summary: sections.overview + ' ' + sections.conclusion,
      sections: [
        { title: 'Financial Overview', content: sections.financials },
        { title: 'Valuation Analysis', content: sections.valuation },
        { title: 'Discounted Cash Flow Analysis', content: dcfSection },
        { title: 'Performance Trends', content: sections.trends },
        { title: 'Future Outlook', content: sections.outlook },
        { title: 'Value Investor\'s Conclusion', content: sections.conclusion }
      ]
    };
  };

  // Format large numbers to more readable form
  const formatLargeNumber = (value) => {
    if (value === 'N/A' || !value) return 'N/A';
    
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else {
      return `$${num.toLocaleString()}`;
    }
  };

  // Render the component
  if (!stockData || !valueAnalysis) {
    return null;
  }

  return (
    <div className="mt-6">
      {!showFullAnalysis ? (
        <button
          onClick={generateFullAnalysis}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating In-Depth Value Analysis...
            </span>
          ) : (
            'Generate In-Depth Value Analysis'
          )}
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold">In-Depth Value Analysis</h3>
            <button
              onClick={() => setShowFullAnalysis(false)}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {deepAnalysis && (
            <>
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-lg text-gray-800 dark:text-gray-200">{deepAnalysis.summary}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="col-span-1 md:col-span-2">
                  <h4 className="text-xl font-semibold mb-2">Key Value Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">P/E Ratio</p>
                      <p className={`text-xl font-bold ${
                        valueAnalysis.metrics?.pe < 15 ? 'text-green-600 dark:text-green-400' :
                        valueAnalysis.metrics?.pe < 25 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>{valueAnalysis.metrics?.pe?.toFixed(2) || 'N/A'}</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">P/B Ratio</p>
                      <p className={`text-xl font-bold ${
                        valueAnalysis.metrics?.pb < 1.5 ? 'text-green-600 dark:text-green-400' :
                        valueAnalysis.metrics?.pb < 3 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>{valueAnalysis.metrics?.pb?.toFixed(2) || 'N/A'}</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">ROE</p>
                      <p className={`text-xl font-bold ${
                        valueAnalysis.metrics?.roe > 0.15 ? 'text-green-600 dark:text-green-400' :
                        valueAnalysis.metrics?.roe > 0.10 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>{valueAnalysis.metrics?.roe ? `${(valueAnalysis.metrics.roe * 100).toFixed(2)}%` : 'N/A'}</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Debt/Equity</p>
                      <p className={`text-xl font-bold ${
                        valueAnalysis.metrics?.debtToEquity < 0.5 ? 'text-green-600 dark:text-green-400' :
                        valueAnalysis.metrics?.debtToEquity < 1 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>{valueAnalysis.metrics?.debtToEquity?.toFixed(2) || 'N/A'}</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Value Score</p>
                      <p className={`text-xl font-bold ${
                        valueAnalysis.valueScore >= 7 ? 'text-green-600 dark:text-green-400' :
                        valueAnalysis.valueScore >= 4 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>{valueAnalysis.valueScore}/10</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {deepAnalysis.sections.map((section, index) => (
                  <div key={index} className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-xl font-semibold mb-2">{section.title}</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{section.content}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                <p>This analysis is generated using value investing principles and is for educational purposes only. Always conduct your own research before making investment decisions.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}