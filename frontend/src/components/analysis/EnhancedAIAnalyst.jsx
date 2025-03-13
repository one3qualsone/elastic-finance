import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EnhancedAnalysisVisuals from './EnhancedAnalysisVisuals';

export default function EnhancedAIAnalyst({ stockData, companyOverview, financials, valueAnalysis }) {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  
  // Reset state when stock changes
  useEffect(() => {
    setAnalysis(null);
    setShowFullAnalysis(false);
    setError(null);
  }, [stockData?.symbol]);

  const generateFullAnalysis = async () => {
    if (analysis) {
      setShowFullAnalysis(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Make API call to your backend LLM service
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/finance/enhanced-analysis/${stockData.symbol}`;
      
      console.log(`Fetching enhanced analysis from: ${apiUrl}`);
      
      const response = await axios.get(apiUrl);
      
      // Get the LLM-generated analysis
      if (!response.data || !response.data.enhancedAnalysis) {
        throw new Error('Invalid response from analysis API');
      }
      
      const llmAnalysis = response.data.enhancedAnalysis;
      setAnalysis(llmAnalysis);
      setShowFullAnalysis(true);
    } catch (error) {
      console.error('Error generating analysis:', error);
      setError(`Failed to generate analysis: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderKeySection = (section, importance = 'medium') => {
    if (!section) return null;
    
    // Determine styling based on importance
    const bgClass = {
      high: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900/30',
      medium: 'bg-white dark:bg-gray-800',
      low: 'bg-gray-50 dark:bg-gray-800/80'
    }[importance];
    
    return (
      <div className={`card p-4 mb-4 ${bgClass}`}>
        <h4 className="text-xl font-semibold mb-3">{section.title}</h4>
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{section.content}</div>
      </div>
    );
  };

  const findSectionByTitle = (sections, titlePattern) => {
    return sections?.find(section => 
      section.title.toUpperCase().includes(titlePattern.toUpperCase()) || 
      section.title.match(new RegExp(`^\\d+\\.\\s*${titlePattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'))
    );
  };

  // Render the component
  if (!stockData || !valueAnalysis) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Enhanced AI Analysis</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Select a stock to see enhanced AI-powered analysis
        </p>
      </div>
    );
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
              Generating In-Depth AI Value Analysis...
            </span>
          ) : (
            'Generate In-Depth AI Value Analysis'
          )}
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold">In-Depth AI Value Analysis</h3>
            <button
              onClick={() => setShowFullAnalysis(false)}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {error && (
            <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}
          
          {analysis && (
            <div className="space-y-6">
              {/* Display the summary at the top */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                <h3 className="text-xl font-semibold mb-3">Analysis Summary</h3>
                <p className="text-lg text-gray-800 dark:text-gray-200">{analysis.summary}</p>
              </div>
              
              {/* Display key sections in order of importance */}
              {analysis.sections && (
                <div className="space-y-6">
                  {/* High importance sections */}
                  {renderKeySection(findSectionByTitle(analysis.sections, "BUSINESS OVERVIEW"), 'high')}
                  {renderKeySection(findSectionByTitle(analysis.sections, "VALUATION ASSESSMENT"), 'high')}
                  
                  {/* Updated to high importance for premium blue styling */}
                  {renderKeySection(findSectionByTitle(analysis.sections, "MANAGEMENT QUALITY"), 'high')}
                  {renderKeySection(findSectionByTitle(analysis.sections, "FINANCIAL STRENGTH ANALYSIS"), 'high')}
                  {renderKeySection(findSectionByTitle(analysis.sections, "PROFITABILITY & EARNINGS ANALYSIS"), 'high')}
                  
                  {/* Updated to high importance for premium blue styling */}
                  {renderKeySection(findSectionByTitle(analysis.sections, "COMPETITIVE ANALYSIS"), 'high')}
                  {renderKeySection(findSectionByTitle(analysis.sections, "INVESTMENT CONCLUSION"), 'high')}
                </div>
              )}
              
              {/* Add the EnhancedAnalysisVisuals AFTER all the text sections */}
              <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6">Financial Analysis & Recommendation</h2>
                <EnhancedAnalysisVisuals analysis={analysis} />
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                <p>This analysis is generated using AI and value investing principles. For educational purposes only. Always conduct your own research before making investment decisions.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}