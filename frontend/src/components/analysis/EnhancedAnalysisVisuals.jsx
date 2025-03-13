// src/components/analysis/EnhancedAnalysisVisuals.jsx
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, ComposedChart, Cell
} from 'recharts';

const customTooltipStyle = {
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    color: '#333', // Dark text color for all tooltip text
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

const ValueMetricsChart = ({ data }) => {
  const getBarColor = (status) => {
    switch(status) {
      case 'good': return '#48bb78'; // green
      case 'neutral': return '#ecc94b'; // yellow
      case 'poor': return '#f56565'; // red
      default: return '#a0aec0'; // gray
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Value Investing Metrics</h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
            <YAxis />
            <Tooltip 
            formatter={(value, name, props) => [value, name]}
            labelFormatter={(label) => `Metric: ${label}`}
            contentStyle={customTooltipStyle}
            />
            <Bar dataKey="value" name="Current Value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
              ))}
            </Bar>
            <Bar dataKey="benchmark" name="Buffett's Benchmark" fill="#4299e1" opacity={0.3} />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Green bars indicate metrics meeting Buffett's criteria
        </div>
      </div>
    </div>
  );
};

const FinancialPerformanceChart = ({ labels, datasets }) => {
  const data = labels.map((label, index) => {
    const dataPoint = { name: label };
    datasets.forEach(dataset => {
      dataPoint[dataset.name] = dataset.data[index];
    });
    return dataPoint;
  });

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Financial Performance</h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
            formatter={(value, name) => [`$${value}M`, name]}
            labelFormatter={(label) => `Year: ${label}`}
            contentStyle={customTooltipStyle}
            />
            <Legend />
            {datasets.map((dataset, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={dataset.name}
                stroke={dataset.color || `#${Math.floor(Math.random()*16777215).toString(16)}`}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Financial performance over time (in millions of dollars)
        </div>
      </div>
    </div>
  );
};

const ValueComparisonChart = ({ data }) => {
  const { currentPrice, intrinsicValue, marginOfSafety, status } = data;
  
  // Colors for status
  const getStatusColor = (status) => {
    switch(status) {
      case 'undervalued': return 'bg-green-500 dark:bg-green-600';
      case 'overvalued': return 'bg-red-500 dark:bg-red-600';
      default: return 'bg-yellow-500 dark:bg-yellow-600';
    }
  };
  
  const getStatusText = (status) => {
    switch(status) {
      case 'undervalued': return 'Potentially Undervalued';
      case 'overvalued': return 'Potentially Overvalued';
      default: return 'Fair Value';
    }
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Value Assessment</h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="flex items-center justify-center mb-4">
          <div className={`text-xl font-bold py-2 px-4 rounded-full text-white ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Current Price</div>
            <div className="text-2xl font-bold">${currentPrice.toFixed(2)}</div>
          </div>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Intrinsic Value</div>
            <div className="text-2xl font-bold">${intrinsicValue.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Margin of Safety</div>
          <div className={`text-2xl font-bold ${marginOfSafety > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {marginOfSafety > 0 ? '+' : ''}{marginOfSafety}%
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Margin of safety represents the discount/premium to estimated intrinsic value
        </div>
      </div>
    </div>
  );
};

const EnhancedAnalysisCharts = ({ chartData }) => {
  if (!chartData || chartData.length === 0) {
    return <div className="text-gray-500">No chart data available</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Financial Charts</h2>
      
      {chartData.map((chart, index) => {
        switch(chart.type) {
          case 'ValueMetrics':
            return <ValueMetricsChart key={index} data={chart.data} />;
          case 'FinancialPerformance':
            return <FinancialPerformanceChart key={index} labels={chart.labels} datasets={chart.datasets} />;
          case 'ValueComparison':
            return <ValueComparisonChart key={index} data={chart.data} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

const OverallRatingBadge = ({ overallRating }) => {
    if (!overallRating) return null;
    
    const { score, label, recommendation } = overallRating;
    
    // Get text color based on score
    const getScoreColor = (score) => {
      if (score >= 8) return 'text-green-600 dark:text-green-400';
      if (score >= 6) return 'text-green-500 dark:text-green-300';
      if (score >= 5) return 'text-yellow-500 dark:text-yellow-400';
      if (score >= 3) return 'text-orange-500 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    };
    
    // Get recommendation badge color
    const getRecommendationColor = (rec) => {
      switch(rec) {
        case 'Buy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'Sell': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      }
    };
    
    return (
      <div className="mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-1">Investment Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Based on Warren Buffett's value investing principles
              </p>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                  {score}/10
                </div>
                <div className="text-sm mt-1 font-medium">{label}</div>
              </div>
              
              <div className="text-center">
                <div className={`text-xl font-bold py-2 px-6 rounded-lg ${getRecommendationColor(recommendation)}`}>
                  {recommendation}
                </div>
                <div className="text-sm mt-1 font-medium">Recommendation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

// Update the export function at the bottom of EnhancedAnalysisVisuals.jsx
export default function EnhancedAnalysisVisuals({ analysis }) {
    if (!analysis) return null;
    
    return (
      <div className="space-y-6">
        <EnhancedAnalysisCharts chartData={analysis.chartData} />
        <OverallRatingBadge overallRating={analysis.overallRating} />
      </div>
    );
  }