// frontend/src/components/charts/TimeChart.jsx
'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TimeChart({ symbol, data }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      // If we have data passed in, use it directly
      if (data && Array.isArray(data) && data.length > 0) {
        processChartData(data);
      } else {
        // Otherwise generate mock data (fallback only)
        const mockData = generateMockData();
        processChartData(mockData);
      }
    } catch (err) {
      console.error('Error processing chart data:', err);
      setError('Failed to create chart');
      setLoading(false);
    }
  }, [symbol, data]);

  const processChartData = (stockData) => {
    try {
      if (!stockData || !Array.isArray(stockData) || stockData.length === 0) {
        setChartData(null);
        setLoading(false);
        return;
      }
      
      // Sort by date (oldest to newest)
      const sortedData = [...stockData].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      
      const labels = sortedData.map(item => {
        // Format the date as MM/DD
        if (!item.date) return '';
        const date = new Date(item.date);
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
      });
      
      const prices = sortedData.map(item => {
        const price = item.close || item.adjClose;
        return price ? parseFloat(price) : null;
      }).filter(price => price !== null);
      
      if (prices.length === 0) {
        setError('No valid price data available');
        setLoading(false);
        return;
      }
      
      setChartData({
        labels,
        datasets: [
          {
            label: `${symbol} Price`,
            data: prices,
            borderColor: 'rgb(14, 165, 233)',
            backgroundColor: 'rgba(14, 165, 233, 0.5)',
            tension: 0.1,
            pointRadius: 1,
            pointHoverRadius: 5,
          },
        ],
      });
    } catch (err) {
      console.error('Error formatting chart data:', err);
      setError('Error processing chart data');
    } finally {
      setLoading(false);
    }
  };

  // Generate mock price data for the chart (only used as fallback)
  const generateMockData = () => {
    const mockData = [];
    const today = new Date();
    let price = 150 + Math.random() * 10;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const change = (Math.random() - 0.48) * 3;
      price += change;
      
      mockData.push({
        date: date.toISOString().split('T')[0],
        open: price - Math.random(),
        high: price + Math.random() * 2,
        low: price - Math.random() * 2,
        close: price,
        volume: Math.floor(Math.random() * 10000000) + 2000000,
      });
    }
    
    return mockData;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">No chart data available</p>
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `$${context.raw.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 8,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        }
      },
    },
  };

  return <Line data={chartData} options={options} />;
}