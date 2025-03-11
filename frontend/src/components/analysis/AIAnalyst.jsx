// frontend/src/components/analysis/AIAnalyst.jsx
'use client';

import { useState, useEffect } from 'react';

export default function AIAnalyst({ stockData, newsData, valueAnalysis }) {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sentimentScore, setSentimentScore] = useState(null);

  useEffect(() => {
    if (stockData && valueAnalysis) {
      generateAnalysis();
    }
  }, [stockData, newsData, valueAnalysis]);

  const generateAnalysis = () => {
    setIsLoading(true);
    
    // In a real application, this would be an API call to your backend
    // For demonstration, we'll create a mock analysis
    setTimeout(() => {
      const mockNewsAnalysis = generateMockNewsAnalysis();
      const mockSentiment = calculateSentiment(valueAnalysis, mockNewsAnalysis.sentiment);
      
      setAnalysis(mockNewsAnalysis.text);
      setSentimentScore(mockSentiment);
      setIsLoading(false);
    }, 1500);
  };
  
  // Generate a mock news analysis
  const generateMockNewsAnalysis = () => {
    if (!stockData || !stockData.symbol) {
      return {
        text: "No stock data available for analysis.",
        sentiment: 5
      };
    }
    
    // In a real app, this would be done by an AI or sentiment analysis algorithm
    const sentiment = Math.random() * 10; // Random score between 0-10
    
    let sentimentText;
    if (sentiment >= 7) {
      sentimentText = 'positive';
    } else if (sentiment >= 4) {
      sentimentText = 'neutral';
    } else {
      sentimentText = 'negative';
    }
    
    const texts = {
      positive: `Recent news for ${stockData.symbol} has been largely positive. The company has shown strong quarterly earnings and several analysts have increased their price targets. Management's forward guidance was optimistic, mentioning plans for expansion into new markets and potential for increased market share.`,
      neutral: `News for ${stockData.symbol} has been mixed recently. While the company reported meeting expectations for the quarter, there are some concerns about increasing competition in the sector. Analysts have generally maintained their positions, with a balanced outlook for future growth.`,
      negative: `${stockData.symbol} has faced some negative press recently. The company missed earnings expectations, and there are concerns about declining market share. Several analysts have lowered their price targets, and the recent industry outlook suggests potential challenges ahead.`
    };
    
    return {
      text: texts[sentimentText],
      sentiment: sentiment
    };
  };
  
  // Calculate overall sentiment score combining value analysis and news
  const calculateSentiment = (valueAnalysis, newsSentiment) => {
    if (!valueAnalysis) return null;
    
    // Weight the value score (70%) and news sentiment (30%)
    const valueWeight = 0.7;
    const newsWeight = 0.3;
    
    const valueScore = valueAnalysis.valueScore || 5;
    return (valueScore * valueWeight + newsSentiment * newsWeight).toFixed(1);
  };
  
  // Determine styling based on sentiment score
  const getSentimentColor = (score) => {
    if (score >= 7) return 'text-green-600 dark:text-green-400';
    if (score >= 4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  const getSentimentLabel = (score) => {
    if (score >= 7) return 'Bullish';
    if (score >= 4) return 'Neutral';
    return 'Bearish';
  };

  if (isLoading) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">AI Analyst</h3>
        <div className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          <span className="ml-3">Analyzing market sentiment...</span>
        </div>
      </div>
    );
  }

  if (!stockData || !valueAnalysis) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">AI Analyst</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Select a stock to see AI-powered analysis
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">AI Analyst</h3>
      
      {sentimentScore && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 dark:text-gray-300">Overall Sentiment</span>
            <span className={`font-bold text-lg ${getSentimentColor(sentimentScore)}`}>
              {sentimentScore}/10
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                sentimentScore >= 7 ? 'bg-green-600' : 
                sentimentScore >= 4 ? 'bg-yellow-500' : 'bg-red-600'
              }`}
              style={{ width: `${sentimentScore * 10}%` }}
            ></div>
          </div>
          <p className="mt-2 text-right text-sm text-gray-600 dark:text-gray-400">
            {getSentimentLabel(sentimentScore)}
          </p>
        </div>
      )}
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Recent News Analysis:</h4>
        <p className="text-gray-700 dark:text-gray-300">
          {analysis || "No analysis available."}
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">Financial Assessment:</h4>
        <p className="text-gray-700 dark:text-gray-300">
          {valueAnalysis ? valueAnalysis.analysis : 'No financial assessment available.'}
        </p>
      </div>
    </div>
  );
}