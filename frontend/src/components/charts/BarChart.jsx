'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ data, title, xAxisLabel, yAxisLabel, colors }) {
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    if (!data) return;
    
    // Create the chart data from props
    setChartData({
      labels: data.labels,
      datasets: data.datasets.map((dataset, index) => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: colors?.[index] || `rgba(${index * 50}, 99, 255, 0.6)`,
        borderColor: colors?.[index] || `rgba(${index * 50}, 99, 255, 1)`,
        borderWidth: 1,
        ...dataset,
      })),
    });
  }, [data, colors]);

  if (!chartData) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: !!title,
        text: title,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            // You can customize the tooltip here
            return `${context.dataset.label}: ${context.formattedValue}`;
          }
        }
      },
    },
    scales: {
      x: {
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel,
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}