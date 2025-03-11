'use client';

import { useState, useEffect } from 'react';

export default function ValuePageResults({ analysisData }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!analysisData) return;
    
    // Prepare data for chart display
    setChartData({
      labels: ['P/E Ratio', 'P/B Ratio', 'ROE', 'Value Score'],
      values: [
        analysisData.metrics.pe,
        analysisData.metrics.pb,
        analysisData.metrics.roe,
        analysisData.valueScore
      ]
    });
  }, [analysisData]);

  if (!analysisData) return null;

  const getBullishBearishClass = (score) => {
    if (score >= 7) return 'text-green-600 dark:text-green-400';
    if (score >= 4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBullishBearishLabel = (score) => {
    if (score >= 7) return 'Bullish';
    if (score >= 4) return 'Neutral';
    return 'Bearish';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{analysisData.symbol} Value Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card col-span-2">
          <h3 className="text-xl font-semibold mb-4">Value Assessment</h3>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 dark:text-gray-300">Value Score</span>
              <span className={`font-bold text-lg ${getBullishBearishClass(analysisData.valueScore)}`}>
                {analysisData.valueScore}/10
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  analysisData.valueScore >= 7 ? 'bg-green-600' : 
                  analysisData.valueScore >= 4 ? 'bg-yellow-500' : 'bg-red-600'
                }`}
                style={{ width: `${analysisData.valueScore * 10}%` }}
              ></div>
            </div>
            <p className="mt-2 text-right text-sm text-gray-600 dark:text-gray-400">
              {getBullishBearishLabel(analysisData.valueScore)}
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 dark:text-gray-300">Current Price</span>
              <span className="font-bold">${analysisData.currentPrice}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Estimated Intrinsic Value</span>
              <span className="font-bold">${analysisData.intrinsicValue || 'N/A'}</span>
            </div>
            
            {analysisData.intrinsicValue && (
              <div className="mt-2">
                <p className={`text-sm ${
                  analysisData.currentPrice < analysisData.intrinsicValue * 0.9 ? 'text-green-600' :
                  analysisData.currentPrice > analysisData.intrinsicValue * 1.1 ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {analysisData.currentPrice < analysisData.intrinsicValue * 0.9 ? 
                    `Potentially undervalued by ${(100 * (1 - analysisData.currentPrice / analysisData.intrinsicValue)).toFixed(1)}%` :
                    analysisData.currentPrice > analysisData.intrinsicValue * 1.1 ?
                    `Potentially overvalued by ${(100 * (analysisData.currentPrice / analysisData.intrinsicValue - 1)).toFixed(1)}%` :
                    'Trading near intrinsic value'
                  }
                </p>
              </div>
            )}
          </div>
          
          <h4 className="font-semibold mb-2">Analysis:</h4>
          <p className="text-gray-700 dark:text-gray-300">
            {analysisData.analysis}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Key Metrics</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Earnings Per Share (EPS)</p>
              <p className="font-semibold">${analysisData.metrics.eps}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Book Value Per Share</p>
              <p className="font-semibold">${analysisData.metrics.bookValue}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">P/E Ratio</p>
              <p className={`font-semibold ${
                analysisData.metrics.pe < 15 ? 'text-green-600 dark:text-green-400' :
                analysisData.metrics.pe < 25 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {analysisData.metrics.pe.toFixed(2)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">P/B Ratio</p>
              <p className={`font-semibold ${
                analysisData.metrics.pb < 1.5 ? 'text-green-600 dark:text-green-400' :
                analysisData.metrics.pb < 3 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {analysisData.metrics.pb.toFixed(2)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Return on Equity (ROE)</p>
              <p className={`font-semibold ${
                analysisData.metrics.roe > 15 ? 'text-green-600 dark:text-green-400' :
                analysisData.metrics.roe > 10 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {(analysisData.metrics.roe * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}